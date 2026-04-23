import { useState, useEffect } from 'react';
import { useHobbyStore } from '../stores/useHobbyStore';
import type { Plan } from '../types';

export function usePlan(hobbyId?: string) {
  const { hobbies, isLoading: storeLoading, error: storeError, setActiveHobby, activeHobby } = useHobbyStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);

  useEffect(() => {
    if (!hobbyId) {
      setIsLoading(false);
      return;
    }

    const foundPlan = hobbies.find(h => h.hobbyId === hobbyId);
    
    if (foundPlan) {
      setPlan(foundPlan);
      setActiveHobby(hobbyId);
      setIsLoading(false);
      setError(null);
    } else {
      setPlan(null);
      setError('Hobby plan not found');
      setIsLoading(false);
    }
  }, [hobbyId, hobbies, setActiveHobby]);

  return {
    plan: plan || activeHobby,
    isLoading: isLoading || storeLoading,
    error: error || storeError,
  };
}
