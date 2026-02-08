import React from 'react';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({ title, subtitle, centered = false }) => {
  return (
    <div className={`mb-16 ${centered ? 'text-center' : ''}`}>
      <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-white mb-4">
        {title}
      </h2>
      {subtitle && (
        <div className={`h-1 w-20 bg-white/20 ${centered ? 'mx-auto' : ''} mb-4`} />
      )}
      {subtitle && (
        <p className="text-neutral-400 max-w-2xl text-lg font-light leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};
