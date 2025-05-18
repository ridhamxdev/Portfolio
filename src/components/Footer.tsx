"use client";

import React from 'react';

const Footer = () => {
  return (
    <footer className="py-8 mt-16 border-t border-gray-700 text-center text-sm text-[var(--text-secondary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p>&copy; {new Date().getFullYear()} Ridham Goyal. All rights reserved.</p>
        <p className="mt-2">
          Built with <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent-primary)]">Next.js</a> &amp; <a href="https://tailwindcss.com" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent-primary)]">Tailwind CSS</a>. Deployed on Vercel.
        </p>
      </div>
    </footer>
  );
};

export default Footer; 