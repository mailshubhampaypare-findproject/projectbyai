import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Wand2, ArrowRight, ChevronLeft, Check, Laptop, Terminal } from "lucide-react";
import { createProject } from "@/lib/projects.functions";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  head: () => ({ meta: [{ title: "Create with AI — ScholarBuild" }] }),
  component: CreateWizard,
});

// Streams
const STREAMS = [
  "Engineering (B.Tech / B.E.)",
  "Computer Applications (MCA / BCA)",
  "Business Administration (MBA)",
  "Business Administration (BBA)",
  "Commerce (B.Com / M.Com)",
  "Arts (BA / MA)",
  "Science (B.Sc / M.Sc)",
  "Pharmacy (B.Pharm)",
  "Design (B.Des)",
  "Hotel Management",
  "Diploma / Polytechnic",
  "Data Science / AI",
];

// Tech options
const FRONTEND_OPTIONS = [
  "HTML5", "CSS3", "JavaScript", "TypeScript", "React", "Next.js", 
  "Angular", "Vue.js", "Svelte", "Bootstrap", "Tailwind CSS", "Flutter", "React Native"
];

const BACKEND_OPTIONS = [
  "Node.js", "Express.js", "Spring Boot", "Java", "Python", "Django", 
  "Flask", "PHP", "Laravel", "ASP.NET", "Ruby on Rails", "Go", "Rust"
];

const LANGUAGE_OPTIONS = [
  "Java", "Python", "JavaScript", "TypeScript", "C", "C++", "C#", "PHP", 
  "Kotlin", "Swift", "Dart", "Go", "Rust", "Ruby", "R", "Scala", "Perl"
];

const DATABASE_OPTIONS = [
  "MySQL", "PostgreSQL", "SQL Server", "Oracle", "SQLite", "MariaDB", 
  "MongoDB", "Firebase Firestore", "Supabase", "Redis", "DynamoDB", 
  "Cassandra", "Neo4j", "Elasticsearch"
];

const FEATURE_OPTIONS = [
  "User Registration", "Login", "Email Verification", "Google Login", 
  "Dashboard", "Profile Management", "Search", "Filter", "Notifications", 
  "Reports", "Analytics", "File Upload", "Download", "Chat", "AI Integration", 
  "Payment Gateway", "QR Code", "Maps", "OTP Verification", "Role-Based Access", 
  "Real-time Updates", "API Integration"
];

const ADMIN_ROLE_OPTIONS = [
  "Super Admin", "Admin", "Sub Admin", "Manager", "Staff", "User Panel"
];

const DEFAULT_ROLE_MANAGEMENTS: Record<string, string> = {
  "Super Admin": "Manage Users, Manage Admins, Website Settings, Reports, Analytics",
  "Admin": "Manage Products, Orders, Customers",
  "User Panel": "Profile, Orders, Settings",
  "Sub Admin": "Manage Content, Moderation",
  "Manager": "Manage Staff, Approve Requests",
  "Staff": "View Reports, Basic Operations",
};

const UI_DESIGN_OPTIONS = [
  "Minimal", "Modern", "Professional", "Corporate", "Dashboard Style", 
  "AI Theme", "Material Design", "Glassmorphism", "Dark Theme", "Light Theme"
];

const AI_GENERATION_OPTIONS = [
  "Complete Source Code", "Database Schema", "API Documentation", 
  "System Architecture", "Folder Structure", "README", "Installation Guide", 
  "Deployment Guide", "Testing Documentation", "Project Report", "PPT Presentation", 
  "ER Diagram", "UML Diagram", "Flowchart", "DFD", "User Manual"
];

const ADDITIONAL_OPTIONS = [
  "Use JWT Authentication", "Make it mobile responsive", "Use MVC architecture", 
  "Follow Clean Code principles", "Add Docker support", "Use REST APIs", 
  "Follow best security practices", "Make it scalable"
];

