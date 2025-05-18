"use client";

import { useEffect, useRef, useState } from "react";
import Head from 'next/head';
// import Image from "next/image"; // No longer used directly here, can be removed if not used by other components still in this file
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import DropAnimation from '../components/DropAnimation';
import { Zap } from 'lucide-react'; // Assuming Zap is still used by SkillCard or elsewhere
import { Spotlight } from "@/components/ui/Spotlight";
import Navbar from "@/components/Navbar"; // Import Navbar
// ProjectsSection and Project interface are no longer needed here

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin);
}

// SkillCard component (replaces SkillBadge)
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
        // setIsFlipped(false); // Optional: reset flip on mouse leave
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
            {skill.icon}
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

// Define Skill type
interface Skill {
  name: string;
  icon: React.ReactNode;
  description: string;
  bgColor?: string; // Optional: for card front background
}

interface SkillCategory {
  category: string;
  skills: Skill[];
}

export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  
  // Removed isNavbarVisible state and related useEffect
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
      .to(".hero-name-scramble", {
        duration: 2,
        scrambleText: {
          text: "Ridham Goyal", 
          chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()", 
          revealDelay: 0.3,
          speed: 0.05
        }
      }, "-=0.3")
      .to(".hero-subtitle-scramble", {
        duration: 3.5,
        scrambleText: {
          text: "I am a versatile full-stack developer, adept at architecting and fabricating extraordinary digital solutions and user-centric online experiences.", 
          chars: "lowerCase", 
          revealDelay: 0.4,
          speed: 0.03
        }
      }, "-=1.5")
      .fromTo(
        ".hero-cta",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 
        "-=1.0"
      );

    // Removed initial navbar visibility check based on scroll position

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []); // Removed scrollThreshold from dependency array

  // Removed useEffect for scroll-dependent navbar visibility

  const skillCategories: SkillCategory[] = [
    {
      category: "Programming Languages",
      skills: [
        {
          name: "C/C++",
          icon: (
            <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', alignItems: 'center' }}>
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg" width="28" height="28" alt="C language" />
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" width="28" height="28" alt="C++ language" />
            </div>
          ),
          description: "Developing high-performance applications and system software.",
          bgColor: "#004482",
        },
        {
          name: "JavaScript (ES6+)",
          icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="40" height="40" alt="JavaScript" />,
          description: "Core web scripting and application development with modern JavaScript.",
          bgColor: "#27272A", 
        },
        {
          name: "HTML5 & CSS3",
          icon: (
            <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', alignItems: 'center' }}>
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" width="28" height="28" alt="HTML5" />
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" width="28" height="28" alt="CSS3" />
            </div>
          ),
          description: "Structuring and styling responsive web content with semantic HTML and modern CSS.",
          bgColor: "#E44D26", 
        },
        {
          name: "Java",
          icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" width="40" height="40" alt="Java" />,
          description: "Building robust, cross-platform enterprise applications with Java.",
          bgColor: "#007396", 
        },
        {
          name: "Python",
          icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" width="40" height="40" alt="Python" />,
          description: "Versatile programming for web, data science, and automation.",
          bgColor: "#306998", 
        },
      ]
    },
    {
      category: "Frameworks & Libraries",
      skills: [
        { 
          name: "React", 
          icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="40" height="40" alt="React" />,
          description: "Crafting dynamic, component-based UIs with a focus on performance and maintainability.",
          bgColor: "#282c34", 
        },
        { 
          name: "Node.js", 
          icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" width="40" height="40" alt="Node.js" />,
          description: "Developing scalable server-side applications and APIs with JavaScript runtime.",
          bgColor: "#212121", 
        },
        { 
          name: "Express.js", 
          icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" width="40" height="40" alt="Express.js" />,
          description: "Building robust and minimalist web application backends and APIs with Express framework.",
          bgColor: "#333333", 
        },
        {
          name: "NestJS",
          icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-plain.svg" width="40" height="40" alt="NestJS" />,
          description: "Building efficient, scalable Node.js server-side applications.",
          bgColor: "#E0234E", 
        },
        {
          name: "Django",
          icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg" width="40" height="40" alt="Django" />,
          description: "Rapidly developing web applications with the Python MVT framework.",
          bgColor: "#092E20", 
        },
      ]
    },
    {
      category: "Developer Tools",
      skills: [
        { 
          name: "Git & GitHub", 
          icon: (
            <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', alignItems: 'center' }}>
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" width="28" height="28" alt="Git" />
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" width="28" height="28" alt="GitHub" />
            </div>
          ),
          description: "Managing source code effectively with version control and collaborative platforms.",
          bgColor: "#171515", 
        },
        {
          name: "Docker",
          icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" width="40" height="40" alt="Docker" />,
          description: "Containerizing applications for consistent development and deployment.",
          bgColor: "#2496ED", 
        },
        {
          name: "Postman",
          icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg" width="40" height="40" alt="Postman" />,
          description: "Designing, building, testing, and iterating on APIs.",
          bgColor: "#FF6C37", 
        },
        {
          name: "VS Code",
          icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" width="40" height="40" alt="VS Code" />,
          description: "Efficient coding and debugging with a feature-rich code editor.",
          bgColor: "#007ACC", 
        },
        {
          name: "Thunder Client",
          icon: <Zap size={32} />,
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
          icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" width="40" height="40" alt="MongoDB" />,
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
          description: "ORM-based relational database management for Node.js applications.",
          bgColor: "#00758F", 
        },
        {
          name: "Redis",
          icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" width="40" height="40" alt="Redis" />,
          description: "In-memory data store for caching, session management, and message brokering.",
          bgColor: "#DC382D", 
        }
      ]
    }
  ];

  return (
    <>
      <Head>
        <script src="https://unpkg.com/gsap@3/dist/ScrambleTextPlugin.min.js"></script>
      </Head>
      <Navbar /> {/* Render Navbar here */}
      <div className="min-h-screen">
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
            fill="var(--accent-primary)" /> 
          {/* Animated Blobs */}
          <div className="opacity-20">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-[var(--accent-primary)] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-[var(--accent-secondary)] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-[var(--accent-primary)] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          </div>
        </div>
        
        {/* Hero Section */}
        {/* pt-16 class removed from main div and applied to sections if needed, as Navbar is fixed */}
        <section 
          ref={heroRef} 
          className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-8 md:px-16 lg:px-24 py-20 pt-24 sm:pt-28 md:pt-32" // Added padding top to account for navbar
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
                  href="/projects" // Updated link
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
        <section id="skills" className="py-20 px-4 sm:px-8 md:px-16 lg:px-24 bg-gradient-to-b from-[var(--card-bg)] to-[var(--background)] pt-24 sm:pt-28 md:pt-32">
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
        
        {/* Projects Section has been removed */}
        
        {/* Footer */}
        <footer className="py-12 px-4 sm:px-8 md:px-16 lg:px-24 border-t border-[var(--border-color)] pt-24 sm:pt-28 md:pt-32">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold gradient-text">Ridham Goyal</h3>
              <p className="text-[var(--text-secondary)] mt-2">Building digital experiences that matter</p>
            </div>
            
            <div className="flex space-x-6">
              <a href="#" className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
              </a>
              <a href="#" className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
              <a href="#" className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="text-center mt-8 text-[var(--text-secondary)] text-sm">
            <p>© {new Date().getFullYear()} Ridham Goyal. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
