import React, { useEffect, useState } from 'react';
import { Instagram, Twitter, Linkedin, Mail } from 'lucide-react';

interface SocialLinks {
  instagram: string;
  twitter: string;
  linkedin: string;
}

interface ContactInfo {
  email: string;
}

const defaultSocial: SocialLinks = { instagram: "", twitter: "https://x.com/DottyEdits", linkedin: "" };
const defaultContact: ContactInfo = { email: "contact@dottyedits.com" };

export const Footer: React.FC = () => {
  const [social, setSocial] = useState<SocialLinks>(defaultSocial);
  const [contact, setContact] = useState<ContactInfo>(defaultContact);

  useEffect(() => {
    fetch('/api/site-content')
      .then(res => res.json())
      .then(data => {
        if (data.social) setSocial({ ...defaultSocial, ...data.social });
        if (data.contact) setContact({ ...defaultContact, ...data.contact });
      })
      .catch(() => { });
  }, []);

  return (
    <footer className="bg-black border-t border-neutral-900 py-16">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">

        <div className="text-center md:text-left">
          <h2 className="text-3xl font-black text-white tracking-tighter mb-2">DOTTY.</h2>
          <p className="text-neutral-500 text-xs uppercase tracking-widest">Digital Content & Video Production.</p>
        </div>

        <div className="flex space-x-6">
          {social.instagram && (
            <a href={social.instagram} target="_blank" rel="noreferrer" className="text-neutral-500 hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
          )}
          {social.twitter && (
            <a href={social.twitter} target="_blank" rel="noreferrer" className="text-neutral-500 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
          )}
          {social.linkedin && (
            <a href={social.linkedin} target="_blank" rel="noreferrer" className="text-neutral-500 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
          )}
          {contact.email && (
            <a href={`mailto:${contact.email}`} className="text-neutral-500 hover:text-white transition-colors"><Mail className="w-5 h-5" /></a>
          )}
        </div>

        <div className="text-neutral-600 text-[10px] uppercase tracking-widest text-center md:text-right">
          <p>&copy; {new Date().getFullYear()} DottyEdits. All rights reserved.</p>
          <p className="mt-1">Powered by Gemini AI</p>
        </div>
      </div>
    </footer>
  );
};