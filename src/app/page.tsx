"use client"; // Add this directive at the very top

import { useEffect, useRef, useState } from "react";
// import Head from 'next/head'; // No longer needed for script tag
import Script from 'next/script'; // Import Next.js Script component
import Image from 'next/image'; // Import next/image
// import { Image } from "next/image"; // Removed as it's unused after project section removal
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import DropAnimation from '../components/DropAnimation';
import { Zap } from 'lucide-react'; // Assuming Zap is still used by SkillCard or elsewhere
import { Spotlight } from "@/components/ui/Spotlight";
import Navbar from "@/components/Navbar"; // Import Navbar
// Removed Parisienne font import and instantiation as it was part of a removed feature or not used
// import { Parisienne } from 'next/font/google'; 
// const parisienne = Parisienne(...);

// Project interface and ProjectCard component were removed as projects are on a separate page
// interface Project { ... }
// const ProjectCard = (...) => { ... };

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin);
}

// Define Skill type
interface Skill {
  name: string;
  icon: string | React.ReactNode; // Allow string URL or ReactNode for icons
  description: string;
  bgColor?: string; // Optional: for card front background
  isJsxIcon?: boolean; // Flag to indicate if icon is JSX or URL
}

interface SkillCategory {
  category: string;
  skills: Skill[];
}

