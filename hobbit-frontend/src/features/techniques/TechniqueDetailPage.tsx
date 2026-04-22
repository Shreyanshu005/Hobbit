import { useState, useEffect, Suspense, lazy } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, CheckCircle2, Video, BookOpen, ExternalLink, Sparkles } from 'lucide-react';
import { Button } from '../../components/atoms/Button';
import { Card } from '../../components/atoms/Card';
import { useHobbyStore } from '../../stores/useHobbyStore';
import { useProgressStore } from '../../stores/useProgressStore';

const Confetti = lazy(() => import('../../components/Confetti'));

export default function TechniqueDetailPage() {
  const { hobbyId, techniqueId } = useParams<{ hobbyId: string; techniqueId: string }>();
  const navigate = useNavigate();
  const { setActiveHobby, activeHobby } = useHobbyStore();
  const { toggleTechnique, getHobbyProgress } = useProgressStore();
  
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (hobbyId) setActiveHobby(hobbyId);
  }, [hobbyId, setActiveHobby]);

  const technique = activeHobby?.techniques.find(t => t.id === techniqueId);
  const progress = activeHobby ? getHobbyProgress(activeHobby.hobbyId) : null;
  const isCompleted = progress?.completedTechniqueIds.includes(techniqueId || '') || false;

  if (!activeHobby || !technique) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Technique not found</h2>
        <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
      </div>
    );
  }

  const handleComplete = () => {
    if (techniqueId && activeHobby) {
      const alreadyCompleted = isCompleted;
      toggleTechnique(activeHobby.hobbyId, techniqueId);
      if (!alreadyCompleted) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
    }
  };

  const nextTechnique = activeHobby.techniques[activeHobby.techniques.indexOf(technique) + 1];

  return (
    <div className="max-w-4xl mx-auto px-4 pt-12 pb-32">
      {showConfetti && (
        <Suspense fallback={null}>
          <Confetti />
        </Suspense>
      )}

      <Link 
        to={`/plan/${activeHobby.hobbyId}`} 
        className="inline-flex items-center text-sm text-slate-500 hover:text-white transition-colors mb-8 group"
      >
        <ChevronLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" />
        Back to {activeHobby.hobby} Path
      </Link>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
             <span className="px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-wider">
               {technique.difficulty}
             </span>
             {isCompleted && (
               <span className="flex items-center gap-1.5 text-green-400 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-lg bg-green-400/10 border border-green-400/20">
                 <CheckCircle2 size={12} />
                 Mastered
               </span>
             )}
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">{technique.title}</h1>
        </div>
        <Button 
          variant={isCompleted ? "outline" : "primary"}
          size="lg"
          onClick={handleComplete}
          className="shadow-xl"
        >
          {isCompleted ? "Completed" : "Mark as Mastered"}
          {isCompleted ? <CheckCircle2 className="ml-2" size={20} /> : <Sparkles className="ml-2" size={20} />}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="overflow-hidden border-white/5">
            <div className="aspect-video bg-slate-950 flex flex-col items-center justify-center text-center p-8 group">
              <div className="w-16 h-16 bg-red-600/10 text-red-500 rounded-full flex items-center justify-center mb-4 border border-red-500/20 group-hover:scale-110 transition-transform duration-500">
                <Video size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Expert Demonstration</h3>
              <p className="text-slate-400 text-sm mb-6 max-w-sm">
                Watch a curated high-leverage tutorial for this specific technique.
              </p>
              <a 
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(technique.primaryYoutubeSearchQuery)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="rounded-full bg-red-600/10 border-red-500/50 text-red-500 hover:bg-red-600 hover:text-white transition-all">
                  Watch on YouTube
                  <ExternalLink className="ml-2" size={16} />
                </Button>
              </a>
            </div>
          </Card>

          <section>
            <div className="flex items-center gap-2 mb-6 text-indigo-400">
              <BookOpen size={20} />
              <h2 className="text-lg font-bold uppercase tracking-widest text-white">Conceptual Focus</h2>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {technique.readingPoints.map((point, idx) => (
                <Card key={idx} className="p-5 border-white/5 bg-slate-900/30 hover:bg-slate-900/50 transition-colors">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold text-slate-500 border border-white/5">
                      {idx + 1}
                    </div>
                    <p className="text-slate-300 leading-relaxed pt-1">{point}</p>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <Card className="p-6 border-white/5 bg-indigo-600/5 overflow-hidden relative">
             <div className="absolute top-0 right-0 p-3 opacity-10">
               <Sparkles size={64} />
             </div>
             <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-[0.2em] mb-4">Why it matters</h3>
             <p className="text-slate-200 text-sm italic leading-relaxed">
               "{technique.whyItMatters}"
             </p>
          </Card>

          {nextTechnique && (
            <div className="p-6 rounded-2xl border border-dashed border-white/10 flex flex-col items-center text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Next Up</span>
              <h4 className="font-bold mb-6">{nextTechnique.title}</h4>
              <Link to={`/technique/${activeHobby.hobbyId}/${nextTechnique.id}`} className="w-full">
                <Button variant="ghost" className="w-full text-xs">
                  See Preview
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
