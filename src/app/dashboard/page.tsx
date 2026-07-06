"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import {
  Sparkles,
  ArrowRight,
  Code2,
  FileText,
  Presentation,
  Check,
  Send,
  Download,
  Plus,
} from "lucide-react";

// Mock types
interface FileNode {
  name: string;
  content: string;
  lang: string;
}

interface ProjectData {
  id: string;
  name: string;
  category: string;
  status: "Ongoing" | "Completed" | "Purchased";
  updatedAt: string;
}

export default function Dashboard() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="size-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
      </div>
    }>
      <DashboardWorkspace />
    </Suspense>
  );
}

function DashboardWorkspace() {
  const searchParams = useSearchParams();
  const initialPrompt = searchParams ? searchParams.get("prompt") : null;

  // Global State
  const [activeTab, setActiveTab] = useState<"create" | "prebuilt" | "my-projects" | "pricing" | "profile">("create");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tokens, setTokens] = useState(1420);

  // 1. Create Project State
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<Array<{ sender: "user" | "bot"; text: string }>>([
    { sender: "user", text: "Build me a Python Flask app that lets students submit assignments and lets teachers grade them." },
    { sender: "bot", text: "Scaffolded a Flask + SQLite project with student/teacher roles, JWT auth, file uploads, and a grading dashboard. Check the Code tab for the file tree, and the Report tab for setup instructions." }
  ]);
  const [currentFileIdx, setCurrentFileIdx] = useState(0);
  const [workspaceTab, setWorkspaceTab] = useState<"code" | "report" | "viva" | "ppt">("code");
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock generated workspace files
  const [workspaceFiles, setWorkspaceFiles] = useState<FileNode[]>([
    {
      name: "app.py",
      lang: "PYTHON",
      content: `from flask import Flask, request, jsonify
from models import db, Assignment, User
from auth import token_required

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///app.db"
db.init_app(app)

@app.route("/api/assignments", methods=["GET"])
@token_required
def list_assignments(user):
    items = Assignment.query.filter_by(owner_id=user.id).all()
    return jsonify([a.to_dict() for a in items])

@app.route("/api/assignments", methods=["POST"])
@token_required
def create_assignment(user):
    data = request.get_json()
    a = Assignment(title=data["title"], owner_id=user.id)
    db.session.add(a)
    db.session.commit()
    return jsonify(a.to_dict()), 201

if __name__ == "__main__":
    app.run(debug=True, port=5000)`
    },
    {
      name: "models.py",
      lang: "PYTHON",
      content: `from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    role = db.Column(db.String(20), nullable=False) # student / teacher

class Assignment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    grade = db.Column(db.String(10), nullable=True)
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'))`
    },
    {
      name: "requirements.txt",
      lang: "TEXT",
      content: `Flask==3.0.0
Flask-SQLAlchemy==3.1.1
PyJWT==2.8.0`
    },
    {
      name: "README.md",
      lang: "MARKDOWN",
      content: `# Assignment Portal Backend

This Flask API serves student assignment uploads and grading portals.

## Quick Setup
1. Run \`pip install -r requirements.txt\`
2. Run \`python app.py\` to boot database and start local portal.`
    }
  ]);

  // 2. Prebuilt Projects State
  const prebuiltProjects = [
    {
      title: "Smart Attendance System",
      category: "COMPUTER VISION",
      price: "$24",
      desc: "Face-recognition attendance tracker with admin dashboard.",
      emoji: "📸"
    },
    {
      title: "MERN E-Commerce Store",
      category: "WEB DEVELOPMENT",
      price: "$29",
      desc: "Full-stack shop with cart, Stripe checkout, and admin.",
      emoji: "🛒"
    },
    {
      title: "Urban Traffic Predictor",
      category: "MACHINE LEARNING",
      price: "$19",
      desc: "LSTM model that forecasts city congestion by hour.",
      emoji: "🚗"
    },
    {
      title: "Realtime Chat App",
      category: "WEB DEVELOPMENT",
      price: "$22",
      desc: "Socket.io chat with rooms, typing indicators, and support.",
      emoji: "💬"
    },
    {
      title: "IoT Greenhouse Monitor",
      category: "IOT",
      price: "$26",
      desc: "Arduino sensors + cloud dashboard for smart green zones.",
      emoji: "🌿"
    },
    {
      title: "Blockchain Voting DApp",
      category: "BLOCKCHAIN",
      price: "$34",
      desc: "Tamper-proof voting on Ethereum with React frontend.",
      emoji: "🗳️"
    }
  ];

  // 3. My Projects State
  const [projectList, setProjectList] = useState<ProjectData[]>([
    { id: "assignment-portal", name: "Assignment Portal", category: "Web Development", status: "Ongoing", updatedAt: "2h ago" },
    { id: "weather-app", name: "Weather Forecast App", category: "Machine Learning", status: "Completed", updatedAt: "3 days ago" },
    { id: "portfolio", name: "Portfolio Website", category: "Web Development", status: "Completed", updatedAt: "1 week ago" },
    { id: "mern-ecommerce", name: "MERN E-Commerce Store", category: "Web Development", status: "Purchased", updatedAt: "2 weeks ago" },
    { id: "smart-attendance", name: "Smart Attendance System", category: "Computer Vision", status: "Purchased", updatedAt: "1 month ago" },
    { id: "library-cli", name: "Library Management CLI", category: "Systems", status: "Ongoing", updatedAt: "5h ago" }
  ]);
  const [myProjectsFilter, setMyProjectsFilter] = useState<"All" | "Ongoing" | "Completed" | "Purchased">("All");

  const filteredMyProjects = projectList.filter(p => myProjectsFilter === "All" || p.status === myProjectsFilter);

  // Trigger search params generator
  useEffect(() => {
    if (initialPrompt) {
      setActiveTab("create");
      handleTriggerAISearch(initialPrompt);
    }
  }, [initialPrompt]);

  const handleTriggerAISearch = (promptText: string) => {
    setIsGenerating(true);
    setTokens(prev => Math.max(0, prev - 20));
    setMessages(prev => [
      ...prev,
      { sender: "user", text: promptText },
      { sender: "bot", text: `🤖 Creating workspace for "${promptText}"... Scaffolded code structures, documentation, PPT slides outline, and interview flashcards.` }
    ]);
    setTimeout(() => {
      setIsGenerating(false);
    }, 1500);
  };

  const handleSendPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isGenerating) return;
    const text = chatInput.trim();
    setChatInput("");
    handleTriggerAISearch(text);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 font-sans">
      <AppSidebar
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as any)}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        tokens={tokens}
      />

      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <AppHeader
          onMenuClick={() => setSidebarOpen(true)}
          tokens={tokens}
        />

        <main className="flex-1 overflow-y-auto">
          
          {/* TAB 1: CREATE PROJECT (Workspace Chat) */}
          {activeTab === "create" && (
            <div className="flex h-full w-full flex-col lg:flex-row overflow-hidden">
              
              {/* Left Column: Chat panel */}
              <div className="flex flex-col flex-1 border-r border-slate-200 bg-white h-full min-w-0">
                <div className="flex h-14 items-center justify-between border-b border-slate-100 px-6 shrink-0">
                  <div>
                    <h1 className="font-semibold text-slate-800 text-base">Assignment Portal</h1>
                    <span className="text-xs text-slate-400">Draft project &bull; auto-saved</span>
                  </div>
                </div>

                {/* Message Log */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col max-w-[85%] ${
                        msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
                      }`}
                    >
                      <span className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">
                        {msg.sender === "user" ? "You" : "ScholarBuild AI"}
                      </span>
                      <div
                        className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                          msg.sender === "user"
                            ? "bg-[#0b172a] text-white rounded-tr-sm"
                            : "bg-slate-50 border border-slate-150 text-slate-800 rounded-tl-sm"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input Prompt bar */}
                <form onSubmit={handleSendPrompt} className="p-4 border-t border-slate-100 bg-white shrink-0">
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask the AI to add a feature, fix a bug, or regenerate the report..."
                      className="w-full rounded-xl border border-slate-200 py-3.5 pl-4 pr-14 text-sm outline-none focus:border-slate-400 transition-colors"
                      disabled={isGenerating}
                    />
                    <button
                      type="submit"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 flex size-9 items-center justify-center rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                      disabled={isGenerating}
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-2 px-1">
                    ⌘ + Enter to send
                  </div>
                </form>
              </div>

              {/* Right Column: Code/Docs workspace panel */}
              <div className="flex flex-col flex-[1.2] bg-white h-full min-w-0">
                {/* Tabs & Top actions */}
                <div className="flex h-14 items-center justify-between border-b border-slate-200 px-6 shrink-0 bg-slate-50/50">
                  <div className="flex gap-2">
                    {(["code", "report", "viva", "ppt"] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setWorkspaceTab(tab)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors capitalize ${
                          workspaceTab === tab
                            ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                      <Plus className="h-3.5 w-3.5" />
                      <span>New project</span>
                    </button>
                    <button className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800">
                      <Download className="h-3.5 w-3.5" />
                      <span>Export all</span>
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-hidden relative">
                  {isGenerating && (
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                      <div className="size-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900 mb-3" />
                      <span className="text-sm font-semibold text-slate-800">Generating project files...</span>
                    </div>
                  )}

                  {/* Workspace Content rendering */}
                  {workspaceTab === "code" && (
                    <div className="flex h-full w-full overflow-hidden">
                      {/* Files Tree Sidebar */}
                      <div className="w-48 border-r border-slate-100 bg-slate-50/50 p-3 overflow-y-auto shrink-0">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">
                          Files
                        </div>
                        <ul className="space-y-1">
                          {workspaceFiles.map((file, idx) => (
                            <li key={idx}>
                              <button
                                onClick={() => setCurrentFileIdx(idx)}
                                className={`w-full text-left rounded-md px-2.5 py-1.5 text-xs font-mono truncate transition-colors ${
                                  currentFileIdx === idx
                                    ? "bg-white text-slate-900 border border-slate-200/60 shadow-sm font-semibold"
                                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                                }`}
                              >
                                {file.name}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Code Editor view */}
                      <div className="flex-1 flex flex-col overflow-hidden bg-[#0c1017]">
                        <div className="flex h-10 items-center justify-between border-b border-slate-800 bg-[#070a0f] px-5 shrink-0 select-none">
                          <span className="text-[10px] font-mono text-slate-500">{workspaceFiles[currentFileIdx]?.name}</span>
                          <span className="text-[9px] font-mono font-bold bg-slate-800 text-slate-400 px-2 py-0.5 rounded uppercase">
                            {workspaceFiles[currentFileIdx]?.lang}
                          </span>
                        </div>
                        <pre className="flex-1 overflow-auto p-5 text-slate-300 font-mono text-xs leading-relaxed">
                          <code>{workspaceFiles[currentFileIdx]?.content}</code>
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Tab 2: Report */}
                  {workspaceTab === "report" && (
                    <div className="p-6 overflow-y-auto h-full max-w-3xl leading-relaxed text-slate-700">
                      <h2 className="text-xl font-bold text-slate-800 mb-3">Project Setup Report</h2>
                      <p className="mb-4">This project implements a secure student-teacher interface using Flask.</p>
                      <h3 className="text-sm font-bold text-slate-800 mb-2 uppercase tracking-wide">Installation Steps</h3>
                      <pre className="bg-slate-50 p-4 border border-slate-200 rounded-lg text-xs font-mono mb-4 overflow-x-auto">
                        pip install -r requirements.txt{"\n"}
                        python app.py
                      </pre>
                    </div>
                  )}

                  {/* Tab 3: Viva */}
                  {workspaceTab === "viva" && (
                    <div className="p-6 overflow-y-auto h-full space-y-4">
                      <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                        <span className="text-xs font-bold text-slate-400 block mb-1">VIVA Q1</span>
                        <strong className="text-slate-800 text-sm block mb-2">What is the primary role of JWT tokens here?</strong>
                        <p className="text-xs text-slate-600">JWT (JSON Web Tokens) are used to handle user sessions securely without storing states on the server.</p>
                      </div>
                      <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                        <span className="text-xs font-bold text-slate-400 block mb-1">VIVA Q2</span>
                        <strong className="text-slate-800 text-sm block mb-2">Why SQLite instead of PostgreSQL?</strong>
                        <p className="text-xs text-slate-600">SQLite stores everything in a local file, making it perfect for lightweight college demos.</p>
                      </div>
                    </div>
                  )}

                  {/* Tab 4: PPT */}
                  {workspaceTab === "ppt" && (
                    <div className="p-6 overflow-y-auto h-full flex flex-col items-center justify-center bg-slate-50/30">
                      <div className="border border-slate-200 bg-white shadow-md rounded-xl p-8 aspect-video w-full max-w-lg flex flex-col">
                        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">Slide 1: Executive Summary</h3>
                        <ul className="text-xs space-y-3 text-slate-600 flex-1 list-disc pl-4">
                          <li>Secure backend API built on Python Flask framework.</li>
                          <li>JWT auth separates Student submissions and Teacher grading fields.</li>
                          <li>UML specifications and code templates fully packaged.</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PREBUILT PROJECTS (Marketplace) */}
          {activeTab === "prebuilt" && (
            <div className="p-8 max-w-7xl mx-auto space-y-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Prebuilt Projects</h1>
                <p className="text-sm text-slate-500 mt-1">Ready-to-run project templates. Buy once, own forever.</p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {prebuiltProjects.map((p, idx) => (
                  <div key={idx} className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
                    <div className="h-44 bg-slate-100 flex items-center justify-center text-4xl select-none">
                      {p.emoji}
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
                        <span>{p.category}</span>
                        <span className="text-slate-800 text-sm font-bold">{p.price}</span>
                      </div>
                      <h3 className="font-semibold text-slate-800 group-hover:text-slate-900 transition-colors text-base">{p.title}</h3>
                      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{p.desc}</p>
                      <button className="mt-4 w-full rounded-lg bg-slate-900 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors">
                        Purchase Template
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: MY PROJECTS */}
          {activeTab === "my-projects" && (
            <div className="p-8 max-w-7xl mx-auto space-y-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Projects</h1>
                <p className="text-sm text-slate-500 mt-1">Everything you've built, are working on, or purchased from the marketplace.</p>
              </div>

              {/* Filters */}
              <div className="flex gap-2 border-b border-slate-200 pb-4">
                {(["All", "Ongoing", "Completed", "Purchased"] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setMyProjectsFilter(f)}
                    className={`px-4 py-2 text-xs font-semibold rounded-full transition-colors ${
                      myProjectsFilter === f
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* Table */}
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <th className="p-4">Project</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Updated</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150">
                    {filteredMyProjects.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/50">
                        <td className="p-4 font-semibold text-slate-800">{p.name}</td>
                        <td className="p-4 text-slate-500">{p.category}</td>
                        <td className="p-4">
                          <span className={`inline-block rounded-md px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            p.status === "Completed"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : p.status === "Ongoing"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-blue-50 text-blue-700 border border-blue-200"
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="p-4 text-slate-500">{p.updatedAt}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => {
                              setActiveTab("create");
                              setMessages([
                                { sender: "user", text: `Resume work on ${p.name}` },
                                { sender: "bot", text: `🤖 Loaded workspace config files for ${p.name}. You can edit, test and compile code on the right panel.` }
                              ]);
                            }}
                            className="rounded-lg border border-slate-200 px-3.5 py-1.5 text-xs font-semibold hover:bg-slate-50 transition-colors"
                          >
                            Open
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: PRICING */}
          {activeTab === "pricing" && (
            <div className="p-8 max-w-7xl mx-auto space-y-10 text-center">
              <div className="max-w-2xl mx-auto space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Choose your AI token plan</h1>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Tokens power every AI action &mdash; chat, code generation, report writing, and slide creation. Upgrade anytime.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto text-left">
                {/* Starter */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Starter</h3>
                    <div className="mt-4 flex items-baseline text-slate-900">
                      <span className="text-3xl font-extrabold tracking-tight">$9</span>
                      <span className="ml-1 text-sm text-slate-500">/ month</span>
                    </div>
                    <p className="text-xs font-medium text-slate-400 mt-2">500 AI tokens included</p>

                    <ul className="mt-6 space-y-3.5 text-xs">
                      {["500 AI tokens / month", "1 active project", "Export code + report", "Email support"].map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2.5 text-slate-600">
                          <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button className="mt-8 w-full rounded-xl border border-slate-200 py-3 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors">
                    Choose Starter
                  </button>
                </div>

                {/* Pro (Most Popular) */}
                <div className="rounded-2xl border-2 border-slate-900 bg-white p-6 shadow-md flex flex-col justify-between relative scale-105 md:scale-100 lg:scale-105 z-10">
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-slate-900 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-white">
                    Most Popular
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Pro</h3>
                    <div className="mt-4 flex items-baseline text-slate-900">
                      <span className="text-3xl font-extrabold tracking-tight">$24</span>
                      <span className="ml-1 text-sm text-slate-500">/ month</span>
                    </div>
                    <p className="text-xs font-medium text-slate-400 mt-2">2,500 AI tokens included</p>

                    <ul className="mt-6 space-y-3.5 text-xs">
                      {["2,500 AI tokens / month", "Unlimited projects", "PPT + viva generator", "Priority support", "Access to premium templates"].map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2.5 text-slate-600 font-medium">
                          <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button className="mt-8 w-full rounded-xl bg-slate-900 py-3 text-xs font-semibold text-white hover:bg-slate-800 transition-colors">
                    Choose Pro
                  </button>
                </div>

                {/* Ultimate */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Ultimate</h3>
                    <div className="mt-4 flex items-baseline text-slate-900">
                      <span className="text-3xl font-extrabold tracking-tight">$59</span>
                      <span className="ml-1 text-sm text-slate-500">/ month</span>
                    </div>
                    <p className="text-xs font-medium text-slate-400 mt-2">10,000 AI tokens included</p>

                    <ul className="mt-6 space-y-3.5 text-xs">
                      {["10,000 AI tokens / month", "Unlimited projects", "All premium templates", "1-on-1 mentor call", "Early access to new features"].map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2.5 text-slate-600">
                          <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button className="mt-8 w-full rounded-xl border border-slate-200 py-3 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors">
                    Choose Ultimate
                  </button>
                </div>
              </div>

              <div className="text-xs text-slate-400 pt-4">
                Unused tokens roll over for 30 days. Cancel anytime.
              </div>
            </div>
          )}

          {/* TAB 5: PROFILE */}
          {activeTab === "profile" && (
            <div className="p-8 max-w-4xl mx-auto space-y-8">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Profile</h1>
                <p className="text-sm text-slate-500 mt-1">Manage your account, preferences, and billing.</p>
              </div>

              {/* User Identity Box */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="flex size-14 items-center justify-center rounded-full bg-slate-200 font-bold text-slate-700 text-lg">
                  AR
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900">Alex Rivera</h3>
                  <p className="text-xs text-slate-400">User ID: usr_8f3a2c</p>
                  <span className="inline-block rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                    PRO PLAN &bull; 1,420 TOKENS
                  </span>
                </div>
              </div>

              {/* Form Info Fields */}
              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <form onSubmit={(e) => { e.preventDefault(); alert("Profile successfully updated!"); }} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">Full name</label>
                      <input
                        type="text"
                        defaultValue="Alex Rivera"
                        className="rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-400"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
                      <input
                        type="email"
                        defaultValue="alex.rivera@university.edu"
                        className="rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-400"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">Password</label>
                      <input
                        type="password"
                        defaultValue="password123"
                        className="rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-400"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">User ID</label>
                      <input
                        type="text"
                        value="usr_8f3a2c"
                        className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-400 outline-none cursor-not-allowed select-none"
                        disabled
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button type="submit" className="rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors">
                      Save changes
                    </button>
                  </div>
                </form>
              </div>

              {/* Theme Settings Switcher */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-slate-800 text-sm">Appearance</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Switch between light and dark themes.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">☀️</span>
                  <div className="relative inline-flex h-5 w-9 cursor-pointer items-center rounded-full bg-slate-200">
                    <div className="size-4 rounded-full bg-white transition-transform translate-x-0.5" />
                  </div>
                  <span className="text-xs text-slate-400">🌙</span>
                </div>
              </div>

              {/* Billing History Table */}
              <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50/50">
                  <h3 className="font-semibold text-slate-800 text-sm">Billing history</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Your last few invoices.</p>
                </div>
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase">
                      <th className="p-4">Invoice</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Plan</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-slate-50/50 border-b border-slate-100">
                      <td className="p-4 font-mono font-bold text-slate-700">INV-837482</td>
                      <td className="p-4 text-slate-500">July 01, 2026</td>
                      <td className="p-4 text-slate-600 font-medium">Pro Plan Monthly</td>
                      <td className="p-4 text-slate-700 font-bold">$24.00</td>
                      <td className="p-4 text-right"><span className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded px-2 py-0.5 font-bold uppercase text-[9px]">Paid</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
