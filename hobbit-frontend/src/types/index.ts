export type HobbyLevel = 'beginner' | 'intermediate' | 'casual'
export type HobbyGoal = 'just-for-fun' | 'perform' | 'compete' | 'social'

export interface Technique {
    id: string
    title: string
    whyItMatters: string
    difficulty: 'beginner' | 'intermediate' | 'advanced'
    primaryYoutubeSearchQuery: string
    prerequisiteId: string | null
    readingPoints: string[]
}

export interface Plan {
    hobbyId: string
    hobby: string
    level: HobbyLevel
    goal: HobbyGoal
    techniques: Technique[]
    generatedAt: string
}

export interface TechniqueStatus {
    id: string
    isCompleted: boolean
    completedAt?: string
}

export type TechniqueUserStatus = 'pending' | 'done' | 'skipped';

export interface UserProgress {
    hobbyId: string
    completedTechniqueIds: string[]
    skippedTechniqueIds: string[]
    lastActive: string
    streak: number
    startedAt: string
}

export interface OnboardingState {
    step: number
    hobby: string
    level: HobbyLevel
    goal: HobbyGoal
}
