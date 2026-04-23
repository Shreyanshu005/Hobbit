import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HobbyHeader } from '../../components/HobbyHeader';
import { ProgressRing } from '../../components/ProgressRing';
import { NextUpCard } from '../../components/NextUpCard';
import { TechniqueCard } from '../../components/TechniqueCard';
import { usePlan } from '../../hooks/usePlan';
import { useStreak } from '../../hooks/useStreak';
import { useProgressStore } from '../../stores/useProgressStore';
import type { Technique } from '../../types';

export default function PlanDetailPage() {
  const { hobbyId } = useParams<{ hobbyId: string }>();
  const navigate = useNavigate();
  const { plan, isLoading, error } = usePlan(hobbyId);
  const { streak, flameLevel } = useStreak(hobbyId || '');
  const { getHobbyProgress, getTechniqueStatus } = useProgressStore();

  if (isLoading) return <div className="flex items-center justify-center min-h-[60vh] text-slate-400 font-bold">Loading your path...</div>;
  if (error || !plan) return <div className="flex items-center justify-center min-h-[60vh] text-rose-500 font-bold">{error || 'Plan not found'}</div>;

  const progress = getHobbyProgress(plan.hobbyId);
  const completedCount = progress?.completedTechniqueIds.length || 0;
  const nextUp = plan.techniques.find(t => getTechniqueStatus(plan.hobbyId, t.id) === 'pending');

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-4xl mx-auto pt-6 pb-20">
      <HobbyHeader 
        name={plan.hobby} 
        streak={streak} 
        flameLevel={flameLevel} 
      />

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-12 items-center mb-16">
        <div>
          <p className="text-xl text-slate-500 font-bold mb-2 uppercase tracking-widest">Your Mastery</p>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
            You've completed <span className="text-indigo-600">{completedCount}</span> of <span className="text-slate-400">{plan.techniques.length}</span> techniques
          </h2>
        </div>
        <ProgressRing current={completedCount} total={plan.techniques.length} />
      </div>

      <AnimatePresence mode="wait">
        {nextUp && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mb-16"
          >
            <NextUpCard 
              technique={nextUp} 
              onClick={() => navigate(`/technique/${plan.hobbyId}/${nextUp.id}`)} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      <section>
        <h3 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-widest border-b-4 border-slate-200 pb-4">
          The Full Stack
        </h3>
        
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {plan.techniques.map((technique: Technique) => (
            <motion.div key={technique.id} variants={item}>
              <TechniqueCard 
                technique={technique}
                status={getTechniqueStatus(plan.hobbyId, technique.id)}
                onClick={() => navigate(`/technique/${plan.hobbyId}/${technique.id}`)}
              />
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