// Helper to identify technical coding streams
const isTechnicalStream = (stream: string) => {
  const s = stream.toLowerCase();
  return s === "engineering" || s === "b.tech" || s === "mca" || s === "bca" ||
         s.includes("b.tech / b.e.") || s.includes("mca / bca") || 
         s.includes("polytechnic") || s.includes("data science") || 
         s.includes("ai") || s.includes("computer");
};

type Answers = {
  stream: string;
  title: string;
  description: string;
  technologies: string[];
  techCustom: string;
  languages: string[];
  databases: string[];
  features: string[];
  featuresCustom: string;
  adminRoles: string[];
  adminManagements: Record<string, string>;
  uiDesign: string[];
  aiGenerations: string[];
  additionalRequirements: string[];
  additionalCustom: string;
};

function CreateWizard() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({
    stream: "",
    title: "",
    description: "",
    technologies: [],
    techCustom: "",
    languages: [],
    databases: [],
    features: [],
    featuresCustom: "",
    adminRoles: [],
    adminManagements: {},
    uiDesign: [],
    aiGenerations: [],
    additionalRequirements: [],
    additionalCustom: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const create = useServerFn(createProject);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isTech = isTechnicalStream(answers.stream);

  // Steps definitions based on tech/non-tech stream
  const steps = isTech
    ? [
        "stream",
        "title",
        "description",
        "technologies",
        "languages",
        "databases",
        "features",
        "adminRoles",
        "uiDesign",
        "aiGenerations",
        "additional",
        "summary"
      ]
    : [
        "stream",
        "title",
        "description",
        "aiGenerations",
        "summary"
      ];

  const currentStepKey = steps[step];
  const isLast = step === steps.length - 1;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const handlePickStream = (stream: string) => {
    setAnswers((prev) => ({ ...prev, stream }));
    setTimeout(() => setStep(1), 150);
  };

  const handleNext = () => {
    // Basic validation
    if (currentStepKey === "stream" && !answers.stream) {
      toast.error("Please select a stream");
      return;
    }
    if (currentStepKey === "title" && !answers.title.trim()) {
      toast.error("Please enter a project title");
      return;
    }
    if (currentStepKey === "description" && !answers.description.trim()) {
      toast.error("Please enter a description");
      return;
    }

    if (isLast) {
      handleSubmit();
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    setStep((s) => Math.max(0, s - 1));
  };

  // Convert selections to AI Prompt
  const generateAIPrompt = () => {
    if (!isTech) {
      return `### Project Request (Non-Technical Stream)
- **Stream/Course**: ${answers.stream}
- **Project Title**: ${answers.title}
- **Description**: ${answers.description}
- **AI Deliverables**: ${answers.aiGenerations.join(", ")}

Please help me design and write this project from scratch.`;
    }

    const techStackList = [...answers.technologies];
    if (answers.techCustom.trim()) techStackList.push(answers.techCustom.trim());

    const featuresList = [...answers.features];
    if (answers.featuresCustom.trim()) featuresList.push(answers.featuresCustom.trim());

    const adminDetails = answers.adminRoles
      .map((role) => `- **${role}**: ${answers.adminManagements[role] || DEFAULT_ROLE_MANAGEMENTS[role] || "Standard roles"}`)
      .join("\n");

    const extraRules = [...answers.additionalRequirements];
    if (answers.additionalCustom.trim()) extraRules.push(answers.additionalCustom.trim());

    return `I want to build a college/student project with the following specifications:

### Project Information
- **Title**: ${answers.title}
- **Academic Course**: ${answers.stream}
- **Overview**: ${answers.description}

### Architecture & Tech Stack
- **Programming Languages**: ${answers.languages.join(", ")}
- **Libraries / Frameworks**: ${techStackList.join(", ")}
- **Database**: ${answers.databases.join(", ")}

### Features
${featuresList.map((f) => `- ${f}`).join("\n")}

### Admin Panels & User Roles
${adminDetails || "- None specified"}

### UI / Design Styling
- **Theme**: ${answers.uiDesign.join(", ")}

### Required Outputs
- **Deliverables**: ${answers.aiGenerations.join(", ")}

### Constraints & Additional Considerations
${extraRules.map((r) => `- ${r}`).join("\n") || "- Standard coding best practices"}`;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const finalPrompt = generateAIPrompt();
      const { id } = await create({
        data: {
          title: answers.title.trim(),
          description: finalPrompt,
        },
      });
      toast.success("Workspace ready — generating code!");
      navigate({ to: "/dashboard/project/$id", params: { id } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create project workspace");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={scrollRef} className="h-full overflow-auto bg-gradient-subtle flex flex-col justify-between">
      <div className="max-w-3xl mx-auto px-4 py-8 w-full flex-1 flex flex-col justify-center">
        <div className="text-center mb-6 space-y-2">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-950 text-xs font-semibold">
            <Sparkles className="h-3 w-3 text-primary animate-pulse" /> AI Project Wizard
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Configure Your <span className="text-gradient bg-foreground px-2 rounded">Project</span>
          </h1>
          <p className="text-sm text-muted-foreground">Answer details to customize source code, slides, and reports.</p>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-1.5 mb-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-all duration-300",
                i <= step ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>

        <Card className="p-6 lg:p-8 shadow-elegant border-2 border-slate-100 dark:border-slate-800 bg-card/60 backdrop-blur-md">
          {/* Stream Selector */}
          {currentStepKey === "stream" && (
            <QA title="Which stream or course are you in?" subtitle="Select your course. Selecting a coding/technical course opens standard advanced setup steps.">
              <ChoiceGrid
                options={STREAMS}
                selected={answers.stream}
                onSelect={handlePickStream}
              />
            </QA>
          )}

          {/* Project Title */}
          {currentStepKey === "title" && (
            <QA title="1. What is the title of your project?" subtitle="Provide a clear, brief name for the repository.">
              <Input
                autoFocus
                placeholder="e.g. AI-Powered Medical Appointment Tracker"
                value={answers.title}
                onChange={(e) => setAnswers({ ...answers, title: e.target.value })}
                className="h-14 text-base"
              />
            </QA>
          )}

          {/* Project Description */}
          {currentStepKey === "description" && (
            <QA title="2. Describe your project in detail" subtitle="Explain what you want to build, how it should work, and any specific requirements.">
              <Textarea
                autoFocus
                rows={6}
                placeholder="e.g. A web platform that helps patients book clinical consultations. Includes doctor scheduling profiles, push notification email alerts, and an admin dashboard to manage clinical sessions..."
                value={answers.description}
                onChange={(e) => setAnswers({ ...answers, description: e.target.value })}
                className="text-base leading-relaxed"
              />
            </QA>
          )}

          {/* Technologies Multi-Select */}
          {currentStepKey === "technologies" && (
            <QA title="3. Which technologies do you want to use for this project?" subtitle="Select all libraries, frameworks, and packages.">
              <div className="space-y-6">
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Frontend Technologies</h4>
                  <MultiChoiceGrid
                    options={FRONTEND_OPTIONS}
                    selected={answers.technologies}
                    onChange={(techs) => setAnswers({ ...answers, technologies: techs })}
                  />
                </div>
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-500">Backend Technologies</h4>
                  <MultiChoiceGrid
                    options={BACKEND_OPTIONS}
                    selected={answers.technologies}
                    onChange={(techs) => setAnswers({ ...answers, technologies: techs })}
                  />
                </div>
                <div className="space-y-2 pt-2 border-t">
                  <label className="text-xs font-bold text-slate-500 uppercase">Other Technology Preference</label>
                  <Input
                    placeholder="e.g. GraphQL, WebRTC, Electron..."
                    value={answers.techCustom}
                    onChange={(e) => setAnswers({ ...answers, techCustom: e.target.value })}
                    className="h-11"
                  />
                </div>
              </div>
            </QA>
          )}

          {/* Programming Languages Multi-Select */}
          {currentStepKey === "languages" && (
            <QA title="4. Which programming language do you want to use?" subtitle="Choose one or more languages for your files.">
              <MultiChoiceGrid
                options={LANGUAGE_OPTIONS}
                selected={answers.languages}
                onChange={(langs) => setAnswers({ ...answers, languages: langs })}
              />
            </QA>
          )}

          {/* Databases Multi-Select */}
          {currentStepKey === "databases" && (
            <QA title="5. Which database do you want to use?" subtitle="Select your database preference.">
              <MultiChoiceGrid
                options={DATABASE_OPTIONS}
                selected={answers.databases}
                onChange={(dbs) => setAnswers({ ...answers, databases: dbs })}
              />
            </QA>
          )}

          {/* Core Features Multi-Select */}
          {currentStepKey === "features" && (
            <QA title="6. What features do you want in your project?" subtitle="Select core features to pre-configure modules.">
              <div className="space-y-4">
                <MultiChoiceGrid
                  options={FEATURE_OPTIONS}
                  selected={answers.features}
                  onChange={(feats) => setAnswers({ ...answers, features: feats })}
                />
                <div className="space-y-2 pt-2 border-t">
                  <label className="text-xs font-bold text-slate-500 uppercase">Custom Features Input</label>
                  <Input
                    placeholder="e.g. CSV report exporting, multi-factor authorization..."
                    value={answers.featuresCustom}
                    onChange={(e) => setAnswers({ ...answers, featuresCustom: e.target.value })}
                    className="h-11"
                  />
                </div>
              </div>
            </QA>
          )}

          {/* Admin Role Panels Management */}
          {currentStepKey === "adminRoles" && (
            <QA title="7. What type of admin panels do you need, and what should each manage?" subtitle="Choose required dashboard panels. You can customize permissions underneath.">
              <div className="space-y-6">
                <MultiChoiceGrid
                  options={ADMIN_ROLE_OPTIONS}
                  selected={answers.adminRoles}
                  onChange={(roles) => {
                    const newManagements = { ...answers.adminManagements };
                    roles.forEach((r) => {
                      if (!newManagements[r]) {
                        newManagements[r] = DEFAULT_ROLE_MANAGEMENTS[r] || "";
                      }
                    });
                    setAnswers({ ...answers, adminRoles: roles, adminManagements: newManagements });
                  }}
                />

                {answers.adminRoles.length > 0 && (
                  <div className="space-y-4 pt-4 border-t">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Configure Permissions</h4>
                    <div className="grid gap-4">
                      {answers.adminRoles.map((role) => (
                        <div key={role} className="space-y-1.5 p-3 rounded-lg border bg-slate-50/50 dark:bg-slate-900/50">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">{role} Responsibilities</label>
                          <Input
                            value={answers.adminManagements[role] || ""}
                            onChange={(e) => {
                              const newManagements = { ...answers.adminManagements, [role]: e.target.value };
                              setAnswers({ ...answers, adminManagements: newManagements });
                            }}
                            placeholder={`e.g. ${DEFAULT_ROLE_MANAGEMENTS[role] || "Manage permissions..."}`}
                            className="bg-card h-10 text-sm"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </QA>
          )}

          {/* UI Design Styling */}
          {currentStepKey === "uiDesign" && (
            <QA title="8. What type of UI design do you want?" subtitle="Select visual aesthetics and theme styling.">
              <MultiChoiceGrid
                options={UI_DESIGN_OPTIONS}
                selected={answers.uiDesign}
                onChange={(ui) => setAnswers({ ...answers, uiDesign: ui })}
              />
            </QA>
          )}

          {/* AI Outputs Generation */}
          {currentStepKey === "aiGenerations" && (
            <QA title={isTech ? "9. What do you want AI to generate for this project?" : "4. What do you want AI to generate for this project?"} subtitle="Choose deliverables. These are generated instantly.">
              <MultiChoiceGrid
                options={AI_GENERATION_OPTIONS}
                selected={answers.aiGenerations}
                onChange={(gens) => setAnswers({ ...answers, aiGenerations: gens })}
              />
            </QA>
          )}

          {/* Additional requirements */}
          {currentStepKey === "additional" && (
            <QA title="10. Is there anything else you want AI to consider?" subtitle="Select code constraints or write your preferences.">
              <div className="space-y-4">
                <MultiChoiceGrid
                  options={ADDITIONAL_OPTIONS}
                  selected={answers.additionalRequirements}
                  onChange={(reqs) => setAnswers({ ...answers, additionalRequirements: reqs })}
                />
                <div className="space-y-2 pt-2 border-t">
                  <label className="text-xs font-bold text-slate-500 uppercase">Additional Custom Requirements</label>
                  <Textarea
                    placeholder="e.g. Ensure we use Tailwind v4.0, structure folders clean with services layers..."
                    value={answers.additionalCustom}
                    onChange={(e) => setAnswers({ ...answers, additionalCustom: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
            </QA>
          )}

          {/* Summary Page */}
          {currentStepKey === "summary" && (
            <QA title="Configure Complete — Prompt Ready" subtitle="Review your specification summary below. We will feed this structured prompt to the AI mentor to kickstart code building.">
              <div className="space-y-4">
                <div className="p-4 rounded-xl border bg-slate-900 text-slate-100 font-mono text-xs overflow-auto max-h-[320px] whitespace-pre-wrap leading-relaxed">
                  {generateAIPrompt()}
                </div>
                <div className="p-3.5 rounded-lg bg-primary/5 border border-primary/20 text-xs text-primary flex items-start gap-2">
                  <Terminal className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>The AI workspace will initialize configured with this detailed specifications prompt, allowing the mentor to instantly build modular code directories.</span>
                </div>
              </div>
            </QA>
          )}
        </Card>

        {/* Wizard Controls */}
        <div className="flex items-center justify-between mt-6">
          <Button variant="ghost" onClick={handleBack} disabled={step === 0 || loading}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <div className="text-xs text-muted-foreground">
            Step {step + 1} of {steps.length}
          </div>
          <Button
            onClick={handleNext}
            disabled={
              loading ||
              (currentStepKey === "stream" && !answers.stream) ||
              (currentStepKey === "title" && !answers.title.trim()) ||
              (currentStepKey === "description" && !answers.description.trim())
            }
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-elegant"
          >
            {loading ? (
              "Building Workspace..."
            ) : isLast ? (
              <>
                <Wand2 className="h-4 w-4 mr-2" /> Build with AI
              </>
            ) : (
              <>
                Next <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// --- Inner Components --------------------------------------------------------
function QA({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-250">
      <div className="space-y-1">
        <h2 className="text-xl lg:text-2xl font-bold tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="pt-2">{children}</div>
    </div>
  );
}

// Choice Grid (Single Select)
function ChoiceGrid({
  options,
  selected,
  onSelect,
}: {
  options: string[];
  selected: string;
  onSelect: (val: string) => void;
}) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onSelect(opt)}
          className={cn(
            "text-left px-4 py-3 rounded-lg border-2 text-sm font-semibold transition-all duration-200",
            "hover:border-primary hover:bg-accent/40 hover:-translate-y-0.5",
            selected === opt ? "border-primary bg-primary/5 font-extrabold text-primary" : "border-border bg-card"
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

// Multi Choice Grid
function MultiChoiceGrid({
  options,
  selected,
  onChange,
}: {
  options: string[];
  selected: string[];
  onChange: (val: string[]) => void;
}) {
  const toggle = (opt: string) => {
    if (selected.includes(opt)) {
      onChange(selected.filter((x) => x !== opt));
    } else {
      onChange([...selected, opt]);
    }
  };

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
      {options.map((opt) => {
        const isSel = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={cn(
              "text-left px-4 py-2.5 rounded-lg border-2 text-xs font-semibold transition-all duration-150 flex items-center justify-between",
              "hover:border-primary hover:bg-accent/30",
              isSel ? "border-primary bg-primary/5 text-primary font-bold" : "border-border bg-card/50"
            )}
          >
            <span>{opt}</span>
            {isSel && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
          </button>
        );
      })}
    </div>
  );
}
