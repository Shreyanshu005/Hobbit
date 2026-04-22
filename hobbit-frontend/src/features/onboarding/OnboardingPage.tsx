import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Trophy, Users, Sparkles, ChevronRight, ChevronLeft, Search } from 'lucide-react';
import { Button } from '../../components/atoms/Button';
import { Card } from '../../components/atoms/Card';
import type { HobbyLevel, HobbyGoal } from '../../types';
import { useHobbyStore } from '../../stores/useHobbyStore';
import { planService } from '../../services/planService';
import { cn } from '../../utils/cn';

interface Step {
  id: string;
  title: string;
  description: string;
}

export default function OnboardingPage() {
  const navigate = useNavigate();
  const addHobby = useHobbyStore((state) => state.addHobby);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    hobby: '',
    level: 'beginner' as HobbyLevel,
    goal: 'just-for-fun' as HobbyGoal,
  });

  const steps: Step[] = [
    { id: 'interest', title: 'What sparks your curiosity?', description: 'Enter a hobby you want to master.' },
    { id: 'level', title: 'Where do you stand?', description: 'Be honest! This shapes your learning path.' },
    { id: 'goal', title: 'What is your objective?', description: 'Choose why you want to learn this.' },
  ];

  const levels: { value: HobbyLevel; label: string; info: string }[] = [
    { value: 'beginner', label: 'Absolute Beginner', info: 'No prior experience.' },
    { value: 'intermediate', label: 'Knowledgeable', info: 'Some basic skills.' },
    { value: 'casual', label: 'Casual Learner', info: 'Learning for leisure.' },
  ];

  const goals: { value: HobbyGoal; label: string; icon: any }[] = [
    { value: 'just-for-fun', label: 'Just for Fun', icon: Sparkles },
    { value: 'perform', label: 'Perform', icon: Target },
    { value: 'compete', label: 'Compete', icon: Trophy },
    { value: 'social', label: 'Social', icon: Users },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      generatePlan();
    }
  };

  const generatePlan = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const plan = await planService.getPlan(formData.hobby, formData.level, formData.goal);
      addHobby(plan);
      navigate(`/plan/${plan.hobbyId}`);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setIsGenerating(false);
    }
  };

  const isStepValid = useMemo(() => {
    if (currentStep === 0) return formData.hobby.length >= 2;
    return true;
  }, [currentStep, formData]);

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full animate-pulse" />
          <div className="relative w-24 h-24 bg-slate-900 border border-white/10 rounded-3xl flex items-center justify-center animate-bounce shadow-2xl">
            <Sparkles className="text-indigo-400 w-10 h-10 animate-pulse" />
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          Crafting your unique path...
        </h2>
        <p className="text-slate-400 max-w-md mx-auto leading-relaxed">
          Our AI is analyzing {formData.hobby} and structuring the perfect curriculum for your {formData.goal} goal.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 pt-20 pb-12">
      <div className="mb-12 flex items-center justify-between">
        <div>
          <span className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-2 block">
            Step {currentStep + 1} of {steps.length}
          </span>
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            {steps[currentStep].title}
          </h1>
          <p className="text-slate-400">
            {steps[currentStep].description}
          </p>
        </div>
        <div className="flex gap-2">
          {steps.map((_, idx) => (
            <div 
              key={idx}
              className={cn(
                "h-1.5 rounded-full transition-all duration-500",
                idx === currentStep ? "w-8 bg-indigo-500" : "w-3 bg-white/10"
              )}
            />
          ))}
        </div>
      </div>

      <Card className="p-8 mb-8 border-white/5 bg-slate-900/40">
        {currentStep === 0 && (
          <div className="space-y-6">
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none group-focus-within:text-indigo-400 transition-colors">
                <Search size={20} />
              </div>
              <input
                autoFocus
                type="text"
                value={formData.hobby}
                onChange={(e) => setFormData({ ...formData, hobby: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && isStepValid && handleNext()}
                placeholder="e.g. Calligraphy, Chess, Rock Climbing..."
                className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all placeholder:text-slate-600"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {['Cooking', 'Guitar', 'Photography', 'Astronomy'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setFormData({ ...formData, hobby: suggestion })}
                  className="px-3 py-1.5 rounded-full border border-white/5 bg-white/5 text-xs text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="grid grid-cols-1 gap-4">
            {levels.map((level) => (
              <button
                key={level.value}
                onClick={() => setFormData({ ...formData, level: level.value })}
                className={cn(
                  "p-5 rounded-2xl border text-left transition-all group",
                  formData.level === level.value 
                    ? "bg-indigo-600/10 border-indigo-500/50 ring-1 ring-indigo-500/20" 
                    : "bg-white/5 border-white/5 hover:bg-white/10"
                )}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className={cn(
                      "font-bold text-lg mb-1 transition-colors",
                      formData.level === level.value ? "text-indigo-400" : "text-white"
                    )}>
                      {level.label}
                    </div>
                    <div className="text-sm text-slate-400">
                      {level.info}
                    </div>
                  </div>
                  <div className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                    formData.level === level.value 
                      ? "border-indigo-500 bg-indigo-500 text-white" 
                      : "border-white/10"
                  )}>
                    {formData.level === level.value && <ChevronRight size={14} />}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {currentStep === 2 && (
          <div className="grid grid-cols-2 gap-4">
            {goals.map((goal) => {
              const GoalIcon = goal.icon;
              const isActive = formData.goal === goal.value;
              return (
                <button
                  key={goal.value}
                  onClick={() => setFormData({ ...formData, goal: goal.value })}
                  className={cn(
                    "p-6 rounded-2xl border flex flex-col items-center justify-center gap-4 transition-all group aspect-square",
                    isActive 
                      ? "bg-indigo-600/10 border-indigo-500/50 ring-1 ring-indigo-500/20" 
                      : "bg-white/5 border-white/5 hover:bg-white/10"
                  )}
                >
                  <div className={cn(
                    "p-3 rounded-xl transition-all",
                    isActive ? "bg-indigo-600 text-white scale-110 shadow-lg shadow-indigo-600/20" : "bg-white/5 text-slate-400"
                  )}>
                    <GoalIcon size={28} />
                  </div>
                  <span className={cn(
                    "font-bold transition-colors",
                    isActive ? "text-indigo-400" : "text-slate-300"
                  )}>
                    {goal.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </Card>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/50 text-red-500 text-sm flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          {error}
        </div>
      )}

      <div className="flex gap-4">
        {currentStep > 0 && (
          <Button 
            variant="ghost" 
            onClick={() => setCurrentStep(currentStep - 1)}
            className="flex-1 py-4 h-auto"
          >
            <ChevronLeft size={20} className="mr-2" />
            Back
          </Button>
        )}
        <Button 
          disabled={!isStepValid}
          onClick={handleNext}
          className="flex-[2] py-4 h-auto text-lg"
        >
          {currentStep === steps.length - 1 ? 'Generate My Plan' : 'Continue'}
          <ChevronRight size={20} className="ml-2" />
        </Button>
      </div>
    </div>
  );
}
