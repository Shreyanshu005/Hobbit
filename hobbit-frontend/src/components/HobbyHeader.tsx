import { StreakBadge } from './StreakBadge';

interface HobbyHeaderProps {
  name: string;
  streak: number;
  flameLevel?: number;
}

export function HobbyHeader({ name, streak, flameLevel }: HobbyHeaderProps) {
  return (
    <div className="flex flex-col gap-2 mb-8">
      <div className="flex items-center gap-4 flex-wrap">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">{name}</h1>
        <StreakBadge streak={streak} level={flameLevel} />
      </div>
    </div>
  );
}
