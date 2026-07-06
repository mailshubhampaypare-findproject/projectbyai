import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { generateText } from "ai";
import { z } from "zod";
import { google } from "@ai-sdk/google";
import { createClient } from "@supabase/supabase-js";

const IdInput = z.object({ id: z.string().uuid() });

export const createProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ title: z.string().min(1).max(120), description: z.string().max(50000).optional() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { data: proj, error } = await context.supabase
      .from("projects")
      .insert({
        user_id: context.userId,
        title: data.title,
        description: data.description ?? null,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: proj.id as string };
  });

export const listProjects = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("projects")
      .select("id, title, description, status, source, tech_stack, created_at, updated_at")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const getProject = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => IdInput.parse(d))
  .handler(async ({ data, context }) => {
    const [{ data: project, error: pe }, { data: messages, error: me }] = await Promise.all([
      context.supabase.from("projects").select("*").eq("id", data.id).single(),
      context.supabase
        .from("chat_messages")
        .select("id, role, parts, created_at")
        .eq("project_id", data.id)
        .order("created_at", { ascending: true }),
    ]);
    if (pe) throw new Error(pe.message);
    if (me) throw new Error(me.message);
    return { project, messages: messages ?? [] };
  });

export const getProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("profiles")
      .select("*")
      .eq("id", context.userId)
      .single();
    if (error) throw new Error(error.message);
    return data;
  });

async function generateArtifact(prompt: string) {
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
    throw new Error("Missing API keys (GEMINI_API_KEY or DEEPSEEK_API_KEY)");
  }

  const { text } = await generateText({
    model: modelInstance,
    prompt,
  });
  return text;
}

async function loadContext(supabase: any, id: string) {
  const { data: project } = await supabase.from("projects").select("*").eq("id", id).single();
  const { data: messages } = await supabase
    .from("chat_messages")
    .select("role, parts")
    .eq("project_id", id)
    .order("created_at", { ascending: true });
  const transcript = (messages ?? [])
    .map((m: any) => {
      const text = (m.parts as any[])
        ?.map((p) => (p?.type === "text" ? p.text : ""))
        .join("");
      return `${m.role.toUpperCase()}: ${text}`;
    })
    .join("\n\n");
  return { project, transcript };
}

