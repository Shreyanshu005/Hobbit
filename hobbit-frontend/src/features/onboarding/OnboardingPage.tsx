import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useHobbyStore } from '../../stores/useHobbyStore';
import { useCollectionStore } from '../../stores/useCollectionStore';
import { planService } from '../../services/planService';
import { storage, STORAGE_KEYS } from '../../utils/storage';
import { validateHobby } from '../../utils/validators';
import * as validateService from '../../services/validateService';
import { fetchHobbyFacts } from '../../services/hobbyService';
import { cn } from '../../utils/cn';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ChatMessages } from './components/ChatMessages';
import { ChatInput } from './components/ChatInput';

export type Message = {
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

  const isNearBottom = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return true;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    return distanceFromBottom < 120;
  }, []);

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

  const handleScrollComplete = useCallback(() => {
    if (isNearBottom()) {
      setShouldScrollOnNextMessage(true);
    }
  }, [isNearBottom]);

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
          
          <ChatMessages
            messages={messages}
            status={status}
            scrollRef={scrollRef}
            onOptionSelect={handleOptionSelect}
            onScrollComplete={handleScrollComplete}
          />

          <ChatInput
            input={input}
            setInput={setInput}
            status={status}
            isGenerating={isGenerating}
            placeholder={placeholderText}
            onSubmit={handleHobbySubmit}
          />
        </>
      )}
    </div>
  );
}
