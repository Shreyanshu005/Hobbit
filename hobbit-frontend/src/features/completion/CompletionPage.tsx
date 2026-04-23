import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, ArrowRight, Sparkles } from 'lucide-react';
import { Suspense, lazy } from 'react';
import { usePlan } from '../../hooks/usePlan';
import { useProgressStore } from '../../stores/useProgressStore';
import { LoadingSpinner } from '../../components/LoadingSpinner';

const Confetti = lazy(() => import('../../components/Confetti'));

export default function CompletionPage() {
  const { hobbyId } = useParams<{ hobbyId: string }>();
  const navigate = useNavigate();
  const { plan, isLoading } = usePlan(hobbyId);
  const { getHobbyProgress } = useProgressStore();

  if (isLoading || !plan) return <LoadingSpinner />;

  const progress = getHobbyProgress(plan.hobbyId);
  const daysElapsed = progress ? Math.ceil((new Date().getTime() - new Date(progress.startedAt).getTime()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div className="min-h-[70vh] my-8 bg-indigo-600 text-white flex flex-col items-center justify-center p-8 text-center overflow-hidden relative rounded-[40px] shadow-2xl">
      <Suspense fallback={null}><Confetti /></Suspense>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500 blur-3xl rounded-full opacity-50" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500 blur-3xl rounded-full opacity-50" />
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 15 }}
        className="relative z-10"
      >
        <div className="w-24 h-24 bg-white text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
          <Trophy size={48} strokeWidth={2.5} />
        </div>

        <h1 className="text-6xl md:text-7xl font-black italic tracking-tight mb-4">Mastered!</h1>
        <h2 className="text-2xl md:text-3xl font-bold mb-10 opacity-90">
          You are now a {plan.hobby} Expert
        </h2>

        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-12">
          <div className="bg-white/10 backdrop-blur-lg rounded-[24px] p-6 border border-white/10">
            <div className="text-4xl font-black mb-1">{plan.techniques.length}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest opacity-60">Techniques</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-[24px] p-6 border border-white/10">
            <div className="text-4xl font-black mb-1">{daysElapsed || 1}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest opacity-60">Days</div>
          </div>
        </div>

        <div className="flex flex-col gap-4 items-center">
          <button
            onClick={() => navigate('/onboarding')}
            className="group flex items-center gap-3 bg-white text-indigo-600 px-8 py-4 rounded-full text-xl font-black hover:bg-indigo-50 transition-all active:scale-95 shadow-xl"
          >
            Start New Hobby
            <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            className="text-white/60 font-bold uppercase tracking-widest text-xs hover:text-white transition-colors flex items-center gap-2"
          >
            <Sparkles size={14} />
            Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );
}
