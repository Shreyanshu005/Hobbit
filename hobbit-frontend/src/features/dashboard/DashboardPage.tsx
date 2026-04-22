import { Link } from 'react-router-dom';
import { Plus, Trophy, Clock, ChevronRight, Zap } from 'lucide-react';
import { Button } from '../../components/atoms/Button';
import { Card } from '../../components/atoms/Card';
import { useHobbyStore } from '../../stores/useHobbyStore';
import { useProgressStore } from '../../stores/useProgressStore';

export default function DashboardPage() {
  const hobbies = useHobbyStore((state) => state.hobbies);
  const getHobbyProgress = useProgressStore((state) => state.getHobbyProgress);

  if (hobbies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
          <Zap className="text-slate-500 w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold mb-2">No active journeys</h2>
        <p className="text-slate-400 mb-8 max-w-sm">
          You haven't started learning any hobbies yet. Let's find your first passion.
        </p>
        <Link to="/onboarding">
          <Button size="lg">
            <Plus className="mr-2" size={20} />
            Start Onboarding
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pt-12 pb-12">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">My Journeys</h1>
          <p className="text-slate-400">Track your skills and progress across your favorite hobbies.</p>
        </div>
        <Link to="/onboarding">
          <Button variant="outline" size="sm">
            <Plus className="mr-1" size={16} />
            Add New
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hobbies.map((plan) => {
          const progress = getHobbyProgress(plan.hobbyId);
          const completedCount = progress?.completedTechniqueIds.length || 0;
          const totalCount = plan.techniques.length;
          const percentage = Math.round((completedCount / totalCount) * 100);

          return (
            <Link key={plan.hobbyId} to={`/plan/${plan.hobbyId}`} className="group">
              <Card className="p-6 h-full border-white/5 hover:border-indigo-500/50 hover:bg-slate-900/60 group-hover:scale-[1.02]">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                    <Trophy size={24} />
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-white/5 px-3 py-1 rounded-full">
                    <Clock size={12} />
                    {plan.level}
                  </div>
                </div>

                <h3 className="text-2xl font-bold mb-1">{plan.hobby}</h3>
                <p className="text-slate-400 text-sm mb-6 line-clamp-1">{plan.goal.replace('-', ' ')} objective</p>

                <div className="space-y-4">
                  <div className="flex justify-between items-end text-sm">
                    <span className="text-slate-400 font-medium">Core Techniques ({completedCount}/{totalCount})</span>
                    <span className="text-indigo-400 font-bold">{percentage}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(99,102,241,0.5)]"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/5 flex items-center text-xs font-semibold text-slate-500 group-hover:text-indigo-400 transition-colors">
                  Continue Learning
                  <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
