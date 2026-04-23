import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { usePlan } from '../../hooks/usePlan';
import { useProgressStore } from '../../stores/useProgressStore';
import { HobbyHeader } from '../../components/HobbyHeader';
import { useStreak } from '../../hooks/useStreak';
import type { Technique, Section } from '../../types';
import { cn } from '../../utils/cn';
import { CheckCircle2, Clock, Play, BookOpen } from 'lucide-react';

const SECTION_META: Record<Section, { label: string; number: number }> = {
  foundation: { label: 'Fundamentals', number: 1 },
  building: { label: 'Building Skills', number: 2 },
  advanced: { label: 'Advanced Techniques', number: 3 },
};

const SECTION_ORDER: Section[] = ['foundation', 'building', 'advanced'];

function TechniqueRow({ technique, status, onClick, isLast }: {
  technique: Technique;
  status: string;
  onClick: () => void;
  isLast: boolean;
}) {
  const isDone = status === 'done';
  const isInProgress = status === 'in-progress';
  const isPending = status === 'pending';

  return (
    <button onClick={onClick} className="flex items-start gap-5 group w-full text-left py-2">
      {/* Timeline connector */}
      <div className="flex flex-col items-center pt-1">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all border-2",
          isDone && "bg-emerald-500 border-emerald-500 text-white",
          isInProgress && "bg-[#6d58e0] border-[#6d58e0] text-white",
          isPending && "bg-white border-slate-200 text-slate-400 group-hover:border-[#6d58e0] group-hover:text-[#6d58e0]"
        )}>
          {isDone ? <CheckCircle2 size={18} /> :
            isInProgress ? <Play size={16} fill="white" /> :
              <Clock size={16} />}
        </div>
        {!isLast && (
          <div className={cn(
            "w-[2px] flex-1 min-h-[32px]",
            isDone ? "bg-emerald-300" : "bg-slate-200"
          )} />
        )}
      </div>

      {/* Content */}
      <div className="pb-6 flex-1 min-w-0">
        <h4 className={cn(
          "text-lg font-semibold leading-snug transition-colors",
          isDone && "text-emerald-800",
          isInProgress && "text-[#6d58e0]",
          isPending && "text-slate-800 group-hover:text-[#6d58e0]"
        )}>
          {technique.title}
        </h4>
        <p className={cn(
          "text-sm mt-0.5 font-medium",
          isDone ? "text-emerald-600/70" : "text-slate-400"
        )}>
          {isDone ? 'Completed' :
            isInProgress ? 'In Progress' :
              `${technique.difficulty} · ${technique.estimatedMinutes} min`}
        </p>
      </div>
    </button>
  );
}

export default function PlanDetailPage() {
  const { hobbyId } = useParams<{ hobbyId: string }>();
  const navigate = useNavigate();
  const { plan, isLoading, error } = usePlan(hobbyId);
  const { getHobbyProgress, getTechniqueStatus } = useProgressStore();

  if (isLoading) return <LoadingSpinner message="Loading your path..." />;
  if (error || !plan) return <div className="flex items-center justify-center min-h-[60vh] text-rose-500 text-lg font-medium">{error || 'Plan not found'}</div>;

  const progress = getHobbyProgress(plan.hobbyId);
  const completedCount = progress?.completedTechniqueIds.length || 0;

  // Group techniques by section
  const sections = SECTION_ORDER.map(section => ({
    section,
    ...SECTION_META[section],
    techniques: plan.techniques.filter(t => t.section === section),
  })).filter(s => s.techniques.length > 0);

  return (
    <div className="max-w-3xl mx-auto pt-8 pb-20">
      <HobbyHeader name={plan.hobby} />

      {/* Top nav tabs */}
      <div className="flex items-center gap-6 mb-10 border-b border-black/5 pb-4">
        <button className="flex items-center gap-2 text-base font-semibold text-[#6d58e0] border-b-2 border-[#6d58e0] pb-1">
          <BookOpen size={16} /> Learning Map
        </button>
        <span className="text-sm text-slate-400 font-medium">
          {completedCount}/{plan.techniques.length} completed · {plan.estimatedTotalHours}h total
        </span>
      </div>

      {/* Sections */}
      <div className="space-y-8">
        {sections.map((sec, secIdx) => {
          const sectionDone = sec.techniques.filter(t => getTechniqueStatus(plan.hobbyId, t.id) === 'done').length;
          return (
            <motion.div
              key={sec.section}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: secIdx * 0.1 }}
            >
              {/* Section header card */}
              <div className="bg-[#faf9f6] border border-black/5 rounded-2xl px-6 py-4 mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {sec.number}. {sec.label}
                  </h3>
                  <p className="text-sm text-slate-400 font-medium mt-0.5">
                    {sectionDone}/{sec.techniques.length} lessons
                  </p>
                </div>
                <div className="w-9 h-9 rounded-lg border border-black/5 bg-white flex items-center justify-center">
                  <BookOpen size={16} className="text-slate-400" />
                </div>
              </div>

              {/* Technique timeline */}
              <div className="pl-4 md:pl-10">
                {sec.techniques.map((technique: Technique, idx: number) => (
                  <TechniqueRow
                    key={technique.id}
                    technique={technique}
                    status={getTechniqueStatus(plan.hobbyId, technique.id)}
                    onClick={() => navigate(`/technique/${plan.hobbyId}/${technique.id}`)}
                    isLast={idx === sec.techniques.length - 1}
                  />
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
