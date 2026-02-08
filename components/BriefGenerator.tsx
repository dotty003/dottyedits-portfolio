import React, { useState } from 'react';
import { generateCreativeBrief } from '../services/geminiService';
import { BriefStatus, CreativeBriefResponse } from '../types';
import { Button } from './Button';
import { Sparkles, Loader, FileText, CheckCircle, Grid3X3 } from 'lucide-react';

export const BriefGenerator: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Music Video',
    description: ''
  });
  const [status, setStatus] = useState<BriefStatus>(BriefStatus.IDLE);
  const [result, setResult] = useState<CreativeBriefResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(BriefStatus.LOADING);
    try {
      const brief = await generateCreativeBrief(formData.name, formData.type, formData.description);
      setResult(brief);
      setStatus(BriefStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      setStatus(BriefStatus.ERROR);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto relative overflow-hidden bg-neutral-900/50 border border-neutral-800">
      
      {/* Decorative dot background for container */}
      <div className="absolute inset-0 bg-dot-pattern-light bg-dot-sm opacity-5 pointer-events-none"></div>

      <div className="p-8 md:p-16 relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <Grid3X3 className="w-6 h-6 text-white" />
          <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Project Kickoff</h3>
        </div>
        
        <p className="text-neutral-400 mb-10 max-w-xl font-light">
          Let's define your vision. Fill out the details below and my AI assistant will generate a structured brief for us to review.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs uppercase font-bold tracking-widest text-neutral-500 mb-2">Handle / Brand</label>
              <input 
                type="text"
                required
                className="w-full bg-black border border-neutral-800 p-4 text-white focus:border-white focus:outline-none transition-all placeholder:text-neutral-700"
                placeholder="@username"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-bold tracking-widest text-neutral-500 mb-2">Format</label>
              <select 
                className="w-full bg-black border border-neutral-800 p-4 text-white focus:border-white focus:outline-none transition-all appearance-none"
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
              >
                <option>Music Video</option>
                <option>Gaming Edit / Montage</option>
                <option>Commercial / Ad</option>
                <option>Documentary</option>
                <option>Short Form (TikTok/Reels)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase font-bold tracking-widest text-neutral-500 mb-2">The Vision</label>
              <textarea 
                required
                className="w-full bg-black border border-neutral-800 p-4 text-white focus:border-white focus:outline-none transition-all h-32 resize-none placeholder:text-neutral-700"
                placeholder="What's the vibe? Fast paced? Glitchy? Cinematic?"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full flex justify-center items-center gap-2"
              disabled={status === BriefStatus.LOADING}
            >
              {status === BriefStatus.LOADING ? (
                <><Loader className="w-4 h-4 animate-spin" /> Processing...</>
              ) : (
                'Generate Brief'
              )}
            </Button>
          </form>

          {/* Results Display */}
          <div className="bg-black p-8 border border-neutral-800 min-h-[400px] flex flex-col relative shadow-2xl">
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-2 h-2 bg-white" />
            <div className="absolute top-0 right-0 w-2 h-2 bg-white" />
            <div className="absolute bottom-0 left-0 w-2 h-2 bg-white" />
            <div className="absolute bottom-0 right-0 w-2 h-2 bg-white" />

            {status === BriefStatus.IDLE && (
              <div className="flex-1 flex flex-col items-center justify-center text-neutral-700 space-y-4">
                <FileText className="w-16 h-16 opacity-20" />
                <p className="text-xs uppercase tracking-widest">Waiting for input...</p>
              </div>
            )}
            
            {status === BriefStatus.LOADING && (
              <div className="flex-1 flex flex-col items-center justify-center text-neutral-400 space-y-4">
                <div className="w-12 h-1 bg-neutral-900 overflow-hidden">
                  <div className="h-full bg-white animate-progress-indeterminate" />
                </div>
                <p className="text-xs uppercase tracking-widest animate-pulse">Consulting Gemini AI...</p>
              </div>
            )}

            {status === BriefStatus.ERROR && (
              <div className="flex-1 flex flex-col items-center justify-center text-red-500 space-y-4">
                <p className="text-xs uppercase font-bold">Error generating brief</p>
              </div>
            )}

            {status === BriefStatus.SUCCESS && result && (
              <div className="animate-fade-in-up space-y-8 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                <div className="flex items-center gap-2 text-white mb-4 border-b border-white/10 pb-4">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-xs font-bold uppercase tracking-widest">Brief Ready</span>
                </div>

                <div>
                  <h4 className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest mb-2">Summary</h4>
                  <p className="text-white leading-relaxed text-sm font-light">{result.summary}</p>
                </div>

                <div>
                  <h4 className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest mb-2">Aesthetic</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.moodBoardSuggestions.map((mood, i) => (
                      <span key={i} className="text-[10px] uppercase font-bold bg-white text-black px-2 py-1">
                        {mood}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <h4 className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest mb-2">ETA</h4>
                    <p className="text-white text-sm font-mono">{result.estimatedTimeline}</p>
                    </div>
                    <div>
                    <h4 className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest mb-2">Tech Specs</h4>
                    <ul className="text-neutral-400 text-xs space-y-1">
                        {result.technicalRequirements.map((req, i) => (
                        <li key={i}>• {req}</li>
                        ))}
                    </ul>
                    </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};