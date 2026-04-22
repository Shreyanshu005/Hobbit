export type HobbyLevel = 'beginner' | 'intermediate' | 'casual'

export type HobbyGoal = 'just-for-fun' | 'perform' | 'compete' | 'social'

export interface PlanRequestBody {
    hobby: string
    level: HobbyLevel
    goal: HobbyGoal
}

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

export interface ApiSuccessResponse<T> {
    success: true
    data: T
}

export interface ApiErrorResponse {
    success: false
    error: string
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse