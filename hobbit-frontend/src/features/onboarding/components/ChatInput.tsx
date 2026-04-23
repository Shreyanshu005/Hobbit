import { ArrowUp } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { HobbyButton } from '../../../components/atoms/HobbyButton';

interface ChatInputProps {
  input: string;
  setInput: (val: string) => void;
  status: 'idle' | 'checking' | 'error' | 'valid';
  isGenerating: boolean;
  placeholder: string;
  onSubmit: () => void;
}

export function ChatInput({
  input,
  setInput,
  status,
  isGenerating,
  placeholder,
  onSubmit
}: ChatInputProps) {
  return (
    <div className="fixed bottom-25 left-4 right-4 z-10 md:relative md:bottom-auto md:left-auto md:right-auto md:z-auto md:px-4 md:pb-4 md:bg-[#fffbf4] md:mt-2">
      <div className="max-w-3xl mx-auto flex items-end gap-3">
        <div className={cn(
          "flex-1 bg-[#fffbf4] border rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)] transition-all overflow-hidden flex items-center min-h-[60px]",
          status === 'error' ? "border-red-400" : "border-slate-200 focus-within:border-slate-400"
        )}>
          <input
            autoFocus
            type="text"
            value={input}
            disabled={status === 'checking' || isGenerating}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
            placeholder={placeholder}
            className="flex-1 bg-transparent py-4 px-6 text-base md:text-xl font-medium text-slate-900 focus:outline-none placeholder:text-slate-500 disabled:opacity-50"
          />
        </div>
        <HobbyButton
          onClick={onSubmit}
          disabled={input.length < 2 || isGenerating || status === 'checking'}
          className="w-[60px] h-[60px] p-0 rounded-2xl shrink-0 bg-[#fffbf4]"
        >
          <ArrowUp size={24} strokeWidth={2.5} />
        </HobbyButton>
      </div>
    </div>
  );
}