// SkillCard component
const SkillCard = ({ 
  skill,
  index
}: { 
  skill: Skill;
  index: number 
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const cardVariants = {
    initial: { opacity: 0, y: 20, scale: 0.9 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.3, delay: index * 0.05, ease: "easeOut" }
    }
  };

  const flipCard = () => setIsFlipped(!isFlipped);

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.5 }}
      whileHover={{ 
        y: -8, 
        scale: 1.08, 
        transition: { duration: 0.2, type: "spring", stiffness: 300, damping: 15 } 
      }}
      className="skill-card-container w-36 h-36 perspective flex-shrink-0 cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
      onClick={flipCard}
    >
      <motion.div
        className="skill-card relative w-full h-full preserve-3d text-center rounded-xl shadow-lg group-hover:shadow-xl group-hover:shadow-[var(--accent-primary)]/25 border border-white/10 transition-shadow duration-200"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        style={{ backgroundColor: skill.bgColor || 'var(--card-bg)' }}
      >
        {/* Front of the card */}
        <div className="card-face card-front absolute w-full h-full backface-hidden flex flex-col items-center justify-center p-4 gap-2">
          <span>
            {typeof skill.icon === 'string' && !skill.isJsxIcon ? (
              <Image src={skill.icon} alt={skill.name} width={40} height={40} />
            ) : (
              skill.icon // Render as ReactNode if not a string URL or if explicitly JSX
            )}
          </span>
          <h4 className="text-sm font-semibold text-[var(--text-primary)]">{skill.name}</h4>
          <AnimatePresence>
            {isHovered && !isFlipped && (
              <motion.p 
                className="text-[10px] text-[var(--text-secondary)] px-1 leading-tight"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.2 }}
              >
                Click for details
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Back of the card */}
        <div className="card-face card-back absolute w-full h-full backface-hidden rotate-y-180 flex flex-col items-center justify-center p-3 bg-[var(--card-bg-darker)] rounded-xl">
          <h5 className="text-xs font-bold mb-1 text-[var(--accent-primary)]">{skill.name}</h5>
          <p className="text-[11px] text-center text-[var(--text-secondary)] leading-snug">
            {skill.description}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  
  // Removed isNavbarVisible state as Navbar handles its own visibility
  // const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  // const scrollThreshold = 200; 

  // useEffect for hero animation (runs once)
  useEffect(() => {
    const heroTl = gsap.timeline({ defaults: { ease: "expo.out" } });
    heroTl
      .fromTo(
        ".hero-intro",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        "0.2"
      )
      // Scramble animation for hero title (name)
      .to(".hero-name-scramble", {
        duration: 2,
        scrambleText: {
          text: "Ridham Goyal", 
          chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()", 
          revealDelay: 0.3,
          speed: 0.05
        }
      }, "-=0.3") // Start slightly after intro
      // Scramble animation for hero subtitle
      .to(".hero-subtitle-scramble", {
        duration: 3,
        scrambleText: {
          text: "I'm a full-stack developer specializing in building exceptional digital experiences.", 
          chars: "lowerCase", 
          revealDelay: 0.3, 
          speed: 0.05
        }
      }, "-=1.5") // Start during name scramble
      .fromTo(
        ".hero-cta",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 
        "-=1.0" // Overlap with subtitle scramble
      );

    // Navbar visibility logic has been moved to Navbar.tsx
    // if (window.scrollY > scrollThreshold) {
    //     setIsNavbarVisible(false);
    //   } else {
    //     setIsNavbarVisible(true);
    //   }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []); // Removed scrollThreshold from dependencies

  // useEffect for scroll-dependent logic (navbar visibility) and data fetching
  useEffect(() => {
    const handleNavbarScroll = () => {
      // Navbar visibility logic has been moved to Navbar.tsx
    };

    let timeoutId: NodeJS.Timeout;
    const debouncedHandler = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        handleNavbarScroll();
      }, 50);
    };

    window.addEventListener('scroll', debouncedHandler);
    
    return () => {
      window.removeEventListener('scroll', debouncedHandler);
      // Note: ScrollTrigger.getAll().forEach(trigger => trigger.kill()); is in the other useEffect
    };
  }, []); // Removed projects from dependencies

  const skillCategories: SkillCategory[] = [
    {
      category: "Programming Languages",
      skills: [
        {
          name: "C/C++",
          icon: (
            <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', alignItems: 'center' }}>
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg" width="28" height="28" alt="C" />
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" width="28" height="28" alt="C++" />
            </div>
          ),
          isJsxIcon: true,
          description: "Building high-performance applications and understanding system-level programming.",
          bgColor: "#659AD2",
        },
        {
          name: "JavaScript",
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
          description: "Core language for modern web development, enabling dynamic and interactive user interfaces.",
          bgColor: "#F7DF1E",
        },
        {
          name: "HTML/CSS",
          icon: (
            <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', alignItems: 'center' }}>
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" width="28" height="28" alt="HTML5" />
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" width="28" height="28" alt="CSS3" />
            </div>
          ),
          isJsxIcon: true,
          description: "Structuring and styling web content for an engaging user experience.",
          bgColor: "#E44D26", 
        },
        {
          name: "Java",
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
          description: "Versatile language for enterprise-level applications and Android development.",
          bgColor: "#007396", 
        },
        {
          name: "Python",
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
          description: "Rapid development for web applications, data science, and scripting.",
          bgColor: "#3776AB", 
        },
      ]
    },
    {
      category: "Frameworks & Libraries",
      skills: [
        {
          name: "React",
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
          description: "Building dynamic user interfaces with a component-based architecture.",
          bgColor: "#61DAFB", 
        },
        {
          name: "Node.js",
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
          description: "Server-side JavaScript runtime for scalable network applications.",
          bgColor: "#339933", 
        },
        {
          name: "Express.js",
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
          description: "Minimalist web framework for Node.js, building robust APIs and web apps.",
          bgColor: "#000000", 
        },
        {
          name: "Nest.js",
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-plain.svg",
          description: "Progressive Node.js framework for building efficient and scalable server-side applications.",
          bgColor: "#E0234E", 
        },
        {
          name: "Django",
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg",
          description: "High-level Python web framework for rapid development and clean design.",
          bgColor: "#092E20", 
        },
      ]
    },
    {
      category: "Developer Tools",
      skills: [
        {
          name: "Git",
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
          description: "Managing source code effectively with version control and collaborative platforms.",
          bgColor: "#F05032", 
        },
        {
          name: "Docker",
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
          description: "Containerizing applications for consistent development and deployment.",
          bgColor: "#2496ED", 
        },
        {
          name: "Postman",
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg",
          description: "Designing, building, testing, and iterating on APIs.",
          bgColor: "#FF6C37", 
        },
        {
          name: "VS Code",
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg",
          description: "Efficient coding and debugging with a feature-rich code editor.",
          bgColor: "#007ACC", 
        },
        {
          name: "Thunder Client",
          icon: <Zap size={32} />,
          isJsxIcon: true,
          description: "Lightweight REST API client extension for VS Code.",
          bgColor: "#20232A", 
        },
      ]
    },
    {
      category: "Databases & Caching",
      skills: [
        { 
          name: "MongoDB", 
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
          description: "Utilizing NoSQL document databases for flexible and scalable data storage solutions.",
          bgColor: "#1E3C2F", 
        },
        {
          name: "Sequelize & MySQL",
          icon: (
            <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', alignItems: 'center' }}>
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sequelize/sequelize-original.svg" width="28" height="28" alt="Sequelize" />
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" width="28" height="28" alt="MySQL" />
            </div>
          ),
          isJsxIcon: true,
          description: "ORM-based relational database management for Node.js applications.",
          bgColor: "#00758F", 
        },
        {
          name: "Redis",
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg",
          description: "In-memory data store for caching, session management, and message brokering.",
          bgColor: "#DC382D", 
        }
      ]
    }
  ];

  return (
    <main className="min-h-screen pt-16">
      {/* Global styles for scrollbar hiding and mask */}
      <style jsx global>{`
        .skills-scroll-container::-webkit-scrollbar {
          display: none;
        }
        .skills-scroll-container {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>

      {/* Animated background gradient & Spotlight */}
      <div className="fixed inset-0 -z-10 ">
        {/* Spotlight Component */}
        <Spotlight
          // className="-top-40 left-0 md:left-60 md:-top-20" // This line is effectively removed by not including it.
          fill="var(--accent-primary)" /> 
        {/* Animated Blobs */}
        <div className="opacity-20">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-[var(--accent-primary)] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-[var(--accent-secondary)] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-[var(--accent-primary)] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
      </div>
      
      {/* Hero Section */}
      <section 
        ref={heroRef} 
        className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-8 md:px-16 lg:px-24 py-20"
      >
        <div className="max-w-6xl w-full mx-auto flex flex-col lg:flex-row items-center justify-between lg:gap-16">
          <div className="lg:w-1/2 text-center lg:text-left">
            <motion.div style={{ y }} className="mb-4 inline-block">
              <span className="hero-intro text-[var(--accent-primary)] font-mono text-sm sm:text-base">Hello, my name is</span>
            </motion.div>
            
            <h1 className="hero-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="hero-name-scramble gradient-text"></span>
            </h1>
            
            <h2 className="hero-subtitle-scramble text-2xl sm:text-3xl md:text-4xl text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto lg:mx-0">
              {/* Placeholder for scramble - original text will be set by GSAP */}
            </h2>
            
            <div className="hero-cta flex flex-wrap gap-4 justify-center lg:justify-start">
              <a 
                href="/projects"
                className="px-6 py-3 rounded-md bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-secondary)] transition-colors duration-300"
              >
                View My Work
              </a>
            </div>
          </div>

          <div className="lg:w-1/2 mt-12 lg:mt-0 flex justify-center items-center">
            <div className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 relative">
              <DropAnimation />
            </div>
          </div>
        </div>
      </section>
      
      {/* Skills Section */}
      <section id="skills" className="py-16 md:py-24 bg-[var(--background-alt)] relative px-4 sm:px-8 md:px-16 lg:px-24 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-12 text-center relative gradient-text"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            My Skills & Toolkit
          </motion.h2>
          
          <div className="space-y-16">
            {skillCategories.map((categoryObj, categoryIndex) => (
              <motion.div 
                key={categoryObj.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: categoryIndex * 0.15 }}
              >
                <h3 className="text-2xl md:text-3xl font-semibold mb-8 text-center md:text-left text-[var(--accent-secondary)] relative pb-2">
                  {categoryObj.category}
                  <span className="absolute bottom-0 left-1/2 md:left-0 transform md:-translate-x-0 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-full"></span>
                </h3>
                <motion.div
                  className="overflow-hidden"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <div 
                    className="flex overflow-x-auto py-4 gap-4 md:gap-6 pb-6 skills-scroll-container"
                    style={{
                      WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
                      maskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
                    }}
                  >
                    {categoryObj.skills.map((skill, index) => (
                      <SkillCard 
                        key={skill.name} 
                        skill={skill} 
                        index={index}
                      />
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer Section - Adjusted for compactness and navbar */}
      <footer className="bg-[var(--background)] text-[var(--text-secondary)] py-8 px-4 sm:px-8 md:px-16 lg:px-24 text-center">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm mb-2">
            &copy; {new Date().getFullYear()} Ridham Goyal. All rights reserved.
          </p>
          <p className="text-xs">
            Crafted with <span className="text-[var(--accent-primary)]">&hearts;</span> and Next.js, Tailwind CSS, Framer Motion, GSAP.
          </p>
        </div>
      </footer>

      {/* GSAP ScrambleTextPlugin CDN - replaced with next/script */}
      {/* <Head>
        <script src="https://unpkg.com/gsap@3/dist/ScrambleTextPlugin.min.js"></script>
      </Head> */}
      <Script src="https://unpkg.com/gsap@3/dist/ScrambleTextPlugin.min.js" strategy="lazyOnload" />

    </main>
  );
}
