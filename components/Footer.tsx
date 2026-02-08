import React from 'react';
import { Instagram, Twitter, Linkedin, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-neutral-900 py-16">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-black text-white tracking-tighter mb-2">DOTTY.</h2>
          <p className="text-neutral-500 text-xs uppercase tracking-widest">Digital Content & Video Production.</p>
        </div>

        <div className="flex space-x-6">
          <a href="#" className="text-neutral-500 hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
          <a href="https://x.com/DottyEdits" target="_blank" rel="noreferrer" className="text-neutral-500 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
          <a href="#" className="text-neutral-500 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
          <a href="mailto:contact@dottyedits.com" className="text-neutral-500 hover:text-white transition-colors"><Mail className="w-5 h-5" /></a>
        </div>

        <div className="text-neutral-600 text-[10px] uppercase tracking-widest text-center md:text-right">
          <p>&copy; {new Date().getFullYear()} DottyEdits. All rights reserved.</p>
          <p className="mt-1">Powered by Gemini AI</p>
        </div>
      </div>
    </footer>
  );
};