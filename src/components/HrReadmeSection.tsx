import { useState } from "react";
import { ChevronDown, ChevronUp, BookOpen, Terminal, CheckCircle2, ShieldCheck, Database, Layers, PlayCircle, FileText, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function HrReadmeSection() {
  const [isExpanded, setIsExpanded] = useState(false);

  const tocItems = [
    { num: 1, title: "Executive Summary & Architecture", desc: "High-level design, monochrome aesthetic, and single-port deployment" },
    { num: 2, title: "Project Directory & Structure", desc: "Complete breakdown of frontend, backend, database, and test folders" },
    { num: 3, title: "Quick Start & Setup Guide", desc: "Step-by-step instructions for VS Code, terminal, and hot-reload development" },
    { num: 4, title: "Credentials & Access Control", desc: "Administrator & Employee credentials, role permissions matrix" },
    { num: 5, title: "Core Modules & Workflows", desc: "Profiles, Family Directory, 30-Day Matrix, Leaves, Projects, and Payroll" },
    { num: 6, title: "Payroll Engine & Calculation", desc: "Mathematical formulas, weekend inclusion, 20% Basic PF, and 3 worked examples" },
    { num: 7, title: "Database Schema Reference", desc: "Detailed schema for 8 database tables with foreign keys and indexes" },
    { num: 8, title: "Complete REST API Reference", desc: "All HTTP routes, methods, authentication headers, payloads, and responses" },
    { num: 9, title: "Verification & Testing Suite", desc: "Comprehensive overview of 149 automated end-to-end verification tests" },
  ];

  return (
    <section className="bg-black text-white border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300">
      {/* Header bar */}
      <div className="p-6 md:p-8 border-b border-neutral-800/80 bg-gradient-to-b from-neutral-900/50 to-transparent">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-neutral-800/80 border border-neutral-700/60 flex items-center justify-center text-white">
              <BookOpen className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs uppercase tracking-widest text-amber-400 font-semibold">README.md</span>
                <span className="text-neutral-500">•</span>
                <Badge variant="outline" className="border-neutral-700 text-neutral-300 text-[10px] py-0">v2.0.0</Badge>
              </div>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white mt-0.5">
                Info HR Management System — System Manual
              </h2>
            </div>
          </div>
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            className="bg-white text-black hover:bg-neutral-200 font-semibold px-5 py-2 h-9 text-xs rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
          >
            {isExpanded ? (
              <>
                <span>See Less</span>
                <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                <span>See More</span>
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        {/* Short Executive Intro */}
        <p className="text-sm text-neutral-300 leading-relaxed mt-4 max-w-3xl">
          Complete engineering manual, database architecture, payroll calculations, and REST API documentation for the Info HR & Payroll Management System.
        </p>

        {/* Table of Contents Section (Always visible) */}
        <div className="mt-6 pt-6 border-t border-neutral-800/60">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold">
              Table of Contents
            </h3>
            <span className="text-[11px] text-neutral-500 font-mono">9 Chapters</span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {tocItems.map((item) => (
              <div
                key={item.num}
                onClick={() => !isExpanded && setIsExpanded(true)}
                className={`p-3 rounded-lg border border-neutral-800/90 bg-neutral-900/40 hover:bg-neutral-800/60 transition-colors ${!isExpanded ? "cursor-pointer" : ""}`}
              >
                <div className="flex items-start gap-2.5">
                  <span className="h-5 w-5 rounded bg-neutral-800 text-amber-400 font-mono text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                    {item.num}
                  </span>
                  <div>
                    <h4 className="text-xs font-semibold text-neutral-100 leading-snug">{item.title}</h4>
                    <p className="text-[11px] text-neutral-400 leading-tight mt-1 line-clamp-2">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Button when collapsed */}
        {!isExpanded && (
          <div className="mt-6 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-neutral-900/30 p-4 rounded-xl border border-neutral-800/60">
            <div className="text-xs text-neutral-400">
              Click <strong className="text-white">See More</strong> to reveal the complete documentation including credentials, code structure, payroll engine formulas, SQLite schema, and API routes.
            </div>
            <Button
              onClick={() => setIsExpanded(true)}
              className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold px-6 py-2 h-9 text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 shrink-0"
            >
              <span>See More Details</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Expanded Details Body */}
      {isExpanded && (
        <div className="p-6 md:p-8 space-y-12 text-neutral-200 text-sm leading-relaxed border-t border-neutral-800">
          
          {/* 1. Executive Summary & System Architecture */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
              <span className="text-amber-400 font-mono font-bold text-base">1.</span>
              <h3 className="text-lg font-bold text-white">Executive Summary & System Architecture</h3>
            </div>
            <p className="text-neutral-300">
              The Info HR Management System is an enterprise human resource and payroll portal designed with a strict minimalist aesthetic and high-performance architecture. Built around a monochrome high-contrast design system (<code className="text-amber-300 bg-neutral-900 px-1.5 py-0.5 rounded font-mono text-xs">#000000</code> text and borders on a pure <code className="text-amber-300 bg-neutral-900 px-1.5 py-0.5 rounded font-mono text-xs">#ffffff</code> canvas), it eliminates visual clutter, unnecessary animations, and non-standard layouts in favor of dense, functional, and legible enterprise interfaces.
            </p>

            <h4 className="text-sm font-semibold text-white tracking-wide uppercase font-mono mt-4">Core Architectural Principles</h4>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-1">
                <div className="font-semibold text-white text-xs flex items-center gap-2">
                  <Database className="h-4 w-4 text-amber-400" /> Zero-Config Embedded Database
                </div>
                <p className="text-xs text-neutral-400 leading-normal">
                  Operates entirely on an embedded SQLite3 engine located at <code className="text-neutral-200 font-mono">server/db/info_hr.db</code>. Eliminates the need for external MySQL, PostgreSQL, or Docker containers.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-1">
                <div className="font-semibold text-white text-xs flex items-center gap-2">
                  <Layers className="h-4 w-4 text-amber-400" /> Single-Port Unified Delivery
                </div>
                <p className="text-xs text-neutral-400 leading-normal">
                  The Express.js server on port 5050 directly serves both the REST API endpoints (<code className="text-neutral-200 font-mono">/api/*</code>) and the optimized React 19 production build from <code className="text-neutral-200 font-mono">client/dist</code>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-1">
                <div className="font-semibold text-white text-xs flex items-center gap-2">
                  <PlayCircle className="h-4 w-4 text-amber-400" /> Weekend-Paid Payroll Policy
                </div>
                <p className="text-xs text-neutral-400 leading-normal">
                  Every month operates on a standard 30-day base. Saturdays and Sundays are fixed paid non-working days and are added to present days during monthly salary calculation.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-1">
                <div className="font-semibold text-white text-xs flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-amber-400" /> Statutory Deduction Precision
                </div>
                <p className="text-xs text-neutral-400 leading-normal">
                  Provident Fund (PF) is set strictly to 20% of Basic Salary (Basic = 50% of Earned Gross). Professional Tax (PT) is flat 200 INR for earnings above 15,000 INR.
                </p>
              </div>
            </div>

            <h4 className="text-sm font-semibold text-white tracking-wide uppercase font-mono mt-4">System Architecture Flow</h4>
            <pre className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 font-mono text-xs text-neutral-300 overflow-x-auto leading-relaxed">
{`[React 19 SPA (Vite)] ---> HTTP REST (JSON) ---> [Express 4.18 (Port 5050)]
        |                                                 |
        +-- Auth JWT & State Management                   +-- JWT Verification & Middleware
        +-- Minimalist B&W CSS Design                     +-- Attendance, Leaves, Projects, Payroll
                                                          +-- SQLite Driver (server/db/info_hr.db)`}
            </pre>
          </div>

          {/* 2. Project Directory & Codebase Structure */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
              <span className="text-amber-400 font-mono font-bold text-base">2.</span>
              <h3 className="text-lg font-bold text-white">Project Directory & Codebase Structure</h3>
            </div>
            <p className="text-neutral-300">
              The codebase is cleanly separated into client frontend, backend API server, database scripts, and automated tests:
            </p>
            <pre className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed">
{`info-hr-system/
|-- package.json             # Unified project scripts (install:all, start, dev, client, seed, test)
|-- README.md                # Full markdown system documentation
|-- client/                  # Frontend React 19 Application
|   |-- package.json         # Frontend packages (lucide-react, vite, @vitejs/plugin-react)
|   |-- vite.config.js       # Vite dev server proxying API calls to http://localhost:5050
|   |-- dist/                # Pre-compiled production React build bundle
|   \`-- src/                 # App.jsx, index.css (monochrome styling), views/, components/
|-- server/                  # Backend Node.js / Express Server
|   |-- server.js            # HTTP entrypoint, static files, route mounting on port 5050
|   |-- middleware/auth.js   # JWT authorization, role guards (isAdmin, isEmployee)
|   |-- routes/              # auth.js, employees.js, attendance.js, leaves.js, projects.js, payroll.js
|   \`-- db/                  # database.js (schema setup), seed.js (mock data), info_hr.db (live SQLite)
\`-- test/
    \`-- verify_system.js     # Comprehensive 149-assertion automated verification test suite`}
            </pre>
          </div>

          {/* 3. Quick Start & Running Guide */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
              <span className="text-amber-400 font-mono font-bold text-base">3.</span>
              <h3 className="text-lg font-bold text-white">Quick Start & Running Guide (VS Code / Terminal)</h3>
            </div>
            <p className="text-neutral-300">
              Getting the application running takes less than two minutes thanks to pre-seeded SQLite and bundled scripts:
            </p>

            <div className="space-y-3">
              <div className="p-3.5 rounded-lg bg-neutral-900/60 border border-neutral-800 space-y-1">
                <span className="text-xs font-mono font-bold text-amber-400">Step 1: Open in VS Code</span>
                <p className="text-xs text-neutral-300">Launch Visual Studio Code and open the <code className="text-white font-mono">info-hr-system</code> folder via File &gt; Open Folder. Open the integrated terminal using <kbd className="bg-neutral-800 px-1 py-0.5 rounded text-[11px] text-white font-mono">Ctrl + `</kbd> (or <kbd className="bg-neutral-800 px-1 py-0.5 rounded text-[11px] text-white font-mono">Cmd + `</kbd> on Mac).</p>
              </div>

              <div className="p-3.5 rounded-lg bg-neutral-900/60 border border-neutral-800 space-y-1">
                <span className="text-xs font-mono font-bold text-amber-400">Step 2: Install All Dependencies</span>
                <p className="text-xs text-neutral-300">Run <code className="text-amber-300 bg-neutral-950 px-2 py-0.5 rounded font-mono">npm run install:all</code> to install both root server packages and client frontend packages concurrently.</p>
              </div>

              <div className="p-3.5 rounded-lg bg-neutral-900/60 border border-neutral-800 space-y-1">
                <span className="text-xs font-mono font-bold text-amber-400">Step 3: Launch the Unified Server</span>
                <p className="text-xs text-neutral-300">Run <code className="text-amber-300 bg-neutral-950 px-2 py-0.5 rounded font-mono">npm start</code>. The terminal will display the start banner on <code className="text-white font-mono">http://localhost:5050</code>.</p>
              </div>

              <div className="p-3.5 rounded-lg bg-neutral-900/60 border border-neutral-800 space-y-1">
                <span className="text-xs font-mono font-bold text-amber-400">Step 4: Access in Web Browser</span>
                <p className="text-xs text-neutral-300">Navigate to <code className="text-white font-mono">http://localhost:5050</code> in Google Chrome, Safari, Firefox, or Edge. You will be greeted by the minimalist login screen.</p>
              </div>

              <div className="p-3.5 rounded-lg bg-neutral-900/60 border border-neutral-800 space-y-1">
                <span className="text-xs font-mono font-bold text-amber-400">Step 5: Optional Dev Mode with Hot Reload</span>
                <p className="text-xs text-neutral-300">For UI development, run <code className="text-neutral-300 bg-neutral-950 px-1.5 py-0.5 rounded font-mono">npm run dev</code> in terminal 1 and <code className="text-neutral-300 bg-neutral-950 px-1.5 py-0.5 rounded font-mono">npm run client</code> in terminal 2. Open <code className="text-white font-mono">http://localhost:3000</code> for instant live reloading.</p>
              </div>

              <div className="p-3.5 rounded-lg bg-neutral-900/60 border border-neutral-800 space-y-1">
                <span className="text-xs font-mono font-bold text-amber-400">Step 6: Resetting Database</span>
                <p className="text-xs text-neutral-300">To re-seed the database back to clean demo data at any time, run <code className="text-amber-300 bg-neutral-950 px-2 py-0.5 rounded font-mono">npm run seed</code>.</p>
              </div>
            </div>
          </div>

          {/* 4. Default Credentials & Role-Based Access Control */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
              <span className="text-amber-400 font-mono font-bold text-base">4.</span>
              <h3 className="text-lg font-bold text-white">Default Credentials & Role-Based Access Control</h3>
            </div>
            <p className="text-neutral-300">
              The system comes pre-seeded with one HR Administrator account and four Employee accounts. Quick Fill shortcut buttons on the login screen allow instantaneous credential population.
            </p>

            <div className="overflow-x-auto rounded-xl border border-neutral-800">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-neutral-900 border-b border-neutral-800 text-neutral-400 uppercase tracking-wider font-sans">
                  <tr>
                    <th className="p-3">Role</th>
                    <th className="p-3">Emp ID</th>
                    <th className="p-3">Login Identifier</th>
                    <th className="p-3">Password</th>
                    <th className="p-3">Designation & Department</th>
                    <th className="p-3 text-right">Monthly Base</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800 bg-neutral-950/60 text-neutral-200">
                  <tr className="hover:bg-neutral-900/40">
                    <td className="p-3"><Badge className="bg-amber-400/20 text-amber-300 border-amber-400/30">Admin</Badge></td>
                    <td className="p-3 font-bold text-white">ADMIN</td>
                    <td className="p-3 text-amber-300">admin@infohr.com</td>
                    <td className="p-3 text-neutral-400">admin123</td>
                    <td className="p-3 font-sans">HR Director (HR)</td>
                    <td className="p-3 text-right text-white font-bold">120,000 INR</td>
                  </tr>
                  <tr className="hover:bg-neutral-900/40">
                    <td className="p-3"><Badge className="bg-neutral-800 text-neutral-300 border-neutral-700">Employee</Badge></td>
                    <td className="p-3 font-bold text-white">EMP101</td>
                    <td className="p-3">EMP101 / john@infohr.com</td>
                    <td className="p-3 text-neutral-400">employee123</td>
                    <td className="p-3 font-sans">Sr Software Engineer (Eng)</td>
                    <td className="p-3 text-right text-white font-bold">85,000 INR</td>
                  </tr>
                  <tr className="hover:bg-neutral-900/40">
                    <td className="p-3"><Badge className="bg-neutral-800 text-neutral-300 border-neutral-700">Employee</Badge></td>
                    <td className="p-3 font-bold text-white">EMP102</td>
                    <td className="p-3">EMP102 / sarah@infohr.com</td>
                    <td className="p-3 text-neutral-400">employee123</td>
                    <td className="p-3 font-sans">UI/UX Specialist (Design)</td>
                    <td className="p-3 text-right text-white font-bold">72,000 INR</td>
                  </tr>
                  <tr className="hover:bg-neutral-900/40">
                    <td className="p-3"><Badge className="bg-neutral-800 text-neutral-300 border-neutral-700">Employee</Badge></td>
                    <td className="p-3 font-bold text-white">EMP103</td>
                    <td className="p-3">EMP103 / michael@infohr.com</td>
                    <td className="p-3 text-neutral-400">employee123</td>
                    <td className="p-3 font-sans">Operations Analyst (Ops)</td>
                    <td className="p-3 text-right text-white font-bold">95,000 INR</td>
                  </tr>
                  <tr className="hover:bg-neutral-900/40">
                    <td className="p-3"><Badge className="bg-neutral-800 text-neutral-300 border-neutral-700">Employee</Badge></td>
                    <td className="p-3 font-bold text-white">EMP104</td>
                    <td className="p-3">EMP104 / emily@infohr.com</td>
                    <td className="p-3 text-neutral-400">employee123</td>
                    <td className="p-3 font-sans">Marketing Associate (Mkt)</td>
                    <td className="p-3 text-right text-white font-bold">60,000 INR</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 5. Core Modules & Functional Workflows */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
              <span className="text-amber-400 font-mono font-bold text-base">5.</span>
              <h3 className="text-lg font-bold text-white">Core Modules & Functional Workflows</h3>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800 space-y-2">
                <h4 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
                  <span className="text-amber-400">5.1</span> Employee Profiles & Multi-Family Directory
                </h4>
                <ul className="list-disc list-inside text-xs text-neutral-300 space-y-1.5 ml-1">
                  <li><strong>Personal Profile Fields:</strong> Contains 7 core attributes: Full Name, Email, Phone Number, Employee ID, Department, Designation, and Date of Joining.</li>
                  <li><strong>Statutory & Banking Details:</strong> Bank Account Number, Bank Name, IFSC Code, PAN Card Number, and UAN/PF Account Number.</li>
                  <li><strong>Multiple Family Directory:</strong> Employees can maintain multiple family member records with Relationship (Spouse, Child, Parent, Sibling), Name, Age, Contact Phone, and Emergency Contact flags.</li>
                  <li><strong>Security & Access Rules:</strong> Employees can view and update their own family records. Administrators possess master editing permissions across all employee files.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800 space-y-2">
                <h4 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
                  <span className="text-amber-400">5.2</span> Attendance Matrix & 30-Day Calendar
                </h4>
                <ul className="list-disc list-inside text-xs text-neutral-300 space-y-1.5 ml-1">
                  <li><strong>Standard 30-Day Grid:</strong> Attendance is calculated and displayed across a uniform 30-day monthly grid (Day 1 through Day 30).</li>
                  <li><strong>Fixed Weekend Policy:</strong> Every Saturday and Sunday is automatically treated as a paid non-working day ('Weekend').</li>
                  <li><strong>Self-Service Clock-In:</strong> Employees clock in with a single click. Duplicate attendance markings on the same calendar day are strictly blocked.</li>
                  <li><strong>Admin Cross-Matrix View:</strong> Administrators have a global calendar table showing all employees with real-time status indicators (P = Present, A = Absent, L = On Leave, W = Weekend).</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800 space-y-2">
                <h4 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
                  <span className="text-amber-400">5.3</span> Leave Management & HR Approval Workflow
                </h4>
                <ul className="list-disc list-inside text-xs text-neutral-300 space-y-1.5 ml-1">
                  <li><strong>Monthly Leave Accrual:</strong> Employees accrue 2 Company Paid Leaves each month. Up to 2 leaves are fully funded without salary deductions.</li>
                  <li><strong>Leave Filing:</strong> Employees submit start date, end date, leave type (Paid, Sick, Casual, Unpaid), and written justification.</li>
                  <li><strong>HR Review Queue:</strong> Admins review pending applications with one-click 'Approve' or 'Reject' actions and optional review notes.</li>
                  <li><strong>Calendar Sync & Alerts:</strong> Approved leave days automatically sync into the employee's 30-day attendance calendar and trigger a push notification.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800 space-y-2">
                <h4 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
                  <span className="text-amber-400">5.4</span> Project Allocations & Client Details
                </h4>
                <ul className="list-disc list-inside text-xs text-neutral-300 space-y-1.5 ml-1">
                  <li><strong>Project Registry:</strong> Tracks Company/Client Name, Business Domain, Project Name, Timeline (Start/End Dates), Tech Stack tags, and Project Manager.</li>
                  <li><strong>Team Assignment:</strong> Admins assign team members with designated project roles (e.g. Lead Developer, Architect) and percentage allocation (e.g. 50%, 100%).</li>
                  <li><strong>Employee Visibility:</strong> Employees see an itemized card list of their assigned client engagements, project managers, and active status.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800 space-y-2">
                <h4 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
                  <span className="text-amber-400">5.5</span> Payroll Engine (Attendance-Based with Weekend Inclusion)
                </h4>
                <ul className="list-disc list-inside text-xs text-neutral-300 space-y-1.5 ml-1">
                  <li><strong>Weekend Inclusion Policy:</strong> Weekends (Saturdays & Sundays) are counted as paid days and are added to present days when calculating payable days.</li>
                  <li><strong>Leave Deduction Threshold:</strong> Deductible leaves are calculated as Max(0, Leaves Taken - 2 Paid Leaves). Unpaid leaves reduce payable days.</li>
                  <li><strong>Fixed PF Calculation:</strong> Provident Fund is strictly 20% of Basic Salary (Basic = 50% of Earned Gross).</li>
                  <li><strong>Batch Generation:</strong> Admins can generate all monthly payslips with one click ('Generate All Salaries'), dispatching real-time notifications to all staff.</li>
                  <li><strong>Printable Payslips:</strong> Employees and Admins can view and print a complete itemized salary slip modal.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 6. Payroll Engine Deep-Dive & Worked Numerical Examples */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
              <span className="text-amber-400 font-mono font-bold text-base">6.</span>
              <h3 className="text-lg font-bold text-white">Payroll Engine Deep-Dive & Worked Numerical Examples</h3>
            </div>
            <p className="text-neutral-300">
              The payroll engine computes gross compensation, statutory deductions, and net take-home salary based on exact mathematical rules:
            </p>

            <div className="grid md:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 font-mono text-xs space-y-1.5">
                <span className="text-amber-400 font-bold uppercase text-[10px]">Formula 1: Net Payable Days</span>
                <p className="text-neutral-400">Weekend Days = Count of Sats & Suns (~8 days)</p>
                <p className="text-neutral-400">Deductible = Max(0, Leaves - 2 Paid Leaves)</p>
                <p className="text-white font-semibold">Net Payable = Min(30, Max(0, Present + Weekends - Deductible))</p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 font-mono text-xs space-y-1.5">
                <span className="text-amber-400 font-bold uppercase text-[10px]">Formula 2: Compensation</span>
                <p className="text-neutral-400">Earned Gross = Base * (Net Payable / 30)</p>
                <p className="text-neutral-400">Basic = Earned Gross * 50%</p>
                <p className="text-neutral-400">HRA = Earned Gross * 30%</p>
                <p className="text-white font-semibold">Allowances = Balance (~20%)</p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 font-mono text-xs space-y-1.5">
                <span className="text-amber-400 font-bold uppercase text-[10px]">Formula 3: Statutory & Net</span>
                <p className="text-neutral-400">PF = Basic Salary * 20%</p>
                <p className="text-neutral-400">PT = 200 INR (if Gross &gt; 15,000 INR)</p>
                <p className="text-white font-semibold">Net Take-Home = Earned Gross - Total Deductions</p>
              </div>
            </div>

            {/* Worked Example 1 */}
            <div className="space-y-2 mt-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider text-amber-400">
                  Worked Example 1: EMP101 Aarav Sharma (18 Days Present + 5 Leaves Taken)
                </h4>
                <span className="text-[11px] text-neutral-400 font-mono">Base Gross: 85,000 INR | Month: 30 Days | Weekends: 8</span>
              </div>
              <div className="overflow-x-auto rounded-xl border border-neutral-800">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-neutral-900 border-b border-neutral-800 text-neutral-400">
                    <tr>
                      <th className="p-2.5">Calculation Step</th>
                      <th className="p-2.5">Formula & Working</th>
                      <th className="p-2.5 text-right">Result Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800 bg-neutral-950/60 text-neutral-300">
                    <tr><td className="p-2 font-semibold">Deductible Leaves</td><td className="p-2">5 leaves taken - 2 company paid leaves</td><td className="p-2 text-right text-white font-bold">3 days</td></tr>
                    <tr><td className="p-2 font-semibold">Net Payable Days</td><td className="p-2">18 present + 8 weekends - 3 deductible leaves</td><td className="p-2 text-right text-white font-bold">23 days</td></tr>
                    <tr><td className="p-2 font-semibold text-amber-300">Earned Gross Salary</td><td className="p-2">85,000 INR * (23 / 30)</td><td className="p-2 text-right text-amber-300 font-bold">65,167 INR</td></tr>
                    <tr><td className="p-2 font-semibold">Basic Salary (50%)</td><td className="p-2">50% of 65,167 INR</td><td className="p-2 text-right">32,584 INR</td></tr>
                    <tr><td className="p-2 font-semibold">HRA (30%)</td><td className="p-2">30% of 65,167 INR</td><td className="p-2 text-right">19,550 INR</td></tr>
                    <tr><td className="p-2 font-semibold">Allowances (20%)</td><td className="p-2">65,167 - (32,584 + 19,550)</td><td className="p-2 text-right">13,033 INR</td></tr>
                    <tr><td className="p-2 font-semibold text-rose-300">PF Deduction (20% Basic)</td><td className="p-2">20% of 32,583.50 INR Basic</td><td className="p-2 text-right text-rose-300">6,517 INR</td></tr>
                    <tr><td className="p-2 font-semibold text-rose-300">Professional Tax (PT)</td><td className="p-2">Flat rate for gross &gt; 15,000 INR</td><td className="p-2 text-right text-rose-300">200 INR</td></tr>
                    <tr><td className="p-2 font-semibold text-rose-400">Total Deductions</td><td className="p-2">6,517 INR (PF) + 200 INR (PT)</td><td className="p-2 text-right text-rose-400 font-bold">6,717 INR</td></tr>
                    <tr className="bg-neutral-900/80"><td className="p-2 font-bold text-emerald-400">Net Take-Home Salary</td><td className="p-2">65,167 INR (Earned Gross) - 6,717 INR (Deductions)</td><td className="p-2 text-right text-emerald-400 font-bold text-sm">58,450 INR</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Worked Example 2 */}
            <div className="space-y-2 mt-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider text-amber-400">
                  Worked Example 2: EMP102 Priya Patel (21 Days Present + 0 Leaves Taken)
                </h4>
                <span className="text-[11px] text-neutral-400 font-mono">Base Gross: 72,000 INR | Month: 30 Days | Weekends: 8</span>
              </div>
              <div className="overflow-x-auto rounded-xl border border-neutral-800">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-neutral-900 border-b border-neutral-800 text-neutral-400">
                    <tr>
                      <th className="p-2.5">Calculation Step</th>
                      <th className="p-2.5">Formula & Working</th>
                      <th className="p-2.5 text-right">Result Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800 bg-neutral-950/60 text-neutral-300">
                    <tr><td className="p-2 font-semibold">Deductible Leaves</td><td className="p-2">0 leaves taken - 2 paid leaves = Max(0, -2)</td><td className="p-2 text-right text-white font-bold">0 days</td></tr>
                    <tr><td className="p-2 font-semibold">Net Payable Days</td><td className="p-2">Min(30, 21 present + 8 weekends - 0)</td><td className="p-2 text-right text-white font-bold">29 days</td></tr>
                    <tr><td className="p-2 font-semibold text-amber-300">Earned Gross Salary</td><td className="p-2">72,000 INR * (29 / 30)</td><td className="p-2 text-right text-amber-300 font-bold">69,600 INR</td></tr>
                    <tr><td className="p-2 font-semibold">Basic Salary (50%)</td><td className="p-2">50% of 69,600 INR</td><td className="p-2 text-right">34,800 INR</td></tr>
                    <tr><td className="p-2 font-semibold">HRA (30%)</td><td className="p-2">30% of 69,600 INR</td><td className="p-2 text-right">20,880 INR</td></tr>
                    <tr><td className="p-2 font-semibold">Allowances (20%)</td><td className="p-2">69,600 - (34,800 + 20,880)</td><td className="p-2 text-right">13,920 INR</td></tr>
                    <tr><td className="p-2 font-semibold text-rose-300">PF Deduction (20% Basic)</td><td className="p-2">20% of 34,800 INR Basic</td><td className="p-2 text-right text-rose-300">6,960 INR</td></tr>
                    <tr><td className="p-2 font-semibold text-rose-300">Professional Tax (PT)</td><td className="p-2">Flat rate for gross &gt; 15,000 INR</td><td className="p-2 text-right text-rose-300">200 INR</td></tr>
                    <tr><td className="p-2 font-semibold text-rose-400">Total Deductions</td><td className="p-2">6,960 INR (PF) + 200 INR (PT)</td><td className="p-2 text-right text-rose-400 font-bold">7,160 INR</td></tr>
                    <tr className="bg-neutral-900/80"><td className="p-2 font-bold text-emerald-400">Net Take-Home Salary</td><td className="p-2">69,600 INR (Earned Gross) - 7,160 INR (Deductions)</td><td className="p-2 text-right text-emerald-400 font-bold text-sm">62,440 INR</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Worked Example 3 */}
            <div className="space-y-2 mt-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider text-amber-400">
                  Worked Example 3: EMP103 Rohan Verma (16 Days Present + 2 Leaves Taken)
                </h4>
                <span className="text-[11px] text-neutral-400 font-mono">Base Gross: 95,000 INR | Month: 30 Days | Weekends: 8 | Paid Quota: 2</span>
              </div>
              <div className="overflow-x-auto rounded-xl border border-neutral-800">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-neutral-900 border-b border-neutral-800 text-neutral-400">
                    <tr>
                      <th className="p-2.5">Calculation Step</th>
                      <th className="p-2.5">Formula & Working</th>
                      <th className="p-2.5 text-right">Result Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800 bg-neutral-950/60 text-neutral-300">
                    <tr><td className="p-2 font-semibold">Deductible Leaves</td><td className="p-2">2 leaves taken - 2 paid quota = 0 deductible</td><td className="p-2 text-right text-white font-bold">0 days</td></tr>
                    <tr><td className="p-2 font-semibold">Net Payable Days</td><td className="p-2">16 present + 8 weekends - 0 deductible leaves</td><td className="p-2 text-right text-white font-bold">24 days</td></tr>
                    <tr><td className="p-2 font-semibold text-amber-300">Earned Gross Salary</td><td className="p-2">95,000 INR * (24 / 30)</td><td className="p-2 text-right text-amber-300 font-bold">76,000 INR</td></tr>
                    <tr><td className="p-2 font-semibold">Basic Salary (50%)</td><td className="p-2">50% of 76,000 INR</td><td className="p-2 text-right">38,000 INR</td></tr>
                    <tr><td className="p-2 font-semibold">HRA (30%)</td><td className="p-2">30% of 76,000 INR</td><td className="p-2 text-right">22,800 INR</td></tr>
                    <tr><td className="p-2 font-semibold">Allowances (20%)</td><td className="p-2">76,000 - (38,000 + 22,800)</td><td className="p-2 text-right">15,200 INR</td></tr>
                    <tr><td className="p-2 font-semibold text-rose-300">PF Deduction (20% Basic)</td><td className="p-2">20% of 38,000 INR Basic</td><td className="p-2 text-right text-rose-300">7,600 INR</td></tr>
                    <tr><td className="p-2 font-semibold text-rose-300">Professional Tax (PT)</td><td className="p-2">Flat rate for gross &gt; 15,000 INR</td><td className="p-2 text-right text-rose-300">200 INR</td></tr>
                    <tr><td className="p-2 font-semibold text-rose-400">Total Deductions</td><td className="p-2">7,600 INR (PF) + 200 INR (PT)</td><td className="p-2 text-right text-rose-400 font-bold">7,800 INR</td></tr>
                    <tr className="bg-neutral-900/80"><td className="p-2 font-bold text-emerald-400">Net Take-Home Salary</td><td className="p-2">76,000 INR (Earned Gross) - 7,800 INR (Deductions)</td><td className="p-2 text-right text-emerald-400 font-bold text-sm">68,200 INR</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* 7. Database Architecture & Schema Reference */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
              <span className="text-amber-400 font-mono font-bold text-base">7.</span>
              <h3 className="text-lg font-bold text-white">Database Architecture & Schema Reference</h3>
            </div>
            <p className="text-neutral-300">
              The relational database schema is managed in SQLite (<code className="text-white font-mono">server/db/info_hr.db</code>). Foreign key constraints and cascade rules ensure data integrity across all 8 tables:
            </p>

            <div className="overflow-x-auto rounded-xl border border-neutral-800">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-neutral-900 border-b border-neutral-800 text-neutral-400 uppercase tracking-wider font-sans">
                  <tr>
                    <th className="p-3">Table Name</th>
                    <th className="p-3">Primary Key</th>
                    <th className="p-3">Foreign Keys</th>
                    <th className="p-3">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800 bg-neutral-950/60 text-neutral-300">
                  <tr><td className="p-2.5 font-bold text-white">users</td><td className="p-2.5 text-amber-400">id</td><td className="p-2.5 text-neutral-500">None</td><td className="p-2.5 font-sans">Employee & Admin credentials, profile, bank info</td></tr>
                  <tr><td className="p-2.5 font-bold text-white">family_members</td><td className="p-2.5 text-amber-400">id</td><td className="p-2.5">user_id -&gt; users(id)</td><td className="p-2.5 font-sans">Multiple family records & emergency contacts</td></tr>
                  <tr><td className="p-2.5 font-bold text-white">attendance</td><td className="p-2.5 text-amber-400">id</td><td className="p-2.5">user_id -&gt; users(id)</td><td className="p-2.5 font-sans">Daily check-in, check-out, hours, status</td></tr>
                  <tr><td className="p-2.5 font-bold text-white">leaves</td><td className="p-2.5 text-amber-400">id</td><td className="p-2.5">user_id, reviewed_by</td><td className="p-2.5 font-sans">Leave requests, types, HR review status</td></tr>
                  <tr><td className="p-2.5 font-bold text-white">projects</td><td className="p-2.5 text-amber-400">id</td><td className="p-2.5">manager_id -&gt; users(id)</td><td className="p-2.5 font-sans">Client projects, domain, timeline, tech stack</td></tr>
                  <tr><td className="p-2.5 font-bold text-white">project_assignments</td><td className="p-2.5 text-amber-400">id</td><td className="p-2.5">project_id, user_id</td><td className="p-2.5 font-sans">Employee project allocation & role link table</td></tr>
                  <tr><td className="p-2.5 font-bold text-white">payroll</td><td className="p-2.5 text-amber-400">id</td><td className="p-2.5">user_id -&gt; users(id)</td><td className="p-2.5 font-sans">Finalized monthly payslips & deduction audit</td></tr>
                  <tr><td className="p-2.5 font-bold text-white">notifications</td><td className="p-2.5 text-amber-400">id</td><td className="p-2.5">user_id -&gt; users(id)</td><td className="p-2.5 font-sans">System push notifications & read status</td></tr>
                </tbody>
              </table>
            </div>

            <h4 className="text-xs font-semibold text-white uppercase font-mono mt-4">SQL Table Definitions (DDL Excerpts)</h4>
            <pre className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 font-mono text-xs text-neutral-300 overflow-x-auto leading-relaxed">
{`-- 1. Users Table
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT, emp_id TEXT UNIQUE NOT NULL, email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL, role TEXT DEFAULT 'employee' CHECK(role IN ('admin', 'employee')),
  full_name TEXT NOT NULL, phone TEXT, designation TEXT, department TEXT, joining_date TEXT,
  base_gross_salary REAL DEFAULT 50000.0, bank_account_no TEXT, bank_name TEXT, ifsc_code TEXT,
  pan_no TEXT, uan_no TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Attendance Table
CREATE TABLE attendance (
  id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL,
  date TEXT NOT NULL, day_of_month INTEGER NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('present', 'absent', 'leave', 'weekend')),
  check_in TEXT, check_out TEXT, hours_worked REAL DEFAULT 0, remarks TEXT,
  UNIQUE(user_id, date), FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Payroll Table
CREATE TABLE payroll (
  id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, month INTEGER, year INTEGER,
  base_gross REAL, present_days INTEGER, weekend_days INTEGER, leaves_taken INTEGER,
  net_payable_days INTEGER, earned_gross REAL, basic_salary REAL, hra REAL, allowances REAL,
  pf_deduction REAL, pt_deduction REAL, total_deductions REAL, net_salary REAL,
  status TEXT DEFAULT 'generated', generated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, month, year), FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);`}
            </pre>
          </div>

          {/* 8. Comprehensive REST API Reference */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
              <span className="text-amber-400 font-mono font-bold text-base">8.</span>
              <h3 className="text-lg font-bold text-white">Comprehensive REST API Reference</h3>
            </div>
            <p className="text-neutral-300">
              All API routes (except <code className="text-amber-300 font-mono bg-neutral-900 px-1 py-0.5 rounded">POST /api/auth/login</code>) require a valid JWT token passed in the Authorization header. Admins have access to all endpoints; Employees are constrained by role middleware.
            </p>

            <div className="overflow-x-auto rounded-xl border border-neutral-800 max-h-96 overflow-y-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-neutral-900 border-b border-neutral-800 text-neutral-400 sticky top-0 z-10 font-sans">
                  <tr>
                    <th className="p-2.5">Method</th>
                    <th className="p-2.5">Endpoint Route</th>
                    <th className="p-2.5">Access Level</th>
                    <th className="p-2.5 font-sans">Purpose & Payload</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800 bg-neutral-950/60 text-neutral-300">
                  <tr><td className="p-2"><Badge className="bg-emerald-950 text-emerald-400 border-emerald-800">POST</Badge></td><td className="p-2 text-white font-bold">/api/auth/login</td><td className="p-2 text-neutral-400 font-sans">Public</td><td className="p-2 font-sans">Authenticates via email/emp_id & password; returns JWT token</td></tr>
                  <tr><td className="p-2"><Badge className="bg-blue-950 text-blue-400 border-blue-800">GET</Badge></td><td className="p-2 text-white font-bold">/api/auth/me</td><td className="p-2 text-neutral-400 font-sans">Authenticated</td><td className="p-2 font-sans">Returns session details of currently authenticated user</td></tr>
                  <tr><td className="p-2"><Badge className="bg-blue-950 text-blue-400 border-blue-800">GET</Badge></td><td className="p-2 text-white font-bold">/api/employees</td><td className="p-2 text-amber-300 font-sans">Admin</td><td className="p-2 font-sans">Returns directory of all employees with family members & stats</td></tr>
                  <tr><td className="p-2"><Badge className="bg-emerald-950 text-emerald-400 border-emerald-800">POST</Badge></td><td className="p-2 text-white font-bold">/api/employees</td><td className="p-2 text-amber-300 font-sans">Admin</td><td className="p-2 font-sans">Creates new employee with personal, family, and bank fields</td></tr>
                  <tr><td className="p-2"><Badge className="bg-amber-950 text-amber-400 border-amber-800">PUT</Badge></td><td className="p-2 text-white font-bold">/api/employees/:id</td><td className="p-2 text-neutral-300 font-sans">Auth / Admin</td><td className="p-2 font-sans">Updates personal profile, family directory, and bank accounts</td></tr>
                  <tr><td className="p-2"><Badge className="bg-rose-950 text-rose-400 border-rose-800">DELETE</Badge></td><td className="p-2 text-white font-bold">/api/employees/:id</td><td className="p-2 text-amber-300 font-sans">Admin</td><td className="p-2 font-sans">Cascades deletion of employee and all associated records</td></tr>
                  <tr><td className="p-2"><Badge className="bg-blue-950 text-blue-400 border-blue-800">GET</Badge></td><td className="p-2 text-white font-bold">/api/attendance/my</td><td className="p-2 text-neutral-300 font-sans">Employee</td><td className="p-2 font-sans">Retrieves employee 30-day attendance history and counts</td></tr>
                  <tr><td className="p-2"><Badge className="bg-emerald-950 text-emerald-400 border-emerald-800">POST</Badge></td><td className="p-2 text-white font-bold">/api/attendance/mark</td><td className="p-2 text-neutral-300 font-sans">Employee</td><td className="p-2 font-sans">Records daily attendance clock-in with duplicate protection</td></tr>
                  <tr><td className="p-2"><Badge className="bg-blue-950 text-blue-400 border-blue-800">GET</Badge></td><td className="p-2 text-white font-bold">/api/attendance/admin/month</td><td className="p-2 text-amber-300 font-sans">Admin</td><td className="p-2 font-sans">Returns 30-day cross-employee attendance calendar matrix</td></tr>
                  <tr><td className="p-2"><Badge className="bg-emerald-950 text-emerald-400 border-emerald-800">POST</Badge></td><td className="p-2 text-white font-bold">/api/attendance/admin/override</td><td className="p-2 text-amber-300 font-sans">Admin</td><td className="p-2 font-sans">Overrides attendance status for specific employee and date</td></tr>
                  <tr><td className="p-2"><Badge className="bg-blue-950 text-blue-400 border-blue-800">GET</Badge></td><td className="p-2 text-white font-bold">/api/leaves/my</td><td className="p-2 text-neutral-300 font-sans">Employee</td><td className="p-2 font-sans">Retrieves leave applications and accrued paid leave balance</td></tr>
                  <tr><td className="p-2"><Badge className="bg-emerald-950 text-emerald-400 border-emerald-800">POST</Badge></td><td className="p-2 text-white font-bold">/api/leaves/apply</td><td className="p-2 text-neutral-300 font-sans">Employee</td><td className="p-2 font-sans">Submits new leave request with date range, type, and reason</td></tr>
                  <tr><td className="p-2"><Badge className="bg-blue-950 text-blue-400 border-blue-800">GET</Badge></td><td className="p-2 text-white font-bold">/api/leaves/admin/all</td><td className="p-2 text-amber-300 font-sans">Admin</td><td className="p-2 font-sans">Lists all employee leave requests with filtering options</td></tr>
                  <tr><td className="p-2"><Badge className="bg-amber-950 text-amber-400 border-amber-800">PUT</Badge></td><td className="p-2 text-white font-bold">/api/leaves/admin/:id/review</td><td className="p-2 text-amber-300 font-sans">Admin</td><td className="p-2 font-sans">Approves or rejects a leave request with audit remarks</td></tr>
                  <tr><td className="p-2"><Badge className="bg-blue-950 text-blue-400 border-blue-800">GET</Badge></td><td className="p-2 text-white font-bold">/api/projects</td><td className="p-2 text-neutral-300 font-sans">Authenticated</td><td className="p-2 font-sans">Lists client projects (all for Admin, assigned for Employee)</td></tr>
                  <tr><td className="p-2"><Badge className="bg-emerald-950 text-emerald-400 border-emerald-800">POST</Badge></td><td className="p-2 text-white font-bold">/api/projects</td><td className="p-2 text-amber-300 font-sans">Admin</td><td className="p-2 font-sans">Creates new client project with domain, dates, and skills</td></tr>
                  <tr><td className="p-2"><Badge className="bg-emerald-950 text-emerald-400 border-emerald-800">POST</Badge></td><td className="p-2 text-white font-bold">/api/projects/:id/assign</td><td className="p-2 text-amber-300 font-sans">Admin</td><td className="p-2 font-sans">Assigns employee to project with designated role & allocation %</td></tr>
                  <tr><td className="p-2"><Badge className="bg-rose-950 text-rose-400 border-rose-800">DELETE</Badge></td><td className="p-2 text-white font-bold">/api/projects/:id/assign/:uid</td><td className="p-2 text-amber-300 font-sans">Admin</td><td className="p-2 font-sans">Removes employee assignment from project</td></tr>
                  <tr><td className="p-2"><Badge className="bg-blue-950 text-blue-400 border-blue-800">GET</Badge></td><td className="p-2 text-white font-bold">/api/payroll/admin/preview</td><td className="p-2 text-amber-300 font-sans">Admin</td><td className="p-2 font-sans">Previews live salary calculations for all staff with formulas</td></tr>
                  <tr><td className="p-2"><Badge className="bg-emerald-950 text-emerald-400 border-emerald-800">POST</Badge></td><td className="p-2 text-white font-bold">/api/payroll/admin/generate</td><td className="p-2 text-amber-300 font-sans">Admin</td><td className="p-2 font-sans">Commits monthly payroll and triggers employee notifications</td></tr>
                  <tr><td className="p-2"><Badge className="bg-blue-950 text-blue-400 border-blue-800">GET</Badge></td><td className="p-2 text-white font-bold">/api/payroll/my</td><td className="p-2 text-neutral-300 font-sans">Employee</td><td className="p-2 font-sans">Retrieves employee generated monthly salary slips</td></tr>
                  <tr><td className="p-2"><Badge className="bg-blue-950 text-blue-400 border-blue-800">GET</Badge></td><td className="p-2 text-white font-bold">/api/payroll/slip/:id</td><td className="p-2 text-neutral-300 font-sans">Auth / Admin</td><td className="p-2 font-sans">Retrieves printable payslip data object with all details</td></tr>
                  <tr><td className="p-2"><Badge className="bg-blue-950 text-blue-400 border-blue-800">GET</Badge></td><td className="p-2 text-white font-bold">/api/notifications</td><td className="p-2 text-neutral-300 font-sans">Authenticated</td><td className="p-2 font-sans">Fetches user notification feed and unread badge count</td></tr>
                  <tr><td className="p-2"><Badge className="bg-amber-950 text-amber-400 border-amber-800">PUT</Badge></td><td className="p-2 text-white font-bold">/api/notifications/:id/read</td><td className="p-2 text-neutral-300 font-sans">Authenticated</td><td className="p-2 font-sans">Marks specific notification as read</td></tr>
                  <tr><td className="p-2"><Badge className="bg-amber-950 text-amber-400 border-amber-800">PUT</Badge></td><td className="p-2 text-white font-bold">/api/notifications/read-all</td><td className="p-2 text-neutral-300 font-sans">Authenticated</td><td className="p-2 font-sans">Marks all notifications for current user as read</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 9. Automated Verification Suite */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
              <span className="text-amber-400 font-mono font-bold text-base">9.</span>
              <h3 className="text-lg font-bold text-white">Automated Verification Suite (149 Tests)</h3>
            </div>
            <p className="text-neutral-300">
              Quality assurance is enforced through an extensive automated testing suite (<code className="text-white font-mono">test/verify_system.js</code>). All 149 assertions execute in under 3 seconds with a 100% pass rate.
            </p>

            <div className="p-3 bg-neutral-900/60 rounded-xl border border-neutral-800">
              <span className="text-xs font-mono font-bold text-amber-400">Test Execution Command:</span>
              <pre className="mt-1 font-mono text-xs text-white">npm test</pre>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-neutral-900/40 border border-neutral-800 space-y-1">
                <div className="font-semibold text-white text-xs flex items-center justify-between">
                  <span>Auth Suite</span>
                  <Badge className="bg-emerald-950 text-emerald-400 border-emerald-800 text-[10px]">24/24</Badge>
                </div>
                <p className="text-[11px] text-neutral-400 leading-tight">Verifies valid logins, incorrect passwords, expired tokens, role guards, and forbidden endpoint escalations.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-900/40 border border-neutral-800 space-y-1">
                <div className="font-semibold text-white text-xs flex items-center justify-between">
                  <span>Employees & Family</span>
                  <Badge className="bg-emerald-950 text-emerald-400 border-emerald-800 text-[10px]">32/32</Badge>
                </div>
                <p className="text-[11px] text-neutral-400 leading-tight">Verifies CRUD operations on profiles, multiple family member additions, emergency flags, and bank info validation.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-900/40 border border-neutral-800 space-y-1">
                <div className="font-semibold text-white text-xs flex items-center justify-between">
                  <span>Attendance Matrix</span>
                  <Badge className="bg-emerald-950 text-emerald-400 border-emerald-800 text-[10px]">28/28</Badge>
                </div>
                <p className="text-[11px] text-neutral-400 leading-tight">Validates single-click clock-in, duplicate prevention on same calendar day, 30-day matrix bounds, and weekend status.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-900/40 border border-neutral-800 space-y-1">
                <div className="font-semibold text-white text-xs flex items-center justify-between">
                  <span>Leave Workflow</span>
                  <Badge className="bg-emerald-950 text-emerald-400 border-emerald-800 text-[10px]">25/25</Badge>
                </div>
                <p className="text-[11px] text-neutral-400 leading-tight">Tests 2-day monthly accrual, leave application submissions, HR approval transitions, and calendar synchronization.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-900/40 border border-neutral-800 space-y-1 sm:col-span-2">
                <div className="font-semibold text-white text-xs flex items-center justify-between">
                  <span>Payroll Calculation Suite</span>
                  <Badge className="bg-emerald-950 text-emerald-400 border-emerald-800 text-[10px]">40/40 (3 Worked Examples)</Badge>
                </div>
                <p className="text-[11px] text-neutral-400 leading-tight">Explicitly validates all 3 worked numerical examples, verifying weekend inclusion, 20% Basic PF deduction, PT 200 INR, and net salary precision.</p>
              </div>
            </div>

            <pre className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 font-mono text-xs text-neutral-300 overflow-x-auto leading-relaxed mt-2">
{`[OK] Database initialized and seeded successfully
[OK] Auth Suite: 24/24 passed
[OK] Employees & Family Suite: 32/32 passed
[OK] Attendance Matrix Suite: 28/28 passed
[OK] Leave Management Suite: 25/25 passed
[OK] Payroll Calculation Suite: 40/40 passed (All 3 worked examples verified)
-------------------------------------------------------------------------------
TOTAL ASSERTIONS: 149 PASSED | 0 FAILED | 0 SKIPPED (Exit Code 0)`}
            </pre>
          </div>

          {/* Bottom Collapse Button */}
          <div className="pt-6 border-t border-neutral-800 flex justify-center">
            <Button
              onClick={() => {
                setIsExpanded(false);
                const el = document.getElementById("hr-readme-box");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              variant="outline"
              className="border-neutral-700 bg-neutral-900 text-white hover:bg-neutral-800 text-xs px-6 py-2 rounded-lg font-mono flex items-center gap-1.5"
            >
              <span>Collapse Documentation</span>
              <ChevronUp className="h-4 w-4" />
            </Button>
          </div>

        </div>
      )}
    </section>
  );
}
