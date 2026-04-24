import { useRef, useEffect } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { useHobbyStore } from '../../stores/useHobbyStore';
import { useCollectionStore } from '../../stores/useCollectionStore';
import { cn } from '../../utils/cn';
import { ChatMessages } from './components/ChatMessages';
import { HobbyButton } from '../../components/atoms/HobbyButton';
import chatPng from '../../assets/chat.png';

import type { Message } from './OnboardingPage';

export default function ExplorePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { collectionId } = useParams<{ collectionId: string }>();
  const allHobbies = useHobbyStore((state) => state.hobbies);
  const collections = useCollectionStore((state) => state.collections);
  const scrollRef = useRef<HTMLDivElement>(null);

  const collection = collections.find(c => c.id === collectionId);
  const hobbies = collectionId && collectionId !== 'general'
    ? allHobbies.filter(h => collection?.hobbyIds.includes(h.hobbyId))
    : allHobbies;

  const hobbyIdParam = searchParams.get('hobby');

  const displayHobby = hobbyIdParam
    ? hobbies.find(h => h.hobbyId === hobbyIdParam) || hobbies[hobbies.length - 1]
    : hobbies[hobbies.length - 1];

  useEffect(() => {
    if (hobbies.length > 0 && !hobbyIdParam && displayHobby) {
      const basePath = collectionId ? `/collection/${collectionId}` : '/explore';
      navigate(`${basePath}?hobby=${displayHobby.hobbyId}`, { replace: true });
    }
  }, [hobbies.length, hobbyIdParam, displayHobby, navigate, collectionId]);

  const historyMessages: Message[] = displayHobby?.chatHistory
    ? displayHobby.chatHistory.map(m => ({ role: m.role as Message['role'], content: m.content }))
    : [];

  if (hobbies.length === 0) {
    return (
      <div className="absolute left-0 right-0 bottom-[100px] lg:bottom-4 top-16 lg:top-0 flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-4 md:px-0">
        <img src={chatPng} className="w-16 h-16 opacity-20 mb-4" alt="" />
        <p className="text-xl font-bold text-slate-400 mb-2">No conversations yet</p>
        <p className="text-sm text-slate-400 mb-6">Start a new chat to begin learning a hobby</p>
        <HobbyButton
          onClick={() => navigate('/new-chat?fresh=1')}
          className="rounded-full px-8 py-3"
        >
          Start New Chat
        </HobbyButton>
      </div>
    );
  }

  return (
    <div className={cn(
      "absolute left-0 right-0 bottom-[100px] lg:bottom-4 top-16 lg:top-0 flex flex-col w-full max-w-4xl mx-auto px-4 md:px-0 py-2 md:py-8 overflow-hidden"
    )}>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="hidden md:block w-full text-center text-slate-400 font-medium text-lg md:text-xl pt-3 pb-3 shrink-0">
          Conversation with Hobbit about <span className="text-slate-700 font-bold capitalize">{displayHobby?.hobby}</span>
        </div>

        {historyMessages.length > 0 ? (
          <ChatMessages
            messages={historyMessages}
            status="idle"
            scrollRef={scrollRef}
            onOptionSelect={() => {}}
            onScrollComplete={() => {}}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400">
            <div className="text-center">
              <p className="text-lg font-medium mb-2">No conversation history saved</p>
              <p className="text-sm">Start a new conversation to see it here</p>
            </div>
          </div>
        )}

        <div className="w-full px-4 pb-4 md:pb-4 bg-transparent md:bg-[#fffbf4] mt-3 md:mt-2 shrink-0">
          <div className="max-w-3xl mx-auto flex items-end gap-3">
            <HobbyButton
              onClick={() => navigate(`/plan/${displayHobby?.hobbyId}`)}
              className="flex-1 rounded-2xl py-4 min-h-[60px]"
            >
              View Plan
            </HobbyButton>
          </div>
        </div>
      </div>
    </div>
  );
}
