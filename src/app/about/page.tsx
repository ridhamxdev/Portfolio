"use client";

import React from 'react';
import { motion } from 'framer-motion';

const AboutPage = () => {
  // const aboutRef = useRef(null); // This ref was used for a scroll animation in the original page.
                                // It might need to be re-implemented or adapted if the same scroll
                                // effect is desired here. For now, it's commented out.

  // useEffect(() => { // This useEffect was for the parallax effect on the image.
  //   if (typeof window !== "undefined") { // Ensure GSAP and ScrollTrigger are available
  //     const gsap = require("gsap");
  //     const { ScrollTrigger } = require("gsap/ScrollTrigger");
  //     gsap.registerPlugin(ScrollTrigger);

  //     gsap.to(".about-image-container", { // Changed selector to be more specific if needed
  //       y: -50,
  //       scrollTrigger: {
  //         trigger: aboutRef.current, // This would need aboutRef to be active
  //         start: "top bottom",
  //         end: "bottom top",
  //         scrub: true
  //       }
  //     });

  //     return () => {
  //       ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  //     };
  //   }
  // }, []);
  
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <main className="max-w-5xl w-full">
        {/* About Section Content - Copied from src/app/page.tsx */}
        <section id="about-standalone" className="py-20 px-4 sm:px-8 md:px-16 lg:px-24"> {/* Changed id to avoid conflicts if this component is ever imported elsewhere */}
          <div className="max-w-5xl mx-auto">
            <motion.h2 
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-16 relative inline-block gradient-text"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }} // Trigger when 50% is visible
              transition={{ duration: 0.5 }}
            >
              About Me
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)]"></span>
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <p className="text-lg sm:text-xl mb-6 text-[var(--text-secondary)]">
                  I\\'m a passionate developer with a keen eye for design and a love for creating seamless user experiences. My journey in web development started with curiosity and has evolved into expertise across the full stack.
                </p>
                <p className="text-lg sm:text-xl mb-6 text-[var(--text-secondary)]">
                  I enjoy tackling complex problems and transforming them into simple, beautiful, and intuitive solutions. When I\\'m not coding, you\\'ll find me exploring new technologies, contributing to open-source projects, or sharing knowledge with the developer community.
                </p>
                <p className="text-lg sm:text-xl text-[var(--text-secondary)]">
                  My goal is to build applications that are not only functional but also provide exceptional user experiences through thoughtful design and performance optimization.
                </p>
              </motion.div>
              
              <motion.div 
                className="about-image-container relative" // Added a specific class for potential GSAP targeting
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="absolute inset-0 border-2 border-[var(--accent-primary)] rounded-lg transform translate-x-4 translate-y-4"></div>
                <div className="w-full h-80 bg-[var(--card-bg)] rounded-lg relative overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] opacity-20"></div>
                  {/* Placeholder for an image or more complex visual element */}
                   <div className="flex items-center justify-center h-full">
                    <span className="text-2xl text-[var(--text-secondary)] opacity-50">Visual Element Here</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutPage;