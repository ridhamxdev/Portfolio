export type ProjectCategory = "AI / ML" | "Real-Time" | "Backend" | "Full Stack";

export interface Project {
    slug: string;
    title: string;
    tagline: string;
    summary: string;
    description: string;
    category: ProjectCategory;
    year: string;
    featured?: boolean;
    flagship?: boolean;
    techStack: string[];
    highlights: string[];
    facts?: { label: string; value: string }[];
    image?: string;
    links: {
        demo?: string;
        // omitted for private / closed-source products
        repo?: string;
    };
}

// Curated from github.com/ridhamxdev — live links verified, copy written from each repo's README.
export const projects: Project[] = [
    {
        slug: "enamdoc",
        title: "EnamDoc",
        tagline: "India's modern dental ecosystem — one app for dentists, students & patients",
        summary:
            "A production dental platform with AI X-ray analysis, video consultations, study material, appointments and payments — built solo and live on iOS, Android and web with real users.",
        description:
            "EnamDoc is a complete dental ecosystem connecting verified dentists, dental students, and patients on one platform — AI-assisted X-ray analysis, video consultations, study materials and quizzes, appointment booking, and payments. I designed, built, and shipped it solo: a 3D-animated marketing site (Three.js + GSAP) for acquisition, and a separate Pro Portal admin running on AWS DynamoDB and S3 with Firebase auth, OpenAI for diagnostics, and Razorpay for payments. It's in production today with active users across iOS, Android, and the web, and the site is SEO-optimised — clean metadata, structured data, sitemaps, and performance tuning to rank and convert.",
        category: "Full Stack",
        year: "2026",
        featured: true,
        flagship: true,
        techStack: ["Next.js", "TypeScript", "Three.js", "GSAP", "Firebase", "AWS", "OpenAI", "Razorpay"],
        highlights: [
            "AI X-ray analysis & video consultations",
            "Appointments + Razorpay payments end to end",
            "Pro Portal admin on AWS DynamoDB & S3",
            "SEO-optimised: metadata, structured data, sitemaps",
            "Shipped solo — live on iOS, Android & web with active users",
        ],
        facts: [
            { label: "Role", value: "Solo developer" },
            { label: "Status", value: "Production · active users" },
            { label: "Platforms", value: "iOS · Android · Web" },
            { label: "Focus", value: "SEO & performance" },
        ],
        image: "/projects/enamdoc.png",
        links: {
            demo: "https://enam-doc.vercel.app",
        },
    },
    {
        slug: "desifood",
        title: "The Desi Food",
        tagline: "Indian food, wellness & beauty — shipped worldwide",
        summary:
            "A cross-border e-commerce store delivering Indian groceries, wellness and beauty products from India to the US and beyond, with instant Algolia search and multi-currency checkout.",
        description:
            "The Desi Food is a cross-border e-commerce platform that ships Indian food, wellness, and beauty products from India to customers around the world. The storefront is a Next.js app with Algolia-powered instant search and a Radix-based component system, backed by a Django API. It handles a full multi-category catalogue, best-sellers, multi-currency pricing, cart and checkout, customer accounts, and order tracking — with worldwide shipping and secure payments front and centre.",
        category: "Full Stack",
        year: "2026",
        featured: true,
        techStack: ["Next.js", "TypeScript", "Django", "Algolia", "React Query", "Tailwind"],
        highlights: [
            "Algolia instant product search",
            "Multi-currency pricing & worldwide shipping",
            "Full catalogue, cart, checkout & order tracking",
            "Next.js storefront on a Django API",
        ],
        facts: [
            { label: "Role", value: "Full-stack developer" },
            { label: "Status", value: "Live in production" },
            { label: "Reach", value: "India → worldwide" },
        ],
        image: "/projects/desifood.png",
        links: {
            demo: "https://desi-food-next-js-local.vercel.app",
        },
    },
    {
        slug: "dreamtouch",
        title: "Dream Touch Studio",
        tagline: "A design studio's site — with a full CMS behind it",
        summary:
            "A marketing and portfolio site for an interior-design & architecture studio, with a NextAuth-protected CMS for portfolio and content, contact-to-email, and SEO baked in.",
        description:
            "Dream Touch Design Studio is a polished marketing and portfolio site for an interior-design and architecture practice. Behind the GSAP-animated front end sits a real CMS: NextAuth-protected admin, rich-text editing, drag-and-drop ordering, and image uploads to manage portfolio and inspiration content stored in MongoDB. Contact forms deliver over email via Nodemailer, and SEO is handled end to end with next-sitemap and a Google indexing workflow.",
        category: "Full Stack",
        year: "2026",
        featured: true,
        techStack: ["Next.js", "TypeScript", "MongoDB", "NextAuth", "GSAP", "Tailwind"],
        highlights: [
            "CMS for portfolio & inspiration (rich-text, uploads, reordering)",
            "NextAuth-protected admin area",
            "Contact forms delivered over email",
            "SEO — sitemaps + Google indexing workflow",
        ],
        facts: [
            { label: "Role", value: "Full-stack developer" },
            { label: "Status", value: "Live in production" },
            { label: "Type", value: "Client product" },
        ],
        image: "/projects/dreamtouch.png",
        links: {
            demo: "https://dreamtouch-client.vercel.app",
        },
    },
    {
        slug: "intellidash",
        title: "IntelliDash",
        tagline: "Turn any spreadsheet into an analytics product",
        summary:
            "Upload a CSV or Excel file and get instant exploratory analysis, machine-learning forecasts, and a shareable PDF report — no BI license required.",
        description:
            "IntelliDash is an enterprise-grade analytics platform that takes raw spreadsheets and returns a complete analytical view: data exploration, interactive charts, one-click ML forecasting on any numeric column, and downloadable PDF reports for stakeholders. It was built to be a free, open-source alternative to tools like Tableau and Power BI, with a Python machine-learning backend served through FastAPI and a React dashboard.",
        category: "AI / ML",
        year: "2026",
        featured: true,
        techStack: ["React", "FastAPI", "Python", "scikit-learn", "Pandas", "Render"],
        highlights: [
            "Instant EDA on any uploaded CSV / Excel dataset",
            "One-click ML forecasting for any numeric column",
            "Auto-generated, shareable PDF reports",
            "Enterprise-style UI deployed across Vercel + Render",
        ],
        image: "/projects/intellidash.png",
        links: {
            demo: "https://intellidash-ten.vercel.app",
            repo: "https://github.com/ridhamxdev/Intellidash",
        },
    },
    {
        slug: "energence",
        title: "Energence",
        tagline: "Forecast renewable energy before it's generated",
        summary:
            "A machine-learning platform that predicts solar and wind output from live weather data to help operators plan grid load and maximise yield.",
        description:
            "Energence is a renewable-energy optimisation platform that uses machine learning to predict and optimise solar and wind power generation. A data-ingestion pipeline pulls real-time weather data, a decoupled inference service runs the prediction models asynchronously, and a Redis cache keeps recent forecasts fast to serve. The dashboard lets operators monitor systems and maximise output against changing weather conditions.",
        category: "AI / ML",
        year: "2025",
        techStack: ["React", "Django", "TensorFlow", "PostgreSQL", "Redis", "Celery"],
        highlights: [
            "Real-time solar & wind generation forecasting",
            "Async inference service decoupled with Celery task queues",
            "Redis caching layer for low-latency predictions",
            "Interactive monitoring dashboards",
        ],
        image: "/projects/energence.png",
        links: {
            demo: "https://energence-ochre.vercel.app",
            repo: "https://github.com/ridhamxdev/Energence",
        },
    },
    {
        slug: "synapse",
        title: "Synapse",
        tagline: "Real-time messaging engineered for throughput",
        summary:
            "An event-driven messaging platform built on Next.js 15 and Socket.io — sub-millisecond delivery, media sharing, typing indicators, and a Prisma-optimised data layer.",
        description:
            "Synapse is a real-time communication platform where the engineering lives in the backend. Socket.io handles stateful connections for live events while REST endpoints manage stateless resources, and Prisma optimises complex joins on MySQL for fast message-history retrieval. Custom adapters broadcast events across connections, composite indexes keep history queries quick, and stream-processing middleware handles secure media uploads.",
        category: "Real-Time",
        year: "2025",
        featured: true,
        techStack: ["Next.js 15", "Socket.io", "Prisma", "MySQL", "Clerk", "TypeScript"],
        highlights: [
            "Bidirectional real-time event streams over Socket.io",
            "Composite-indexed schema for fast message history",
            "Stream-processing middleware for media uploads",
            "Role-based access control on the API layer",
        ],
        links: {
            repo: "https://github.com/ridhamxdev/Synapse",
        },
    },
    {
        slug: "poker-ai-agent",
        title: "Poker AI Agent",
        tagline: "Game-theory poker that learns not to be exploited",
        summary:
            "A poker engine whose AI uses Counterfactual Regret Minimization to approach Nash equilibrium, model opponents, and play live multiplayer hands in real time.",
        description:
            "A poker application featuring AI opponents driven by Counterfactual Regret Minimization (CFR). The agent traverses the game tree to compute regret for each action — fold, call, raise — and refines its strategy over time to minimise exploitability in an imperfect-information game. A real-time opponent-modelling system adapts to player aggression and bluffing frequency, and an event-driven socket layer keeps human and AI game state in sync.",
        category: "AI / ML",
        year: "2026",
        featured: true,
        techStack: ["TypeScript", "Node.js", "CFR", "Socket.io", "MongoDB", "React"],
        highlights: [
            "CFR strategy that approximates Nash equilibrium",
            "Adaptive opponent modelling for aggression & bluffs",
            "Bluff detection and execution",
            "Real-time multiplayer state synchronisation",
        ],
        links: {
            repo: "https://github.com/ridhamxdev/ai-poker-agent",
        },
    },
    {
        slug: "tasknexus",
        title: "TaskNexus",
        tagline: "A backend that never drops a transaction",
        summary:
            "A NestJS notification and transaction backend built for reliability — ACID-safe operations, RabbitMQ queues, and Redis caching for fault tolerance at volume.",
        description:
            "TaskNexus is a backend system engineered with NestJS to process financial operations and deliver email notifications reliably. It uses the repository pattern for database abstraction and RabbitMQ to decouple the core transaction engine from side-effect services like notifications, so the system stays available even under load. ACID-compliant transaction managers protect data integrity, and Redis caching cuts database pressure on high-frequency reads.",
        category: "Backend",
        year: "2025",
        techStack: ["NestJS", "TypeScript", "MySQL", "Sequelize", "RabbitMQ", "Redis"],
        highlights: [
            "ACID-compliant transaction processing",
            "RabbitMQ queues decouple side effects from the core",
            "Redis caching for high-frequency reads",
            "Modular, microservices-ready structure",
        ],
        links: {
            repo: "https://github.com/ridhamxdev/TaskNexus",
        },
    },
    {
        slug: "lead-gen-crm",
        title: "Lead Gen CRM",
        tagline: "A sales pipeline with an AI copywriter built in",
        summary:
            "A multi-user CRM to track leads through the pipeline, watch conversion analytics, and generate Gemini-powered WhatsApp messages per lead.",
        description:
            "A full-featured lead-management system: sign up, add and filter leads, move them through stages from New Lead to Successfully Closed, and read dashboard analytics for total leads, order value, and conversion rate. A Gemini-powered generator drafts WhatsApp outreach per lead, and JWT sessions stored in HTTP-only cookies keep users logged in across restarts. Built on Next.js 15 with a Turso (libSQL) database.",
        category: "Full Stack",
        year: "2026",
        techStack: ["Next.js 15", "TypeScript", "Turso", "Google Gemini", "JWT", "Tailwind"],
        highlights: [
            "Multi-user auth with year-long persistent sessions",
            "Pipeline stages from New Lead to Closed",
            "Gemini-generated WhatsApp message drafts",
            "Dashboard analytics: leads, value, conversion rate",
        ],
        image: "/projects/crm.png",
        links: {
            demo: "https://crm-for-lead-generation-jl4b.vercel.app",
            repo: "https://github.com/ridhamxdev/crm-for-lead-generation",
        },
    },
    {
        slug: "highway-delite",
        title: "Highway Delite",
        tagline: "Book travel experiences across India",
        summary:
            "A travel-booking platform for experiences like kayaking and sunrise treks — browse, pick a date and slot, and book end-to-end with real-time availability and promo codes.",
        description:
            "Highway Delite is a full-stack travel-experience booking platform. Users browse experiences, choose a date and time slot, apply promo codes, and complete a booking against real-time slot availability. The React + TypeScript frontend talks to a Node.js / Express API backed by MongoDB, with everything wired up end-to-end including seed data.",
        category: "Full Stack",
        year: "2025",
        techStack: ["React", "TypeScript", "Node.js", "Express", "MongoDB", "Tailwind"],
        highlights: [
            "Real-time slot availability per experience",
            "Date & time-slot selection flow",
            "Promo-code support at checkout",
            "End-to-end booking with seeded catalogue",
        ],
        links: {
            demo: "https://bookit-app-eta.vercel.app",
            repo: "https://github.com/ridhamxdev/bookit-app",
        },
    },
    {
        slug: "chatlive",
        title: "ChatLive",
        tagline: "Multi-channel chat with live presence",
        summary:
            "A real-time chat app with multiple channels, handle validation, persistent history, and auto-reconnection — built on Next.js and Socket.io.",
        description:
            "ChatLive is a real-time chat application with multiple channels (General, Tech Talk, Random), a user-handle validation and registration flow, and persistent message history loaded on channel join. Socket.io powers live messaging with join/leave notifications and connection-status indicators, and auto-reconnection keeps sessions resilient. Built on Next.js 14 with full TypeScript type safety.",
        category: "Real-Time",
        year: "2025",
        techStack: ["Next.js 14", "TypeScript", "Socket.io", "DaisyUI", "Tailwind"],
        highlights: [
            "Multiple live channels with presence",
            "Handle validation & registration",
            "Persistent history loaded per channel",
            "Auto-reconnection with status indicators",
        ],
        image: "/projects/chatlive.png",
        links: {
            demo: "https://chat-live-mauve.vercel.app",
            repo: "https://github.com/ridhamxdev/ChatLive",
        },
    },
    {
        slug: "slotswapper",
        title: "SlotSwapper",
        tagline: "Trade time slots, peer to peer",
        summary:
            "A peer-to-peer scheduling app where users request and approve swaps of each other's time slots, secured with JWT auth on a Prisma + Postgres backend.",
        description:
            "SlotSwapper is a peer-to-peer time-slot swapping app. Users browse available slots, request a swap, and approve incoming requests — backed by a Node.js / Express / TypeScript API with Prisma over PostgreSQL and JWT authentication. A React + Vite frontend uses React Query and Zustand for data and state, with the whole stack runnable through Docker Compose.",
        category: "Full Stack",
        year: "2025",
        techStack: ["React", "Vite", "Express", "Prisma", "PostgreSQL", "Docker"],
        highlights: [
            "Request / approve peer-to-peer slot swaps",
            "JWT auth with bcrypt-hashed credentials",
            "Prisma schema over Dockerised Postgres",
            "React Query + Zustand on the frontend",
        ],
        image: "/projects/swappable.png",
        links: {
            demo: "https://swappable-service.vercel.app",
            repo: "https://github.com/ridhamxdev/SwappableService",
        },
    },
    {
        slug: "authora",
        title: "Authora",
        tagline: "A MERN store, built from the ground up",
        summary:
            "A full e-commerce platform covering authentication, cart and checkout, and product search and filtering on a modular MERN architecture.",
        description:
            "Authora is a fully functional e-commerce solution delivering the full shopping flow from product discovery to checkout. It follows a RESTful API design, a component-based React frontend for reuse, and a NoSQL schema shaped for flexible product attributes — with user authentication, profile management, cart and checkout, and product search and filtering.",
        category: "Full Stack",
        year: "2026",
        techStack: ["MongoDB", "Express", "React", "Node.js", "NestJS"],
        highlights: [
            "Authentication & profile management",
            "Cart and checkout flow",
            "Product search and filtering",
            "Flexible NoSQL product schema",
        ],
        links: {
            repo: "https://github.com/ridhamxdev/Authora",
        },
    },
    {
        slug: "risk-aware-poker",
        title: "Risk-Aware Poker AI",
        tagline: "Max-EV play, with a risk manager on top",
        summary:
            "A research agent that layers explicit risk management over an EV-maximising poker bot — hard guardrails, a risk-adjusted utility, and a bankroll floor.",
        description:
            "Risk-Aware Poker AI addresses the risk-management gap in prior poker-AI work by adding an explicit risk layer to the decision engine. An analyst picks the max-EV action; a 'boss' risk layer then applies a hard guardrail (force-fold when the bet-to-bankroll ratio crosses a threshold), a soft risk utility that ranks actions by EV minus a penalty on risk and variance, and an optional bankroll floor. A Flask API exposes the decision endpoint to a React frontend.",
        category: "AI / ML",
        year: "2025",
        techStack: ["Python", "Flask", "React", "NumPy"],
        highlights: [
            "Hard guardrail force-folds on bankroll risk",
            "Risk-adjusted utility: EV − λ·(risk + variance)",
            "Configurable bankroll floor",
            "Sweepable thresholds for experimentation",
        ],
        links: {
            repo: "https://github.com/ridhamxdev/risk_aware",
        },
    },
    {
        slug: "taskglitch",
        title: "TaskGlitch",
        tagline: "Rank your sales tasks by the revenue they return",
        summary:
            "A sales-productivity dashboard that scores every task by ROI — total revenue, time efficiency, revenue per hour, and a grade — with filtering and CSV export.",
        description:
            "TaskGlitch is a sales-productivity tracker that turns a task list into a performance dashboard. Each task carries revenue, time, and a computed ROI, rolled up into headline metrics — total revenue, time efficiency, revenue per hour, average ROI, and an overall grade. Tasks can be searched, filtered by status and priority, edited inline, and exported to CSV. Built with React, TypeScript, and Material UI (X Charts + date pickers) on a fast Vite build.",
        category: "Full Stack",
        year: "2025",
        techStack: ["React", "TypeScript", "Vite", "MUI", "MUI X Charts", "Day.js"],
        highlights: [
            "ROI scoring across revenue, time & efficiency",
            "Search + status / priority filtering",
            "Inline task editing and CSV export",
            "Headline KPIs with an overall grade",
        ],
        image: "/projects/erino.png",
        links: {
            demo: "https://erino-task.vercel.app",
            repo: "https://github.com/ridhamxdev/erino_task",
        },
    },
    {
        slug: "vibecommerce",
        title: "VibeCommerce",
        tagline: "A clean full-stack shopping cart",
        summary:
            "A mock e-commerce cart with a typed React frontend and an Express + SQLite backend — browse, add, update quantities, and run a mock checkout that persists.",
        description:
            "VibeCommerce is a full-stack mock e-commerce cart demonstrating clean architecture and database integration. The React + TypeScript + Tailwind frontend handles browsing, quantity steppers, and toast feedback, while a Node.js + Express + TypeScript backend exposes REST APIs for products, cart CRUD, and checkout with SQLite persistence. State is managed through React Context in a feature-based structure.",
        category: "Full Stack",
        year: "2025",
        techStack: ["React", "TypeScript", "Express", "SQLite", "Tailwind", "Vite"],
        highlights: [
            "Product browsing with quantity steppers",
            "Cart CRUD + mock checkout, persisted to SQLite",
            "REST APIs in a feature-based structure",
            "React Context state with toast feedback",
        ],
        links: {
            repo: "https://github.com/ridhamxdev/VibeCommerce",
        },
    },
];

export const categories: ("All" | ProjectCategory)[] = [
    "All",
    "AI / ML",
    "Real-Time",
    "Backend",
    "Full Stack",
];

export const featuredProjects = projects.filter((p) => p.featured);
