import { useState, Suspense, lazy } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Play, CheckCircle2, Video, BookOpen, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlan } from '../../hooks/usePlan';
import { useProgressStore } from '../../stores/useProgressStore';
import { cn } from '../../utils/cn';

const Confetti = lazy(() => import('../../components/Confetti'));

export default function TechniqueDetailPage() {
  const { hobbyId, techniqueId } = useParams<{ hobbyId: string; techniqueId: string }>();
  const navigate = useNavigate();
  const { plan, isLoading } = usePlan(hobbyId);
  const { toggleTechnique, skipTechnique, getTechniqueStatus } = useProgressStore();
  
  const [showCelebration, setShowCelebration] = useState(false);

  if (isLoading || !plan) return <div className="flex items-center justify-center min-h-[60vh] text-slate-400 font-bold">Loading...</div>;

  const technique = plan.techniques.find(t => t.id === techniqueId);
  if (!technique) return <div className="flex items-center justify-center min-h-[60vh] text-rose-500 font-bold">Technique not found</div>;

  const status = getTechniqueStatus(plan.hobbyId, technique.id);
  const isDone = status === 'done';

  const handleMarkDone = () => {
    if (!isDone) {
      toggleTechnique(plan.hobbyId, technique.id);
      setShowCelebration(true);
      setTimeout(() => {
        setShowCelebration(false);
        navigate(`/plan/${plan.hobbyId}`);
      }, 1500);
    } else {
      toggleTechnique(plan.hobbyId, technique.id);
    }
  };

  const handleSkip = () => {
    skipTechnique(plan.hobbyId, technique.id);
    navigate(`/plan/${plan.hobbyId}`);
  };

  return (
    <div className="max-w-4xl mx-auto pt-6 pb-40 relative">
      <AnimatePresence>
        {showCelebration && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm"
          >
            <Suspense fallback={null}><Confetti /></Suspense>
            <motion.div
              initial={{ scale: 0.5, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              className="bg-emerald-500 text-white p-12 rounded-[40px] shadow-2xl shadow-emerald-200 flex flex-col items-center gap-6"
            >
              <CheckCircle2 size={120} strokeWidth={3} />
              <h2 className="text-5xl font-black italic">Mastered!</h2>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => navigate(`/plan/${plan.hobbyId}`)}
        className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-widest text-sm hover:text-slate-900 transition-colors mb-12 group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Back to Path
      </button>

      <header className="mb-16">
        <div className="flex items-center gap-3 mb-4">
          <span className={cn(
            "text-xs font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full",
            technique.difficulty === 'beginner' && "bg-emerald-100 text-emerald-700",
            technique.difficulty === 'intermediate' && "bg-amber-100 text-amber-700",
            technique.difficulty === 'advanced' && "bg-rose-100 text-rose-700"
          )}>
            {technique.difficulty}
          </span>
          {isDone && (
            <span className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              <CheckCircle2 size={14} />
              Mastered
            </span>
          )}
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1] mb-8">
          {technique.title}
        </h1>
        <p className="text-xl md:text-2xl font-medium text-slate-400 leading-relaxed max-w-2xl italic">
          "{technique.whyItMatters}"
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <section>
          <div className="flex items-center gap-2 text-indigo-600 mb-6 font-black uppercase tracking-widest">
            <Video size={20} />
            Visual Guide
          </div>
          <a 
            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(technique.primaryYoutubeSearchQuery)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <div className="aspect-video bg-white rounded-[40px] border-4 border-slate-100 flex flex-col items-center justify-center p-8 text-center transition-all group-hover:bg-slate-50 group-hover:border-slate-200 shadow-sm">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-rose-600 shadow-xl group-hover:scale-110 transition-transform mb-6">
                <Play size={40} fill="currentColor" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Search "{technique.primaryYoutubeSearchQuery}"</h3>
              <p className="text-slate-500 font-bold text-sm">Opens in YouTube</p>
            </div>
          </a>
        </section>

        <section>
          <div className="flex items-center gap-2 text-indigo-600 mb-6 font-black uppercase tracking-widest">
            <BookOpen size={20} />
            Key Insights
          </div>
          <div className="bg-white rounded-[40px] p-8 space-y-6 shadow-sm border border-black/5">
            {technique.readingPoints.map((point, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 font-black text-sm shrink-0 border-2 border-slate-100">
                  {idx + 1}
                </div>
                <p className="text-lg font-bold text-slate-700 leading-relaxed">
                  {point}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <footer className="fixed bottom-12 left-1/2 -translate-x-1/2 w-full max-w-lg px-8 z-50">
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={handleMarkDone}
            className={cn(
              "w-full py-6 rounded-full text-2xl font-black flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl",
              isDone 
                ? "bg-slate-200 text-slate-500" 
                : "bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-200"
            )}
          >
            {isDone ? <CheckCircle2 size={28} /> : <Sparkles size={28} />}
            {isDone ? 'Mastered!' : 'Mark as Mastered'}
          </button>
          
          <button
            onClick={handleSkip}
            className="text-slate-400 font-bold uppercase tracking-widest text-sm hover:text-rose-500 transition-colors"
          >
            Skip this technique
          </button>
        </div>
      </footer>
    </div>
  );
}
