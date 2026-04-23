import { Play } from 'lucide-react';
import type { Technique } from '../types';
import { cn } from '../utils/cn';

interface NextUpCardProps {
  technique: Technique;
  onClick?: () => void;
}

export function NextUpCard({ technique, onClick }: NextUpCardProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 group">
      {/* Decorative gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 opacity-50" />
      <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full" />
      
      <div className="relative z-10">
        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em] mb-4 block">Next Up</span>
        <h3 className="text-3xl font-black mb-2 leading-tight max-w-[80%]">{technique.title}</h3>
        <p className="text-slate-400 text-base font-medium mb-8 max-w-[70%] italic">
          "{technique.whyItMatters}"
        </p>
        
        <button
          onClick={onClick}
          className="flex items-center gap-3 bg-white text-slate-900 px-6 py-3 rounded-full font-bold text-lg hover:bg-indigo-50 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/10"
        >
          <Play size={20} fill="currentColor" />
          Start Learning
        </button>
      </div>
    </div>
  );
}
