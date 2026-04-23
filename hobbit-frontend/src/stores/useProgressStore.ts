import { create } from 'zustand';
import type { UserProgress, TechniqueUserStatus } from '../types';
import { storage, STORAGE_KEYS } from '../utils/storage';

interface ProgressState {
  progress: UserProgress[];
  toggleTechnique: (hobbyId: string, techniqueId: string) => void;
  skipTechnique: (hobbyId: string, techniqueId: string) => void;
  getHobbyProgress: (hobbyId: string) => UserProgress | null;
  getTechniqueStatus: (hobbyId: string, techniqueId: string) => TechniqueUserStatus;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  progress: storage.get<UserProgress[]>(STORAGE_KEYS.PROGRESS) || [],

  toggleTechnique: (hobbyId, techniqueId) => set((state) => {
    let hobbyProgress = state.progress.find((p) => p.hobbyId === hobbyId);
    
    if (!hobbyProgress) {
      hobbyProgress = {
        hobbyId,
        completedTechniqueIds: [],
        skippedTechniqueIds: [],
        lastActive: new Date().toISOString(),
        streak: 1,
        startedAt: new Date().toISOString()
      };
    }

    const isCompleted = hobbyProgress.completedTechniqueIds.includes(techniqueId);
    const newCompletedIds = isCompleted
      ? hobbyProgress.completedTechniqueIds.filter((id) => id !== techniqueId)
      : [...hobbyProgress.completedTechniqueIds, techniqueId];

    const newSkippedIds = hobbyProgress.skippedTechniqueIds.filter(id => id !== techniqueId);

    const now = new Date();
    const lastActive = new Date(hobbyProgress.lastActive);
    const diffDays = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
    
    let newStreak = hobbyProgress.streak;
    if (diffDays === 1) {
      newStreak += 1;
    } else if (diffDays > 1) {
      newStreak = 1;
    }

    const updatedHobbyProgress = {
      ...hobbyProgress,
      completedTechniqueIds: newCompletedIds,
      skippedTechniqueIds: newSkippedIds,
      lastActive: now.toISOString(),
      streak: newStreak
    };

    const newProgress = state.progress.filter((p) => p.hobbyId !== hobbyId);
    const finalProgress = [...newProgress, updatedHobbyProgress];
    
    storage.set(STORAGE_KEYS.PROGRESS, finalProgress);
    return { progress: finalProgress };
  }),

  skipTechnique: (hobbyId, techniqueId) => set((state) => {
    let hobbyProgress = state.progress.find((p) => p.hobbyId === hobbyId);
    if (!hobbyProgress) {
      hobbyProgress = {
        hobbyId,
        completedTechniqueIds: [],
        skippedTechniqueIds: [],
        lastActive: new Date().toISOString(),
        streak: 0,
        startedAt: new Date().toISOString()
      };
    }

    const isSkipped = hobbyProgress.skippedTechniqueIds.includes(techniqueId);
    const newSkippedIds = isSkipped
      ? hobbyProgress.skippedTechniqueIds.filter(id => id !== techniqueId)
      : [...hobbyProgress.skippedTechniqueIds, techniqueId];
    
    const newCompletedIds = hobbyProgress.completedTechniqueIds.filter(id => id !== techniqueId);

    const updatedHobbyProgress = {
      ...hobbyProgress,
      skippedTechniqueIds: newSkippedIds,
      completedTechniqueIds: newCompletedIds,
      lastActive: new Date().toISOString()
    };

    const newProgress = state.progress.filter((p) => p.hobbyId !== hobbyId);
    const finalProgress = [...newProgress, updatedHobbyProgress];
    
    storage.set(STORAGE_KEYS.PROGRESS, finalProgress);
    return { progress: finalProgress };
  }),

  getHobbyProgress: (hobbyId) => {
    return get().progress.find((p) => p.hobbyId === hobbyId) || null;
  },

  getTechniqueStatus: (hobbyId, techniqueId) => {
    const hobbyProgress = get().progress.find((p) => p.hobbyId === hobbyId);
    if (!hobbyProgress) return 'pending';
    if (hobbyProgress.completedTechniqueIds.includes(techniqueId)) return 'done';
    if (hobbyProgress.skippedTechniqueIds.includes(techniqueId)) return 'skipped';
    return 'pending';
  }
}));
