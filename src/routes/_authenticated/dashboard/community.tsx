import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Send,
  Search,
  ThumbsUp,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Users,
  MessageCircle,
  GraduationCap,
  Layers,
  Filter,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard/community")({
  head: () => ({ meta: [{ title: "Community Q&A — projectbyAI" }] }),
  component: DashboardCommunityPage,
});

interface Reply {
  id: string;
  user_name: string;
  user_role: string;
  user_college?: string;
  message: string;
  created_at: string;
}

interface Thread {
  id: string;
  user_name: string;
  user_college?: string;
  user_role: string;
  project_title: string;
  topic?: string;
  message: string;
  created_at: string;
  upvotes: number;
  replies: Reply[];
}

const STORAGE_KEY = "project_community_discussions_v1";

const SEED_THREADS: Thread[] = [
  {
    id: "cm-seed-1",
    user_name: "Rahul Verma",
    user_college: "IIT Delhi",
    user_role: "Student",
    project_title: "AI Medical Diagnostic & Disease Prediction System",
    topic: "Setup & Run",
    message: "While running the Flask backend for the AI Medical Diagnostic project, I am getting an error with torchvision compatibility. Which PyTorch version is recommended for the CNN model weights?",
    created_at: "2 hours ago",
    upvotes: 6,
    replies: [
      {
        id: "cr-seed-1-1",
        user_name: "Amit Patel",
        user_role: "Verified Contributor (Author)",
        user_college: "Senior ML Engineer",
        message: "Make sure to use PyTorch 2.2.0 with torchvision 0.17.0. We included a pinned requirements.txt in the zip archive — running `pip install -r requirements.txt` in a fresh virtual environment resolves this immediately.",
        created_at: "1 hour ago",
      },
      {
        id: "cr-seed-1-2",
        user_name: "Rahul Verma",
        user_role: "Student",
        user_college: "IIT Delhi",
        message: "Thanks Amit, that worked like a charm! The model loaded and API response is super fast now.",
        created_at: "45 minutes ago",
      },
    ],
  },
  {
    id: "cm-seed-2",
    user_name: "Pooja Hegde",
    user_college: "VIT Vellore",
    user_role: "Student",
    project_title: "Smart Attendance System with Face Recognition",
    topic: "Viva Defense FAQs",
    message: "Can anyone share the most common viva questions external college examiners ask about face embeddings and Euclidean distance thresholds in this project?",
    created_at: "5 hours ago",
    upvotes: 9,
    replies: [
      {
        id: "cr-seed-2-1",
        user_name: "Vikram Sen",
        user_role: "Verified Contributor",
        user_college: "NIT Trichy Alum",
        message: "Examiners almost always ask: 1) What is the difference between Haar Cascade detection and FaceNet 128-d embeddings? 2) How do you handle lighting variations? 3) What is the false positive rate when the threshold is 0.6 vs 0.7? Refer to Chapter 4 of the included project report for the exact viva formulas.",
        created_at: "3 hours ago",
      },
    ],
  },
  {
    id: "cm-seed-3",
    user_name: "Sneha Reddy",
    user_college: "BITS Pilani",
    user_role: "Student",
    project_title: "Decentralized Voting System using Ethereum Smart Contracts",
    topic: "Database & Schema",
    message: "Does this project require Ganache local blockchain or can we deploy directly to Sepolia testnet for college demo?",
    created_at: "1 day ago",
    upvotes: 7,
    replies: [
      {
        id: "cr-seed-3-1",
        user_name: "Karan Mehta",
        user_role: "Verified Contributor (Author)",
        user_college: "Web3 Developer",
        message: "Both work! For viva day, we strongly recommend running Ganache locally because college Wi-Fi can sometimes be slow or block Infura RPC endpoints. The README includes one-click Truffle scripts for both.",
        created_at: "18 hours ago",
      },
    ],
  },
];

const TOPICS = [
  "All Topics",
  "Setup & Run",
  "Viva Defense FAQs",
  "Database & Schema",
  "Code & Architecture",
  "General Discussion",
];

function DashboardCommunityPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [libraryProjects, setLibraryProjects] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState("All Topics");
  const [searchQuery, setSearchQuery] = useState("");

  // Post Question form state
  const [newProject, setNewProject] = useState("General Discussion");
  const [newTopic, setNewTopic] = useState("Setup & Run");
  const [newQuestionText, setNewQuestionText] = useState("");
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);

  // Reply inputs state
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [upvotedThreads, setUpvotedThreads] = useState<Record<string, boolean>>({});

  // 1. Load User & Library Projects & Threads
  useEffect(() => {
    async function init() {
      // User & profile
      const { data: authData } = await supabase.auth.getUser();
      if (authData?.user) {
        setCurrentUser(authData.user);
        const { data: prof } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authData.user.id)
          .single();
        if (prof) setUserProfile(prof);
      }

      // Projects for dropdown
      const { data: libData } = await supabase
        .from("library_projects")
        .select("title")
        .order("title");

      if (libData && libData.length > 0) {
        setLibraryProjects(libData.map((p) => p.title));
        setNewProject(libData[0].title);
      } else {
        setLibraryProjects([
          "AI Medical Diagnostic & Disease Prediction System",
          "Smart Attendance System with Face Recognition",
          "Decentralized Voting System using Ethereum Smart Contracts",
          "Autonomous Drone Navigation & Obstacle Avoidance",
          "College ERP & Student Management Portal",
        ]);
        setNewProject("AI Medical Diagnostic & Disease Prediction System");
      }

      // Load Threads from Supabase or localStorage
      try {
        const { data: dbThreads } = await supabase
          .from("project_community_messages")
          .select("*")
          .order("created_at", { ascending: false });

        if (dbThreads && dbThreads.length > 0) {
          setThreads(dbThreads);
          return;
        }
      } catch (err) {
        console.warn("Supabase community messages note:", err);
      }

      // Fallback to localStorage
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          try {
            setThreads(JSON.parse(stored));
            return;
          } catch (e) {
            console.warn("Storage parse error:", e);
          }
        }
      }

      // Seed threads fallback
      setThreads(SEED_THREADS);
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_THREADS));
      }
    }

    init();

    // Listen for storage events for tab synchronization
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setThreads(JSON.parse(e.newValue));
        } catch (err) {
          console.warn("Storage sync note:", err);
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const saveThreads = (updatedThreads: Thread[]) => {
    setThreads(updatedThreads);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedThreads));
    }
  };

  // 2. Post New Question
  const handlePostQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) {
      toast.error("Please enter a question");
      return;
    }

    setIsSubmittingQuestion(true);
    const authorName =
      userProfile?.full_name ||
      currentUser?.user_metadata?.full_name ||
      currentUser?.email?.split("@")[0] ||
      "Student";

    const newThread: Thread = {
      id: `cm-${Date.now()}`,
      user_name: authorName,
      user_college: userProfile?.college || "College Student",
      user_role: "Student",
      project_title: newProject,
      topic: newTopic,
      message: newQuestionText.trim(),
      created_at: "Just now",
      upvotes: 1,
      replies: [],
    };

    const updated = [newThread, ...threads];
    saveThreads(updated);
    setNewQuestionText("");
    setIsSubmittingQuestion(false);
    toast.success("Question posted to the community!");

    // Attempt saving to Supabase table asynchronously
    try {
      await supabase.from("project_community_messages").insert([
        {
          id: newThread.id,
          user_name: newThread.user_name,
          user_college: newThread.user_college,
          user_role: newThread.user_role,
          project_title: newThread.project_title,
          message: newThread.message,
          created_at: new Date().toISOString(),
          replies: [],
        },
      ]);
    } catch (err) {
      console.warn("DB insert note (local storage active):", err);
    }
  };

  // 3. Post Reply
  const handleReplySubmit = async (threadId: string) => {
    const text = replyInputs[threadId]?.trim();
    if (!text) {
      toast.error("Please type your reply before submitting");
      return;
    }

    const responderName =
      userProfile?.full_name ||
      currentUser?.user_metadata?.full_name ||
      currentUser?.email?.split("@")[0] ||
      "Community Member";

    const newReply: Reply = {
      id: `cr-${Date.now()}`,
      user_name: responderName,
      user_role: "Community Member",
      user_college: userProfile?.college || "Student",
      message: text,
      created_at: "Just now",
    };

    const updated = threads.map((thread) => {
      if (thread.id === threadId) {
        return {
          ...thread,
          replies: [...(thread.replies || []), newReply],
        };
      }
      return thread;
    });

    saveThreads(updated);
    setReplyInputs((prev) => ({ ...prev, [threadId]: "" }));
    toast.success("Reply posted!");

    // Attempt updating in Supabase
    try {
      const targetThread = updated.find((t) => t.id === threadId);
      if (targetThread) {
        await supabase
          .from("project_community_messages")
          .update({ replies: targetThread.replies })
          .eq("id", threadId);
      }
    } catch (err) {
      console.warn("DB update note:", err);
    }
  };

  // 4. Upvote Handler
  const handleUpvote = (threadId: string) => {
    if (upvotedThreads[threadId]) {
      toast.info("You already upvoted this topic");
      return;
    }

    const updated = threads.map((thread) => {
      if (thread.id === threadId) {
        return {
          ...thread,
          upvotes: (thread.upvotes || 0) + 1,
        };
      }
      return thread;
    });

    saveThreads(updated);
    setUpvotedThreads((prev) => ({ ...prev, [threadId]: true }));
    toast.success("Topic upvoted!");
  };

  // Filter threads
  const filteredThreads = threads.filter((t) => {
    const matchesTopic =
      selectedTopic === "All Topics" ||
      t.topic === selectedTopic ||
      (!t.topic && selectedTopic === "General Discussion");

    const matchesQuery =
      searchQuery.trim() === "" ||
      t.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.project_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.user_name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTopic && matchesQuery;
  });

  const totalAnswers = threads.reduce((acc, t) => acc + (t.replies?.length || 0), 0);

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-6xl mx-auto p-6 lg:p-10 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground font-semibold">
              <MessageSquare className="h-4 w-4 text-primary" /> Community
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight mt-1 text-foreground">
              Student Community Q&A
            </h1>
            <p className="text-muted-foreground mt-1 text-sm max-w-2xl">
              Ask questions about project setup, database configuration, or viva defense, and get direct answers from fellow students and project contributors.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 rounded-xl border border-border bg-card shadow-2xs text-center">
              <p className="text-[11px] text-muted-foreground font-medium">Discussions</p>
              <p className="text-base font-bold text-foreground">{threads.length}</p>
            </div>
            <div className="px-3.5 py-2 rounded-xl border border-border bg-card shadow-2xs text-center">
              <p className="text-[11px] text-muted-foreground font-medium">Answers</p>
              <p className="text-base font-bold text-primary">{totalAnswers}</p>
            </div>
          </div>
        </div>

        {/* Ask Question Card */}
        <Card className="p-6 border-border shadow-xs space-y-4 bg-card/60 backdrop-blur">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-base text-foreground">Ask or Start a Discussion</h2>
              <p className="text-xs text-muted-foreground">
                Get help with code errors, setup dependencies, or viva exam questions.
              </p>
            </div>
          </div>

          <form onSubmit={handlePostQuestion} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Project or Technology *
                </label>
                <select
                  value={newProject}
                  onChange={(e) => setNewProject(e.target.value)}
                  className="w-full h-9 rounded-md border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="General Discussion">General Discussion / Setup Help</option>
                  {libraryProjects.map((title) => (
                    <option key={title} value={title}>
                      {title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Topic Category *
                </label>
                <select
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  className="w-full h-9 rounded-md border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Setup & Run">Setup & Run</option>
                  <option value="Viva Defense FAQs">Viva Defense FAQs</option>
                  <option value="Database & Schema">Database & Schema</option>
                  <option value="Code & Architecture">Code & Architecture</option>
                  <option value="General Discussion">General Discussion</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                Your Question / Topic Details *
              </label>
              <Textarea
                placeholder="Ask your question in detail (e.g., How to configure MySQL database credentials in application.properties? What are common examiner questions for JWT auth?)..."
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                rows={3}
                required
                className="text-xs leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Answers are visible to all students and contributors
              </span>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmittingQuestion}
                className="bg-gradient-primary shadow-elegant font-semibold text-xs h-9 px-5"
              >
                <Send className="w-3.5 h-3.5 mr-1.5" />
                Post Question
              </Button>
            </div>
          </form>
        </Card>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Topic Pills */}
          <div className="flex gap-2 flex-wrap items-center">
            {TOPICS.map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => setSelectedTopic(topic)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  selectedTopic === topic
                    ? "bg-primary text-primary-foreground shadow-2xs"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {topic}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-72">
            <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search discussions & projects..."
              className="pl-8 h-9 text-xs"
            />
          </div>
        </div>

        {/* Discussion Threads List */}
        <div className="space-y-4">
          {filteredThreads.length === 0 ? (
            <Card className="p-12 text-center border-dashed border-border bg-card/40 space-y-3">
              <MessageSquare className="w-10 h-10 mx-auto text-muted-foreground/40" />
              <p className="font-semibold text-base text-foreground">No discussions found</p>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                {searchQuery || selectedTopic !== "All Topics"
                  ? "Try resetting your search filters or browse other topics."
                  : "Be the first to ask a question about your project setup or viva defense!"}
              </p>
            </Card>
          ) : (
            filteredThreads.map((thread) => (
              <Card
                key={thread.id}
                className="p-5 border-border shadow-xs space-y-4 hover:border-primary/30 transition-colors bg-card"
              >
                {/* Thread Header */}
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/20 text-primary font-bold text-xs uppercase flex items-center justify-center border border-border shrink-0">
                      {thread.user_name ? thread.user_name.charAt(0) : "S"}
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-foreground">
                          {thread.user_name}
                        </span>
                        {thread.user_college && (
                          <span className="text-xs text-muted-foreground">
                            • {thread.user_college}
                          </span>
                        )}
                        <Badge
                          variant="secondary"
                          className="text-[10px] px-2 py-0 bg-primary/10 text-primary border-0"
                        >
                          {thread.user_role || "Student"}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap pt-0.5">
                        <span className="text-xs font-semibold text-primary">
                          Re: {thread.project_title}
                        </span>
                        {thread.topic && (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-muted-foreground">
                            {thread.topic}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] text-muted-foreground">
                    {thread.created_at}
                  </span>
                </div>

                {/* Question Body */}
                <p className="text-sm text-foreground/90 leading-relaxed font-normal pl-0 sm:pl-12">
                  {thread.message}
                </p>

                {/* Thread Actions */}
                <div className="flex items-center gap-4 pl-0 sm:pl-12 pt-1 border-t border-border/50 text-xs text-muted-foreground">
                  <button
                    type="button"
                    onClick={() => handleUpvote(thread.id)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                      upvotedThreads[thread.id]
                        ? "bg-primary/10 text-primary font-bold"
                        : "hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{thread.upvotes || 0} Upvotes</span>
                  </button>

                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{thread.replies?.length || 0} Answers</span>
                  </span>
                </div>

                {/* Replies Thread */}
                {thread.replies && thread.replies.length > 0 && (
                  <div className="space-y-3 pl-4 sm:pl-12 border-l-2 border-primary/20 ml-2 sm:ml-4 mt-2">
                    {thread.replies.map((reply) => (
                      <div
                        key={reply.id}
                        className="p-3.5 rounded-xl bg-muted/40 border border-border/50 space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-xs flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-foreground">
                              {reply.user_name}
                            </span>
                            {reply.user_college && (
                              <span className="text-[11px] text-muted-foreground">
                                • {reply.user_college}
                              </span>
                            )}
                            <Badge
                              className={`text-[9px] px-1.5 py-0 ${
                                reply.user_role.includes("Contributor") || reply.user_role.includes("Author")
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-0"
                                  : "bg-primary/10 text-primary border-0"
                              }`}
                            >
                              {reply.user_role}
                            </Badge>
                          </div>
                          <span className="text-[10px] text-muted-foreground">
                            {reply.created_at}
                          </span>
                        </div>
                        <p className="text-xs text-foreground/90 leading-relaxed">
                          {reply.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Form */}
                <div className="flex items-center gap-2 pl-0 sm:pl-12 pt-2">
                  <Input
                    placeholder="Write an answer, tip, or clarification..."
                    value={replyInputs[thread.id] || ""}
                    onChange={(e) =>
                      setReplyInputs({
                        ...replyInputs,
                        [thread.id]: e.target.value,
                      })
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleReplySubmit(thread.id);
                      }
                    }}
                    className="h-9 text-xs bg-muted/30"
                  />
                  <Button
                    size="sm"
                    onClick={() => handleReplySubmit(thread.id)}
                    className="h-9 text-xs px-4 shrink-0 font-semibold"
                  >
                    Reply
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
