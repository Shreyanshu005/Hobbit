import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { cn } from '../../../utils/cn';
import type { Plan, TechniqueUserStatus } from '../../../types';

interface LessonSidebarProps {
  plan: Plan;
  activeTechniqueId: string;
  getTechniqueStatus: (hobbyId: string, techniqueId: string) => TechniqueUserStatus;
  toggleTechnique: (hobbyId: string, techniqueId: string) => void;
  skipTechnique: (hobbyId: string, techniqueId: string) => void;
  setSidebarExpanded: (val: boolean) => void;
}

export function LessonSidebar({
  plan,
  activeTechniqueId,
  getTechniqueStatus,
  toggleTechnique,
  skipTechnique,
  setSidebarExpanded
}: LessonSidebarProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.aside
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 280, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ type: "spring", bounce: 0, duration: 0.3 }}
      className={cn(
        "border-r border-black/5 flex flex-col shrink-0 bg-[#fff9ef] backdrop-blur-xl overflow-hidden h-full z-40",
        "fixed lg:relative top-0 bottom-0 left-0 lg:left-auto shadow-2xl lg:shadow-none"
      )}
    >
      <div className="w-[280px] h-full flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-black/5">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight capitalize">{plan.hobby}</h2>
        </div>

        {imageLoaded && (
          <div className="w-full h-38 border-b border-black/5 bg-white/50 overflow-hidden flex items-center justify-center animate-in fade-in zoom-in-95 duration-700 shrink-0">
            <img
              src={`https://image.pollinations.ai/prompt/${plan.hobby.toLowerCase().replace(/\s+/g, '_')}?width=400&height=400&nologo=true`}
              alt={plan.hobby}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <img
          src={`https://image.pollinations.ai/prompt/${plan.hobby.toLowerCase().replace(/\s+/g, '_')}?width=400&height=400&nologo=true`}
          alt=""
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(false)}
          className="hidden"
        />

        <div className="p-6 py-2 pt-2 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Lessons</h3>
          <span className="text-[11px] font-bold text-gray-900 bg-gray-50 px-2 py-0.5 rounded-full">
            {plan.techniques.filter(t => getTechniqueStatus(plan.hobbyId, t.id) === 'done').length} / {plan.techniques.length}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-0 pb-10">
          {plan.techniques.map((t) => {
            const tStatus = getTechniqueStatus(plan.hobbyId, t.id);
            const isActive = t.id === activeTechniqueId;
            return (
              <div
                key={t.id}
                className={cn(
                  'w-full flex items-center gap-3 px-6 py-4 transition-all group border-b border-black/5',
                  isActive
                    ? 'bg-black/10 text-gray-900'
                    : 'text-gray-500 hover:bg-black/5'
                )}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleTechnique(plan.hobbyId, t.id);
                  }}
                  className={cn(
                    "w-4 h-4 rounded-sm flex items-center justify-center transition-all shrink-0",
                    tStatus === 'done'
                      ? "bg-slate-400 text-white"
                      : "border border-slate-200 bg-white"
                  )}
                >
                  {tStatus === 'done' && <Check className="w-3 h-3 stroke-[3]" />}
                </button>

                <button
                  onClick={() => {
                    navigate(`/technique/${plan.hobbyId}/${t.id}`);
                    if (window.innerWidth <= 1024) {
                      setSidebarExpanded(false);
                    }
                  }}
                  className="flex-1 text-left min-w-0"
                >
                  <span className={cn(
                    'text-base font-medium leading-snug block truncate transition-all',
                    isActive ? 'font-semibold text-gray-900' : (tStatus === 'done' || tStatus === 'skipped' ? 'text-gray-400 line-through' : 'text-gray-600')
                  )}>
                    {t.title}
                  </span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    skipTechnique(plan.hobbyId, t.id);
                  }}
                  className={cn(
                    "p-1 rounded transition-all",
                    tStatus === 'skipped' ? "text-red-500" : "text-black/40 group-hover:text-black"
                  )}
                  title={tStatus === 'skipped' ? "Unskip" : "Skip"}
                >
                  <X size={12} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </motion.aside>
  );
}