export const generateReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => IdInput.parse(d))
  .handler(async ({ data, context }) => {
    const { data: profile } = await context.supabase
      .from("profiles")
      .select("tokens, used_tokens")
      .eq("id", context.userId)
      .single();

    if (!profile || (profile.tokens ?? 0) <= 0) {
      throw new Error("Insufficient tokens. Please buy more tokens to generate report.");
    }

    const { project, transcript } = await loadContext(context.supabase, data.id);
    const prompt = `You are writing a professional academic project report in clean, raw HTML (do not enclose it in markdown blocks or write \`\`\`html blocks) for the project described below.
    
Title: ${project.title}
Description: ${project.description ?? "(none)"}

Chat transcript with the mentor (contains the code and design decisions):
${transcript || "(no chat yet — infer a reasonable report from the title/description)"}

The report MUST follow this exact structure and include all the specified details:

<h1>INDEX</h1>
<table border="1" style="width:100%; border-collapse:collapse; margin-bottom:20px;">
  <thead>
    <tr><th style="padding: 8px; text-align: left; background-color: #f8f9fa;">Sr. No.</th><th style="padding: 8px; text-align: left; background-color: #f8f9fa;">CHAPTER</th><th style="padding: 8px; text-align: left; background-color: #f8f9fa;">Page No.</th></tr>
  </thead>
  <tbody>
    <tr><td></td><td>ABSTRACT</td><td>1</td></tr>
    <tr><td></td><td>LIST OF FIGURES</td><td>2</td></tr>
    <tr><td></td><td>LIST OF TABLES</td><td>3</td></tr>
    <tr><td>1</td><td>INTRODUCTION</td><td></td></tr>
    <tr><td></td><td>&nbsp;&nbsp;1.1 Problem Definition</td><td>1</td></tr>
    <tr><td></td><td>&nbsp;&nbsp;1.2 Present System In Use</td><td>2</td></tr>
    <tr><td></td><td>&nbsp;&nbsp;1.3 Flaws In Present System</td><td>2</td></tr>
    <tr><td></td><td>&nbsp;&nbsp;1.4 Need Of New System</td><td>2</td></tr>
    <tr><td></td><td>&nbsp;&nbsp;1.5 Proposed System</td><td>3</td></tr>
    <tr><td>2</td><td>DETAILED SYSTEM DESIGN</td><td></td></tr>
    <tr><td></td><td>&nbsp;&nbsp;2.1 System Flow Chart</td><td>5</td></tr>
    <tr><td></td><td>&nbsp;&nbsp;2.2 Structure Diagram Of Each Module</td><td>6</td></tr>
    <tr><td></td><td>&nbsp;&nbsp;2.3 Data Dictionary</td><td>7</td></tr>
    <tr><td></td><td>&nbsp;&nbsp;2.4 Data Flow Diagrams</td><td>8</td></tr>
    <tr><td>3</td><td>SOFTWARE / HARDWARE DETAILS</td><td></td></tr>
    <tr><td></td><td>&nbsp;&nbsp;3.1 Choice Of A Language Used</td><td>11</td></tr>
    <tr><td></td><td>&nbsp;&nbsp;3.2 Hardware / Software Specification</td><td>11</td></tr>
    <tr><td>4</td><td>SYSTEM DESIGN</td><td></td></tr>
    <tr><td></td><td>&nbsp;&nbsp;4.1 Program Listing</td><td>15</td></tr>
    <tr><td></td><td>&nbsp;&nbsp;4.2 Input Screens</td><td>15</td></tr>
    <tr><td></td><td>&nbsp;&nbsp;4.3 Output Screens / Reports</td><td>16</td></tr>
    <tr><td>5</td><td>USER DOCUMENTATION</td><td></td></tr>
    <tr><td></td><td>&nbsp;&nbsp;5.1 Implementation, Program Execution & Testing</td><td>39</td></tr>
    <tr><td>6</td><td>CONCLUSION</td><td></td></tr>
    <tr><td></td><td>&nbsp;&nbsp;6.1 Limitations Of The System</td><td>43</td></tr>
    <tr><td></td><td>&nbsp;&nbsp;6.2 Future Scope</td><td>44</td></tr>
    <tr><td>7</td><td>REFERENCES</td><td>46</td></tr>
    <tr><td>8</td><td>ANNEXURE</td><td>48</td></tr>
  </tbody>
</table>

<h1>ABSTRACT</h1>
<p>[Provide a clear academic abstract describing the system, objectives, technology stack, architecture layers (Controller, Service, Repository, Entity, DB), and main highlights]</p>

<h1>LIST OF FIGURES</h1>
<ul>
  <li>1. Detailed System Flow Chart</li>
  <li>2. DFD Level Flow Chart</li>
  <li>3. Structure Diagram of the System</li>
  <li>4. Data Dictionary Flow</li>
</ul>

<h1>LIST OF TABLES</h1>
<ul>
  <li>1. User Roles and Access Details</li>
  <li>2. Database Schema Structure</li>
  <li>3. Technology Stack Used</li>
  <li>4. System Workflow Summary</li>
  <li>5. User Roles and Permissions</li>
  <li>6. Core Modules of the System</li>
  <li>7. Testing Summary</li>
</ul>

<h1>1 INTRODUCTION</h1>
<h2>1.1 PROBLEM DEFINITION</h2>
<p>[Detailed definition of the problem this project solves based on the project parameters]</p>
<h2>1.2 PRESENT SYSTEM IN USE</h2>
<p>[Describe current manual/basic systems in use or common existing designs]</p>
<h2>1.3 FLAWS IN PRESENT SYSTEM</h2>
<p>[List security vulnerabilities, duplication, lack of scalability, and manual inefficiency issues]</p>
<h2>1.4 NEED OF NEW SYSTEM</h2>
<p>[Explain the core business benefits of automating this workflow and building the new system]</p>
<h2>1.5 PROPOSED SYSTEM</h2>
<p>[Provide proposed system description, tech stack, and module outline]</p>

<h1>2 DETAILED SYSTEM DESIGN</h1>
<h2>2.1 SYSTEM FLOW CHART</h2>
<p>[Step-by-step description of logical system workflow]</p>
<h2>2.2 STRUCTURE DIAGRAM OF EACH MODULE</h2>
<p>[Outline structure of User Auth, Main Features, Core logic modules, etc.]</p>
<h2>2.3 DATA DICTIONARY</h2>
<p>[Tabular dictionary detail list of tables and columns used]</p>
<h2>2.4 DATA FLOW DIAGRAMS</h2>
<p>[Flow of data between users and components]</p>

<h1>3 SOFTWARE / HARDWARE DETAILS</h1>
<h2>3.1 CHOICE OF LANGUAGE USED</h2>
[Justify coding language, frameworks, DB, build tool choices]
<h2>3.2 HARDWARE / SOFTWARE SPECIFICATION</h2>
<p>[State specs: Intel i3/i5, 4GB/8GB RAM, Windows/Linux, Java/Python, MySQL, etc.]</p>

<h1>4 SYSTEM DESIGN</h1>
<h2>4.1 PROGRAM LISTING</h2>
<p>[List key files, classes, components, or source codes and explain their purposes]</p>
<h2>4.2 INPUT SCREENS</h2>
<p>[Describe inputs: login, sign up, features creation]</p>
<h2>4.3 OUTPUT SCREENS / REPORTS</h2>
<p>[Describe results output: dashboards, lists, metrics]</p>

<h1>5 USER DOCUMENTATION</h1>
<h2>5.1 IMPLEMENTATION, PROGRAM EXECUTION & TESTING</h2>
<p>[Detailed test cases, results, and execution guides]</p>

<h1>6 CONCLUSION</h1>
<h2>6.1 LIMITATIONS OF THE SYSTEM</h2>
<p>[List current system limits, internet dependencies, hosting constraints, etc.]</p>
<h2>6.2 FUTURE SCOPE</h2>
<p>[Outline future extensions like mobile app, API support, payment gateways]</p>

<h1>7 REFERENCES</h1>
<p>[Standard bibliography, textbooks, official documentations, stackoverflow, online tutorials]</p>

<h1>8 ANNEXURE</h1>
<p>[Optional annexure guidelines and standard code segments]</p>

IMPORTANT: Output the report as raw HTML content ONLY. Do not use markdown syntax, markdown blocks, or surround with backticks. Start with index/abstract directly. Make it comprehensive, detailed, and at least 1500 words.`;
    const report = await generateArtifact(prompt);

    // Deduct 1 token and increment used tokens
    const currentT = profile?.tokens ?? 0;
    const currentUsed = profile?.used_tokens ?? 0;
    await context.supabase
      .from("profiles")
      .update({
        tokens: Math.max(0, currentT - 1),
        used_tokens: currentUsed + 1
      })
      .eq("id", context.userId);

    await context.supabase.from("projects").update({ report }).eq("id", data.id);
    return { report };
  });

