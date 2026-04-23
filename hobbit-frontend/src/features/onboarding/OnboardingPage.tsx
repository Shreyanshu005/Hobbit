import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, ArrowUp, Upload, Mic } from 'lucide-react';
import { useHobbyStore } from '../../stores/useHobbyStore';
import { planService } from '../../services/planService';
import { storage, STORAGE_KEYS } from '../../utils/storage';
import { validateHobby } from '../../utils/validators';
import { cn } from '../../utils/cn';

type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
  type?: 'options';
  options?: string[];
  field?: 'level' | 'goal';
};

export default function OnboardingPage() {
  const navigate = useNavigate();
  const addHobby = useHobbyStore((state) => state.addHobby);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'system', content: "To personalize your course, let's understand your learning goal and background knowledge." },
    { role: 'assistant', content: "Hi! I am Hobbit. What hobby would you like to master today?" }
  ]);
  const [input, setInput] = useState('');
  const [hobby, setHobby] = useState('');
  const [level, setLevel] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking, isGenerating]);

  const handleHobbySubmit = () => {
    const validationError = validateHobby(input);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    const userHobby = input.trim();
    setHobby(userHobby);
    setMessages(prev => [...prev, { role: 'user', content: userHobby }]);
    setInput('');
    setIsThinking(true);
    setTimeout(() => {
      setIsThinking(false);
      setMessages(prev => [
        ...prev,
        { 
          role: 'assistant', 
          content: `That's a great choice! What is your current experience level with ${userHobby}?`,
          type: 'options',
          field: 'level',
          options: ['Complete beginner', 'Know a few basics', 'Intermediate', 'Advanced']
        }
      ]);
    }, 2000);
  };

  const handleOptionSelect = (option: string, field: 'level' | 'goal') => {
    setMessages(prev => [...prev, { role: 'user', content: option }]);
    setIsThinking(true);
    if (field === 'level') {
      const mappedLevel = option.toLowerCase().includes('beginner') ? 'beginner' : 
                          option.toLowerCase().includes('intermediate') ? 'intermediate' : 'casual';
      setLevel(mappedLevel);
      setTimeout(() => {
        setIsThinking(false);
        setMessages(prev => [
          ...prev,
          { 
            role: 'assistant', 
            content: `Perfect. And what's your primary goal for learning ${hobby}?`,
            type: 'options',
            field: 'goal',
            options: ['Just for fun', 'Perform for others', 'Compete', 'Social/Meet people']
          }
        ]);
      }, 2000);
    } else {
      const mappedGoal = option.toLowerCase().includes('fun') ? 'just-for-fun' :
                         option.toLowerCase().includes('perform') ? 'perform' :
                         option.toLowerCase().includes('compete') ? 'compete' : 'social';
      setTimeout(() => {
        setIsThinking(false);
        generatePlan(mappedGoal);
      }, 2000);
    }
  };

  const generatePlan = async (finalGoal: string) => {
    setIsGenerating(true);
    try {
      const plan = await planService.getPlan(hobby, level as any, finalGoal as any);
      addHobby(plan);
      storage.remove(STORAGE_KEYS.SETTINGS);
      navigate(`/plan/${plan.hobbyId}`);
    } catch (err: any) {
      setIsGenerating(false);
      setMessages(prev => [...prev, { role: 'assistant', content: "Something went wrong. Let's try again. What hobby are you interested in?" }]);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] max-w-4xl mx-auto py-8">
      <div className="w-full max-w-2xl mx-auto bg-[#eeebff] rounded-xl p-3 mb-8 flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-1.5 text-[#6d58e0] font-bold">
          <Globe className="w-5 h-5" />
          <span className="text-sm">Internet</span>
        </div>
        <div className="h-4 w-[1px] bg-[#6d58e0]/20" />
        <p className="text-sm font-semibold text-slate-500">
          Tell Hobbit <span className="text-slate-900">what hobby you want to learn?</span>
        </p>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 space-y-8 scroll-smooth pb-20">
        {messages.map((msg, idx) => (
          <div key={idx} className={cn(
            "flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300",
            msg.role === 'user' ? "items-end" : "items-start"
          )}>
            {msg.role === 'system' ? (
              <p className="w-full text-center text-slate-400 font-medium text-sm mb-4">{msg.content}</p>
            ) : msg.role === 'user' ? (
              <div className="bg-[#e0f2fe] text-slate-900 px-5 py-2.5 rounded-2xl font-medium shadow-sm max-w-[80%]">{msg.content}</div>
            ) : (
              <div className="space-y-4 max-w-[90%]">
                <p className="text-[17px] font-semibold text-[#1d1627] leading-relaxed">{msg.content}</p>
                {msg.type === 'options' && (
                  <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
                    {msg.options?.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleOptionSelect(opt, msg.field!)}
                        className="px-5 py-2 rounded-xl bg-white border border-black/10 text-slate-700 font-bold hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm text-sm"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        {isThinking && (
          <div className="flex items-center gap-1.5 px-2 animate-in fade-in duration-300">
            <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" />
          </div>
        )}
        {isGenerating && (
          <div className="flex flex-col items-start space-y-4 animate-in fade-in duration-300">
            <p className="text-[17px] font-semibold text-indigo-600 animate-pulse">Crafting your personalized {hobby} plan...</p>
          </div>
        )}
      </div>
      <div className="mt-auto px-4 pb-4 bg-[#fffbf4]">
        <div className="max-w-2xl mx-auto relative">
          <div className={cn(
            "bg-white border rounded-2xl shadow-sm transition-all overflow-hidden flex items-center pr-3 min-h-[60px]",
            error ? "border-red-400" : "border-black/15 focus-within:border-black/30"
          )}>
            <div className="flex items-center gap-1 px-3">
              <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors"><Upload size={20} /></button>
            </div>
            <input
              autoFocus
              type="text"
              value={input}
              disabled={isThinking || isGenerating}
              onChange={(e) => {
                setInput(e.target.value);
                if (error) setError(null);
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleHobbySubmit()}
              placeholder="Or type your own response here..."
              className="flex-1 bg-transparent py-4 text-[17px] font-medium text-slate-900 focus:outline-none placeholder:text-slate-300 disabled:opacity-50"
            />
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors"><Mic size={20} /></button>
              <button 
                onClick={handleHobbySubmit}
                disabled={input.length < 2 || isGenerating || isThinking}
                className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all disabled:opacity-30"
              >
                <ArrowUp size={22} strokeWidth={2.5} />
              </button>
            </div>
          </div>
          {error && <p className="absolute left-4 -bottom-6 text-red-500 text-xs font-bold animate-in fade-in slide-in-from-top-1">{error}</p>}
        </div>
      </div>
    </div>
  );
}
