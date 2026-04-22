import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Play, CheckCircle2, Circle, ArrowDown } from 'lucide-react';
import { Button } from '../../components/atoms/Button';
import { Card } from '../../components/atoms/Card';
import { useHobbyStore } from '../../stores/useHobbyStore';
import { useProgressStore } from '../../stores/useProgressStore';
import { cn } from '../../utils/cn';

export default function PlanDetailPage() {
  const { hobbyId } = useParams<{ hobbyId: string }>();
  const navigate = useNavigate();
  const { setActiveHobby, activeHobby } = useHobbyStore();
  const { getHobbyProgress } = useProgressStore();

  useEffect(() => {
    if (hobbyId) {
      setActiveHobby(hobbyId);
    }
  }, [hobbyId, setActiveHobby]);

  if (!activeHobby) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Plan not found</h2>
        <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
      </div>
    );
  }

  const progress = getHobbyProgress(activeHobby.hobbyId);
  const completedIds = progress?.completedTechniqueIds || [];

  return (
    <div className="max-w-3xl mx-auto px-4 pt-12 pb-24">
      <Link to="/dashboard" className="inline-flex items-center text-sm text-slate-500 hover:text-white transition-colors mb-8 group">
        <ChevronLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </Link>

      <div className="mb-12">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4">{activeHobby.hobby}</h1>
        <div className="flex flex-wrap gap-3">
          <span className="px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest">
            {activeHobby.level}
          </span>
          <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-400 text-xs font-bold uppercase tracking-widest">
            {activeHobby.goal.replace('-', ' ')}
          </span>
        </div>
      </div>

      <div className="space-y-4 relative">

        <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-indigo-500/50 via-slate-800 to-indigo-500/50 hidden sm:block" />

        {activeHobby.techniques.map((technique, idx) => {
          const isCompleted = completedIds.includes(technique.id);
          const isNext = !isCompleted && (idx === 0 || completedIds.includes(activeHobby.techniques[idx-1].id));

          return (
            <div key={technique.id} className="relative group">
              <div className="flex gap-6 items-start">

                <div className="relative z-10 mt-5 hidden sm:block">
                  {isCompleted ? (
                    <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/40">
                      <CheckCircle2 size={28} />
                    </div>
                  ) : isNext ? (
                    <div className="w-14 h-14 rounded-2xl bg-slate-900 border-2 border-indigo-500 text-indigo-400 flex items-center justify-center animate-pulse shadow-xl shadow-indigo-500/20">
                      <Circle size={28} />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-white/5 text-slate-700 flex items-center justify-center">
                      <Circle size={28} />
                    </div>
                  )}
                </div>


                <Link 
                  to={`/technique/${activeHobby.hobbyId}/${technique.id}`}
                  className="flex-1"
                >
                  <Card className={cn(
                    "p-6 hover:translate-x-2 transition-all duration-300 border-white/5",
                    isNext && "border-indigo-500/30 bg-slate-900/60 ring-1 ring-indigo-500/10",
                    !isCompleted && !isNext && "opacity-50 grayscale"
                  )}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-bold text-indigo-400/80 uppercase tracking-[0.2em] bg-indigo-400/10 px-2 py-0.5 rounded">
                            STEP {idx + 1}
                          </span>
                          {isCompleted && (
                            <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest bg-green-400/10 px-2 py-0.5 rounded">
                              Completed
                            </span>
                          )}
                        </div>
                        <h3 className={cn(
                          "text-xl font-bold transition-colors",
                          isCompleted ? "text-slate-400 line-through decoration-indigo-500/50" : "text-white"
                        )}>
                          {technique.title}
                        </h3>
                        <p className="text-slate-500 text-sm mt-2 line-clamp-1">
                          {technique.whyItMatters}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant={isNext ? "primary" : "outline"} 
                          size="sm"
                          className="rounded-full h-10 w-10 p-0 sm:w-auto sm:px-4 sm:h-auto"
                        >
                          <Play size={16} className={cn(isNext && "fill-current mr-0 sm:mr-2")} />
                          <span className="hidden sm:inline">{isCompleted ? 'Review' : 'Start'}</span>
                        </Button>
                      </div>
                    </div>
                  </Card>
                </Link>
              </div>
              
              {idx < activeHobby.techniques.length - 1 && (
                <div className="sm:hidden flex justify-center py-2">
                   <ArrowDown size={16} className="text-slate-700" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
