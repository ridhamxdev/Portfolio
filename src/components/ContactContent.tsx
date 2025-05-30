"use client";

import React from 'react';
import { Mail, Linkedin, Github, Twitter } from 'lucide-react';
// import { cn } from "@/lib/utils"; // Removed
import CardSpotlightEffect from "./ui/card-spotlight";

interface ContactContentProps {
  onClose?: () => void;
}

const ContactContent: React.FC<ContactContentProps> = ({ onClose }) => {
  const email = 'ridham.dev3@example.com';
  const socialLinks = [
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/ridham-goyal-025b422a0/',
      icon: <Linkedin size={24} />,
    },
    {
      name: 'GitHub',
      url: 'https://github.com/ridhamxdev',
      icon: <Github size={24} />,
    },
    {
      name: 'Twitter',
      url: 'https://x.com/Ridham572806',
      icon: <Twitter size={24} />,
    },
  ];

  return (
    <CardSpotlightEffect className="max-w-2xl w-full bg-gray-800 shadow-2xl rounded-lg p-8 md:p-12 !border-slate-700">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-50"
          aria-label="Close contact form"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
      <header className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
          Get in Touch
        </h1>
        <p className="mt-4 text-lg text-gray-300">
          I&apos;m always excited to connect and discuss new projects, ideas, or just chat about tech!
        </p>
      </header>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-purple-300 mb-4">Direct Email</h2>
        <a
          href={`mailto:${email}`}
          className="inline-flex items-center gap-3 text-lg text-pink-400 hover:text-pink-300 transition-colors duration-200 p-3 bg-gray-700 rounded-lg hover:bg-gray-600"
        >
          <Mail size={24} />
          <span>{email}</span>
        </a>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-purple-300 mb-6">Find me on Social Media</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center gap-2 p-6 bg-gray-700 rounded-lg shadow-md hover:bg-gray-600 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 group"
            >
              <span className="text-purple-400 group-hover:text-pink-400 transition-colors duration-200">
                {link.icon}
              </span>
              <span className="text-gray-200 group-hover:text-white transition-colors duration-200">
                {link.name}
              </span>
            </a>
          ))}
        </div>
      </section>

      <footer className="mt-12 text-center">
        <p className="text-gray-400">
          Looking forward to hearing from you!
        </p>
      </footer>
    </CardSpotlightEffect>
  );
};

export default ContactContent; 