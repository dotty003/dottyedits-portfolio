import React from 'react';
import { SectionHeading } from './SectionHeading';

const clients = [
  'VOGUE', 'RED BULL', 'SONY MUSIC', 'COMPLEX', 'HYPEBEAST', 'NIKE', 'ADIDAS', 'VICE'
];

export const Clients: React.FC = () => {
  return (
    <section id="clients" className="py-24 bg-black border-t border-neutral-900">
      <div className="container mx-auto px-6">
        <SectionHeading 
          title="Worked With" 
          centered
        />
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
          {clients.map((client, index) => (
            <div 
              key={index}
              className="h-32 border border-neutral-900 bg-neutral-950 flex items-center justify-center hover:bg-neutral-900 transition-all duration-300 group cursor-default"
            >
              <span className="text-xl md:text-2xl font-black text-neutral-700 group-hover:text-white transition-colors tracking-tighter">
                {client}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};