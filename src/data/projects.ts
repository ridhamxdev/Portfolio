export interface Project {
    slug: string;
    title: string;
    shortDescription: string;
    fullDescription: string;
    role: "Backend" | "AI Agent" | "Full Stack";
    techStack: string[];

    architecture?: {
        diagram?: string;
        description: string;
    };

    systemDesign?: {
        headline: string;
        points: string[];
    };

    aiFeatures?: {
        modelUsed?: string;
        ragUsage?: string;
        agentWorkflow?: string;
    };

    challenges?: string[];
    keyFeatures: string[];

    links: {
        demo?: string;
        repo?: string;
        video?: string;
    };

    heroImage?: string;
    gallery?: string[];
}

export const projects: Project[] = [
    {
        slug: "synapse",
        title: "Synapse",
        shortDescription: "High-performance real-time messaging backend with Socket.io custom protocols.",
        fullDescription: "Synapse is a robust backend architecture designed for scalable, real-time communication. While it includes a frontend, the core engineering lies in its event-driven backend which leverages Socket.io for sub-millisecond message delivery and Prisma ORM for complex relationship management. The system handles substantial throughput for features like typing indicators, message queues, and media uploads.",
        role: "Backend",
        techStack: ["Node.js", "Socket.io", "Prisma", "MySQL", "Clerk", "TypeScript"],
        architecture: {
            description: "Event-driven backend architecture. Socket.io handles stateful connections for real-time events, while REST endpoints manage stateless resource operations. Prisma ORM optimizes complex join queries on MySQL to ensure low-latency data retrieval."
        },
        systemDesign: {
            headline: "Scalable Real-Time Infrastructure",
            points: [
                "Engineered custom Socket.io adapters for distributed event broadcasting.",
                "Optimized database schema with composite indexes for rapid message history retrieval.",
                "Implemented secure file handling middleware with stream-processing for media uploads."
            ]
        },
        keyFeatures: [
            "Real-time bidirectional event streams",
            "Optimized SQL query performance",
            "Secure media stream handling",
            "RBAC middleware implementation"
        ],
        links: {
            repo: "https://github.com/ridhamxdev/Synapse.git"
        }
    },
    {
        slug: "energence",
        title: "Energence",
        shortDescription: "AI-driven renewable energy prediction platform.",
        fullDescription: "Energence is a comprehensive platform designed to optimize renewable energy usage. It leverages machine learning models to predict solar and wind power generation, allowing for better grid management and efficiency.",
        role: "Full Stack",
        techStack: ["React", "Django", "TensorFlow", "PostgreSQL", "Redis"],
        architecture: {
            description: "Microservices architecture separating the ML prediction engine from the user-facing dashboard. Data ingestion pipeline processes real-time weather data."
        },
        systemDesign: {
            headline: "Scalable Prediction Engine",
            points: [
                "Decoupled ML inference service using Celery for asynchronous task processing.",
                "Redis caching layer to store recent predictions and reduce database load.",
                "REST API design for seamless frontend-backend communication."
            ]
        },
        keyFeatures: [
            "Real-time energy generation forecasting",
            "Interactive data visualization dashboards",
            "Historical data analysis"
        ],
        links: {
            repo: "https://github.com/ridhamxdev/Energence"
        }
    },
    {
        slug: "tasknexus",
        title: "TaskNexus",
        shortDescription: "Enterprise-grade financial backend system orchestrating secure transactions.",
        fullDescription: "TaskNexus is a sophisticated backend system engineered with NestJS to handle high-fidelity financial operations. It emphasizes data integrity and system resilience, implementing ACID-compliant transactions and asynchronous processing pipelines. The architecture is designed to handle complex business logic, separating concerns between transaction processing, notification dispatch, and data persistence.",
        role: "Backend",
        techStack: ["NestJS", "TypeScript", "MySQL", "Sequelize", "RabbitMQ", "Redis"],
        architecture: {
            description: "Modular backend architecture using NestJS. It employs the Repository pattern for database abstraction and uses RabbitMQ to decouple the core transaction engine from side-effect services like notifications, ensuring high availability and fault tolerance."
        },
        systemDesign: {
            headline: "Resilient Financial Architecture",
            points: [
                "Implemented ACID-compliant transaction managers using Sequelize for data integrity.",
                "Integrated RabbitMQ for asynchronous, reliable message queuing of system events.",
                "Utilized Redis caching strategies to reduce database load for high-frequency read operations."
            ]
        },
        keyFeatures: [
            "ACID-compliant transaction processing",
            "Asynchronous event message queues",
            "High-performance caching layer",
            "Modular microservices-ready structure"
        ],
        links: {
            repo: "https://github.com/ridhamxdev/TaskNexus"
        }
    },
    {
        slug: "authora",
        title: "Authora",
        shortDescription: "Modern e-commerce platform with MERN stack.",
        fullDescription: "Authora is a fully functional e-commerce solution providing a seamless shopping experience, from product discovery to checkout.",
        role: "Full Stack",
        techStack: ["MongoDB", "Express", "React", "Node.js", "NestJS"],
        systemDesign: {
            headline: "Modular E-commerce Architecture",
            points: [
                "RESTful API design following Open API specifications.",
                "Component-based frontend architecture for reusability.",
                "NoSQL database schema design for flexible product attributes."
            ]
        },
        keyFeatures: [
            "User authentication and profile management",
            "Cart and checkout functionality",
            "Product search and filtering"
        ],
        links: {
            repo: "https://github.com/ridhamxdev/Authora"
        }
    },
    {
        slug: "poker-ai-agent",
        title: "Poker AI Agent (CFR)",
        shortDescription: "Advanced Poker AI with Counterfactual Regret Minimization.",
        fullDescription: "A comprehensive poker game application featuring AI opponents powered by Counterfactual Regret Minimization (CFR) algorithms. The system features real-time multiplayer functionality, opponent modeling, and risk management strategies.",
        role: "AI Agent",
        techStack: ["Node.js", "TypeScript", "CFR Algorithm", "Socket.io", "MongoDB", "React", "Vite"],
        architecture: {
            description: "Hybrid architecture combining a Node.js game server with a dedicated AI decision engine. The AI engine runs CFR algorithms in real-time to compute optimal strategies based on game state and opponent history."
        },
        systemDesign: {
            headline: "Strategic AI Decision Engine",
            points: [
                "Implemented Counterfactual Regret Minimization (CFR) for approximating Nash Equilibrium in imperfect information games.",
                "Real-time Opponent Modeling system that adapts to player aggression and bluffing frequencies.",
                "Event-driven socket architecture to synchronize game state between human players and AI agents."
            ]
        },
        aiFeatures: {
            modelUsed: "CFR (Counterfactual Regret Minimization)",
            agentWorkflow: "The AI agent traverses the game tree to calculate regret values for each action (Fold, Call, Raise), updating its strategy profile over time to minimize exploitability."
        },
        keyFeatures: [
            "CFR-based decision making",
            "Opponent Modeling & Adaptability",
            "Bluffing detection & execution",
            "Real-time game state synchronization"
        ],
        links: {
            repo: "https://github.com/ridhamxdev/ai-poker-agent.git"
        }
    }
];