export const generateViva = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => IdInput.parse(d))
  .handler(async ({ data, context }) => {
    const { data: profile } = await context.supabase
      .from("profiles")
      .select("tokens, used_tokens")
      .eq("id", context.userId)
      .single();

    if (!profile || (profile.tokens ?? 0) <= 0) {
      throw new Error("Insufficient tokens. Please buy more tokens to generate viva questions.");
    }

    const { project, transcript } = await loadContext(context.supabase, data.id);
    const prompt = `Generate 20 likely viva / interview questions with detailed model answers for the following student project. Format as Markdown with numbered questions and answers in italics.

Project: ${project.title}
Description: ${project.description ?? ""}

Context:
${transcript || "(none)"}

Include a mix of: (a) conceptual/theory (b) implementation specifics (c) troubleshooting (d) 3-5 "why did you choose X" questions. Keep answers short and honest.`;
    const viva = await generateArtifact(prompt);

    // Deduct 1 token and increment used tokens
    const currentT = profile?.tokens ?? 0;
    const currentUsed = profile?.used_tokens ?? 0;
    await context.supabase
      .from("profiles")
      .update({
        tokens: Math.max(0, currentT - 1),
        used_tokens: currentUsed + 1
      })
      .eq("id", context.userId);

    await context.supabase.from("projects").update({ viva_questions: viva }).eq("id", data.id);
    return { viva };
  });

export type Slide = { title: string; bullets: string[]; notes?: string };

export const generateSlides = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => IdInput.parse(d))
  .handler(async ({ data, context }): Promise<{ slides: Slide[] }> => {
    const { data: profile } = await context.supabase
      .from("profiles")
      .select("tokens, used_tokens")
      .eq("id", context.userId)
      .single();

    if (!profile || (profile.tokens ?? 0) <= 0) {
      throw new Error("Insufficient tokens. Please buy more tokens to generate slides.");
    }

    const { project, transcript } = await loadContext(context.supabase, data.id);
    const prompt = `Create a 10-slide presentation deck for this student project. Return ONLY valid JSON of the form:
{"slides":[{"title":"...","bullets":["...","..."],"notes":"..."}, ...]}
No prose before or after. Exactly 10 slides.

Suggested slides: 1 Title, 2 Problem, 3 Objectives, 4 Literature/Motivation, 5 System Architecture, 6 Tech Stack, 7 Modules, 8 How it Works (demo flow), 9 Results/Screenshots, 10 Conclusion & Future Work.

Project title: ${project.title}
Description: ${project.description ?? ""}

Context:
${transcript || "(none)"}`;
    const text = await generateArtifact(prompt);
    const match = text.match(/\{[\s\S]*\}/);
    let slides: Slide[] = [];
    if (match) {
      try {
        const parsed = JSON.parse(match[0]) as { slides?: Slide[] };
        slides = parsed.slides ?? [];
      } catch {
        slides = [];
      }
    }

    // Deduct 1 token and increment used tokens
    const currentT = profile?.tokens ?? 0;
    const currentUsed = profile?.used_tokens ?? 0;
    await context.supabase
      .from("profiles")
      .update({
        tokens: Math.max(0, currentT - 1),
        used_tokens: currentUsed + 1
      })
      .eq("id", context.userId);

    await context.supabase.from("projects").update({ slides: slides as never }).eq("id", data.id);
    return { slides };
  });

export const deleteProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => IdInput.parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("projects").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listRegisteredUsers = createServerFn({ method: "GET" })
  .handler(async () => {
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseUrl = process.env.SUPABASE_URL;

    if (!supabaseUrl) {
      throw new Error("SUPABASE_URL is missing in environment variables.");
    }
    if (!serviceKey) {
      throw new Error("SUPABASE_SERVICE_ROLE_KEY is missing in environment variables. Please add it to your .env file.");
    }

    const serviceClient = createClient(supabaseUrl, serviceKey, {
      auth: {
        persistSession: false,
      },
    });

    const { data, error } = await serviceClient
      .from("profiles")
      .select("id, email, full_name, plan, tokens, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error("Supabase query failed: " + error.message);
    }

    return data || [];
  });
