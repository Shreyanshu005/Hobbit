import { create } from 'zustand';
import type { UserProgress } from '../types';
import { storage, STORAGE_KEYS } from '../utils/storage';

interface ProgressState {
  progress: UserProgress[];
  toggleTechnique: (hobbyId: string, techniqueId: string) => void;
  getHobbyProgress: (hobbyId: string) => UserProgress | null;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  progress: storage.get<UserProgress[]>(STORAGE_KEYS.PROGRESS) || [],

  toggleTechnique: (hobbyId, techniqueId) => set((state) => {
    let hobbyProgress = state.progress.find((p) => p.hobbyId === hobbyId);
    
    if (!hobbyProgress) {
      hobbyProgress = {
        hobbyId,
        completedTechniqueIds: [],
        lastActive: new Date().toISOString(),
        streak: 0
      };
    }

    const isCompleted = hobbyProgress.completedTechniqueIds.includes(techniqueId);
    const newCompletedIds = isCompleted
      ? hobbyProgress.completedTechniqueIds.filter((id) => id !== techniqueId)
      : [...hobbyProgress.completedTechniqueIds, techniqueId];

    const updatedHobbyProgress = {
      ...hobbyProgress,
      completedTechniqueIds: newCompletedIds,
      lastActive: new Date().toISOString(),
      // Streak logic could be refined further but simplified here
    };

    const newProgress = state.progress.filter((p) => p.hobbyId !== hobbyId);
    const finalProgress = [...newProgress, updatedHobbyProgress];
    
    storage.set(STORAGE_KEYS.PROGRESS, finalProgress);
    return { progress: finalProgress };
  }),

  getHobbyProgress: (hobbyId) => {
    return get().progress.find((p) => p.hobbyId === hobbyId) || null;
  }
}));
