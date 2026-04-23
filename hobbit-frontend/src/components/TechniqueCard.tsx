import { ChevronRight, CheckCircle2 } from 'lucide-react';
import type { Technique, TechniqueStatus } from '../types';
import { cn } from '../utils/cn';

interface TechniqueCardProps {
  technique: Technique;
  status: TechniqueStatus;
  onClick?: () => void;
}

export function TechniqueCard({ technique, status, onClick }: TechniqueCardProps) {
  const isDone = status === 'done';
  const isSkipped = status === 'skipped';
  const isPending = status === 'pending';

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left p-6 md:p-7 rounded-2xl border transition-all duration-300 group flex items-center gap-6 relative overflow-hidden",
        isDone && "bg-emerald-50/50 border-emerald-200/60",
        isSkipped && "bg-slate-50/50 border-slate-200 opacity-70",
        isPending && "bg-white border-black/5 shadow-md shadow-black/5 hover:shadow-sm hover:shadow-black/10"
      )}
    >
      {/* Hover ellipse animation for pending cards */}
      {isPending && (
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none z-0">
          <div className="absolute left-[-20px] bottom-[-20px]">
            <svg width="280" height="200" viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse
                cx="20"
                cy="180"
                rx="220"
                ry="180"
                fill="#F1EFFC"
                className="transition-transform transform scale-0 group-hover:scale-100 duration-[400ms] origin-bottom-left"
              />
              <ellipse
                cx="20"
                cy="180"
                rx="180"
                ry="140"
                fill="#E2DEF9"
                className="transition-transform transform scale-0 group-hover:scale-100 duration-[600ms] delay-75 origin-bottom-left"
              />
            </svg>
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0 relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <span className={cn(
            "text-xs font-semibold px-2.5 py-1 rounded-lg",
            technique.difficulty === 'beginner' && "bg-emerald-100/80 text-emerald-700",
            technique.difficulty === 'intermediate' && "bg-amber-100/80 text-amber-700",
            technique.difficulty === 'advanced' && "bg-rose-100/80 text-rose-700"
          )}>
            {technique.difficulty}
          </span>
          <span className="text-xs font-medium text-slate-400">
            {technique.estimatedMinutes} min
          </span>
          {isDone && <span className="text-xs font-semibold text-emerald-600">Mastered</span>}
        </div>

        <h3 className={cn(
          "text-lg md:text-xl font-semibold transition-all leading-snug",
          isDone && "text-emerald-900",
          isSkipped && "text-slate-400 line-through decoration-1",
          isPending && "text-slate-900 group-hover:text-[#6d58e0]"
        )}>
          {technique.title}
        </h3>

        <p className="text-base text-slate-500 line-clamp-1 mt-1.5 font-medium">
          {technique.whyItMatters}
        </p>
      </div>

      <div className={cn(
        "w-11 h-11 rounded-full flex items-center justify-center transition-all shrink-0 relative z-10",
        isDone && "bg-emerald-500 text-white",
        isSkipped && "bg-slate-200 text-slate-400",
        isPending && "bg-slate-100 text-slate-400 group-hover:bg-[#6d58e0] group-hover:text-white"
      )}>
        {isDone ? <CheckCircle2 size={20} /> : <ChevronRight size={20} />}
      </div>
    </button>
  );
}
