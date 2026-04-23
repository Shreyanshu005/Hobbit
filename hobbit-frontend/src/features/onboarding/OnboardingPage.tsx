import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Globe, ArrowUp } from 'lucide-react';
import { useHobbyStore } from '../../stores/useHobbyStore';
import { useCollectionStore } from '../../stores/useCollectionStore';
import { planService } from '../../services/planService';
import { storage, STORAGE_KEYS } from '../../utils/storage';
import { validateHobby } from '../../utils/validators';
import * as validateService from '../../services/validateService';
import { fetchHobbyFacts } from '../../services/hobbyService';
import { cn } from '../../utils/cn';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import logoPng from '../../assets/logo.png';

type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
  type?: 'options';
  options?: string[];
  field?: 'level' | 'goal';
};

const PLACEHOLDER_PROMPTS = [
  'I want to learn Guitar...',
  'Teach me Chess...',
  'I want to master Cooking...',
  'Help me with Photography...',
  'I want to learn Dancing...',
  'Teach me Origami...',
];

/** Strip common prefixes to extract the actual hobby name */
function extractHobby(raw: string): string {
  const prefixes = [
    /^i\s+want\s+to\s+learn\s+/i,
    /^i\s+want\s+to\s+master\s+/i,
    /^i\s+want\s+to\s+try\s+/i,
    /^i\s+want\s+to\s+do\s+/i,
    /^i\s+want\s+to\s+start\s+/i,
    /^teach\s+me\s+/i,
    /^help\s+me\s+with\s+/i,
    /^help\s+me\s+learn\s+/i,
    /^i\s+like\s+/i,
    /^i\s+love\s+/i,
    /^let'?s\s+learn\s+/i,
    /^let'?s\s+try\s+/i,
  ];
  let cleaned = raw.trim();
  for (const prefix of prefixes) {
    cleaned = cleaned.replace(prefix, '');
  }
  // Remove trailing punctuation
  cleaned = cleaned.replace(/[.!?,;]+$/, '').trim();
  return cleaned || raw.trim();
}

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { collectionId } = useParams<{ collectionId: string }>();
  const addHobby = useHobbyStore((state) => state.addHobby);
  const addHobbyToCollection = useCollectionStore((state) => state.addHobbyToCollection);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'system', content: "To personalize your course, let's understand your learning goal and background knowledge." },
    { role: 'assistant', content: "Hi! I am Hobbit. What hobby would you like to master today?" }
  ]);
  const [input, setInput] = useState('');
  const [hobby, setHobby] = useState('');
  const [level, setLevel] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState<'idle' | 'checking' | 'error' | 'valid'>('idle');
  const [loadingFacts, setLoadingFacts] = useState<string[]>([]);
  const [factIndex, setFactIndex] = useState(0);

  // Animated placeholder
  const [placeholderText, setPlaceholderText] = useState('');
  const [promptIdx, setPromptIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = PLACEHOLDER_PROMPTS[promptIdx];
    const speed = isDeleting ? 30 : 60;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setPlaceholderText(current.slice(0, charIdx + 1));
        setCharIdx(charIdx + 1);
        if (charIdx + 1 === current.length) {
          setTimeout(() => setIsDeleting(true), 1500);
        }
      } else {
        setPlaceholderText(current.slice(0, charIdx - 1));
        setCharIdx(charIdx - 1);
        if (charIdx - 1 === 0) {
          setIsDeleting(false);
          setPromptIdx((promptIdx + 1) % PLACEHOLDER_PROMPTS.length);
        }
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [charIdx, isDeleting, promptIdx]);

  // Cycle loading facts
  useEffect(() => {
    if (isGenerating && loadingFacts.length > 0) {
      const interval = setInterval(() => {
        setFactIndex((prev) => (prev + 1) % loadingFacts.length);
      }, 3000);
      return () => clearInterval(interval);
    } else {
      setFactIndex(0);
    }
  }, [isGenerating, loadingFacts]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, status, isGenerating]);

  const handleHobbySubmit = async () => {
    const basicError = validateHobby(input);
    if (basicError) {
      setMessages(prev => [...prev, { role: 'user', content: input }]);
      setInput('');
      setStatus('checking');
      setTimeout(() => {
        setStatus('idle');
        setMessages(prev => [...prev, { role: 'assistant', content: basicError }]);
      }, 2000);
      return;
    }

    setStatus('checking');
    const rawInput = input.trim();
    const extractedHobby = extractHobby(rawInput);
    setMessages(prev => [...prev, { role: 'user', content: rawInput }]);
    setInput('');

    try {
      const response = await validateService.checkHobby(extractedHobby);
      if (!response.success) {
        setStatus('idle');
        setMessages(prev => [...prev, { role: 'assistant', content: response.error }]);
        return;
      }
      setHobby(extractedHobby);

      setTimeout(() => {
        setStatus('idle');
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: `That's a great choice! What is your current experience level with ${extractedHobby}?`,
            type: 'options',
            field: 'level',
            options: ['Beginner', 'Know basics', 'Intermediate', 'Advanced']
          }
        ]);
      }, 2000);
    } catch (err) {
      setHobby(extractedHobby);
      setTimeout(() => {
        setStatus('idle');
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: `That's a great choice! What is your current experience level with ${extractedHobby}?`,
            type: 'options',
            field: 'level',
            options: ['Beginner', 'Know basics', 'Intermediate', 'Advanced']
          }
        ]);
      }, 2000);
    }
  };

  const handleOptionSelect = (option: string, field: 'level' | 'goal') => {
    setMessages(prev => [...prev, { role: 'user', content: option }]);
    setStatus('checking');
    if (field === 'level') {
      const mappedLevel = option.toLowerCase().includes('beginner') ? 'beginner' :
        option.toLowerCase().includes('intermediate') ? 'intermediate' : 'casual';
      setLevel(mappedLevel);
      setTimeout(() => {
        setStatus('idle');
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: `Perfect. And what's your primary goal for learning ${hobby}?`,
            type: 'options',
            field: 'goal',
            options: ['Just for fun', 'Perform', 'Compete', 'Social']
          }
        ]);
      }, 2000);
    } else {
      const mappedGoal = option.toLowerCase().includes('fun') ? 'just-for-fun' :
        option.toLowerCase().includes('perform') ? 'perform' :
          option.toLowerCase().includes('compete') ? 'compete' : 'social';
      setTimeout(() => {
        setStatus('idle');
        generatePlan(mappedGoal);
      }, 2000);
    }
  };

  const generatePlan = async (finalGoal: string) => {
    setIsGenerating(true);
    // Fetch fun facts from Groq while plan generates
    fetchHobbyFacts(hobby).then(facts => setLoadingFacts(facts));
    try {
      const plan = await planService.getPlan(hobby, level as any, finalGoal as any);
      addHobby({ ...plan, chatHistory: messages });

      if (collectionId && collectionId !== 'general') {
        addHobbyToCollection(collectionId, plan.hobbyId);
      }

      storage.remove(STORAGE_KEYS.SETTINGS);
      navigate(`/plan/${plan.hobbyId}`);
    } catch (err: any) {
      setIsGenerating(false);
      const errorMessage = err.message || "Something went wrong. Let's try again. What hobby are you interested in?";
      setMessages(prev => [...prev, { role: 'assistant', content: errorMessage }]);
    }
  };

  const currentFact = loadingFacts.length > 0 ? loadingFacts[factIndex] : `Crafting your personalized ${hobby} plan...`;

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] max-w-4xl mx-auto py-8">
      {isGenerating ? (
        <div className="flex-1 flex items-center justify-center animate-in fade-in zoom-in-95 duration-500">
          <LoadingSpinner size={200} message={currentFact} fullHeight={false} />
        </div>
      ) : (
        <>
          <div className="w-full text-center text-slate-400 font-medium text-sm md:text-base pt-4 shrink-0">
            To personalize your course, let's understand your requirements.
          </div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto w-full max-w-3xl mx-auto px-4 space-y-8 scroll-smooth pb-20 pt-4 flex flex-col">
            <div className="mt-auto space-y-8 shrink-0">
              {messages.filter(m => m.role !== 'system').map((msg, idx) => (
                <div key={idx} className={cn(
                  "flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300",
                  msg.role === 'user' ? "items-end" : "items-start"
                )}>
                  {msg.role === 'user' ? (
                    <div className="text-slate-900 font-medium max-w-[85%] text-[15px] md:text-[17px] text-right bg-black/5 px-4 py-2 rounded-2xl rounded-tr-sm">
                      {msg.content}
                    </div>
                  ) : (
                    <div className="flex items-start gap-2 w-full">
                      <div className="w-8 h-8 md:w-9 md:h-9 shrink-0 flex flex-col items-center justify-center mt-1 -ml-2">
                        <img src={logoPng} alt="AI Logo" className="w-full h-full object-contain" />
                      </div>
                      <div className="space-y-4 flex-1">
                        <div className="flex flex-col gap-3">
                          {msg.content.split('\n').map((line, i) => {
                            if (!line.trim()) return null;
                            if (line.match(/^[-_*]{3,}$/)) return <hr key={i} className="my-2 border-black/10 w-full" />;
                            return (
                              <p key={i} className="text-[15px] md:text-[17px] font-medium text-[#1d1627] leading-relaxed">
                                {line.replace(/[*#]/g, '')}
                              </p>
                            );
                          })}
                        </div>
                        {msg.type === 'options' && (
                          <div className="flex flex-wrap gap-1.5 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
                            {msg.options?.map((opt) => (
                              <button
                                key={opt}
                                onClick={() => handleOptionSelect(opt, msg.field!)}
                                className="px-5 py-2.5 rounded-2xl border-2 border-slate-200 text-slate-800 font-semibold text-sm md:text-base hover:border-slate-800 transition-all cursor-pointer"
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {status === 'checking' && (
                <div className="flex items-center px-4 animate-in fade-in duration-300">
                  <LoadingSpinner size={80} fullHeight={false} />
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <div className="mt-auto px-4 pb-4 bg-[#fffbf4]">
        <div className="max-w-3xl mx-auto relative">
          <div className={cn(
            "bg-white border rounded-2xl shadow-sm transition-all overflow-hidden flex items-center pr-3 min-h-[60px]",
            status === 'error' ? "border-red-400" : "border-black/15 focus-within:border-black/30"
          )}>
            <input
              autoFocus
              type="text"
              value={input}
              disabled={status === 'checking' || isGenerating}
              onChange={(e) => {
                setInput(e.target.value);
                if (status === 'error') setStatus('idle');
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleHobbySubmit()}
              placeholder={placeholderText}
              className="flex-1 bg-transparent py-4 px-6 text-xl font-medium text-slate-900 focus:outline-none placeholder:text-slate-500 disabled:opacity-50"
            />
            <button
              onClick={handleHobbySubmit}
              disabled={input.length < 2 || isGenerating || status === 'checking'}
              className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-white hover:bg-slate-900 transition-all disabled:opacity-50"
            >
              <ArrowUp size={22} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
