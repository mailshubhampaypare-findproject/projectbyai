import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, generateText, streamText, type UIMessage } from "ai";
import { createClient } from "@supabase/supabase-js";
import { google } from "@ai-sdk/google";
import type { Slide } from "@/lib/projects.functions";

const SYSTEM_PROMPT = `You are Scholarly, a warm and expert AI project mentor for college and university students.

You help them build real, working academic projects. When the user describes a project idea:
1. Ask a couple of clarifying questions if the scope is vague, otherwise start immediately.
2. CRITICAL: Keep your chat responses extremely short and simple. DO NOT explain the code or write long paragraphs. Focus on writing the code blocks. Write at most 1-2 short sentences introducing the code, and no explanation at all after the code block.
3. Generate real, runnable, well-commented source code inside fenced code blocks with a language tag (\`\`\`python, \`\`\`tsx, \`\`\`js, etc.). To map code to the generated source tree workspace explorer, you MUST ALWAYS include a comment on the very first line inside the code block with the relative file path. For example:
   // File: src/components/Header.tsx
   or
   # File: main.py
4. Prefer popular student-friendly stacks (Python + Flask, MERN, Next.js, Django, React) unless the user asks otherwise.
5. When appropriate, mention which files to create, how to install dependencies, and how to run the project in 1-2 brief sentences.

Format your responses in clear Markdown. Be extremely brief. Let the code speak for itself.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const authHeader = request.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
          return new Response("Unauthorized", { status: 401 });
        }
        const token = authHeader.slice(7);

        const SUPABASE_URL = process.env.SUPABASE_URL!;
        const SUPABASE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY!;
        const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
          global: { headers: { Authorization: `Bearer ${token}` } },
          auth: { persistSession: false, autoRefreshToken: false },
        });
        const { data: userData, error: userErr } = await supabase.auth.getUser(token);
        if (userErr || !userData.user) {
          return new Response("Unauthorized", { status: 401 });
        }
        const userId = userData.user.id;

        // Verify token balance
        const { data: profile } = await supabase
          .from("profiles")
          .select("tokens, used_tokens")
          .eq("id", userId)
          .single();

        if (!profile || (profile.tokens ?? 0) <= 0) {
          return new Response("Insufficient tokens. Please purchase more AI tokens.", { status: 403 });
        }

        const body = (await request.json()) as {
          messages: UIMessage[];
          projectId: string;
        };
        const { messages, projectId } = body;
        if (!projectId || !Array.isArray(messages)) {
          return new Response("Bad request", { status: 400 });
        }

        // Verify project ownership
        const { data: project } = await supabase
          .from("projects")
          .select("id, title, description")
          .eq("id", projectId)
          .single();
        if (!project) return new Response("Not found", { status: 404 });

        // Save the latest user message
        const last = messages[messages.length - 1];
        if (last?.role === "user") {
          await supabase.from("chat_messages").insert({
            project_id: projectId,
            user_id: userId,
            role: "user",
            parts: last.parts as unknown as object,
          });
        }

        const geminiKey = process.env.GEMINI_API_KEY;
        const deepseekKey = process.env.DEEPSEEK_API_KEY;

        let modelInstance: any;

        if (geminiKey) {
          process.env.GOOGLE_GENERATIVE_AI_API_KEY = geminiKey;
          modelInstance = google("gemini-2.5-flash");
        } else if (deepseekKey) {
          const { createOpenAI } = await import("@ai-sdk/openai");
          const deepseek = createOpenAI({
            baseURL: "https://api.deepseek.com",
            apiKey: deepseekKey,
          });
          modelInstance = deepseek("deepseek-chat");
        } else {
          return new Response("Missing API keys (GEMINI_API_KEY or DEEPSEEK_API_KEY)", { status: 500 });
        }

        try {
          const result = streamText({
            model: modelInstance,
            system: SYSTEM_PROMPT + `\n\nCurrent project: ${project.title}${project.description ? "\nDescription: " + project.description : ""}`,
            messages: await convertToModelMessages(messages),
          });

          return result.toUIMessageStreamResponse({
            originalMessages: messages,
            onFinish: async ({ responseMessage }) => {
              // Deduct a token and increment used tokens
              const currentT = profile?.tokens ?? 0;
              const currentUsed = profile?.used_tokens ?? 0;
              const newT = Math.max(0, currentT - 1);
              const newUsed = currentUsed + 1;

              await supabase
                .from("profiles")
                .update({ tokens: newT, used_tokens: newUsed })
                .eq("id", userId);

              await supabase.from("chat_messages").insert({
                project_id: projectId,
                user_id: userId,
                role: "assistant",
                parts: responseMessage.parts as unknown as object,
              });

              // Extract concatenated assistant text and code blocks for the code panel.
              const text = responseMessage.parts
                .map((p) => (p.type === "text" ? p.text : ""))
                .join("");
              const codeBlocks: string[] = [];
              const re = /```[\w-]*\n([\s\S]*?)```/g;
              let m: RegExpExecArray | null;
              while ((m = re.exec(text)) !== null) codeBlocks.push(m[0]);
              if (codeBlocks.length > 0) {
                const combined = codeBlocks.join("\n\n");
                await supabase
                  .from("projects")
                  .update({ code: combined })
                  .eq("id", projectId);

                // Auto-generate report, viva questions, and slides in the background
                // now that we have real code to describe.
                try {
                  const ctx = `Project: ${project.title}\nDescription: ${project.description ?? ""}\n\nGenerated code & mentor notes:\n${text.slice(0, 12000)}`;

                  const [reportRes, vivaRes, slidesRes] = await Promise.all([
                    generateText({
                      model: modelInstance,
                      prompt: `Write a complete college project report in Markdown for the project below. Sections: # Title, ## Overview, ## Objectives, ## Tech Stack & Versions (list each language/framework with exact version and OS), ## System Architecture, ## Modules / Features, ## How to Run the Project (prerequisites, install, run, test), ## File Structure, ## Future Scope, ## Conclusion. 800-1200 words, student-friendly.\n\n${ctx}`,
                    }),
                    generateText({
                      model: modelInstance,
                      prompt: `Generate 20 likely viva / interview questions with short model answers for this student project. Markdown, numbered, answers in italics. Mix conceptual, implementation, troubleshooting, and "why did you choose X" questions.\n\n${ctx}`,
                    }),
                    generateText({
                      model: modelInstance,
                      prompt: `Return ONLY valid JSON of the form {"slides":[{"title":"...","bullets":["..."],"notes":"..."}, ...]} with EXACTLY 10 slides for a class presentation. Slides: 1 Title, 2 Problem, 3 Objectives, 4 Motivation, 5 System Architecture, 6 Tech Stack, 7 Modules, 8 How it Works, 9 Results/Screenshots, 10 Conclusion & Future Work. No prose before or after.\n\n${ctx}`,
                    }),
                  ]);

                  let slides: Slide[] = [];
                  const m = slidesRes.text.match(/\{[\s\S]*\}/);
                  if (m) {
                    try { slides = (JSON.parse(m[0]) as { slides?: Slide[] }).slides ?? []; } catch { /* ignore */ }
                  }

                  await supabase
                    .from("projects")
                    .update({
                      report: reportRes.text,
                      viva_questions: vivaRes.text,
                      slides: slides as never,
                    })
                    .eq("id", projectId);
                } catch (err) {
                  console.error("auto-artifact generation failed", err);
                }
              }
            },
          });
        } catch (err: any) {
          console.error("AI Generation Stream Error:", err);
          return new Response(err.message || "AI stream generation failed", { status: 400 });
        }
      },
    },
  },
});
