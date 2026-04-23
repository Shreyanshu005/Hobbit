import { RefObject } from 'react';
import { cn } from '../../../utils/cn';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { TypewriterText } from '../../../components/TypewriterText';
import logoPng from '../../../assets/logo.png';

type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
  type?: 'options';
  options?: string[];
  field?: 'level' | 'goal';
};

interface ChatMessagesProps {
  messages: Message[];
  status: 'idle' | 'checking' | 'error' | 'valid';
  scrollRef: RefObject<HTMLDivElement>;
  onOptionSelect: (option: string, field: 'level' | 'goal') => void;
  onScrollComplete: () => void;
}

export function ChatMessages({ 
  messages, 
  status, 
  scrollRef, 
  onOptionSelect,
  onScrollComplete
}: ChatMessagesProps) {
  const filteredMessages = messages.filter(m => m.role !== 'system');

  return (
    <div className="flex-1 flex items-center justify-center md:items-end md:justify-center mt-10 md:mt-0">
      <div 
        ref={scrollRef} 
        className="w-full max-w-3xl mx-auto px-4 space-y-8 scroll-smooth pb-24 pt-6 flex flex-col h-full max-h-[calc(100vh-18rem)] overflow-y-auto md:h-[500px] md:overflow-y-auto md:flex-none rounded-[32px]"
      >
        <div className="space-y-8 shrink-0">
          {filteredMessages.map((msg, idx) => (
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
                      {idx === filteredMessages.length - 1 ? (
                        <TypewriterText 
                          text={msg.content} 
                          onComplete={onScrollComplete}
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
                            onClick={() => onOptionSelect(opt, msg.field!)}
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
  );
}
