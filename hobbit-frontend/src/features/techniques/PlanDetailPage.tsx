import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { usePlan } from '../../hooks/usePlan';
import { useProgressStore } from '../../stores/useProgressStore';
import type { Technique, Section } from '../../types';
import { cn } from '../../utils/cn';

import { 
  CheckCircle2, 
  Clock, 
  Play, 
  ChevronLeft, 
  ChevronRight
} from 'lucide-react';

const SECTION_META: Record<Section, { label: string; number: number }> = {
  foundation: { label: 'Fundamentals', number: 1 },
  building: { label: 'Building Skills', number: 2 },
  advanced: { label: 'Advanced Techniques', number: 3 },
};

const SECTION_ORDER: Section[] = ['foundation', 'building', 'advanced'];

export default function PlanDetailPage() {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { hobbyId } = useParams<{ hobbyId: string }>();
  const navigate = useNavigate();
  const { plan, isLoading, error } = usePlan(hobbyId);
  const { getHobbyProgress, getTechniqueStatus } = useProgressStore();

  useEffect(() => {
    if (plan && plan.techniques.length > 0) {
      navigate(`/technique/${plan.hobbyId}/${plan.techniques[0].id}`, { replace: true });
    }
  }, [plan, navigate]);

  if (isLoading) return <LoadingSpinner message="Loading your path..." />;
  if (error || !plan) return <div className="flex items-center justify-center min-h-[60vh] text-rose-500 text-lg font-medium">{error || 'Plan not found'}</div>;

  const progress = getHobbyProgress(plan.hobbyId);
  const completedCount = progress?.completedTechniqueIds.length || 0;

  const sections = SECTION_ORDER.map(section => ({
    section,
    ...SECTION_META[section],
    techniques: plan.techniques.filter(t => t.section === section),
  })).filter(s => s.techniques.length > 0);

  return (
    <div className="flex flex-col h-full bg-transparent">
      <header className="h-16 border-b border-gray-100 flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="p-1 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="w-8 h-8 flex items-center justify-center">
              <ChevronLeft size={24} className="text-gray-400" />
            </div>
          </Link>
          <h2 className="text-lg font-medium text-gray-900 tracking-tight capitalize">{plan.hobby}</h2>
        </div>
        
        <div />
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden lg:flex w-[280px] border-r border-black/5 flex-col shrink-0 bg-[#fff9ef] backdrop-blur-xl">
        
          {imageLoaded && (
            <div className="w-full h-32 border-b border-black/5 bg-white/50 overflow-hidden flex items-center justify-center animate-in fade-in zoom-in-95 duration-700 shrink-0">
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
          <div className="p-6 pb-2 pt-0 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Lessons</h3>
            <span className="text-[11px] font-bold text-gray-900 bg-gray-50 px-2 py-0.5 rounded-full">
              {plan.techniques.filter(t => getTechniqueStatus(plan.hobbyId, t.id) === 'done').length} / {plan.techniques.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto px-4 space-y-8 pb-10">
            <nav className="space-y-1">
              <button
                className="w-full text-left flex flex-col rounded-xl px-4 py-3 bg-white shadow-sm border border-gray-100 text-gray-900"
              >
                <span className="text-[15px] font-semibold text-gray-900">Learning Map</span>
                <span className="text-[11px] font-bold text-indigo-500 uppercase tracking-wider mt-1">Overview</span>
              </button>
              
              <div className="pt-4 px-4 mb-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Lessons</div>
              {plan.techniques.map((t) => {
                const tStatus = getTechniqueStatus(plan.hobbyId, t.id);
                return (
                  <button
                    key={t.id}
                    onClick={() => navigate(`/technique/${plan.hobbyId}/${t.id}`)}
                    className="w-full text-left flex flex-col rounded-xl px-4 py-3 text-gray-500 hover:bg-gray-100/50 transition-all"
                  >
                    <span className="text-[15px] font-medium text-gray-600">
                      {t.title}
                    </span>
                    {tStatus === 'done' && (
                      <span className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider mt-1">Completed</span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto bg-transparent">
          <div className="max-w-4xl mx-auto py-20">
            <header className="mb-16">
              <div className="relative inline-block mb-6">
                <h1 
                  className="text-5xl font-bold text-slate-900 leading-[1.1] relative z-10"
                  style={{ fontFamily: "'Caveat', cursive" }}
                >
                  Learning Map
                </h1>
                <svg
                  className="absolute -bottom-6 left-0 w-[60%] text-[#6d58e0]/40 pointer-events-none"
                  viewBox="0 0 100 20"
                  preserveAspectRatio="none"
                  style={{ height: '0.4em' }}
                >
                  <motion.path 
                    d="M 2 10 Q 50 0 98 15" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="6" 
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1, ease: "easeInOut", delay: 0.5 }}
                  />
                </svg>
              </div>
              <p className="text-xl font-medium text-gray-400 tracking-tight">
                {completedCount} of {plan.techniques.length} lessons completed · {plan.estimatedTotalHours} hours total
              </p>
            </header>

            <div className="space-y-16">
              {sections.map((sec, secIdx) => (
                <motion.div
                  key={sec.section}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: secIdx * 0.1 }}
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-lg">
                      {sec.number}
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900">
                      {sec.label}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {sec.techniques.map((technique: Technique) => {
                      const status = getTechniqueStatus(plan.hobbyId, technique.id);
                      const isDone = status === 'done';
                      const isInProgress = status === 'in-progress';
                      
                      return (
                        <button
                          key={technique.id}
                          onClick={() => navigate(`/technique/${plan.hobbyId}/${technique.id}`)}
                          className={cn(
                            "group flex items-center justify-between p-6 rounded-[24px] border-2 transition-all text-left",
                            isDone ? "bg-emerald-50/50 border-emerald-100" : 
                            isInProgress ? "bg-indigo-50/50 border-indigo-100 shadow-sm" :
                            "bg-white border-gray-100 hover:border-gray-200"
                          )}
                        >
                          <div className="flex items-center gap-5">
                            <div className={cn(
                              "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                              isDone ? "bg-emerald-500 text-white" : 
                              isInProgress ? "bg-indigo-600 text-white" :
                              "bg-gray-50 text-gray-400 group-hover:bg-gray-100"
                            )}>
                              {isDone ? <CheckCircle2 size={24} /> : 
                               isInProgress ? <Play size={20} fill="white" /> :
                               <Clock size={20} />}
                            </div>
                            <div>
                              <h4 className={cn(
                                "text-xl font-semibold",
                                isDone ? "text-emerald-900" : "text-gray-900"
                              )}>
                                {technique.title}
                              </h4>
                              <p className="text-sm font-medium text-gray-400 mt-1">
                                {technique.difficulty} · {technique.estimatedMinutes} min
                              </p>
                            </div>
                          </div>
                          <ChevronRight className={cn(
                            "w-5 h-5 transition-transform group-hover:translate-x-1",
                            isDone ? "text-emerald-300" : "text-gray-300"
                          )} />
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
