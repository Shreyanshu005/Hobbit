import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { usePlanGenerationStore } from '../../stores/usePlanGenerationStore';
import { storage, STORAGE_KEYS } from '../../utils/storage';
import { validateHobby } from '../../utils/validators';
import * as validateService from '../../services/validateService';
import { cn } from '../../utils/cn';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ChatMessages } from './components/ChatMessages';
import { ChatInput } from './components/ChatInput';
import { HobbyButton } from '../../components/atoms/HobbyButton';
import { Plus } from 'lucide-react';

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

const defaultMessages: Message[] = [
  { role: 'system', content: "To personalize your course, let's understand your learning goal and background knowledge." },
  { role: 'assistant', content: "Hi! I am Hobbit. What hobby would you like to master today?" }
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { collectionId } = useParams<{ collectionId: string }>();
  const [searchParams] = useSearchParams();

  const scrollRef = useRef<HTMLDivElement>(null);
  const isFresh = searchParams.get('fresh') === '1';

  const genStatus = usePlanGenerationStore((s) => s.status);
  const genHobby = usePlanGenerationStore((s) => s.hobby);
  const genLoadingFacts = usePlanGenerationStore((s) => s.loadingFacts);
  const genFactIndex = usePlanGenerationStore((s) => s.factIndex);
  const genPlanId = usePlanGenerationStore((s) => s.generatedPlanId);
  const genError = usePlanGenerationStore((s) => s.error);
  const startGeneration = usePlanGenerationStore((s) => s.startGeneration);
  const resetGeneration = usePlanGenerationStore((s) => s.reset);

  const [messages, setMessages] = useState<Message[]>(() => {
    if (isFresh) return defaultMessages;
    const saved: any = storage.get(STORAGE_KEYS.ONBOARDING_STATE);
    return saved?.messages || defaultMessages;
  });
  const [input, setInput] = useState(() => {
    if (isFresh) return '';
    const saved: any = storage.get(STORAGE_KEYS.ONBOARDING_STATE);
    return saved?.input || '';
  });
  const [hobby, setHobby] = useState(() => {
    if (isFresh) return '';
    const saved: any = storage.get(STORAGE_KEYS.ONBOARDING_STATE);
    return saved?.hobby || '';
  });
  const [level, setLevel] = useState(() => {
    if (isFresh) return '';
    const saved: any = storage.get(STORAGE_KEYS.ONBOARDING_STATE);
    return saved?.level || '';
  });
  const [status, setStatus] = useState<'idle' | 'checking' | 'error' | 'valid'>(() => {
    if (isFresh) return 'idle';
    const saved: any = storage.get(STORAGE_KEYS.ONBOARDING_STATE);
    const s = saved?.status || 'idle';
    return s === 'checking' ? 'idle' : s;
  });
  const [shouldScrollOnNextMessage, setShouldScrollOnNextMessage] = useState(false);

  const isNearBottom = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return true;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    return distanceFromBottom < 120;
  }, []);

  const clearChat = useCallback(() => {
    storage.remove(STORAGE_KEYS.ONBOARDING_STATE);
    setMessages(defaultMessages);
    setInput('');
    setHobby('');
    setLevel('');
    setStatus('idle');
    storage.set(STORAGE_KEYS.ONBOARDING_STATE, { active: true });
  }, []);

  useEffect(() => {
    window.addEventListener('clear-chat', clearChat);
    return () => window.removeEventListener('clear-chat', clearChat);
  }, [clearChat]);

  useEffect(() => {
    if (genStatus === 'done' && genPlanId) {
      storage.remove(STORAGE_KEYS.ONBOARDING_STATE);
      navigate(`/plan/${genPlanId}`);
      resetGeneration();
    }
  }, [genStatus, genPlanId, navigate, resetGeneration]);

  useEffect(() => {
    if (genStatus === 'error' && genError) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Plan generation failed. Please try again." }]);
      resetGeneration();
    }
  }, [genStatus, genError, resetGeneration]);

  useEffect(() => {
    let isActive = true;
    let timerId: ReturnType<typeof setTimeout>;

    if (isFresh) {
      clearChat();
      navigate('/new-chat', { replace: true });
    } else {
      const saved: any = storage.get(STORAGE_KEYS.ONBOARDING_STATE);
      if (saved?.messages?.length > 0) {
        const lastMsg = saved.messages[saved.messages.length - 1];
        const hasGoalQuestion = saved.messages.some(
          (m: any) => m.role === 'assistant' && m.field === 'goal'
        );
        const hasLevelQuestion = saved.messages.some(
          (m: any) => m.role === 'assistant' && m.field === 'level'
        );

        if (lastMsg.role === 'user') {
          setStatus('checking');
          
          if (!hasLevelQuestion) {
            const extractedHobby = extractHobby(lastMsg.content);
            validateService.checkHobby(extractedHobby).then(response => {
              if (!isActive) return;
              if (!response.success) {
                setStatus('idle');
                setMessages((prev: Message[]) => [...prev, { role: 'assistant', content: response.error }]);
                return;
              }
              const correctedHobby = response.data?.hobby || extractedHobby;
              setHobby(correctedHobby);
              timerId = setTimeout(() => {
                if (!isActive) return;
                setStatus('idle');
                setMessages((prev: Message[]) => [
                  ...prev,
                  {
                    role: 'assistant',
                    content: `That's a great choice! What is your current experience level with ${correctedHobby}?`,
                    type: 'options',
                    field: 'level',
                    options: ['Beginner', 'Know basics', 'Intermediate', 'Advanced']
                  }
                ]);
              }, 500);
            }).catch(() => {
              if (!isActive) return;
              setStatus('error');
              setMessages((prev: Message[]) => [...prev, { role: 'assistant', content: `Please check your network or try again.` }]);
            });

          } else if (hasLevelQuestion && !hasGoalQuestion) {
            const mappedLevel = lastMsg.content.toLowerCase().includes('beginner') ? 'beginner' :
              lastMsg.content.toLowerCase().includes('intermediate') ? 'intermediate' : 'casual';
            setLevel(mappedLevel);
            timerId = setTimeout(() => {
              if (!isActive) return;
              setStatus('idle');
              setMessages((prev: Message[]) => [
                ...prev,
                {
                  role: 'assistant',
                  content: `Perfect. And what's your primary goal for learning ${saved.hobby || 'this'}?`,
                  type: 'options',
                  field: 'goal',
                  options: ['Just for fun', 'Perform', 'Compete', 'Social']
                }
              ]);
            }, 500);

          } else if (hasGoalQuestion) {
            const mappedGoal = lastMsg.content.toLowerCase().includes('fun') ? 'just-for-fun' :
              lastMsg.content.toLowerCase().includes('perform') ? 'perform' :
                lastMsg.content.toLowerCase().includes('compete') ? 'compete' : 'social';
            timerId = setTimeout(() => {
              if (!isActive) return;
              setStatus('idle');
              startGeneration({
                hobby: saved.hobby,
                level: saved.level || 'beginner',
                goal: mappedGoal,
                collectionId,
                messages: saved.messages,
              });
            }, 500);
          }
        }
      }
    }

    return () => {
      isActive = false;
      if (timerId) clearTimeout(timerId);
    };
  }, []);

  useEffect(() => {
    storage.set(STORAGE_KEYS.ONBOARDING_STATE, {
      active: true,
      messages,
      input,
      hobby,
      level,
      status,
    });
  }, [messages, input, hobby, level, status]);

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
      setShouldScrollOnNextMessage(true);
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
    setShouldScrollOnNextMessage(true);
    setInput('');

    try {
      const response = await validateService.checkHobby(extractedHobby);
      if (!response.success) {
        setStatus('idle');
        setMessages(prev => [...prev, { role: 'assistant', content: response.error }]);
        return;
      }
      const correctedHobby = response.data?.hobby || extractedHobby;
      setHobby(correctedHobby);

      setTimeout(() => {
        setStatus('idle');
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: `That's a great choice! What is your current experience level with ${correctedHobby}?`,
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
            content: `Please check your network or try again.`
          }
        ]);
      }, 2000);
    }
  };

  const handleInputSubmit = async () => {
    if (!input.trim()) return;

    if (hobby && level && genStatus !== 'generating') {
      handleOptionSelect(input, 'goal');
      setInput('');
      return;
    }
    
    if (hobby && !level && genStatus !== 'generating') {
      handleOptionSelect(input, 'level');
      setInput('');
      return;
    }
    
    handleHobbySubmit();
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
        const ackMessage = { 
          role: 'assistant' as const, 
          content: `Got it! I'm now crafting your personalized ${hobby} plan based on your choices. This will take just a few seconds...` 
        };
        setMessages(prev => [...prev, ackMessage]);
        
        setTimeout(() => {
          startGeneration({
            hobby,
            level,
            goal: mappedGoal,
            collectionId,
            messages: [...messages, { role: 'user', content: option }, ackMessage],
          });
        }, 1500);
      }, 1000);
    }
  };

  const currentFact = genLoadingFacts.length > 0 ? genLoadingFacts[genFactIndex] : `Crafting your personalized ${genHobby || hobby} plan...`;

  return (
    <div className={cn(
      "absolute left-0 right-0 bottom-[100px] lg:bottom-4 top-16 lg:top-0 flex flex-col w-full max-w-4xl mx-auto px-4 md:px-0 py-2 md:py-8 overflow-hidden"
    )}>
      {genStatus === 'generating' ? (
        <div className="flex-1 flex items-center justify-center animate-in fade-in zoom-in-95 duration-500">
          <LoadingSpinner size={200} message={currentFact} fullHeight={false} />
        </div>
      ) : (
        <>
          <div className="w-full hidden md:flex items-center justify-between pt-3 pb-3 shrink-0 max-w-3xl mx-auto">
            <span className="text-slate-400 font-medium text-lg md:text-xl">
              To personalize your course, let's understand your requirements.
            </span>
            <HobbyButton
              onClick={clearChat}
              variant="outline"
              className="rounded-full px-4 py-2 flex items-center gap-1.5 text-sm shrink-0"
            >
              <Plus className="w-4 h-4" />
              New Chat
            </HobbyButton>
          </div>

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
            isGenerating={false}
            placeholder={messages[messages.length - 1]?.type === 'options' ? "Please select an option above..." : placeholderText}
            onSubmit={handleInputSubmit}
            disabled={messages[messages.length - 1]?.type === 'options'}
          />
        </>
      )}
    </div>
  );
}
