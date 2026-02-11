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
        <div className="max-w-3xl mx-auto">
          <SectionHeading
            title={content.headline}
            subtitle={content.subtitle}
          />
          <div className="space-y-6 text-neutral-400 text-lg leading-relaxed font-light">
            {content.paragraphs.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}

            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {content.tools.map((tool) => (
                <div key={tool} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm font-bold uppercase tracking-wide text-neutral-300 whitespace-nowrap">{tool}</span>
                </div>
              ))}
            </div>

            <div className="pt-8 flex items-center gap-4">
              <div className="text-4xl font-black text-white">{String(content.yearsExperience).padStart(2, '0')}</div>
              <div className="text-xs uppercase tracking-widest text-neutral-500 font-bold max-w-[100px]">Years of Experience</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};