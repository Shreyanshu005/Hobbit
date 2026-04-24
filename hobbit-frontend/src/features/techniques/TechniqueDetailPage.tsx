import { useState, useEffect, Suspense, lazy, useMemo, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ChevronLeft,
  CheckCircle2,
  Layout,
  ExternalLink,
  ChevronRight,
  Trophy
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlan } from '../../hooks/usePlan';
import { useProgressStore } from '../../stores/useProgressStore';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { cn } from '../../utils/cn';
import { HobbyButton } from '../../components/atoms/HobbyButton';
import { LessonSidebar } from './components/LessonSidebar';

const Confetti = lazy(() => import('../../components/Confetti'));

export default function TechniqueDetailPage() {
  const { hobbyId, techniqueId } = useParams<{ hobbyId: string; techniqueId: string }>();
  const navigate = useNavigate();
  const mainScrollRef = useRef<HTMLElement>(null);
  const { plan, isLoading } = usePlan(hobbyId);
  const { getTechniqueStatus, toggleTechnique, skipTechnique } = useProgressStore();

  const [showCelebration] = useState(false);
  const [scenarioResult, setScenarioResult] = useState<{ answered: boolean; correct: boolean | null }>({ answered: false, correct: null });
  const [sidebarExpanded, setSidebarExpanded] = useState(window.innerWidth > 1024);

  useEffect(() => {
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTo(0, 0);
    }
    setScenarioResult({ answered: false, correct: null });
  }, [techniqueId]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        setSidebarExpanded(false);
      } else {
        setSidebarExpanded(true);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (sidebarExpanded && window.innerWidth <= 1024) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarExpanded]);

  const technique = useMemo(() => plan?.techniques.find(t => t.id === techniqueId), [plan, techniqueId]);
  const currentIndex = useMemo(() => plan?.techniques.findIndex(t => t.id === techniqueId) ?? -1, [plan, techniqueId]);

  const nextTechnique = useMemo(() => {
    if (currentIndex === -1 || !plan) return null;
    return plan.techniques.slice(currentIndex + 1).find(t => getTechniqueStatus(plan.hobbyId, t.id) !== 'skipped');
  }, [plan, currentIndex, getTechniqueStatus]);

  if (isLoading || !plan) return <LoadingSpinner message="Loading technique..." />;
  if (!technique) return <div className="flex items-center justify-center min-h-[60vh] text-rose-500 text-lg font-medium">Technique not found</div>;

  const handleScenarioAnswer = (index: number) => {
    const isCorrect = index === technique.scenarioChallenge?.correctIndex;
    setScenarioResult({ answered: true, correct: isCorrect });
  };

  return (
    <div className="flex h-full bg-transparent overflow-hidden relative">
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

      <AnimatePresence>
        {sidebarExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarExpanded(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {sidebarExpanded && (
          <LessonSidebar
            plan={plan}
            activeTechniqueId={technique.id}
            getTechniqueStatus={getTechniqueStatus}
            toggleTechnique={toggleTechnique}
            skipTechnique={skipTechnique}
            setSidebarExpanded={setSidebarExpanded}
          />
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0 h-full">
        <header className="h-16 border-b border-gray-100 flex items-center justify-between px-6 shrink-0 z-20 bg-[#fffbf4]/50 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-slate-500"
              title={sidebarExpanded ? "Hide Lessons" : "Show Lessons"}
            >
              <Layout size={20} className={cn("transition-transform", !sidebarExpanded && "rotate-180")} />
            </button>
            <div className="w-px h-6 bg-gray-100 mx-1 hidden lg:block" />
            <Link to="/dashboard" className="p-1 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="w-8 h-8 flex items-center justify-center">
                <ChevronLeft size={24} className="text-gray-400" />
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-4">
          </div>
        </header>

        <main
          ref={mainScrollRef}
          className="flex-1 overflow-y-auto bg-transparent relative w-full scroll-smooth"
        >
          <div className="max-w-4xl mx-auto px-6 md:px-10 py-12 md:py-20 pb-40">
            <div className="mb-16">
              <div className="relative inline-block mb-6">
                <h1
                  className="text-3xl md:text-5xl font-bold text-slate-900 leading-[1.1] relative z-10"
                  style={{ fontFamily: "'Caveat', cursive" }}
                >
                  {technique.title}
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
              <p className="text-lg md:text-xl font-medium text-gray-400 mb-10 tracking-tight">
                {technique.whyItMatters}
              </p>

              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed font-medium">
                {technique.readingPoints.map((point, idx) => {
                  const [heading, ...contentParts] = point.includes(':') ? point.split(':') : [`Concept ${idx + 1}`, point];
                  const fullContent = contentParts.join(':').trim();
                  const [intro, ...bullets] = fullContent.split('•').map(s => s.trim()).filter(Boolean);

                  return (
                    <div key={idx} className="mb-10 group">
                      <h3 className="text-4xl font-bold text-slate-900 mb-4 ">
                        {heading.trim()}
                      </h3>
                      <div className="space-y-4">
                        {intro && (
                          <p className="text-lg text-gray-600/90 leading-relaxed">
                            {intro}
                          </p>
                        )}
                        {bullets.length > 0 && (
                          <ul className="list-none space-y-3">
                            {bullets.map((bullet, bIdx) => (
                              <li key={bIdx} className="flex gap-3 text-lg text-gray-600/90">
                                <span className="text-indigo-400 shrink-0">•</span>
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-8">
              <section className="bg-transparent rounded-sm p-8 border border-slate-200 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.03)]">
                <div className="flex items-center gap-3 text-slate-900 mb-6">

                  <span className="text-4xl font-bold uppercase tracking-wider">Practice Session</span>
                </div>
                <h3 className="text-3xl font-semibold text-slate-900 mb-4">Action Step</h3>
                <p className="text-lg text-slate-700 leading-relaxed">
                  {technique.practicePrompt}
                </p>
              </section>

              <section className="bg-transparent rounded-sm p-8 border border-slate-200 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.03)]">
                <div className="flex items-center gap-3 text-slate-900 mb-6">

                  <span className="text-4xl font-bold uppercase tracking-wider">Common Mistakes</span>
                </div>
                <div className="space-y-4">
                  {technique.commonMistakes.map((mistake, idx) => (
                    <div key={idx} className="flex gap-3">
                      <span className="text-slate-400 font-bold shrink-0 mt-0.5">•</span>
                      <p className="text-base text-slate-600 font-medium leading-relaxed">{mistake}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {technique.videos && technique.videos.length > 0 && (
              <section className="mt-20">
                <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-3 text-gray-900">
                    <h2 className="text-2xl font-bold">Watch & Learn</h2>
                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {technique.videos.map((video) => (
                    <a
                      key={video.videoId}
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col gap-3 rounded-2xl overflow-hidden"
                    >
                      <div className="aspect-video rounded-2xl overflow-hidden relative border border-gray-100">
                        <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur shadow-xl flex items-center justify-center scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all">
                            <ExternalLink size={20} className="text-gray-900 ml-0.5" />
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="text-[17px] font-semibold text-gray-900 leading-snug line-clamp-2">
                          {video.title}
                        </div>
                        <div className="text-sm font-medium text-gray-400 mt-1">
                          {video.channelName}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            )}

            {plan.hobbyCategory === 'strategic' && technique.scenarioChallenge && (
              <section className="mt-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center gap-3 text-slate-900 mb-8 border-b border-black/5 pb-4">
                  <Trophy size={20} />
                  <h2 className="text-2xl font-bold">Strategic Challenge</h2>
                </div>
                <div className="bg-transparent rounded-2xl p-8 border border-black/5">
                  <h3 className="text-2xl font-bold text-slate-900 mb-8 leading-tight">{technique.scenarioChallenge.prompt}</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {technique.scenarioChallenge.options.map((option, idx) => (
                      <button
                        key={idx}
                        disabled={scenarioResult.answered}
                        onClick={() => handleScenarioAnswer(idx)}
                        className={cn(
                          "w-full text-left p-6 rounded-xl font-medium text-[17px] transition-all border-2",
                          !scenarioResult.answered
                            ? "bg-white border-white hover:border-slate-300 text-gray-700 shadow-sm"
                            : idx === technique.scenarioChallenge?.correctIndex
                              ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-100"
                              : "bg-white/50 border-gray-100 text-gray-400 opacity-50"
                        )}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  {scenarioResult.answered && (
                    <div className="mt-8 p-6 bg-white/80 rounded-xl border border-black/5">
                      <p className="text-slate-900 font-medium text-lg leading-relaxed">{technique.scenarioChallenge.explanation}</p>
                    </div>
                  )}
                </div>
              </section>
            )}

            <div className="mt-32 pt-10 border-t border-black/5 flex justify-end">
              {nextTechnique ? (
                <HobbyButton
                  onClick={() => {
                    navigate(`/technique/${plan.hobbyId}/${nextTechnique.id}`);
                  }}
                  className="px-4 py-2 text-lg rounded-full"
                >
                  <span>Next Lesson</span>
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </HobbyButton>
              ) : (
                <Link
                  to="/dashboard"
                  className="inline-block"
                >
                  <HobbyButton
                    className="rounded-full border-slate-200 bg-transparent shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)] active:shadow-none px-6 py-2 text-lg text-slate-900"
                  >
                    <span>Finish</span>

                  </HobbyButton>
                </Link>
              )}
            </div>
          </div>

          <div className="h-20" />

        </main>
      </div>
    </div>
  );
}
