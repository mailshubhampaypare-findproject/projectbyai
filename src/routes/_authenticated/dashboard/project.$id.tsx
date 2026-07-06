import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useServerFn } from "@tanstack/react-start";
import { getProject, generateReport, generateViva, generateSlides, getProfile, type Slide } from "@/lib/projects.functions";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import {
  Send, Sparkles, Code2, FileText, MessageCircleQuestion, Presentation,
  Loader2, RefreshCw, ChevronLeft, ChevronRight, Copy, Paperclip, X,
  Maximize2, Minimize2, Columns, LayoutGrid, Eye, Folder, ChevronDown,
  FileCode, GitBranch, Circle, Bold, Italic, Underline, Table, Image,
  Undo, Redo, Save, Download, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/dashboard/project/$id")({
  head: () => ({ meta: [{ title: "Project Workspace — ScholarBuild" }] }),
  component: ProjectWorkspace,
});

type ProjectRow = {
  id: string; title: string; description: string | null; code: string | null;
  report: string | null; viva_questions: string | null; slides: Slide[] | null;
};

function ProjectWorkspace() {
  const { id } = Route.useParams();
  const load = useServerFn(getProject);
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: () => load({ data: { id } }),
  });
  const project = data?.project as ProjectRow | undefined;
  
  const loadProfile = useServerFn(getProfile);
  const { data: profile, refetch: refetchProfile } = useQuery({
    queryKey: ["profile"],
    queryFn: () => loadProfile(),
  });
  
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);

  const initialMessages = useMemo<UIMessage[]>(
    () => (data?.messages ?? []).map((m: { id: string; role: string; parts: unknown }) => ({
      id: m.id,
      role: m.role as UIMessage["role"],
      parts: m.parts as UIMessage["parts"],
    })),
    [data],
  );

  if (isLoading || !project) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading project…
      </div>
    );
  }

  const userTokens = profile?.tokens ?? 0;
  const requireTokensHandler = () => setIsTokenModalOpen(true);

  return (
    <div className="h-full flex flex-col relative">
      <div className="px-6 py-4 border-b bg-card/50">
        <h1 className="text-xl font-semibold">{project.title}</h1>
        {project.description && (
          <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">{project.description}</p>
        )}
      </div>
      <Tabs defaultValue="build" className="flex-1 flex flex-col min-h-0">
        <TabsList className="mx-6 mt-3 self-start">
          <TabsTrigger value="build"><Sparkles className="h-4 w-4 mr-1" /> AI Build</TabsTrigger>
          <TabsTrigger value="report"><FileText className="h-4 w-4 mr-1" /> Report</TabsTrigger>
          <TabsTrigger value="viva"><MessageCircleQuestion className="h-4 w-4 mr-1" /> Viva</TabsTrigger>
          <TabsTrigger value="ppt"><Presentation className="h-4 w-4 mr-1" /> PPT</TabsTrigger>
        </TabsList>
        <TabsContent value="build" className="flex-1 min-h-0 m-0 flex flex-col h-full">
          <BuildTab
            projectId={id}
            initialMessages={initialMessages}
            initialCode={project.code}
            projectPrompt={project.description}
            tokens={userTokens}
            onRequireTokens={requireTokensHandler}
            refetchProfile={refetchProfile}
          />
        </TabsContent>
        <TabsContent value="report" className="flex-1 min-h-0 m-0 overflow-auto">
          <ArtifactTab
            kind="report"
            id={id}
            initial={project.report}
            onRefetch={refetch}
            generateFn={generateReport}
            title="Project Report"
            description="A complete Markdown report — tech stack, versions, how to run, architecture, and everything your teacher needs."
            tokens={userTokens}
            onRequireTokens={requireTokensHandler}
            refetchProfile={refetchProfile}
          />
        </TabsContent>
        <TabsContent value="viva" className="flex-1 min-h-0 m-0 overflow-auto">
          <ArtifactTab
            kind="viva"
            id={id}
            initial={project.viva_questions}
            onRefetch={refetch}
            generateFn={generateViva}
            title="Viva & Interview Questions"
            description="Twenty likely questions with model answers, drawn from your project's tech and design."
            tokens={userTokens}
            onRequireTokens={requireTokensHandler}
            refetchProfile={refetchProfile}
          />
        </TabsContent>
        <TabsContent value="ppt" className="flex-1 min-h-0 m-0 overflow-auto">
          <SlidesTab 
            id={id} 
            initial={project.slides} 
            onRefetch={refetch} 
            tokens={userTokens}
            onRequireTokens={requireTokensHandler}
            refetchProfile={refetchProfile}
          />
        </TabsContent>
      </Tabs>

      {/* 0 Tokens Warning Modal popup */}
      {isTokenModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-500">
              <Zap className="h-6 w-6 text-amber-500 shrink-0" />
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">AI Tokens Exhausted</h3>
            </div>
            
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              You currently have <strong className="text-red-500 font-bold">0 tokens available</strong>. You need AI tokens to chat with the mentor, write source files, or compile your reports and slides.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <Button 
                variant="outline" 
                onClick={() => setIsTokenModalOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  setIsTokenModalOpen(false);
                  window.location.href = "/dashboard/pricing";
                }}
                className="bg-gradient-primary text-white shadow-elegant font-semibold"
              >
                Buy New Tokens
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* -------- Helper: parse attachments out of message text -------- */
const parseAttachments = (text: string) => {
  const attachments: { name: string; url: string }[] = [];
  const re = /\[Attachment:\s*(.*?)\s*\((https?:\/\/.*?)\)\]/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    attachments.push({ name: match[1], url: match[2] });
  }
  const cleanText = text.replace(/### Attachments:[\s\S]*$/, "").trim();
  return { cleanText, attachments };
};

type FileNode = {
  name: string;
  path: string;
  isFolder: boolean;
  children?: FileNode[];
  code?: string;
  lang?: string;
};

function FileTreeItem({
  node,
  selectedPath,
  onSelectFile,
  expandedFolders,
  onToggleFolder,
}: {
  node: FileNode;
  selectedPath: string;
  onSelectFile: (file: { path: string; code: string; lang: string }) => void;
  expandedFolders: Record<string, boolean>;
  onToggleFolder: (path: string) => void;
}) {
  const isExpanded = expandedFolders[node.path] ?? true;

  if (node.isFolder) {
    return (
      <div>
        <button
          type="button"
          onClick={() => onToggleFolder(node.path)}
          className="flex items-center gap-1.5 w-full text-left py-1 px-2 rounded-md hover:bg-slate-200/70 dark:hover:bg-slate-800/60 text-xs font-medium text-slate-600 dark:text-slate-300 transition-colors"
        >
          {isExpanded ? <ChevronDown className="h-3 w-3 shrink-0 text-slate-400" /> : <ChevronRight className="h-3 w-3 shrink-0 text-slate-400" />}
          <Folder className="h-3.5 w-3.5 text-blue-400 fill-blue-400/30 shrink-0" />
          <span className="truncate">{node.name}</span>
        </button>
        {isExpanded && node.children && (
          <div className="pl-3 ml-2.5 border-l border-slate-200 dark:border-slate-700/50">
            {node.children.map((child, i) => (
              <FileTreeItem
                key={i}
                node={child}
                selectedPath={selectedPath}
                onSelectFile={onSelectFile}
                expandedFolders={expandedFolders}
                onToggleFolder={onToggleFolder}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  const isSelected = selectedPath === node.path;
  return (
    <button
      type="button"
      onClick={() => onSelectFile({ path: node.path, code: node.code ?? "", lang: node.lang ?? "text" })}
      className={cn(
        "flex items-center gap-1.5 w-full text-left py-1 px-2 rounded-md text-xs font-mono transition-colors",
        isSelected
          ? "bg-blue-100/80 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold"
          : "hover:bg-slate-200/70 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400"
      )}
    >
      <FileCode className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
      <span className="truncate">{node.name}</span>
    </button>
  );
}

/* -------- Build tab (chat + code) -------- */
function BuildTab({
  projectId, initialMessages, initialCode, projectPrompt, tokens, onRequireTokens, refetchProfile,
}: { 
  projectId: string; 
  initialMessages: UIMessage[]; 
  initialCode: string | null; 
  projectPrompt: string | null;
  tokens: number;
  onRequireTokens: () => void;
  refetchProfile: () => void;
}) {
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: () => ({ projectId }),
        headers: async (): Promise<Record<string, string>> => {
          const { data } = await supabase.auth.getSession();
          const token = data.session?.access_token;
          return token ? { Authorization: `Bearer ${token}` } : {};
        },
      }),
    [projectId],
  );
  const { messages, sendMessage, status } = useChat({
    id: projectId,
    messages: initialMessages,
    transport,
    onError: (e) => toast.error(e.message),
    onFinish: () => {
      refetchProfile();
    }
  });
  const [input, setInput] = useState("");
  const [layoutMode, setLayoutMode] = useState<"split" | "chat" | "code">("split");
  const [attachments, setAttachments] = useState<{ name: string; url: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  const [activeFile, setActiveFile] = useState<{ path: string; code: string; lang: string } | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  const autoStartedRef = useRef(false);
  useEffect(() => {
    if (messages.length === 0 && projectPrompt && !autoStartedRef.current && status === "ready") {
      autoStartedRef.current = true;
      sendMessage({ text: projectPrompt });
    }
  }, [messages.length, projectPrompt, sendMessage, status]);

  const isBusy = status === "submitted" || status === "streaming";

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    try {
      const file = files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `chat-attachments/${fileName}`;

      const { data, error } = await supabase.storage
        .from("uploads")
        .upload(filePath, file, { cacheControl: "3600", upsert: true });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from("uploads")
        .getPublicUrl(filePath);

      setAttachments((prev) => [
        ...prev,
        { name: file.name, url: urlData.publicUrl },
      ]);
      toast.success(`${file.name} attached!`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload file");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tokens <= 0) {
      onRequireTokens();
      return;
    }
    const text = input.trim();
    if (!text && attachments.length === 0) return;
    if (isBusy) return;

    let finalMsg = text;
    if (attachments.length > 0) {
      const attachmentText = attachments
        .map((a) => `[Attachment: ${a.name} (${a.url})]`)
        .join("\n");
      finalMsg = `${text}\n\n### Attachments:\n${attachmentText}`;
    }

    setInput("");
    setAttachments([]);
    sendMessage({ text: finalMsg });
  };

  // Extract code blocks from all assistant messages
  const codeSnippets = useMemo(() => {
    const files: { path: string; name: string; code: string; lang: string }[] = [];
    let fileIndex = 1;

    for (const m of messages) {
      if (m.role !== "assistant") continue;
      const text = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
      const re = /```([\w-]*)\n([\s\S]*?)```/g;
      let match: RegExpExecArray | null;
      while ((match = re.exec(text)) !== null) {
        const lang = match[1] || "text";
        const code = match[2];

        // Search for file path header comment on the first few lines
        const lines = code.split("\n");
        let filePath = "";
        for (let i = 0; i < Math.min(5, lines.length); i++) {
          const line = lines[i].trim();
          const fileMatch = line.match(/^(?:\/\/\/|\/\/|#|\/\*)\s*(?:file:?|file\s+path:?|path:?|filename:?)?\s*([\w\-./\\]+)/i);
          if (fileMatch && fileMatch[1] && fileMatch[1].includes(".")) {
            filePath = fileMatch[1].replace(/\\/g, "/"); // normalize backslashes to forward slashes
            break;
          }
        }

        if (!filePath) {
          filePath = `snippet-${fileIndex}.${lang === "typescript" || lang === "tsx" ? "tsx" : lang === "javascript" ? "js" : lang === "python" ? "py" : lang}`;
          fileIndex++;
        }

        const parts = filePath.split("/");
        const name = parts[parts.length - 1];

        // Deduplicate: replace older versions with the latest code snippet
        const existingIdx = files.findIndex((f) => f.path === filePath);
        if (existingIdx !== -1) {
          files[existingIdx] = { path: filePath, name, code, lang };
        } else {
          files.push({ path: filePath, name, code, lang });
        }
      }
    }
    return files;
  }, [messages]);

  // Recursively compile into file tree
  const fileTree = useMemo(() => {
    const root: FileNode[] = [];
    for (const file of codeSnippets) {
      const parts = file.path.split("/");
      let currentLevel = root;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const isLast = i === parts.length - 1;
        const currentPath = parts.slice(0, i + 1).join("/");
        let existingNode = currentLevel.find((n) => n.name === part);
        if (!existingNode) {
          existingNode = {
            name: part,
            path: currentPath,
            isFolder: !isLast,
            children: isLast ? undefined : [],
            code: isLast ? file.code : undefined,
            lang: isLast ? file.lang : undefined,
          };
          currentLevel.push(existingNode);
        }
        if (!isLast && existingNode.children) {
          currentLevel = existingNode.children;
        }
      }
    }
    const sortNodes = (nodes: FileNode[]) => {
      nodes.sort((a, b) => {
        if (a.isFolder && !b.isFolder) return -1;
        if (!a.isFolder && b.isFolder) return 1;
        return a.name.localeCompare(b.name);
      });
      for (const node of nodes) {
        if (node.children) sortNodes(node.children);
      }
    };
    sortNodes(root);

    // GitHub-style directory flattening for single-child folders
    const compressFolders = (nodes: FileNode[]): FileNode[] => {
      return nodes.map((node) => {
        if (node.isFolder && node.children) {
          const flattenedChildren = compressFolders(node.children);
          if (flattenedChildren.length === 1 && flattenedChildren[0].isFolder) {
            const singleChild = flattenedChildren[0];
            return {
              ...node,
              name: `${node.name}/${singleChild.name}`,
              path: singleChild.path,
              children: singleChild.children,
            };
          }
          return { ...node, children: flattenedChildren };
        }
        return node;
      });
    };

    return compressFolders(root);
  }, [codeSnippets]);

  // Automatically select the first file as active if none is selected
  useEffect(() => {
    if (codeSnippets.length > 0) {
      if (!activeFile || !codeSnippets.some((f) => f.path === activeFile.path)) {
        setActiveFile(codeSnippets[0]);
      }
    } else {
      setActiveFile(null);
    }
  }, [codeSnippets, activeFile]);

  return (
    <div className="h-full flex flex-col lg:flex-row gap-0 overflow-hidden">
      {/* Chat — sticky input at bottom, only messages scroll */}
      <div 
        className={cn(
          "flex flex-col min-h-0 border-r bg-card transition-all duration-300",
          layoutMode === "chat" ? "w-full flex-1" : layoutMode === "code" ? "hidden" : "lg:w-1/2 flex-1"
        )}
      >
        {/* Chat Header — fixed */}
        <div className="px-4 py-3 border-b bg-muted/20 flex items-center gap-2 shrink-0">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="font-semibold text-sm">AI Workspace Mentor</span>
          
          <div className="flex items-center gap-1 ml-auto border rounded-md p-0.5 bg-slate-100 dark:bg-slate-900 text-xs">
            <button
              type="button"
              onClick={() => setLayoutMode("chat")}
              className={cn("px-2 py-0.5 rounded text-[10px] font-bold transition-all", layoutMode === "chat" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground")}
            >
              Chat Only
            </button>
            <button
              type="button"
              onClick={() => setLayoutMode("split")}
              className={cn("px-2 py-0.5 rounded text-[10px] font-bold transition-all hidden lg:inline-block", layoutMode === "split" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground")}
            >
              Split View
            </button>
            <button
              type="button"
              onClick={() => setLayoutMode("code")}
              className={cn("px-2 py-0.5 rounded text-[10px] font-bold transition-all", layoutMode === "code" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground")}
            >
              Code Only
            </button>
          </div>
        </div>

        {/* Scrollable messages area — takes all available space */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto min-h-0 p-6 space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-12 space-y-2">
              <Sparkles className="h-8 w-8 mx-auto text-primary" />
              <p className="text-muted-foreground">Start by asking the AI to build a specific part of your project.</p>
              <p className="text-xs text-muted-foreground">Example: "Generate the Flask backend with face detection endpoints."</p>
            </div>
          )}
          {messages.map((m) => (
            <MessageBubble key={m.id} message={m} onOpenLightbox={setLightboxUrl} />
          ))}
          {isBusy && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
              <Loader2 className="h-4 w-4 animate-spin text-primary" /> Scholarly is thinking…
            </div>
          )}
        </div>

        {/* Sticky bottom input area — never scrolls */}
        <div className="shrink-0 border-t bg-card/80 backdrop-blur-sm">
          {/* Upload previews */}
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 px-4 py-2 border-b bg-slate-50 dark:bg-slate-900/30">
              {attachments.map((a, i) => (
                <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs text-muted-foreground border">
                  <FileText className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="max-w-[120px] truncate">{a.name}</span>
                  <button
                    type="button"
                    onClick={() => setAttachments((prev) => prev.filter((_, idx) => idx !== i))}
                    className="hover:text-destructive p-0.5 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Uploading progress indicator */}
          {uploading && (
            <div className="text-xs text-muted-foreground px-4 py-2 flex items-center gap-1.5 animate-pulse border-b bg-slate-50 dark:bg-slate-900/30">
              <Loader2 className="h-3 w-3 animate-spin text-primary" />
              Uploading file attachment...
            </div>
          )}

          <form onSubmit={submit} className="p-3">
            <div className="flex gap-2 items-end">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept="image/*,.pdf,.zip,.txt,.json,.js,.py,.html,.css"
              />
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || isBusy}
                className="h-[44px] w-[44px] shrink-0 rounded-xl"
                title="Attach File (Image, PDF, ZIP)"
              >
                <Paperclip className="h-4 w-4 text-muted-foreground" />
              </Button>
              
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(e); }
                }}
                placeholder="Ask the AI to build, refactor, or explain…"
                className="resize-none min-h-[44px] max-h-32 rounded-xl text-sm"
                disabled={isBusy}
              />
              <Button type="submit" size="icon" className="h-[44px] w-[44px] bg-gradient-primary shrink-0 rounded-xl" disabled={isBusy || (!input.trim() && attachments.length === 0)}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Code */}
      <div 
        className={cn(
          "flex flex-col min-h-0 bg-muted/30 transition-all duration-300",
          layoutMode === "code" ? "w-full flex-1" : layoutMode === "chat" ? "hidden" : "lg:w-1/2 flex-1"
        )}
      >
        <div className="px-4 py-3 border-b bg-card/50 flex items-center gap-2">
          <Code2 className="h-4 w-4 text-primary" />
          <span className="font-semibold text-sm">Workspace Files Explorer</span>
          <span className="text-xs text-muted-foreground ml-auto">{codeSnippets.length} file{codeSnippets.length === 1 ? "" : "s"}</span>
          
          <div className="flex items-center gap-1 ml-3 border rounded-md p-0.5 bg-slate-100 dark:bg-slate-900 text-xs">
            <button
              type="button"
              onClick={() => setLayoutMode("chat")}
              className={cn("px-2 py-0.5 rounded text-[10px] font-bold transition-all", layoutMode === "chat" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground")}
            >
              Chat Only
            </button>
            <button
              type="button"
              onClick={() => setLayoutMode("split")}
              className={cn("px-2 py-0.5 rounded text-[10px] font-bold transition-all hidden lg:inline-block", layoutMode === "split" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground")}
            >
              Split View
            </button>
            <button
              type="button"
              onClick={() => setLayoutMode("code")}
              className={cn("px-2 py-0.5 rounded text-[10px] font-bold transition-all", layoutMode === "code" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground")}
            >
              Code Only
            </button>
          </div>
        </div>

        {codeSnippets.length === 0 && !initialCode ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-sm text-muted-foreground">
            <Code2 className="h-8 w-8 mx-auto mb-3 opacity-40" />
            As the AI generates code, directories and files will appear here in real time.
          </div>
        ) : (
          <div className="flex-1 flex min-h-0 overflow-hidden">
            {/* GitHub-style Sidebar Explorer Tree */}
            <div className="w-[220px] sm:w-[260px] shrink-0 overflow-auto border-r border-slate-200 dark:border-slate-700/60 bg-slate-50/80 dark:bg-[#0d1117] flex flex-col min-h-0">
              <div className="px-3 py-2.5 border-b border-slate-200 dark:border-slate-700/60 flex items-center gap-2 shrink-0">
                <GitBranch className="h-3.5 w-3.5 text-slate-500" />
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Files</span>
                <span className="ml-auto text-[10px] font-mono text-slate-400 bg-slate-200/60 dark:bg-slate-800 px-1.5 py-0.5 rounded-full">{codeSnippets.length}</span>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
                {fileTree.map((node, i) => (
                  <FileTreeItem
                    key={i}
                    node={node}
                    selectedPath={activeFile?.path ?? ""}
                    onSelectFile={setActiveFile}
                    expandedFolders={expandedFolders}
                    onToggleFolder={toggleFolder}
                  />
                ))}
              </div>
            </div>

            {/* GitHub-style Code Viewer */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-white dark:bg-[#0d1117]">
              {activeFile ? (
                <>
                  {/* GitHub file header bar */}
                  <div className="flex items-center justify-between px-4 py-2 bg-slate-50 dark:bg-[#161b22] border-b border-slate-200 dark:border-slate-700/60">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileCode className="h-4 w-4 text-slate-400 shrink-0" />
                      <span className="text-xs font-mono font-semibold truncate text-slate-700 dark:text-slate-200">{activeFile.path}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-md uppercase">{activeFile.lang}</span>
                      <span className="text-[10px] font-mono text-slate-400">{activeFile.code.split('\n').length} lines</span>
                      <Button size="sm" variant="ghost" className="h-7 text-xs hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => { navigator.clipboard.writeText(activeFile.code); toast.success("Copied to clipboard"); }}>
                        <Copy className="h-3.5 w-3.5 mr-1" /> Copy
                      </Button>
                    </div>
                  </div>
                  {/* GitHub-style code with line numbers */}
                  <div className="flex-1 overflow-auto">
                    <table className="w-full border-collapse text-xs font-mono leading-[1.6] select-text" style={{ tabSize: 4 }}>
                      <tbody>
                        {activeFile.code.split('\n').map((line, i) => (
                          <tr key={i} className="hover:bg-blue-50/60 dark:hover:bg-blue-900/10 transition-colors">
                            <td className="sticky left-0 w-[1%] min-w-[50px] px-3 py-0 text-right text-slate-300 dark:text-slate-600 select-none border-r border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-[#0d1117] font-mono align-top" style={{ userSelect: 'none' }}>{i + 1}</td>
                            <td className="px-4 py-0 whitespace-pre overflow-x-auto text-slate-800 dark:text-slate-200 align-top">{line || ' '}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : initialCode ? (
                <div className="flex-1 flex flex-col min-h-0">
                  <div className="flex items-center justify-between px-4 py-2 bg-slate-50 dark:bg-[#161b22] border-b border-slate-200 dark:border-slate-700/60">
                    <div className="flex items-center gap-2">
                      <FileCode className="h-4 w-4 text-slate-400" />
                      <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-200">project-source.txt</span>
                    </div>
                  </div>
                  <div className="flex-1 overflow-auto">
                    <table className="w-full border-collapse text-xs font-mono leading-[1.6] select-text" style={{ tabSize: 4 }}>
                      <tbody>
                        {initialCode.split('\n').map((line, i) => (
                          <tr key={i} className="hover:bg-blue-50/60 dark:hover:bg-blue-900/10 transition-colors">
                            <td className="sticky left-0 w-[1%] min-w-[50px] px-3 py-0 text-right text-slate-300 dark:text-slate-600 select-none border-r border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-[#0d1117] font-mono align-top" style={{ userSelect: 'none' }}>{i + 1}</td>
                            <td className="px-4 py-0 whitespace-pre-wrap overflow-x-auto text-slate-800 dark:text-slate-200 align-top">{line || ' '}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">Select a file from the explorer sidebar to view code.</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxUrl && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-200"
          onClick={() => setLightboxUrl(null)}
        >
          <div className="relative max-w-4xl w-full max-h-[85vh] flex items-center justify-center animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <button 
              type="button"
              className="absolute -top-12 right-0 text-white hover:text-slate-300 bg-black/40 hover:bg-black/60 p-2 rounded-full flex items-center justify-center focus:outline-none" 
              onClick={() => setLightboxUrl(null)}
            >
              <X className="h-5 w-5" />
            </button>
            <img src={lightboxUrl} alt="Attachment view" className="max-w-full max-h-[80vh] rounded-lg shadow-2xl object-contain border border-slate-800 bg-slate-950" />
          </div>
        </div>
      )}
    </div>
  );
}

function MessageBubble({ message, onOpenLightbox }: { message: UIMessage; onOpenLightbox: (url: string) => void }) {
  const text = message.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
  const isUser = message.role === "user";
  const { cleanText, attachments } = parseAttachments(text);

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-primary text-primary-foreground px-4 py-2.5 text-sm flex flex-col gap-2">
          <div className="whitespace-pre-wrap">{cleanText}</div>
          {attachments.length > 0 && (
            <div className="grid gap-2 mt-2 pt-2 border-t border-primary-foreground/20">
              {attachments.map((a, i) => {
                const isImage = /\.(png|jpe?g|gif|webp|svg)/i.test(a.name) || a.url.includes("image");
                return (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-primary-foreground/10 text-xs gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      {isImage ? (
                        <div 
                          className="h-10 w-10 rounded border border-white/20 overflow-hidden cursor-pointer bg-white/10 shrink-0"
                          onClick={() => onOpenLightbox(a.url)}
                        >
                          <img src={a.url} alt={a.name} className="h-full w-full object-cover" />
                        </div>
                      ) : (
                        <FileText className="h-8 w-8 text-primary-foreground shrink-0" />
                      )}
                      <span className="font-medium truncate text-primary-foreground">{a.name}</span>
                    </div>
                    <Button size="sm" variant="ghost" className="h-7 text-[10px] text-primary-foreground hover:bg-white/10" asChild>
                      <a href={a.url} target="_blank" rel="noopener noreferrer" download>
                        Download
                      </a>
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none prose-pre:hidden prose-code:before:content-none prose-code:after:content-none flex flex-col gap-2">
      <ReactMarkdown
        components={{
          code({ className, children }) {
            const isBlock = /language-/.test(className ?? "");
            if (isBlock) return null; // rendered in right panel
            return <code className="bg-accent text-accent-foreground px-1.5 py-0.5 rounded text-[0.85em]">{children}</code>;
          },
          pre: () => null,
        }}
      >
        {cleanText}
      </ReactMarkdown>
      {attachments.length > 0 && (
        <div className="grid gap-2 mt-2 pt-2 border-t border-slate-100/50">
          {attachments.map((a, i) => {
            const isImage = /\.(png|jpe?g|gif|webp|svg)/i.test(a.name) || a.url.includes("image");
            return (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg border bg-slate-50/50 dark:bg-slate-900/20 text-xs gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  {isImage ? (
                    <div 
                      className="h-10 w-10 rounded border overflow-hidden cursor-pointer bg-slate-100 shrink-0"
                      onClick={() => onOpenLightbox(a.url)}
                    >
                      <img src={a.url} alt={a.name} className="h-full w-full object-cover" />
                    </div>
                  ) : (
                    <FileText className="h-8 w-8 text-primary shrink-0" />
                  )}
                  <span className="font-medium truncate text-foreground">{a.name}</span>
                </div>
                <Button size="sm" variant="ghost" className="h-7 text-[10px]" asChild>
                  <a href={a.url} target="_blank" rel="noopener noreferrer" download>
                    Download
                  </a>
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* -------- Artifact tabs (report / viva) -------- */
function ArtifactTab({
  kind, id, initial, generateFn, onRefetch, title, description, tokens, onRequireTokens, refetchProfile,
}: {
  kind: string;
  id: string;
  initial: string | null;
  generateFn: (...args: any[]) => Promise<any>;
  onRefetch: () => void;
  title: string;
  description: string;
  tokens: number;
  onRequireTokens: () => void;
  refetchProfile: () => void;
}) {
  const [content, setContent] = useState<string | null>(initial);
  const [busy, setBusy] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [htmlContent, setHtmlContent] = useState(initial || "");
  const [saving, setSaving] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const gen = useServerFn(generateFn as any);

  useEffect(() => {
    if (content) {
      setHtmlContent(content);
    }
  }, [content]);

  const run = async () => {
    if (tokens <= 0) {
      onRequireTokens();
      setShowConfirm(false);
      return;
    }
    setBusy(true);
    try {
      const result = (await gen({ data: { id } })) as Record<string, string>;
      const value = kind === "viva" ? result.viva : result.report;
      setContent(value);
      setHtmlContent(value);
      onRefetch();
      refetchProfile();
      toast.success("Generated!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
      setShowConfirm(false);
    }
  };

  const handleGenerateClick = () => {
    if (tokens <= 0) {
      onRequireTokens();
      return;
    }
    if (kind === "report") {
      setShowConfirm(true);
    } else {
      run();
    }
  };

  const handleSave = async () => {
    if (!editorRef.current) return;
    setSaving(true);
    const updatedHtml = editorRef.current.innerHTML;
    try {
      const { error } = await supabase
        .from("projects")
        .update({ report: updatedHtml })
        .eq("id", id);
      if (error) throw error;
      setHtmlContent(updatedHtml);
      toast.success("Report saved successfully!");
    } catch (err) {
      toast.error("Failed to save report changes");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleCommand = (command: string, value: string = "") => {
    document.execCommand(command, false, value);
  };

  const insertTable = () => {
    const rows = prompt("Enter number of rows:", "3");
    const cols = prompt("Enter number of columns:", "3");
    if (!rows || !cols) return;
    
    let tableHtml = '<table border="1" style="width: 100%; border-collapse: collapse; margin: 15px 0;"><thead><tr>';
    for (let c = 0; c < parseInt(cols); c++) {
      tableHtml += `<th style="padding: 8px; border: 1px solid #ddd; background-color: #f8f9fa; font-weight: bold; text-align: left;">Header ${c+1}</th>`;
    }
    tableHtml += '</tr></thead><tbody>';
    for (let r = 0; r < parseInt(rows); r++) {
      tableHtml += '<tr>';
      for (let c = 0; c < parseInt(cols); c++) {
        tableHtml += '<td style="padding: 8px; border: 1px solid #ddd;">Cell</td>';
      }
      tableHtml += '</tr>';
    }
    tableHtml += '</tbody></table><p>&nbsp;</p>';
    
    editorRef.current?.focus();
    document.execCommand('insertHTML', false, tableHtml);
  };

  const insertImage = () => {
    const url = prompt("Enter image URL:", "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop");
    if (!url) return;
    
    const imgHtml = `<img src="${url}" alt="Report Image" style="max-width: 100%; height: auto; border-radius: 8px; margin: 15px auto; display: block; box-shadow: 0 4px 12px rgba(0,0,0,0.08);" /><p>&nbsp;</p>`;
    editorRef.current?.focus();
    document.execCommand('insertHTML', false, imgHtml);
  };

  return (
    <div className="w-full p-6 lg:p-8 space-y-6">
      <div className="flex items-start justify-between gap-4 no-print">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-muted-foreground mt-1">{description}</p>
        </div>
        <Button onClick={handleGenerateClick} disabled={busy || showConfirm} className="bg-gradient-primary shrink-0">
          {busy ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : content ? <RefreshCw className="h-4 w-4 mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
          {content ? "Regenerate" : "Generate"}
        </Button>
      </div>

      {showConfirm && (
        <Card className="p-6 border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-900/50 space-y-4 no-print">
          <div className="flex gap-3">
            <Sparkles className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 animate-pulse" />
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-amber-800 dark:text-amber-300">Is your project code complete?</h3>
              <p className="text-xs text-amber-700/90 dark:text-amber-400/90 leading-relaxed">
                <strong>Note:</strong> Please only generate the report when your code is fully completed. If you generate it in the middle of development, the report will be generated incomplete or incorrect. First complete all code with the AI, then generate the report.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button size="sm" variant="outline" onClick={() => setShowConfirm(false)} disabled={busy}>
              Cancel
            </Button>
            <Button size="sm" onClick={run} disabled={busy} className="bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-700 dark:hover:bg-amber-600 border-none">
              {busy ? <Loader2 className="h-3 w-3 mr-1 animate-spin text-white" /> : null}
              Yes, generate report
            </Button>
          </div>
        </Card>
      )}

      {content ? (
        kind === "report" ? (
          <div className="space-y-4 no-print-container">
            {/* Google Docs Toolbar */}
            <div className="editor-toolbar flex flex-wrap items-center gap-1 p-1 bg-[#f0f4f9] dark:bg-slate-900 border rounded-lg shadow-sm shrink-0 sticky top-0 z-10 no-print text-slate-800 dark:text-slate-200">
              <Button size="icon" variant="ghost" className="h-7 w-7 hover:bg-slate-200 dark:hover:bg-slate-800" onClick={() => handleCommand('undo')} title="Undo">
                <Undo className="h-3.5 w-3.5" />
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7 hover:bg-slate-200 dark:hover:bg-slate-800" onClick={() => handleCommand('redo')} title="Redo">
                <Redo className="h-3.5 w-3.5" />
              </Button>
              
              <div className="h-5 w-px bg-slate-300 dark:bg-slate-700 mx-1" />
              
              {/* Heading Dropdown */}
              <select 
                className="h-7 text-xs bg-white dark:bg-slate-800 border rounded px-1.5 outline-none cursor-pointer text-slate-700 dark:text-slate-300 font-semibold"
                onChange={(e) => handleCommand('formatBlock', e.target.value)}
                defaultValue="p"
              >
                <option value="p">Normal text</option>
                <option value="h1">Heading 1</option>
                <option value="h2">Heading 2</option>
                <option value="h3">Heading 3</option>
              </select>

              <div className="h-5 w-px bg-slate-300 dark:bg-slate-700 mx-1" />

              {/* Text formatting */}
              <Button size="icon" variant="ghost" className="h-7 w-7 hover:bg-slate-200 dark:hover:bg-slate-800" onClick={() => handleCommand('bold')} title="Bold">
                <Bold className="h-3.5 w-3.5 font-bold" />
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7 hover:bg-slate-200 dark:hover:bg-slate-800" onClick={() => handleCommand('italic')} title="Italic">
                <Italic className="h-3.5 w-3.5" />
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7 hover:bg-slate-200 dark:hover:bg-slate-800" onClick={() => handleCommand('underline')} title="Underline">
                <Underline className="h-3.5 w-3.5" />
              </Button>

              {/* Color Controls */}
              <div className="flex items-center gap-1 ml-1">
                <button type="button" onClick={() => handleCommand('foreColor', '#18181b')} className="h-4 w-4 rounded-full bg-zinc-900 border border-white/20" title="Charcoal" />
                <button type="button" onClick={() => handleCommand('foreColor', '#2563eb')} className="h-4 w-4 rounded-full bg-blue-600 border border-white/20" title="Blue" />
                <button type="button" onClick={() => handleCommand('foreColor', '#dc2626')} className="h-4 w-4 rounded-full bg-red-600 border border-white/20" title="Red" />
                <button type="button" onClick={() => handleCommand('foreColor', '#16a34a')} className="h-4 w-4 rounded-full bg-green-600 border border-white/20" title="Green" />
                <button type="button" onClick={() => handleCommand('foreColor', '#eab308')} className="h-4 w-4 rounded-full bg-yellow-500 border border-white/20" title="Highlight Yellow" />
              </div>

              <div className="h-5 w-px bg-slate-300 dark:bg-slate-700 mx-1" />

              {/* Alignment */}
              <Button size="icon" variant="ghost" className="h-7 w-7 hover:bg-slate-200 dark:hover:bg-slate-800" onClick={() => handleCommand('justifyLeft')} title="Align Left">
                <AlignLeft className="h-3.5 w-3.5" />
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7 hover:bg-slate-200 dark:hover:bg-slate-800" onClick={() => handleCommand('justifyCenter')} title="Align Center">
                <AlignCenter className="h-3.5 w-3.5" />
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7 hover:bg-slate-200 dark:hover:bg-slate-800" onClick={() => handleCommand('justifyRight')} title="Align Right">
                <AlignRight className="h-3.5 w-3.5" />
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7 hover:bg-slate-200 dark:hover:bg-slate-800" onClick={() => handleCommand('justifyFull')} title="Justify">
                <AlignJustify className="h-3.5 w-3.5" />
              </Button>

              <div className="h-5 w-px bg-slate-300 dark:bg-slate-700 mx-1" />

              {/* Lists */}
              <Button size="icon" variant="ghost" className="h-7 w-7 hover:bg-slate-200 dark:hover:bg-slate-800" onClick={() => handleCommand('insertUnorderedList')} title="Bullet List">
                <List className="h-3.5 w-3.5" />
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7 hover:bg-slate-200 dark:hover:bg-slate-800" onClick={() => handleCommand('insertOrderedList')} title="Numbered List">
                <ListOrdered className="h-3.5 w-3.5" />
              </Button>

              <div className="h-5 w-px bg-slate-300 dark:bg-slate-700 mx-1" />

              {/* Insert Table / Photo */}
              <Button size="icon" variant="ghost" className="h-7 w-7 hover:bg-slate-200 dark:hover:bg-slate-800" onClick={insertTable} title="Insert Table">
                <Table className="h-3.5 w-3.5" />
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7 hover:bg-slate-200 dark:hover:bg-slate-800" onClick={insertImage} title="Insert Photo">
                <Image className="h-3.5 w-3.5" />
              </Button>

              <div className="ml-auto flex items-center gap-1.5">
                <Button size="sm" variant="outline" className="h-7 text-[11px] font-semibold" onClick={handleSave} disabled={saving}>
                  {saving ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Save className="h-3 w-3 mr-1" />}
                  Save Edits
                </Button>
                <Button size="sm" className="h-7 text-[11px] bg-blue-600 hover:bg-blue-700 text-white font-semibold" onClick={() => window.print()}>
                  <Download className="h-3 w-3 mr-1" /> Download PDF
                </Button>
              </div>
            </div>

            {/* Google Docs Canvas container */}
            <div className="w-full bg-slate-100 dark:bg-[#0f1115] border rounded-lg p-6 flex justify-center overflow-auto max-h-[850px] print:bg-white print:border-none print:p-0">
              {/* A4 Paper Editor Container */}
              <div 
                id="printable-report-card" 
                className="w-[816px] min-h-[1123px] bg-white dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 shadow-md p-16 relative overflow-visible google-doc-sheet border"
              >
                {/* Print Only Header/Footer */}
                <div className="hidden print:flex print-header">
                  {title}
                </div>
                <div className="hidden print:flex print-footer">
                  <span>Wainganga College Of Engineering and Management</span>
                  <span className="page-number">Page </span>
                </div>

                {/* Editable Content Area */}
                <div
                  ref={editorRef}
                  contentEditable={true}
                  suppressContentEditableWarning={true}
                  className="outline-none min-h-[1000px] select-text text-left"
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
              </div>
            </div>

            {/* Google Doc Sizing and Print Layout Overrides Styling */}
            <style>{`
              .google-doc-sheet {
                font-family: Arial, Helvetica, sans-serif !important;
                font-size: 13px !important;
                line-height: 1.6 !important;
                color: #1f2937 !important;
              }
              .google-doc-sheet h1 {
                font-size: 18px !important;
                font-weight: bold !important;
                margin-top: 28px !important;
                margin-bottom: 12px !important;
                color: #111827 !important;
                border-bottom: 1px solid #e5e7eb !important;
                padding-bottom: 4px !important;
              }
              .google-doc-sheet h2 {
                font-size: 14px !important;
                font-weight: bold !important;
                margin-top: 20px !important;
                margin-bottom: 8px !important;
                color: #374151 !important;
              }
              .google-doc-sheet p {
                margin-bottom: 12px !important;
                font-size: 13px !important;
              }
              .google-doc-sheet table {
                width: 100% !important;
                border-collapse: collapse !important;
                font-size: 12px !important;
                margin: 16px 0 !important;
              }
              .google-doc-sheet th {
                border: 1px solid #d1d5db !important;
                padding: 6px 10px !important;
                background-color: #f9fafb !important;
                font-weight: bold !important;
              }
              .google-doc-sheet td {
                border: 1px solid #d1d5db !important;
                padding: 6px 10px !important;
              }
              .google-doc-sheet ul {
                list-style-type: disc !important;
                padding-left: 20px !important;
                margin-bottom: 12px !important;
              }
              .google-doc-sheet ol {
                list-style-type: decimal !important;
                padding-left: 20px !important;
                margin-bottom: 12px !important;
              }

              @media print {
                header, footer, aside, nav, button, .no-print, .editor-toolbar, 
                [data-sidebar="sidebar"], .group\\/sidebar-wrapper, .sidebar-trigger, 
                [role="tablist"], .no-print-container > div:first-child {
                  display: none !important;
                }
                body, html, main, [role="main"], .min-h-screen, .flex-1, .space-y-6, 
                .no-print-container, .tabs-content, [role="tabpanel"], .w-full {
                  background: white !important;
                  color: black !important;
                  padding: 0 !important;
                  margin: 0 !important;
                  border: none !important;
                  box-shadow: none !important;
                  max-width: 100% !important;
                  width: 100% !important;
                  height: auto !important;
                }
                #printable-report-card {
                  display: block !important;
                  position: absolute !important;
                  left: 0 !important;
                  top: 0 !important;
                  width: 100% !important;
                  height: auto !important;
                  padding: 15mm 0 !important;
                  margin: 0 !important;
                  border: none !important;
                  box-shadow: none !important;
                  background: white !important;
                  color: black !important;
                  counter-reset: page;
                }
                .print-header {
                  position: fixed;
                  top: -12mm;
                  left: 0;
                  right: 0;
                  height: 8mm;
                  display: flex !important;
                  justify-content: flex-end;
                  align-items: center;
                  font-size: 8px;
                  font-family: Arial, sans-serif;
                  color: #666;
                  border-bottom: 0.5px solid #ccc;
                }
                .print-footer {
                  position: fixed;
                  bottom: -12mm;
                  left: 0;
                  right: 0;
                  height: 8mm;
                  display: flex !important;
                  justify-content: space-between;
                  align-items: center;
                  font-size: 8px;
                  font-family: Arial, sans-serif;
                  color: #666;
                  border-top: 0.5px solid #ccc;
                }
                .page-number::after {
                  content: counter(page);
                }
                @page {
                  size: A4;
                  margin: 25mm 20mm 25mm 20mm;
                }
                h1 {
                  page-break-before: always;
                  margin-top: 30px;
                }
                h1:first-of-type {
                  page-break-before: avoid;
                }
              }
            `}</style>
          </div>
        ) : (
          /* Custom styled Viva Tab with Download Questions Button */
          <div className="space-y-4 no-print-container w-full">
            {/* Simple toolbar with Download Button */}
            <div className="editor-toolbar flex items-center justify-between p-2 bg-[#f0f4f9] dark:bg-slate-900 border rounded-lg shadow-sm shrink-0 sticky top-0 z-10 no-print">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">Wainganga Exams</span>
                <span className="text-xs text-muted-foreground font-semibold">Project Viva Preparation Q&A</span>
              </div>
              <Button size="sm" className="h-7 text-[11px] bg-blue-600 hover:bg-blue-700 text-white font-semibold" onClick={() => window.print()}>
                <Download className="h-3 w-3 mr-1" /> Download Q&A PDF
              </Button>
            </div>

            {/* Document sheet */}
            <div className="w-full bg-slate-100 dark:bg-[#0f1115] border rounded-lg p-6 flex justify-center overflow-auto max-h-[850px] print:bg-white print:border-none print:p-0">
              <Card 
                id="printable-viva-card" 
                className="w-[816px] min-h-[1123px] bg-white dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 shadow-md p-16 relative overflow-visible viva-sheet border"
              >
                {/* Print Only Header/Footer */}
                <div className="hidden print:flex print-header">
                  {title}
                </div>
                <div className="hidden print:flex print-footer">
                  <span>Wainganga College Of Engineering and Management</span>
                  <span className="page-number">Page </span>
                </div>

                {/* Viva Q&A Markdown Area */}
                <div className="prose-viva select-text text-left">
                  <ReactMarkdown>
                    {content}
                  </ReactMarkdown>
                </div>
              </Card>
            </div>

            {styleTagForViva}
          </div>
        )
      ) : (
        <Card className="p-12 text-center border-dashed no-print">
          <p className="text-muted-foreground">No {kind} yet — click Generate to create one from your project chat.</p>
        </Card>
      )}
    </div>
  );
}

const styleTagForViva = (
  <style>{`
    .prose-viva {
      font-family: Arial, Helvetica, sans-serif !important;
      font-size: 13.5px !important;
      line-height: 1.65 !important;
      color: #374151 !important;
    }
    .prose-viva h3 {
      font-size: 15px !important;
      font-weight: bold !important;
      color: #2563eb !important;
      margin-top: 26px !important;
      margin-bottom: 8px !important;
      border-left: 3px solid #2563eb;
      padding-left: 8px;
    }
    .prose-viva p {
      margin-bottom: 14px !important;
    }
    .prose-viva strong {
      color: #111827 !important;
    }

    @media print {
      header, footer, aside, nav, button, .no-print, .editor-toolbar, 
      [data-sidebar="sidebar"], .group\\/sidebar-wrapper, .sidebar-trigger, 
      [role="tablist"], .no-print-container > div:first-child {
        display: none !important;
      }
      body, html, main, [role="main"], .min-h-screen, .flex-1, .space-y-6, 
      .no-print-container, .tabs-content, [role="tabpanel"], .w-full {
        background: white !important;
        color: black !important;
        padding: 0 !important;
        margin: 0 !important;
        border: none !important;
        box-shadow: none !important;
        max-width: 100% !important;
        width: 100% !important;
        height: auto !important;
      }
      #printable-viva-card {
        display: block !important;
        position: absolute !important;
        left: 0 !important;
        top: 0 !important;
        width: 100% !important;
        height: auto !important;
        padding: 15mm 0 !important;
        margin: 0 !important;
        border: none !important;
        box-shadow: none !important;
        background: white !important;
        color: black !important;
        counter-reset: page;
      }
      .print-header {
        position: fixed;
        top: -12mm;
        left: 0;
        right: 0;
        height: 8mm;
        display: flex !important;
        justify-content: flex-end;
        align-items: center;
        font-size: 8px;
        font-family: Arial, sans-serif;
        color: #666;
        border-bottom: 0.5px solid #ccc;
      }
      .print-footer {
        position: fixed;
        bottom: -12mm;
        left: 0;
        right: 0;
        height: 8mm;
        display: flex !important;
        justify-content: space-between;
        align-items: center;
        font-size: 8px;
        font-family: Arial, sans-serif;
        color: #666;
        border-top: 0.5px solid #ccc;
      }
      .page-number::after {
        content: counter(page);
      }
      @page {
        size: A4;
        margin: 25mm 20mm 25mm 20mm;
      }
      h3 {
        page-break-before: always;
        margin-top: 25px;
      }
      h3:first-of-type {
        page-break-before: avoid;
      }
    }
  `}</style>
);

/* -------- Slides tab -------- */
function SlidesTab({ 
  id, initial, onRefetch, tokens, onRequireTokens, refetchProfile,
}: { 
  id: string; 
  initial: Slide[] | null; 
  onRefetch: () => void;
  tokens: number;
  onRequireTokens: () => void;
  refetchProfile: () => void;
}) {
  const [slides, setSlides] = useState<Slide[]>(initial ?? []);
  const [busy, setBusy] = useState(false);
  const [idx, setIdx] = useState(0);
  const gen = useServerFn(generateSlides);

  const run = async () => {
    if (tokens <= 0) {
      onRequireTokens();
      return;
    }
    setBusy(true);
    try {
      const { slides: s } = await gen({ data: { id } });
      setSlides(s);
      setIdx(0);
      onRefetch();
      refetchProfile();
      toast.success("Deck created!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally { setBusy(false); }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 lg:p-10 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Presentation Deck</h2>
          <p className="text-muted-foreground mt-1">A 10-slide deck ready to present in class — problem, architecture, tech stack, demo flow, and more.</p>
        </div>
        <Button onClick={run} disabled={busy} className="bg-gradient-primary shrink-0">
          {busy ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : slides.length ? <RefreshCw className="h-4 w-4 mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
          {slides.length ? "Regenerate deck" : "Generate deck"}
        </Button>
      </div>

      {slides.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <Presentation className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p className="text-muted-foreground">No deck yet — click Generate.</p>
        </Card>
      ) : (
        <>
          <Card className="aspect-[16/9] p-10 lg:p-16 flex flex-col justify-center shadow-elegant bg-gradient-subtle relative overflow-hidden">
            <div className="absolute top-4 right-6 text-xs text-muted-foreground font-mono">{idx + 1} / {slides.length}</div>
            <h3 className="text-3xl lg:text-5xl font-bold mb-6 text-gradient">{slides[idx].title}</h3>
            <ul className="space-y-3 text-lg lg:text-xl text-foreground/85">
              {slides[idx].bullets.map((b, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-primary">•</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            {slides[idx].notes && (
              <p className="mt-6 text-sm italic text-muted-foreground border-l-2 border-primary pl-3">Speaker notes: {slides[idx].notes}</p>
            )}
          </Card>
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setIdx((i) => Math.max(0, i - 1))} disabled={idx === 0}>
              <ChevronLeft className="h-4 w-4 mr-1" /> Prev
            </Button>
            <div className="flex gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className={`h-2 w-8 rounded-full transition-colors ${i === idx ? "bg-primary" : "bg-muted"}`}
                />
              ))}
            </div>
            <Button variant="outline" onClick={() => setIdx((i) => Math.min(slides.length - 1, i + 1))} disabled={idx === slides.length - 1}>
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
