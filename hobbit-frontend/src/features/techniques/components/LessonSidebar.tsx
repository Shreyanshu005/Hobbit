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
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">{plan.hobby}</h2>
        </div>
        
        <div className="p-6 py-2">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Lessons</h3>
        </div>

        <div className="flex-1 overflow-y-auto px-4 space-y-1 pb-10">
          {plan.techniques.map((t) => {
            const tStatus = getTechniqueStatus(plan.hobbyId, t.id);
            const isActive = t.id === activeTechniqueId;
            return (
              <div
                key={t.id}
                className={cn(
                  'w-full flex items-center gap-2 rounded-sm px-3 py-2 transition-all border group',
                  isActive 
                    ? 'border-slate-400 bg-transparent text-gray-900' 
                    : 'border-transparent text-gray-500 hover:bg-black/5'
                )}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleTechnique(plan.hobbyId, t.id);
                  }}
                  className={cn(
                    "w-4 h-4 rounded-sm border flex items-center justify-center transition-all shrink-0",
                    tStatus === 'done'
                      ? "bg-slate-400 border-slate-400 text-white"
                      : "border-slate-200 bg-white"
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
                    'text-sm font-medium leading-snug block truncate transition-all',
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
