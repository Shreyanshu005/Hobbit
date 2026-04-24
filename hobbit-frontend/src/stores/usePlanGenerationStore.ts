import { create } from 'zustand';
import { planService } from '../services/planService';
import { fetchHobbyFacts } from '../services/hobbyService';
import { useHobbyStore } from './useHobbyStore';
import { useCollectionStore } from './useCollectionStore';
import { storage, STORAGE_KEYS } from '../utils/storage';
import type { Message } from '../features/onboarding/OnboardingPage';
import type { HobbyLevel, HobbyGoal } from '../types';

interface PlanGenerationState {
  status: 'idle' | 'generating' | 'done' | 'error';
  hobby: string;
  level: string;
  goal: string;
  collectionId?: string;
  messages: Message[];
  loadingFacts: string[];
  factIndex: number;
  error: string | null;
  generatedPlanId: string | null;

  startGeneration: (params: {
    hobby: string;
    level: string;
    goal: string;
    collectionId?: string;
    messages: Message[];
  }) => void;
  setFactIndex: (index: number) => void;
  reset: () => void;
  dismiss: () => void;
}

let factInterval: ReturnType<typeof setInterval> | null = null;

export const usePlanGenerationStore = create<PlanGenerationState>((set, get) => ({
  status: 'idle',
  hobby: '',
  level: '',
  goal: '',
  collectionId: undefined,
  messages: [],
  loadingFacts: [],
  factIndex: 0,
  error: null,
  generatedPlanId: null,

  startGeneration: async ({ hobby, level, goal, collectionId, messages }) => {
    set({
      status: 'generating',
      hobby,
      level,
      goal,
      collectionId,
      messages,
      loadingFacts: [],
      factIndex: 0,
      error: null,
      generatedPlanId: null,
    });

    fetchHobbyFacts(hobby).then(facts => {
      set({ loadingFacts: facts });
      if (factInterval) clearInterval(factInterval);
      factInterval = setInterval(() => {
        const state = get();
        if (state.status !== 'generating') {
          if (factInterval) clearInterval(factInterval);
          return;
        }
        set({ factIndex: (state.factIndex + 1) % Math.max(state.loadingFacts.length, 1) });
      }, 3000);
    });

    try {
      const plan = await planService.getPlan(
        hobby,
        level as HobbyLevel,
        goal as HobbyGoal,
        messages
      );

      const finalMessages: Message[] = [
        ...messages,
        { role: 'assistant', content: `Your personalized ${hobby} plan is ready! Tap "View Plan" to start learning.` }
      ];

      useHobbyStore.getState().addHobby({ ...plan, chatHistory: finalMessages });

      if (collectionId && collectionId !== 'general') {
        useCollectionStore.getState().addHobbyToCollection(collectionId, plan.hobbyId);
      }

      storage.remove(STORAGE_KEYS.ONBOARDING_STATE);

      if (factInterval) clearInterval(factInterval);

      set({
        status: 'done',
        generatedPlanId: plan.hobbyId,
      });
    } catch (err: any) {
      if (factInterval) clearInterval(factInterval);
      set({
        status: 'error',
        error: err?.message || 'Failed to generate plan. Please try again.',
      });
    }
  },

  setFactIndex: (index) => set({ factIndex: index }),

  reset: () => {
    if (factInterval) clearInterval(factInterval);
    set({
      status: 'idle',
      hobby: '',
      level: '',
      goal: '',
      collectionId: undefined,
      messages: [],
      loadingFacts: [],
      factIndex: 0,
      error: null,
      generatedPlanId: null,
    });
  },

  dismiss: () => {
    set({ status: 'idle', generatedPlanId: null });
  },
}));
