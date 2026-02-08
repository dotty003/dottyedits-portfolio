import React from 'react';
import { SectionHeading } from './SectionHeading';
import { ServiceItem } from '../types';
import { Scissors, MonitorPlay, Palette, Layers } from 'lucide-react';

const services: (ServiceItem & { icon: React.ReactNode })[] = [
  {
    title: 'Offline Editing',
    description: 'Crafting the narrative arc. Selection, assembly, and fine-tuning of the story beats.',
    tools: ['Premiere Pro', 'Avid Media Composer'],
    icon: <Scissors className="w-8 h-8" />
  },
  {
    title: 'Color Grading',
    description: 'Enhancing mood and tone. Creating a consistent visual language across all shots.',
    tools: ['DaVinci Resolve', 'Baselight'],
    icon: <Palette className="w-8 h-8" />
  },
  {
    title: 'Motion Graphics',
    description: 'Adding dynamic text and visual elements to elevate the production value.',
    tools: ['After Effects', 'Cinema 4D'],
    icon: <Layers className="w-8 h-8" />
  },
  {
    title: 'Sound Design',
    description: 'Mixing dialogue, music, and SFX to create an immersive auditory experience.',
    tools: ['Pro Tools', 'Audition'],
    icon: <MonitorPlay className="w-8 h-8" />
  }
];

export const Services: React.FC = () => {
  return (
    <section id="services" className="py-24 bg-neutral-950">
      <div className="container mx-auto px-6">
        <SectionHeading 
          title="Expertise" 
          subtitle="Technical proficiency meets creative intuition."
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, idx) => (
            <div 
              key={idx} 
              className="p-8 border border-neutral-800 bg-black/50 hover:bg-neutral-900 transition-colors duration-300 group"
            >
              <div className="mb-6 text-neutral-500 group-hover:text-white transition-colors duration-300">
                {service.icon}
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
          ))}
        </div>
      </div>
    </section>
  );
};
