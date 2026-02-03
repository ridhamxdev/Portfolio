"use client";

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image'; // Import the Next.js Image component
import gsap from 'gsap'; // Import gsap
import { ScrollTrigger } from 'gsap/ScrollTrigger'; // Import ScrollTrigger
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'; // Import ScrambleTextPlugin

// Register ScrollTrigger and ScrambleTextPlugin if running in a browser environment
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin);
}

const AboutPage = () => {
  const aboutRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined" && aboutRef.current) {
      gsap.to(".about-image-container", {
        yPercent: -25,
        ease: "none",
        scrollTrigger: {
          trigger: aboutRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: aboutRef.current,
          start: "top center+=20%",
          once: true
        }
      });

      tl.to(".about-title-scramble", {
        duration: 1.5,
        scrambleText: { text: "About Me", chars: "upperCase", speed: 0.3, revealDelay: 0.5 }
      })
        .to(".about-p1-scramble", {
          duration: 2.5,
          scrambleText: { text: document.querySelector('.about-p1-scramble')?.textContent || "", chars: "lowerCase", speed: 0.1, revealDelay: 0.2 }
        }, "-=1.2")
        .to(".about-p2-scramble", {
          duration: 3,
          scrambleText: { text: document.querySelector('.about-p2-scramble')?.textContent || "", chars: "lowerCase", speed: 0.1, revealDelay: 0.3 }
        }, "-=2.2")
        .to(".about-p3-scramble", {
          duration: 3.5,
          scrambleText: { text: document.querySelector('.about-p3-scramble')?.textContent || "", chars: "lowerCase", speed: 0.1, revealDelay: 0.4 }
        }, "-=2.7");

      return () => {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        tl.kill();
      };
    }
  }, []);

  return (
    <div className="min-h-screen text-white py-12 sm:py-16 md:py-20 relative">
      <main className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <section id="about-standalone" ref={aboutRef} className="w-full">
          <div>
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-10 md:mb-12 relative inline-block gradient-text about-title-scramble"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5 }}
            >
              About Me
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)]"></span>
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <motion.p
                  className="text-lg sm:text-xl mb-6 text-[var(--text-secondary)] leading-relaxed about-p1-scramble font-sans"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  I&apos;m a full-stack developer passionate about creating elegant, user-centric web experiences. My curiosity-driven journey has led to expertise in technologies like React, Node.js, Python (Django), and various modern databases, allowing me to tackle diverse development challenges.
                </motion.p>
                <motion.p
                  className="text-lg sm:text-xl mb-6 text-[var(--text-secondary)] leading-relaxed about-p2-scramble font-sans"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: 0.45 }}
                >
                  I translate complex problems into intuitive solutions, as seen in projects like the ML-powered Energence platform, the secure TaskNexus system, and the Authora e-commerce site. I&apos;m committed to continuous learning, exploring new tech, and contributing to the developer community.
                </motion.p>
                <motion.p
                  className="text-lg sm:text-xl text-[var(--text-secondary)] leading-relaxed about-p3-scramble font-sans"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  My goal is to build impactful applications that are both functional and delightful to use. I achieve this through thoughtful design, performance optimization, and a deep understanding of user needs, ensuring every project delivers an exceptional digital experience.
                </motion.p>
              </motion.div>

              <motion.div
                className="about-image-container relative mt-10 md:mt-0"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="absolute inset-0 border-2 border-[var(--accent-primary)] rounded-lg transform translate-x-4 translate-y-4"></div>
                <div className="w-full h-80 bg-[var(--card-bg)] rounded-lg relative overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] opacity-20"></div>

                  <Image
                    src="/profile-photo.jpg"
                    alt="Ridham Goyal - Profile Photo"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
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