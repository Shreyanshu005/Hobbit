import { create } from 'zustand';
import type { Plan } from '../types';
import { storage, STORAGE_KEYS } from '../utils/storage';

interface HobbyState {
  hobbies: Plan[];
  activeHobby: Plan | null;
  isLoading: boolean;
  error: string | null;
  addHobby: (plan: Plan) => void;
  setActiveHobby: (hobbyId: string | null) => void;
  deleteHobby: (hobbyId: string) => void;
  setError: (error: string | null) => void;
}

export const useHobbyStore = create<HobbyState>((set) => ({
  hobbies: storage.get<Plan[]>(STORAGE_KEYS.HOBBIES) || [],
  activeHobby: null,
  isLoading: false,
  error: null,

  addHobby: (plan) => set((state) => {
    const exists = state.hobbies.some((h) => h.hobbyId === plan.hobbyId);
    if (exists) {
      const updatedHobbies = state.hobbies.map(h => h.hobbyId === plan.hobbyId ? { ...h, ...plan } : h);
      storage.set(STORAGE_KEYS.HOBBIES, updatedHobbies);
      return { hobbies: updatedHobbies, activeHobby: { ...state.activeHobby, ...plan } as Plan };
    }
    
    const newHobbies = [...state.hobbies, plan];
    storage.set(STORAGE_KEYS.HOBBIES, newHobbies);
    return { hobbies: newHobbies, activeHobby: plan };
  }),

  setActiveHobby: (hobbyId) => set((state) => {
    const hobby = state.hobbies.find((h) => h.hobbyId === hobbyId) || null;
    return { activeHobby: hobby };
  }),

  deleteHobby: (hobbyId) => set((state) => {
    const newHobbies = state.hobbies.filter((h) => h.hobbyId !== hobbyId);
    storage.set(STORAGE_KEYS.HOBBIES, newHobbies);
    return { 
      hobbies: newHobbies, 
      activeHobby: state.activeHobby?.hobbyId === hobbyId ? null : state.activeHobby 
    };
  }),

  setError: (error) => set({ error }),
}));
