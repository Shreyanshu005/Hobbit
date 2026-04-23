import { ChevronRight, CheckCircle2, CircleDashed } from 'lucide-react';
import type { Technique, TechniqueUserStatus } from '../types';
import { cn } from '../utils/cn';

interface TechniqueCardProps {
  technique: Technique;
  status: TechniqueUserStatus;
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
        "w-full text-left p-6 rounded-2xl border transition-all duration-300 group flex items-center gap-6",
        isDone && "bg-emerald-50/50 border-emerald-200",
        isSkipped && "bg-slate-50/50 border-slate-200 opacity-75",
        isPending && "bg-white border-slate-200 hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-500/10"
      )}
    >
      {/* Status indicator line */}
      <div className={cn(
        "absolute left-0 top-6 bottom-6 w-1 rounded-r-full transition-colors",
        isDone && "bg-emerald-500",
        isSkipped && "bg-slate-400",
        isPending && "bg-amber-400 group-hover:bg-indigo-500"
      )} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={cn(
            "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md",
            technique.difficulty === 'beginner' && "bg-emerald-100 text-emerald-700",
            technique.difficulty === 'intermediate' && "bg-amber-100 text-amber-700",
            technique.difficulty === 'advanced' && "bg-rose-100 text-rose-700"
          )}>
            {technique.difficulty}
          </span>
          {isDone && <span className="text-[10px] font-bold text-emerald-600 uppercase">Mastered</span>}
          {isSkipped && <span className="text-[10px] font-bold text-slate-400 uppercase">Skipped</span>}
        </div>
        
        <h3 className={cn(
          "text-xl font-bold transition-all",
          isDone && "text-emerald-900",
          isSkipped && "text-slate-400 line-through decoration-2",
          isPending && "text-slate-900 group-hover:text-indigo-600"
        )}>
          {technique.title}
        </h3>
        
        <p className="text-sm text-slate-500 line-clamp-1 mt-1 font-medium">
          {technique.whyItMatters}
        </p>
      </div>

      <div className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center transition-all",
        isDone && "bg-emerald-500 text-white",
        isSkipped && "bg-slate-200 text-slate-400",
        isPending && "bg-slate-100 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white"
      )}>
        {isDone ? <CheckCircle2 size={20} /> : <ChevronRight size={20} />}
      </div>
    </button>
  );
}
