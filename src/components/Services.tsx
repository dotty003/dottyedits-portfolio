import React, { useEffect, useState } from 'react';
import { SectionHeading } from './SectionHeading';
import { Scissors, MonitorPlay, Palette, Layers, LucideIcon } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  description: string;
  tools: string[];
}

const defaultServices: Service[] = [
  { id: "svc-1", title: "Offline Editing", description: "Crafting the narrative arc. Selection, assembly, and fine-tuning of the story beats.", tools: ["Premiere Pro", "Avid Media Composer"] },
  { id: "svc-2", title: "Color Grading", description: "Enhancing mood and tone. Creating a consistent visual language across all shots.", tools: ["DaVinci Resolve", "Baselight"] },
  { id: "svc-3", title: "Motion Graphics", description: "Adding dynamic text and visual elements to elevate the production value.", tools: ["After Effects", "Cinema 4D"] },
  { id: "svc-4", title: "Sound Design", description: "Mixing dialogue, music, and SFX to create an immersive auditory experience.", tools: ["Pro Tools", "Audition"] }
];

const iconMap: Record<string, LucideIcon> = {
  "Offline Editing": Scissors,
  "Color Grading": Palette,
  "Motion Graphics": Layers,
  "Sound Design": MonitorPlay
};

export const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>(defaultServices);

  useEffect(() => {
    fetch('/api/site-content')
      .then(res => res.json())
      .then(data => {
        if (data.services?.length) setServices(data.services);
      })
      .catch(() => { });
  }, []);

  return (
    <section id="services" className="py-24 bg-neutral-950">
      <div className="container mx-auto px-6">
        <SectionHeading
          title="Expertise"
          subtitle="Technical proficiency meets creative intuition."
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, idx) => {
            const IconComponent = iconMap[service.title] || Layers;
            return (
              <div
                key={service.id || idx}
                className="p-8 border border-neutral-800 bg-black/50 hover:bg-neutral-900 transition-colors duration-300 group"
              >
                <div className="mb-6 text-neutral-500 group-hover:text-white transition-colors duration-300">
                  <IconComponent className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{service.title}</h3>
                <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                  {service.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {service.tools.map(tool => (
                    <span key={tool} className="text-xs border border-neutral-800 px-2 py-1 text-neutral-500 rounded">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
