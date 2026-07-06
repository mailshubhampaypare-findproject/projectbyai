# Task Checklist: ProjectByAI (Phase 2)

- [x] **Database & Framework Transition**
  - [x] Replace Next.js shell with Vite + TanStack Start framework
  - [x] Integrate standard `@ai-sdk/google` (Gemini 1.5 Flash) natively
  - [x] Link hosted Supabase cloud instance via local `.env` keys
  - [x] Run database schema triggers and tables (`profiles`, `projects`, `chat_messages`)

- [x] **Project Library & Admin Panel Integration**
  - [x] Rename "Prebuilt Projects" to "Project Library" in sidebar and page titles
  - [x] Create the `library_projects` and `blog_posts` tables schema
  - [x] Build the Admin Panel route at `/admin` with credentials auth check
  - [x] Connect database so admin uploads populate dynamically into Project Library
  - [x] Build policy routes: Privacy Policy (`/privacy`), Terms (`/terms`), Refund (`/refund`), and Contact (`/contact`)

- [x] **Blog and Home Page Enhancements**
  - [x] Create blog grid page (`/blog`) with search, categories, and 3-column rows
  - [x] Create blog details page (`/blog/$slug`) displaying title, date, large banner, and content
  - [x] Redesign footer layout: centered copyright, right-aligned vertical links, left-aligned logo & social icons (IG, YT, LinkedIn)
  - [x] Add "FAQ" accordion section (5-7 expandable questions) on Landing page
  - [x] Add "How it works" 6-step text box grid (3 boxes per row, matching theme) on Landing page

- [x] **Theme & Admin Dashboard Refinements**
  - [x] Make text-gradient solid yellow in light mode for readability
  - [x] Change light mode sidebar background color to white/light-gray with dark text
  - [x] Redesign Admin Dashboard background to off-white and text to charcoal
  - [x] Render live projects and blogs in a 3-column grid layout inside Admin Dashboard
  - [x] Implement modal forms for adding/editing projects and blogs in Admin Panel
  - [x] Add individual project FAQs column to database schema (`faqs` JSONB field)
  - [x] Build interactive project FAQ builder in Admin Panel project details modal
  - [x] Render custom project-specific FAQs at the bottom of the project details page

- [x] **CMS Operations (Uploader & Category selector)**
  - [x] Build category selector: dropdown list of existing + custom write-in input
  - [x] Wire up Supabase Storage client-side uploads for project thumbnails & blog banner thumbnails
  - [x] Integrate screenshot uploader appending multiple image URLs dynamically
  - [x] Embed zip uploader saving downloadable project ZIP codes straight to Supabase Storage
  - [x] Program YouTube video link parser to automatically extract the 11-char video ID from any URL
  - [x] Build a Rich Markdown toolbar editor: click to wrap selection in Bold, H1, H2, H3, lists
  - [x] Integrate image embed button inside Markdown editor uploading images dynamically to bucket

- [x] **Project Detail Redesigns**
  - [x] Remove the standard full source code/reports details bullet list from purchase card
  - [x] Keep the purchase price & Buy button card as a sticky card stacked in the right column
  - [x] Make the project description font size smaller (`text-sm`)
  - [x] Create clickable screenshots that open in a medium-sized lightbox modal with a Close button
  - [x] Convert Project FAQs into an interactive collapsible accordion (only showing the question until clicked)
  - [x] Style FAQ questions with white text in dark mode (`text-slate-900 dark:text-white`) for perfect visibility

