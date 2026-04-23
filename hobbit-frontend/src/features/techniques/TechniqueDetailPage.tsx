import { useState, Suspense, lazy } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, CheckCircle2, Video, BookOpen, Sparkles, AlertCircle, Dumbbell, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlan } from '../../hooks/usePlan';
import { useProgressStore } from '../../stores/useProgressStore';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { cn } from '../../utils/cn';

const Confetti = lazy(() => import('../../components/Confetti'));

export default function TechniqueDetailPage() {
  const { hobbyId, techniqueId } = useParams<{ hobbyId: string; techniqueId: string }>();
  const navigate = useNavigate();
  const { plan, isLoading } = usePlan(hobbyId);
  const { toggleTechnique, getTechniqueStatus } = useProgressStore();

  const [showCelebration, setShowCelebration] = useState(false);
  const [scenarioResult, setScenarioResult] = useState<{ answered: boolean; correct: boolean | null }>({ answered: false, correct: null });

  if (isLoading || !plan) return <LoadingSpinner message="Loading technique..." />;

  const technique = plan.techniques.find(t => t.id === techniqueId);
  if (!technique) return <div className="flex items-center justify-center min-h-[60vh] text-rose-500 text-lg font-medium">Technique not found</div>;

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

  const handleScenarioAnswer = (index: number) => {
    const isCorrect = index === technique.scenarioChallenge?.correctIndex;
    setScenarioResult({ answered: true, correct: isCorrect });
  };

  return (
    <div className="max-w-4xl mx-auto pt-6 pb-40 relative px-4">
      {/* Celebration overlay */}
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
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              className="bg-emerald-500 text-white p-12 rounded-[32px] shadow-2xl shadow-emerald-200 flex flex-col items-center gap-4 text-center"
            >
              <CheckCircle2 size={100} strokeWidth={2.5} />
              <h2 className="text-4xl font-semibold">Mastered!</h2>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back button */}
      <button
        onClick={() => navigate(`/plan/${plan.hobbyId}`)}
        className="flex items-center gap-2 text-slate-400 font-medium text-base hover:text-slate-900 transition-colors mb-8 group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Back to Path
      </button>

      {/* Header */}
      <header className="mb-14">
        <div className="flex flex-wrap items-center gap-2.5 mb-5">
          <span className={cn(
            "text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-black/10 text-slate-700"
          )}>
            {technique.difficulty}
          </span>
          <span className="text-xs font-medium text-slate-400 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100">
            {technique.section}
          </span>
          <span className="text-xs font-medium text-[#6d58e0] px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100">
            {technique.estimatedMinutes} min
          </span>
        </div>
        <h1 className="text-3xl md:text-5xl font-semibold text-slate-900 tracking-tight leading-tight mb-5">
          {technique.title}
        </h1>
        <p className="text-xl font-medium text-slate-500 leading-relaxed max-w-2xl">
          {technique.whyItMatters}
        </p>
      </header>

      <div className="space-y-14">
        {/* Visual Learning */}
        <section>
          <div className="flex items-center gap-2 text-[#6d58e0] mb-5">
            <Video size={18} />
            <span className="text-base font-semibold">Visual Learning</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {technique.videos.length > 0 ? technique.videos.map((video) => (
              <a
                key={video.videoId}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white rounded-2xl border border-black/5 overflow-hidden hover:shadow-md hover:shadow-black/5 transition-all shadow-sm"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-rose-600 shadow-xl">
                      <Video size={22} fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-slate-900 line-clamp-2 text-base leading-snug mb-1">{video.title}</h4>
                  <p className="text-sm font-medium text-slate-400">{video.channelName}</p>
                </div>
              </a>
            )) : (
              <div className="md:col-span-2 py-12 bg-slate-50 rounded-2xl text-center border border-dashed border-slate-200">
                <p className="text-slate-400 font-medium text-base">Search YouTube for "{technique.youtubeSearchQueries[0]}"</p>
              </div>
            )}
          </div>
        </section>

        {/* Key Concepts */}
        <section>
          <div className="flex items-center gap-2 text-[#6d58e0] mb-5">
            <BookOpen size={18} />
            <span className="text-base font-semibold">Key Concepts</span>
          </div>
          <div className="bg-white rounded-2xl p-6 md:p-8 space-y-5 shadow-sm border border-black/5">
            {technique.readingPoints.map((point, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#f1effc] flex items-center justify-center text-[#6d58e0] font-semibold text-sm shrink-0">
                  {idx + 1}
                </div>
                <p className="text-lg font-medium text-slate-700 leading-relaxed pt-0.5">{point}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Practice Session */}
        <section>
          <div className="flex items-center gap-2 text-[#6d58e0] mb-5">
            <Dumbbell size={18} />
            <span className="text-base font-semibold">Practice Session</span>
          </div>
          <div className="bg-[#110d19] rounded-2xl p-8 text-white shadow-xl shadow-black/10 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
                Action Step
                <span className="text-xs bg-white/10 px-3 py-1 rounded-full text-indigo-300 border border-white/10 font-medium">Required</span>
              </h3>
              <p className="text-lg font-medium text-slate-300 leading-relaxed">
                {technique.practicePrompt}
              </p>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 blur-[100px] -mr-32 -mt-32" />
          </div>
        </section>

        {/* Strategic Challenge */}
        {plan.hobbyCategory === 'strategic' && technique.scenarioChallenge && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-2 text-amber-600 mb-5">
              <Trophy size={18} />
              <span className="text-base font-semibold">Strategic Challenge</span>
            </div>
            <div className="bg-amber-50/80 rounded-2xl p-8 border border-amber-200/50 shadow-sm">
              <h3 className="text-xl font-semibold text-amber-900 mb-6">{technique.scenarioChallenge.prompt}</h3>
              <div className="grid grid-cols-1 gap-3">
                {technique.scenarioChallenge.options.map((option, idx) => (
                  <button
                    key={idx}
                    disabled={scenarioResult.answered}
                    onClick={() => handleScenarioAnswer(idx)}
                    className={cn(
                      "w-full text-left p-4 rounded-xl font-medium text-base transition-all border",
                      !scenarioResult.answered
                        ? "bg-white border-white hover:border-amber-400 text-slate-700"
                        : idx === technique.scenarioChallenge?.correctIndex
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : "bg-white border-rose-200 text-slate-400 opacity-50"
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {scenarioResult.answered && (
                <div className="mt-6 p-6 bg-white rounded-xl border border-amber-200 shadow-sm animate-in zoom-in-95 duration-300">
                  <p className="text-amber-900 font-medium text-base leading-relaxed">{technique.scenarioChallenge.explanation}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Common Mistakes */}
        <section>
          <div className="flex items-center gap-2 text-rose-500 mb-5">
            <AlertCircle size={18} />
            <span className="text-base font-semibold">Common Mistakes</span>
          </div>
          <div className="bg-rose-50/50 rounded-2xl p-6 md:p-8 border border-rose-100 space-y-4">
            {technique.commonMistakes.map((mistake, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="w-7 h-7 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 font-semibold text-xs shrink-0">
                  !
                </div>
                <p className="text-base font-medium text-rose-900/80 leading-relaxed">{mistake}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Fixed bottom action button */}
      <footer className="fixed bottom-12 left-1/2 -translate-x-1/2 w-full max-w-lg px-8 z-50">
        <button
          onClick={handleMarkDone}
          className={cn(
            "w-full py-5 rounded-full text-xl font-semibold flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl",
            isDone
              ? "bg-slate-200 text-slate-500"
              : "bg-[#6d58e0] text-white hover:bg-[#5a47c4] shadow-indigo-200"
          )}
        >
          {isDone ? <CheckCircle2 size={24} /> : <Sparkles size={24} />}
          {isDone ? 'Mastered!' : 'Complete Lesson'}
        </button>
      </footer>
    </div>
  );
}
