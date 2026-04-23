import { Flame } from 'lucide-react';
import { cn } from '../utils/cn';

interface StreakBadgeProps {
  streak: number;
  level?: number; // 1, 2, 3
}

export function StreakBadge({ streak, level = 1 }: StreakBadgeProps) {
  if (streak === 0) return null;

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold transition-all duration-500",
      level === 1 && "bg-orange-50 text-orange-600",
      level === 2 && "bg-orange-100 text-orange-600 scale-105",
      level === 3 && "bg-amber-100 text-amber-700 scale-110 shadow-lg shadow-amber-200/50"
    )}>
      <Flame 
        size={18} 
        fill={level >= 2 ? "currentColor" : "none"}
        className={cn(
          "transition-all duration-500",
          streak > 0 && "animate-pulse"
        )} 
      />
      <span className="text-sm">{streak} day streak</span>
    </div>
  );
}