- [x] **WYSIWYG Rich Text Blog Editor Integration**
  - [x] Convert blog text area into a modern, native HTML `contenteditable` rich text box
  - [x] Add font family dropdown selector (Sans-serif, Serif, Monospace)
  - [x] Integrate color-picker input allowing text color changes dynamically
  - [x] Build Heading formatting buttons (H1, H2, H3, H4, P)
  - [x] Integrate lists (ordered/numbered and unordered/bulleted)
  - [x] Add alignment actions (Left, Center, Right, Justify)
  - [x] Build inline hyperlink insert tool
  - [x] Implement inline image upload: select image, save to Supabase Storage, and embed directly at cursor position between text paragraphs
  - [x] Upgrade blog details rendering to safely parse rich HTML outputs with markdown compatibility fallback
  - [x] Style images inside WYSIWYG editor to display nicely (`max-width: 320px`, centered layout) without breaking paragraph flow
  - [x] Add responsive image styles for live blog details views to prevent text alignment breakage
  - [x] Expand blog editor modal layout to a high-end 6xl viewport container taking 90% height
  - [x] Restructure Title and URL Slug inputs into a dynamic side-by-side grid layout to free up massive editing canvas
  - [x] Prevent focus loss and text selection dropping when clicking toolbar formatting items
  - [x] Correct heading tags formatting arguments (`<h1>` tag values wrapper instead of raw strings)
  - [x] Style inline hyperlinks with high-visibility blue color and underline states

- [x] **Public Project Library Catalog Page**
  - [x] Create the new public route `/projects` displaying all dynamic library projects
  - [x] Place search bar input at the top to filter catalog live
  - [x] Add category tag selectors below search inputs to filter projects dynamically
  - [x] Render card grids displaying thumbnails, badges, and prices for all live database projects
  - [x] Program active auth redirection: if guest clicks card, route them to signup flow, then automatically redirect back to the specific project detail workspace
  - [x] Append Project Library link into landing and main footer menus directly below Blog

- [x] **Razorpay Payment Gateway Integration**
  - [x] Configure client-side Razorpay SDK dynamic script loading inside React components
  - [x] Set up payment options (merchant name, plan details, user prefilled details, custom branding blue theme) using test keys
  - [x] Connect Razorpay overlay launch to all **Buy now** buttons on Project Library detail pages
  - [x] Connect Razorpay overlay launch to all **Choose package** buttons on AI token pricing cards
  - [x] Program dynamic database update: automatically increment purchased AI tokens count inside user profile upon success

- [x] **Workspace Dashboard (My Projects) Split**
  - [x] Segregate My Projects dashboard list into two clear visual categories: "Created with AI" & "Purchased Projects"
  - [x] Dynamically hook successful library purchases to insert a corresponding row record in the user workspace `projects` table
  - [x] Store project ZIP file download links directly inside the database rows
  - [x] Render direct **Download Source Code (.ZIP)** buttons on purchased project cards under the workspace

- [x] **Advanced AI Project Wizard Creation Flow**
  - [x] Re-architect project setup wizard to support conditional step execution based on chosen Course/Stream
  - [x] Implement multi-select checkboxes for Frontend & Backend tech stacks (with preference custom entry)
  - [x] Implement multi-select checkboxes for Programming Languages, Databases, and Core Application Features
  - [x] Build sub-configuration panel for Admin Roles permissions details mapping
  - [x] Structure multi-select checklist for UI Theme designs and AI Deliverables options
  - [x] Design Summary screen converting selections into structured prompt templates loaded directly to AI chat builder

- [x] **Workspace Chat Upgrades & Dual-Panel Layout**
  - [x] Integrate paperclip attachments button supporting dynamic image/PDF uploads to Supabase uploads bucket
  - [x] Embed multi-upload preview badge layout above chat input form
  - [x] Implement regex message parsing to render interactive download cards for PDFs and click-to-expand lightbox modals for screenshots
  - [x] Redesign layout structure to allow full-width maximize/minimize toggle buttons (Chat Only, Split View, Code Only) on both panes
  - [x] Upgrade chat API model call to Gemini 1.5 Pro to process code edits and modal attachment details with SOTA logical reasoning
  - [x] Add hierarchical folder-wise tree explorer explorer side navigation inside Code builder tab
  - [x] Integrate optional/fallback DeepSeek API provider routing based on DEEPSEEK_API_KEY environment configuration
