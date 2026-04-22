import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, glass = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl border transition-all duration-300',
          glass 
            ? 'bg-slate-900/40 backdrop-blur-xl border-white/5 shadow-xl shadow-black/20' 
            : 'bg-slate-900 border-white/10 shadow-lg',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export { Card };
