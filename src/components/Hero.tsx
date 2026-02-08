import React, { useEffect, useRef, useState } from 'react';
import { Aperture } from 'lucide-react';
import { Button } from './Button';

interface HeroContent {
  title: string;
  tagline: string;
  statusBadge: string;
}

const defaultHero: HeroContent = {
  title: "DOTTY.EDITS",
  tagline: "Transforming Concepts into Captivating Visuals",
  statusBadge: "Open for Commissions"
};

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lensBaseRef = useRef<HTMLDivElement>(null);
  const lensMidRef = useRef<HTMLDivElement>(null);
  const lensGlassRef = useRef<HTMLDivElement>(null);
  const reflectionRef = useRef<HTMLDivElement>(null);
  const sensorRef = useRef<HTMLDivElement>(null);
  const flareGroupRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState<HeroContent>(defaultHero);

  useEffect(() => {
    fetch('/api/site-content')
      .then(res => res.json())
      .then(data => {
        if (data.hero) setContent({ ...defaultHero, ...data.hero });
      })
      .catch(() => { });
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const { innerWidth, innerHeight } = window;
      const x = (e.clientX - innerWidth / 2) / (innerWidth / 2);
      const y = (e.clientY - innerHeight / 2) / (innerHeight / 2);

      containerRef.current.style.transform = `perspective(1000px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg)`;

      if (lensBaseRef.current) {
        lensBaseRef.current.style.transform = `translate(${x * 10}px, ${y * 10}px)`;
      }
      if (lensMidRef.current) {
        lensMidRef.current.style.transform = `translate(${x * 25}px, ${y * 25}px)`;
      }
      if (sensorRef.current) {
        sensorRef.current.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
        sensorRef.current.style.filter = `hue-rotate(${x * 40}deg) brightness(${1 + Math.abs(y) * 0.5})`;
      }
      if (lensGlassRef.current) {
        lensGlassRef.current.style.transform = `translate(${x * 45}px, ${y * 45}px)`;
      }
      if (reflectionRef.current) {
        reflectionRef.current.style.transform = `translate(${-x * 80}px, ${-y * 80}px) scale(${1 + Math.abs(x) * 0.1})`;
        reflectionRef.current.style.opacity = `${0.4 + Math.abs(x) * 0.4}`;
      }
      if (flareGroupRef.current) {
        flareGroupRef.current.style.transform = `translate(${-x * 120}px, ${-y * 120}px)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Format title for styling (split on period)
  const titleParts = content.title.split('.');
  const formattedTitle = titleParts.length > 1
    ? <>{titleParts[0]}<span className="text-neutral-500">.</span>{titleParts.slice(1).join('.')}</>
    : content.title;

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black selection:bg-white selection:text-black">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,#111_0%,#000_100%)] pointer-events-none"></div>
      <div className="absolute inset-0 z-0 bg-dot-grid bg-grid-md opacity-10 pointer-events-none"></div>

      {/* 3D Lens Composition */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div ref={containerRef} className="relative w-[350px] h-[350px] md:w-[600px] md:h-[600px] transition-transform duration-100 ease-out will-change-transform opacity-60 md:opacity-100">
          <div ref={lensBaseRef} className="absolute inset-0 rounded-full bg-[#050505] border border-neutral-800 shadow-2xl flex items-center justify-center transition-transform duration-100 ease-out">
            <div className="absolute inset-[2%] rounded-full border border-neutral-900 bg-neutral-950"></div>
            <div className="absolute inset-[5%] rounded-full border border-dashed border-neutral-800/50 opacity-40 animate-[spin_60s_linear_infinite]"></div>
          </div>
          <div ref={lensMidRef} className="absolute inset-[15%] rounded-full bg-[#080808] border border-neutral-800 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex items-center justify-center transition-transform duration-100 ease-out overflow-hidden">
            <div className="absolute inset-0 rounded-full border-[20px] border-neutral-950/50"></div>
            <div className="absolute inset-[10%] rounded-full border border-neutral-800/30"></div>
            <div ref={sensorRef} className="absolute w-[30%] h-[30%] bg-neutral-900 transition-transform duration-100 ease-out flex items-center justify-center overflow-hidden border border-neutral-800/50 rounded-sm">
              <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.03)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.03)_50%,rgba(255,255,255,0.03)_75%,transparent_75%,transparent)] bg-[length:4px_4px]"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-emerald-900/20 mix-blend-color-dodge"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]"></div>
            </div>
          </div>
          <div ref={lensGlassRef} className="absolute inset-[28%] rounded-full bg-gradient-to-br from-neutral-800/20 to-black/80 overflow-hidden shadow-[inset_0_5px_20px_rgba(255,255,255,0.1)] border border-neutral-800 flex items-center justify-center transition-transform duration-100 ease-out backdrop-blur-[1px]">
            <div className="w-[35%] h-[35%] rounded-full border border-neutral-800 shadow-[0_0_30px_rgba(0,0,0,1)] relative z-10 overflow-hidden bg-black/80 backdrop-blur-sm">
              <div className="absolute inset-0 flex items-center justify-center opacity-40">
                <Aperture className="w-[150%] h-[150%] text-neutral-600 animate-[spin_20s_linear_infinite]" strokeWidth={1} />
              </div>
            </div>
            <div ref={reflectionRef} className="absolute -inset-full bg-gradient-to-tr from-transparent via-white/10 to-transparent blur-2xl rotate-45 pointer-events-none z-20 mix-blend-overlay transition-transform duration-100 ease-out"></div>
            <div ref={flareGroupRef} className="absolute inset-0 pointer-events-none transition-transform duration-100 ease-out z-30">
              <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 mix-blend-screen"></div>
              <div className="absolute top-1/2 left-1/2 w-[150%] h-1 bg-white/5 blur-sm transform -translate-x-1/2 -translate-y-1/2 rotate-[-5deg] mix-blend-screen"></div>
              <div className="absolute top-[40%] left-[60%] w-2 h-2 bg-white/40 rounded-full blur-[1px] shadow-[0_0_10px_white]"></div>
              <div className="absolute bottom-[30%] right-[30%] w-12 h-12 border border-white/5 rounded-full blur-[1px]"></div>
            </div>
            <div className="absolute top-[25%] right-[25%] w-3 h-3 bg-white/90 rounded-full blur-[1px] z-20 shadow-[0_0_15px_rgba(255,255,255,0.9)]"></div>
          </div>
        </div>
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 border border-white/20 rounded-full mb-8 backdrop-blur-md animate-fade-in-up bg-neutral-900/50 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span className="text-xs uppercase tracking-widest text-white/80 font-bold">{content.statusBadge}</span>
        </div>

        <h1 className="text-6xl md:text-9xl font-black text-white mb-6 tracking-tighter leading-none animate-fade-in-up delay-100 mix-blend-difference drop-shadow-2xl">
          {formattedTitle}
        </h1>

        <p className="text-neutral-400 text-lg md:text-2xl max-w-2xl mx-auto mb-10 font-medium leading-relaxed animate-fade-in-up delay-200 uppercase tracking-wide mix-blend-plus-lighter">
          {content.tagline}
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
          <Button onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}>
            View Work
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 z-20">
        <span className="text-[10px] uppercase tracking-widest text-white">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
      </div>
    </section>
  );
};