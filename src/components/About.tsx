import React, { useEffect, useState } from 'react';
import { SectionHeading } from './SectionHeading';
import { Check } from 'lucide-react';

interface AboutContent {
  headline: string;
  subtitle: string;
  paragraphs: string[];
  tools: string[];
  yearsExperience: number;
  photoUrl?: string;
}

const defaultAbout: AboutContent = {
  headline: "Behind the Edit",
  subtitle: "Obsessed with rhythm, pacing, and visual impact.",
  paragraphs: [
    "I'm Dotty, a freelance video editor specializing in high-energy content that grabs attention and refuses to let go. My editing style is defined by aggressive cuts, dynamic motion graphics, and a monochromatic aesthetic that stands out in a saturated feed.",
    "Whether it's a music video, a gaming montage, or a commercial spot, I bring a unique \"glitch\" philosophy to every timeline: break the pattern to create the moment."
  ],
  tools: ["Premiere Pro", "After Effects", "DaVinci Resolve", "Cinema 4D"],
  yearsExperience: 4,
  photoUrl: "/DOTTY.jpeg"
};

export const About: React.FC = () => {
  const [content, setContent] = useState<AboutContent>(defaultAbout);

  useEffect(() => {
    fetch('/api/site-content')
      .then(res => res.json())
      .then(data => {
        if (data.about) setContent({ ...defaultAbout, ...data.about });
      })
      .catch(() => { });
  }, []);

  return (
    <section id="about" className="py-24 bg-neutral-950 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <div>
            <SectionHeading
              title={content.headline}
              subtitle={content.subtitle}
            />
            <div className="space-y-6 text-neutral-400 text-lg leading-relaxed font-light">
              {content.paragraphs.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}

              <div className="pt-8 grid grid-cols-2 gap-4">
                {content.tools.map((tool) => (
                  <div key={tool} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm font-bold uppercase tracking-wide text-neutral-300">{tool}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square bg-neutral-900 border border-neutral-800 relative overflow-hidden group">
              <div className="absolute inset-0 bg-dot-grid bg-grid-md opacity-20 z-20 pointer-events-none"></div>
              <img
                src={content.photoUrl || "/DOTTY.jpeg"}
                alt="Dotty"
                className="w-full h-full object-cover grayscale opacity-80 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105"
              />
              <div className="absolute bottom-8 right-8 text-right z-30 mix-blend-difference">
                <p className="text-6xl font-black text-white/50">{String(content.yearsExperience).padStart(2, '0')}</p>
                <p className="text-xs uppercase tracking-widest text-neutral-400 font-bold">Years Exp.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};