import type { Plan, HobbyLevel, HobbyGoal } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const planService = {
  getPlan: async (hobby: string, level: HobbyLevel, goal: HobbyGoal): Promise<Plan> => {
    const response = await fetch(`${API_BASE_URL}/plan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ hobby, level, goal }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate plan');
    }

    const result = await response.json();
    return result.data;
  }
};
