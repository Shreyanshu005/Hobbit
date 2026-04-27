import { useState, useCallback } from 'react';
import { ArrowUp, Mic } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { HobbyButton } from '../../../components/atoms/HobbyButton';

interface ChatInputProps {
  input: string;
  setInput: (val: string) => void;
  status: 'idle' | 'checking' | 'error' | 'valid';
  isGenerating: boolean;
  placeholder: string;
  onSubmit: () => void;
  disabled?: boolean;
}

export function ChatInput({
  input,
  setInput,
  status,
  isGenerating,
  placeholder,
  onSubmit,
  disabled = false
}: ChatInputProps) {
  const [isListening, setIsListening] = useState(false);

  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please try Chrome or Safari.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = true;
      recognition.continuous = false;

      recognition.onstart = () => {
        setIsListening(true);
        console.log('Recording started...');
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');

        setInput(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          alert('Microphone access was denied. Please enable it in your browser settings.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        console.log('Recording ended.');
      };

      recognition.start();
    } catch (err) {
      console.error('Failed to start recognition:', err);
      setIsListening(false);
    }
  }, [setInput]);

  return (
    <div className="w-full px-4 pb-4 md:pb-4 bg-transparent md:bg-[#fffbf4] mt-3 md:mt-2 shrink-0">
      <div className="max-w-3xl mx-auto flex items-end gap-3">
        <div className={cn(
          "flex-1 bg-[#fffbf4] border rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)] transition-all overflow-hidden flex items-center min-h-[60px] relative",
          status === 'error' ? "border-red-400" : "border-slate-200 focus-within:border-slate-400",
          isListening && "border-indigo-400 ring-2 ring-indigo-100"
        )}>
          <input
            type="text"
            value={input}
            disabled={status === 'checking' || isGenerating || disabled}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !disabled && onSubmit()}
            placeholder={isListening ? "Listening..." : placeholder}
            className="flex-1 bg-transparent py-4 pl-6 pr-12 text-base md:text-xl font-medium text-slate-900 focus:outline-none placeholder:text-slate-500 disabled:opacity-50"
          />
          <button
            type="button"
            onClick={startListening}
            disabled={status === 'checking' || isGenerating || disabled}
            className={cn(
              "absolute right-3 p-2 rounded-xl transition-all",
              isListening ? "text-slate-900 bg-[#f6af40] animate-pulse" : "text-slate-400 hover:text-slate-600 hover:bg-black/5"
            )}
          >
            {isListening ? <Mic size={20} strokeWidth={2.5} /> : <Mic size={20} strokeWidth={2} />}
          </button>
        </div>
        <HobbyButton
          onClick={onSubmit}
          disabled={input.length < 2 || isGenerating || status === 'checking' || disabled}
          className="w-[60px] h-[60px] p-0 rounded-2xl shrink-0 bg-[#fffbf4]"
        >
          <ArrowUp size={24} strokeWidth={2.5} />
        </HobbyButton>
      </div>
    </div>
  );
}
