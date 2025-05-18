"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { IconBrandGithub, IconBrandLinkedin } from '@tabler/icons-react';
import ContactContent from '@/components/ContactContent';

interface NavItem {
  name: string;
  link: string;
  icon?: React.ReactNode;
  action?: () => void;
}

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: NavItem[];
  className?: string;
}) => {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollThreshold = 50;
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const openContactModal = () => setIsContactModalOpen(true);
  const closeContactModal = () => setIsContactModalOpen(false);

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < scrollThreshold) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > scrollThreshold) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', controlNavbar, { passive: true });
    return () => window.removeEventListener('scroll', controlNavbar);
  }, []);

  const processedNavItems = navItems.map(item => {
    if (item.name === "Contact") {
      return { ...item, link: '#', action: openContactModal };
    }
    return item;
  });

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "flex max-w-fit fixed top-10 inset-x-0 mx-auto border border-white/[0.2] rounded-full bg-black-100/80 backdrop-blur-md shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-50 pr-2 pl-8 py-2 items-center justify-center space-x-4",
            className
          )}
        >
          {processedNavItems.map((navItem: NavItem, idx: number) => (
            <Link
              key={`link=${idx}`}
              href={navItem.link}
              onClick={(e) => {
                if (navItem.action) {
                  e.preventDefault();
                  navItem.action();
                }
              }}
              className={cn(
                "relative text-neutral-50 items-center flex space-x-1 hover:text-neutral-300 group",
                navItem.name === "Contact" ? "cursor-pointer" : ""
              )}
            >
              {navItem.icon && <span className="text-sm">{navItem.icon}</span>}
              <span className="hidden sm:block text-sm">{navItem.name}</span>
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[var(--accent-primary)] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
            </Link>
          ))}
          <a 
            href="https://github.com/ridhamxdev"
            target="_blank" 
            rel="noopener noreferrer" 
            className="relative text-neutral-50 items-center flex hover:text-neutral-300 p-2 group"
          >
            <IconBrandGithub className="h-5 w-5" />
            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[var(--accent-primary)] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
          </a>
          <a 
            href="https://www.linkedin.com/in/ridham-goyal-025b422a0/"
            target="_blank" 
            rel="noopener noreferrer" 
            className="relative text-neutral-50 items-center flex hover:text-neutral-300 p-2 group"
          >
            <IconBrandLinkedin className="h-5 w-5" />
            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[var(--accent-primary)] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
          </a>
          <button 
            onClick={openContactModal}
            className="border text-sm font-medium relative border-neutral-200/50 text-white px-4 py-2 rounded-full hover:bg-[var(--accent-primary)] hover:border-[var(--accent-primary)] transition-colors duration-300"
          >
            <span>Contact Me</span>
            <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-[var(--accent-secondary)] to-transparent h-px" />
          </button>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {isContactModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
            onClick={closeContactModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <ContactContent onClose={closeContactModal} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}; 