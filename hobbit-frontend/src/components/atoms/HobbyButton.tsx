import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface HobbyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  className?: string;
}

export function HobbyButton({ 
  children, 
  variant = 'primary', 
  className, 
  ...props 
}: HobbyButtonProps) {
  const variants = {
    primary: 'bg-transparent text-slate-900 border-slate-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)] active:shadow-none',
    secondary: 'bg-transparent text-[#f6af40] border-[#f6af40] shadow-[4px_4px_0px_0px_rgba(246,175,64,0.1)] hover:shadow-[2px_2px_0px_0px_rgba(246,175,64,0.1)] active:shadow-none',
    outline: 'bg-transparent text-slate-900 border-slate-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)] active:shadow-none',
    ghost: 'bg-transparent text-slate-600 border-transparent shadow-none hover:bg-black/5'
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-base transition-all border-2',
        'hover:translate-x-[2px] hover:translate-y-[2px]',
        'active:translate-x-[4px] active:translate-y-[4px]',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
