export interface ResumeProfile {
    name: string;
    role: string;
    location: string;
    availability: string;
    summary: string;
}

export interface ResumeLink {
    name: string;
    href: string;
    label: string;
}

export interface ExperienceEntry {
    role: string;
    org: string;
    period: string;
    summary: string;
    points: string[];
    stack: string[];
}

export interface SkillGroup {
    label: string;
    items: string[];
}

export interface EducationEntry {
    school: string;
    degree: string;
    period: string;
}

export const profile: ResumeProfile = {
    name: "Ridham Goyal",
    role: "Full-Stack & Systems Engineer",
    location: "Bengaluru, IN",
    availability: "Open to full-time roles and freelance, 2026",
    summary:
        "I build the parts of an app users never see but always feel: real-time backends, event-driven architectures, and AI systems that have to actually make a call. Seventeen projects shipped, eleven live right now.",
};

export const links: ResumeLink[] = [
    {
        name: "LinkedIn",
        href: "https://www.linkedin.com/in/ridham-goyal-025b422a0/",
        label: "/ridham-goyal",
    },
    {
        name: "GitHub",
        href: "https://github.com/ridhamxdev",
        label: "@ridhamxdev",
    },
    {
        name: "X",
        href: "https://x.com/Ridham572806",
        label: "@Ridham572806",
    },
];

export const experience: ExperienceEntry[] = [
    {
        role: "Solo Developer",
        org: "EnamDoc",
        period: "2026 - Present",
        summary:
            "A production dental platform connecting dentists, students and patients, designed, built and shipped solo.",
        points: [
            "Live on iOS, Android and web with active users",
            "AI X-ray analysis, video consultations, appointments and Razorpay payments end to end",
            "Pro Portal admin on AWS DynamoDB and S3 with Firebase auth and OpenAI diagnostics",
            "SEO end to end: metadata, structured data, sitemaps, performance tuning",
        ],
        stack: ["Next.js", "TypeScript", "Three.js", "AWS", "Firebase", "OpenAI", "Razorpay"],
    },
    {
        role: "Freelance Full-Stack Engineer",
        org: "Client products",
        period: "2025 - Present",
        summary:
            "Client sites and products shipped to production, from CMS-backed marketing to cross-border commerce.",
        points: [
            "The Desi Food: cross-border e-commerce with Algolia instant search, multi-currency checkout and worldwide shipping, live in production",
            "Dream Touch Studio: marketing site with a NextAuth-protected CMS, rich-text editing, uploads and email delivery, live for a design studio",
            "EL LAZINA: cinematic Three.js concept site for a culture-led cafe, shipped as a client pitch",
        ],
        stack: ["Next.js", "Django", "Algolia", "MongoDB", "GSAP", "Tailwind"],
    },
    {
        role: "Independent Systems & AI Projects",
        org: "Self-directed",
        period: "2025 - 2026",
        summary:
            "Deep dives into the hard parts: throughput, reliability and decision-making under uncertainty.",
        points: [
            "Synapse: real-time messaging engine on Socket.io with composite-indexed history and stream media middleware",
            "TaskNexus: NestJS transaction backend with ACID guarantees, RabbitMQ queues and Redis caching",
            "Poker AI: Counterfactual Regret Minimization agent approaching Nash equilibrium with live opponent modelling",
            "Energence: ML platform forecasting solar and wind output from live weather with async Celery inference",
        ],
        stack: ["NestJS", "Socket.io", "RabbitMQ", "Redis", "TensorFlow", "Python"],
    },
];

export const skills: SkillGroup[] = [
    {
        label: "Languages",
        items: ["TypeScript", "JavaScript", "Python", "SQL", "Java"],
    },
    {
        label: "Frontend & Motion",
        items: ["React", "Next.js", "Three.js / R3F", "GSAP", "Tailwind CSS"],
    },
    {
        label: "Backend & Data",
        items: [
            "Node.js",
            "NestJS",
            "Express",
            "Django",
            "FastAPI",
            "Socket.io",
            "Prisma",
            "PostgreSQL",
            "MySQL",
            "MongoDB",
            "Redis",
            "RabbitMQ",
        ],
    },
    {
        label: "AI / ML & Infra",
        items: [
            "TensorFlow",
            "scikit-learn",
            "OpenAI API",
            "Gemini",
            "Docker",
            "AWS",
            "Firebase",
            "Vercel",
        ],
    },
];

export const stats: [string, string][] = [
    ["17", "Projects shipped"],
    ["11", "Live deployments"],
    ["3", "Client products in production"],
    ["2026", "Open to work"],
];

// Add education here (school, degree, period); the section renders automatically.
export const education: EducationEntry[] = [];

// Resolved against src/data/projects.ts by the resume page.
export const selectedSlugs: string[] = [
    "enamdoc",
    "synapse",
    "poker-ai-agent",
    "intellidash",
    "tasknexus",
];
