import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import { useHobbyStore } from '../../stores/useHobbyStore';
import { useCollectionStore } from '../../stores/useCollectionStore';
import { planService } from '../../services/planService';
import { storage, STORAGE_KEYS } from '../../utils/storage';
import { validateHobby } from '../../utils/validators';
import * as validateService from '../../services/validateService';
import { fetchHobbyFacts } from '../../services/hobbyService';
import { cn } from '../../utils/cn';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { HobbyButton } from '../../components/atoms/HobbyButton';
import { TypewriterText } from '../../components/TypewriterText';
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
  const [searchParams] = useSearchParams();
  const addHobby = useHobbyStore((state) => state.addHobby);
  const addHobbyToCollection = useCollectionStore((state) => state.addHobbyToCollection);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isFresh = searchParams.get('fresh') === '1';
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
  const [shouldScrollOnNextMessage, setShouldScrollOnNextMessage] = useState(false);

  const isNearBottom = () => {
    const el = scrollRef.current;
    if (!el) return true;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    return distanceFromBottom < 120;
  };


  useEffect(() => {
    if (isFresh) {
      storage.remove(STORAGE_KEYS.ONBOARDING_STATE);
      setMessages([
        { role: 'system', content: "To personalize your course, let's understand your learning goal and background knowledge." },
        { role: 'assistant', content: "Hi! I am Hobbit. What hobby would you like to master today?" }
      ]);
      setInput('');
      setHobby('');
      setLevel('');
      setStatus('idle');
      setLoadingFacts([]);
      setFactIndex(0);
    } else {
      const persistedState: any = storage.get(STORAGE_KEYS.ONBOARDING_STATE);
      if (persistedState) {
        setMessages(persistedState.messages || messages);
        setInput(persistedState.input || '');
        setHobby(persistedState.hobby || '');
        setLevel(persistedState.level || '');
        setStatus(persistedState.status || 'idle');
        setLoadingFacts(persistedState.loadingFacts || []);
        setFactIndex(persistedState.factIndex || 0);
      }
    }
  }, [isFresh]);

  useEffect(() => {
    if (!isFresh) {
      const stateToPersist = {
        messages,
        input,
        hobby,
        level,
        status,
        loadingFacts,
        factIndex
      };
      storage.set(STORAGE_KEYS.ONBOARDING_STATE, stateToPersist);
    }
  }, [messages, input, hobby, level, status, loadingFacts, factIndex, isFresh]);


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
    if (shouldScrollOnNextMessage && scrollRef.current) {
      const scrollElement = scrollRef.current;
      scrollElement.scrollTo({
        top: scrollElement.scrollHeight,
        behavior: 'smooth'
      });
      setShouldScrollOnNextMessage(false);
    }
  }, [messages, shouldScrollOnNextMessage]);

  const handleHobbySubmit = async () => {
    const basicError = validateHobby(input);
    if (basicError) {
      setMessages(prev => [...prev, { role: 'user', content: input }]);
      setShouldScrollOnNextMessage(isNearBottom());
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
    setShouldScrollOnNextMessage(isNearBottom());
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
      setTimeout(() => {
        setStatus('error');
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: `Please check your network or try again later.`
          }
        ]);
      }, 2000);
    }
  };

  const handleOptionSelect = (option: string, field: 'level' | 'goal') => {
    setMessages(prev => [...prev, { role: 'user', content: option }]);
    setShouldScrollOnNextMessage(true);
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
      setStatus('error');
      setMessages(prev => [...prev, { role: 'assistant', content: "Please check your network or try again later." }]);
    }
  };

  const currentFact = loadingFacts.length > 0 ? loadingFacts[factIndex] : `Crafting your personalized ${hobby} plan...`;

  return (
    <div className={cn(
      "flex flex-col max-w-4xl mx-auto py-8",
      isGenerating ? "h-[calc(100vh-10rem)] md:h-[calc(100vh-100px)]" : "h-full md:h-[calc(100vh-100px)]"
    )}>
      {isGenerating ? (
        <div className="flex-1 flex items-center justify-center animate-in fade-in zoom-in-95 duration-500">
          <LoadingSpinner size={200} message={currentFact} fullHeight={false} />
        </div>
      ) : (
        <>
          {messages.filter(m => m.role !== 'system').length <= 1 && (
            <div className="w-full text-center text-slate-400 font-medium text-lg md:text-xl pt-4 shrink-0">
              To personalize your course, let's understand your requirements.
            </div>
          )}
          <div className="flex-1 flex items-center justify-center md:items-end md:justify-center mt-10 md:mt-0">
            <div ref={scrollRef} className="w-full max-w-3xl mx-auto px-4 space-y-8 scroll-smooth pb-24 pt-6 flex flex-col h-full max-h-[calc(100vh-18rem)] overflow-y-auto md:h-[500px] md:overflow-y-auto md:flex-none rounded-[32px]">
              <div className="space-y-8 shrink-0">
                {messages.filter(m => m.role !== 'system').map((msg, idx) => (
                  <div key={idx} className={cn(
                    "flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300",
                    msg.role === 'user' ? "items-end" : "items-start"
                  )}>
                    {msg.role === 'user' ? (
                      <div className="text-slate-900 font-medium max-w-[85%] text-lg md:text-xl text-right bg-black/5 px-4 py-2 rounded-2xl rounded-tr-sm">
                        {msg.content}
                      </div>
                    ) : (
                      <div className="flex items-start gap-2 w-full">
                        <div className="w-8 h-8 md:w-9 md:h-9 shrink-0 flex flex-col items-center justify-center mt-1 -ml-2">
                          <img src={logoPng} alt="AI Logo" className="w-full h-full object-contain" />
                        </div>
                        <div className="space-y-4 flex-1">
                          <div className="flex flex-col gap-3">
                            {idx === messages.filter(m => m.role !== 'system').length - 1 ? (
                              <TypewriterText 
                                text={msg.content} 
                                onComplete={() => setShouldScrollOnNextMessage(isNearBottom())}
                              />
                            ) : (
                              msg.content.split('\n').map((line, i) => {
                                if (!line.trim()) return null;
                                if (line.match(/^[-_*]{3,}$/)) return <hr key={i} className="my-2 border-black/10 w-full" />;
                                return (
                                  <p key={i} className="text-lg md:text-xl font-medium text-[#1d1627] leading-relaxed">
                                    {line.replace(/[*#]/g, '')}
                                  </p>
                                );
                              })
                            )}
                          </div>
                          {msg.type === 'options' && (
                            <div className="flex flex-wrap gap-1.5 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
                              {msg.options?.map((opt) => (
                                <button
                                  key={opt}
                                  onClick={() => handleOptionSelect(opt, msg.field!)}
                                  className="px-5 py-2.5 rounded-2xl border-2 border-slate-200 text-slate-800 font-semibold text-lg md:text-xl hover:border-slate-800 transition-all cursor-pointer"
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
          </div>
        </>
      )}

      <div className={cn(
        "fixed bottom-25 left-4 right-4 z-10 md:relative md:bottom-auto md:left-auto md:right-auto md:z-auto md:px-4 md:pb-4 md:bg-[#fffbf4] md:mt-2",
        isFresh ? "md:mt-2" : "md:mt-2"
      )}>
        <div className="max-w-3xl mx-auto flex items-end gap-3">
          <div className={cn(
            "flex-1 bg-transparent border rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)] transition-all overflow-hidden flex items-center min-h-[60px]",
            status === 'error' ? "border-red-400" : "border-slate-200 focus-within:border-slate-400"
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
              className="flex-1 bg-transparent py-4 px-6 text-base md:text-xl font-medium text-slate-900 focus:outline-none placeholder:text-slate-500 disabled:opacity-50"
            />
          </div>
          <HobbyButton
            onClick={handleHobbySubmit}
            disabled={input.length < 2 || isGenerating || status === 'checking'}
            className="w-[60px] h-[60px] p-0 rounded-2xl shrink-0"
          >
            <ArrowUp size={24} strokeWidth={2.5} />
          </HobbyButton>
        </div>
      </div>
    </div>
  );
}
