# Ridham's Portfolio

Welcome to my personal developer portfolio, a showcase of my work in Full Stack Engineering and AI Agent development. This platform is built with modern web technologies to demonstrate high-performance web development, 3D interactivity, and clean UI/UX design.

## 🚀 Tech Stack

This portfolio is engineered with the latest Next.js ecosystem tools:

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router & Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/) for strict type safety
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & Vanilla CSS
- **Animations**: [Framer Motion](https://www.framer.com/motion/) & [GSAP](https://gsap.com/)
- **3D Graphics**: [Three.js](https://threejs.org/) & [React Three Fiber](https://r3f.docs.pmnd.rs/) with [Drei](https://github.com/pmndrs/drei)
- **UI Components**: Custom components inspired by Aceternity UI, Lucide Icons

## 🛠 Features

- **Dynamic Project Showcase**: Interactive 3D cards and spotlight effects to present projects.
- **Responsive Design**: Fully responsive layouts optimized for all devices.
- **Performance Optimized**: Built with Turbopack for fast HMR and Next.js optimization for production builds.
- **Modern Aesthetics**: Dark mode focused, glassmorphism, and subtle particle effects.

## 📂 Featured Projects

### 📡 [Synapse](https://github.com/ridhamxdev/Synapse.git) - Backend
**High-performance real-time messaging backend.**
Engineered a robust event-driven backend using **Node.js** and **Socket.io**. Capable of handling sub-millisecond message delivery with custom socket adapters and a **Prisma/MySQL** data layer optimized with composite indexes for rapid history retrieval.
- *Tech Stack*: Node.js, Socket.io, Prisma, MySQL, Clerk

### 🧠 [Energence](https://github.com/ridhamxdev/Energence) - Full Stack
**AI-driven renewable energy prediction platform.**
A comprehensive platform leveraging **TensorFlow** models to predict solar and wind power generation. Features a microservices architecture with a decoupled ML inference engine and a **Redis** caching layer to optimize data delivery to the React dashboard.
- *Tech Stack*: React, Django, TensorFlow, PostgreSQL, Redis

### 💳 [TaskNexus](https://github.com/ridhamxdev/TaskNexus) - Backend
**Enterprise-grade financial transaction system.**
A sophisticated **NestJS** backend designing for high-fidelity financial operations. Implements **ACID-compliant** transactions via Sequelize and uses **RabbitMQ** for decoupling notification services, ensuring system resilience and data integrity.
- *Tech Stack*: NestJS, TypeScript, MySQL, Sequelize, RabbitMQ, Redis

### ♠️ [Poker AI Agent](https://github.com/ridhamxdev/ai-poker-agent.git) - AI Agent
**Advanced Poker AI with Counterfactual Regret Minimization.**
A complex AI agent implementing **CFR algorithms** to approximate Nash Equilibrium in imperfect information games. Features real-time opponent modeling and risk management strategies synchronized via web sockets.
- *Tech Stack*: Node.js, TypeScript, CFR Algorithm, Socket.io

### 🛒 [Authora](https://github.com/ridhamxdev/Authora) - Full Stack
**Modern e-commerce platform.**
A fully functional MERN stack solution providing a seamless shopping experience. Built with a component-based architecture and a flexible **ProNoSQL** product schema.
- *Tech Stack*: MongoDB, Express, React, Node.js

## 🏃‍♂️ Running Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/ridhamxdev/Portfolio.git
   cd Portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to explore the portfolio.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
