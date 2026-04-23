import { ArrowRight } from 'lucide-react';
import type { Technique } from '../types';

interface NextUpCardProps {
  technique: Technique;
  onClick?: () => void;
}

export function NextUpCard({ technique, onClick }: NextUpCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#f1effc] p-8 md:p-10 group">
      {/* Decorative circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute right-[-40px] bottom-[-40px]">
          <svg width="280" height="200" viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse
              cx="200"
              cy="160"
              rx="160"
              ry="130"
              fill="#E2DEF9"
              className="transition-transform transform scale-0 group-hover:scale-100 duration-500 origin-bottom-right"
            />
          </svg>
        </div>
      </div>

      <div className="relative z-10">
        <span className="text-sm font-semibold text-[#6d58e0] mb-4 block">Next Up</span>
        <h3 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-3 leading-tight max-w-[85%]">
          {technique.title}
        </h3>
        <p className="text-lg text-slate-500 font-medium mb-8 max-w-[75%] leading-relaxed">
          {technique.whyItMatters}
        </p>

        <button
          onClick={onClick}
          className="flex items-center gap-3 bg-[#110d19] text-white px-6 py-3 rounded-full font-semibold text-base hover:bg-[#110d19]/90 transition-all active:scale-95 shadow-lg shadow-black/10"
        >
          Start Learning
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
