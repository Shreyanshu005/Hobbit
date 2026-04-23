import { useMemo } from 'react';
import { useProgressStore } from '../stores/useProgressStore';

export function useStreak(hobbyId: string) {
  const getHobbyProgress = useProgressStore((state) => state.getHobbyProgress);
  
  const streakInfo = useMemo(() => {
    const progress = getHobbyProgress(hobbyId);
    if (!progress) return { streak: 0, flameLevel: 0 };

    const streak = progress.streak;
    
    let flameLevel = 0;
    if (streak > 0) flameLevel = 1;
    if (streak >= 3) flameLevel = 2;
    if (streak >= 7) flameLevel = 3;

    return { streak, flameLevel };
  }, [hobbyId, getHobbyProgress]);

  return streakInfo;
}
