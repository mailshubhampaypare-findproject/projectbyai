export type PrebuiltProject = {
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  price: number;
  category: string;
  thumbnail: string;
  screenshots: string[];
  youtubeId: string;
  tech: string[];
  buyUrl: string;
};

const img = (seed: string) =>
  `https://images.unsplash.com/${seed}?auto=format&fit=crop&w=1200&q=80`;

export const PREBUILT_PROJECTS: PrebuiltProject[] = [
  {
    slug: "smart-attendance",
    title: "Smart Attendance System with Face Recognition",
    description: "Automated attendance using OpenCV & Python with a Flask dashboard.",
    longDescription:
      "A complete college attendance system that detects and recognizes student faces via webcam, marks attendance in a database and exports reports as CSV/Excel. Includes admin dashboard, class management, and email notifications.",
    price: 49,
    category: "Machine Learning",
    thumbnail: img("photo-1526374965328-7f61d4dc18c5"),
    screenshots: [
      img("photo-1551288049-bebda4e38f71"),
      img("photo-1516321318423-f06f85e504b3"),
      img("photo-1517245386807-bb43f82c33c4"),
    ],
    youtubeId: "dQw4w9WgXcQ",
    tech: ["Python 3.10", "OpenCV", "Flask", "SQLite", "Bootstrap"],
    buyUrl: "https://buy.stripe.com/test_scholarly_attendance",
  },
  {
    slug: "ecom-mern",
    title: "Full-Stack E-Commerce Store (MERN)",
    description: "MongoDB + Express + React + Node store with Stripe payments.",
    longDescription:
      "Production-grade e-commerce with product catalog, cart, checkout via Stripe, order tracking, admin dashboard for products/orders, JWT auth and image uploads.",
    price: 79,
    category: "Web Development",
    thumbnail: img("photo-1607082348824-0a96f2a4b9da"),
    screenshots: [
      img("photo-1556742049-0cfed4f6a45d"),
      img("photo-1563013544-824ae1b704d3"),
      img("photo-1611926653458-09294b3142bf"),
    ],
    youtubeId: "dQw4w9WgXcQ",
    tech: ["Node 20", "React 18", "MongoDB", "Express", "Stripe"],
    buyUrl: "https://buy.stripe.com/test_scholarly_mern",
  },
  {
    slug: "chatbot-nlp",
    title: "AI College Enquiry Chatbot",
    description: "NLP chatbot for admissions with intent classification.",
    longDescription:
      "A trained NLP chatbot that answers admission, fees, and course queries. Built with Python, TensorFlow, and a React chat widget. Includes training notebook and admin analytics.",
    price: 39,
    category: "AI / NLP",
    thumbnail: img("photo-1531482615713-2afd69097998"),
    screenshots: [
      img("photo-1573497019940-1c28c88b4f3e"),
      img("photo-1526379095098-d400fd0bf935"),
      img("photo-1584697964358-3e14ca57658b"),
    ],
    youtubeId: "dQw4w9WgXcQ",
    tech: ["Python 3.11", "TensorFlow", "NLTK", "React", "FastAPI"],
    buyUrl: "https://buy.stripe.com/test_scholarly_chatbot",
  },
  {
    slug: "hospital-mgmt",
    title: "Hospital Management System",
    description: "Patients, appointments, billing — Django + PostgreSQL.",
    longDescription:
      "End-to-end hospital management with doctor scheduling, patient records, billing, prescription printing, and role-based access control.",
    price: 59,
    category: "Web Development",
    thumbnail: img("photo-1519494026892-80bbd2d6fd0d"),
    screenshots: [
      img("photo-1587351021759-3e566b6af7cc"),
      img("photo-1516549655169-df83a0774514"),
      img("photo-1538108149393-fbbd81895907"),
    ],
    youtubeId: "dQw4w9WgXcQ",
    tech: ["Python 3.11", "Django 5", "PostgreSQL", "Bootstrap"],
    buyUrl: "https://buy.stripe.com/test_scholarly_hospital",
  },
  {
    slug: "iot-weather",
    title: "IoT Weather Station Dashboard",
    description: "ESP32 sensor data streamed to a live React dashboard.",
    longDescription:
      "Collect temperature, humidity, and air quality from ESP32 sensors, push to MQTT broker, and visualize on a React dashboard with historical charts and alerts.",
    price: 45,
    category: "IoT",
    thumbnail: img("photo-1504198458649-3128b932f49e"),
    screenshots: [
      img("photo-1451187580459-43490279c0fa"),
      img("photo-1518770660439-4636190af475"),
      img("photo-1508614589041-895b88991e3e"),
    ],
    youtubeId: "dQw4w9WgXcQ",
    tech: ["ESP32", "MQTT", "React", "Node.js", "InfluxDB"],
    buyUrl: "https://buy.stripe.com/test_scholarly_iot",
  },
  {
    slug: "blog-cms",
    title: "Personal Blog & CMS (Next.js)",
    description: "Markdown blog with an admin editor and SEO out of the box.",
    longDescription:
      "A modern personal blog and content platform with markdown editor, image uploads, tag system, comments, and static-first performance.",
    price: 29,
    category: "Web Development",
    thumbnail: img("photo-1499750310107-5fef28a66643"),
    screenshots: [
      img("photo-1467232004584-a241de8bcf5d"),
      img("photo-1432888622747-4eb9a8efeb07"),
      img("photo-1517842645767-c639042777db"),
    ],
    youtubeId: "dQw4w9WgXcQ",
    tech: ["Next.js 14", "TypeScript", "Prisma", "PostgreSQL"],
    buyUrl: "https://buy.stripe.com/test_scholarly_blog",
  },
];

export const PRICING_PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: 99,
    tokens: 200,
    tagline: "For occasional assignments",
    features: [
      "200 AI tokens / month",
      "Unlimited projects",
      "AI code & report generation",
      "Basic viva questions",
      "Email support",
    ],
    highlight: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: 249,
    tokens: 800,
    tagline: "Best for final-year students",
    features: [
      "800 AI tokens / month",
      "Everything in Starter",
      "Unlimited slide decks",
      "Interview & viva pack",
      "Priority AI queue",
    ],
    highlight: true,
  },
  {
    id: "campus",
    name: "Campus",
    price: 499,
    tokens: 2500,
    tagline: "For serious builders & teams",
    features: [
      "2 500 AI tokens / month",
      "Everything in Pro",
      "Team collaboration",
      "Custom branded reports",
      "Dedicated support",
    ],
    highlight: false,
  },
];
