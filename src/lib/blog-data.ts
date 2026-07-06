export type BlogPost = {
  slug: string;
  title: string;
  content: string;
  thumbnail: string;
  category: string;
  created_at: string;
};

const img = (seed: string) =>
  `https://images.unsplash.com/${seed}?auto=format&fit=crop&w=1200&q=80`;

export const MOCK_BLOG_POSTS: BlogPost[] = [
  {
    slug: "getting-started-ai-projects",
    title: "How to Build Your First Final Year Project with AI",
    content: `
Building a final-year engineering project can feel overwhelming. From choosing the right tech stack to writing code and drafting documentation, the tasks pile up quickly. 

Here is a simple roadmap to guide you:
1. **Identify the Core Problem**: Don't build features you don't need. Keep the MVP (Minimum Viable Product) focused.
2. **Draft a Blueprint**: List the tools, frameworks, and architecture.
3. **Use AI Wisely**: Let the AI write boilerplate code and debug complex library configurations, but make sure you understand the architecture so you can explain it to your examiner.
4. **Prepare the Presentation early**: Most of your grade comes from the presentation and viva, not just the code.

By using ScholarBuild, you can automate report drafting, slide creation, and coding within minutes.
    `,
    thumbnail: img("photo-1531482615713-2afd69097998"),
    category: "Academic Guidelines",
    created_at: "2026-07-01T12:00:00Z",
  },
  {
    slug: "cracking-the-viva-exam",
    title: "Cracking the Project Viva: 5 Common Questions Answered",
    content: `
Your project viva is the ultimate test of whether you actually built the project yourself. Here are the 5 questions teachers ask the most:

1. **Why did you choose this database?** Be ready to justify SQL (relational schema, consistency) vs NoSQL (scalability, unstructured data).
2. **What is the flow of your application?** Explain the request-response lifecycle from the user interface down to the database triggers.
3. **How do you handle authentication securely?** Explain JWTs, session storage, and how your middleware handles route guarding.
4. **What are the limitations of your system?** Always admit boundaries—it shows maturity.
5. **How would you scale this in production?** Mention serverless deployment, caching, or load balancing.
    `,
    thumbnail: img("photo-1434030216411-0b793f4b4173"),
    category: "Viva Preparation",
    created_at: "2026-07-02T10:30:00Z",
  },
  {
    slug: "writing-perfect-project-reports",
    title: "Structure of a Grade-A Engineering Project Report",
    content: `
A standard final year project report must follow a precise structure to satisfy academic boards. Make sure to include:

- **Introduction**: Problem definition, objectives, and scope.
- **Literature Survey**: Existing systems, their drawbacks, and how your proposed system addresses them.
- **System Architecture**: Data flow diagrams (DFD), system modules, and entity-relationship diagrams (ERD).
- **Implementation**: Code snippets, algorithms, and key libraries used.
- **Results and Discussion**: Screenshots, test cases, and performance analysis.
- **Conclusion & Future Scope**: Summary of findings and potential next steps.
    `,
    thumbnail: img("photo-1451187580459-43490279c0fa"),
    category: "Report Writing",
    created_at: "2026-07-03T09:15:00Z",
  },
];
