export type HobbyLevel = 'beginner' | 'intermediate' | 'casual'
export type HobbyGoal = 'just-for-fun' | 'perform' | 'compete' | 'social'
export type HobbyCategory = 'physical' | 'strategic' | 'creative' | 'technical'
export type Difficulty = 'beginner' | 'intermediate' | 'advanced'
export type Section = 'foundation' | 'building' | 'advanced'
export type TechniqueStatus = 'pending' | 'in-progress' | 'done' | 'skipped'
export type PracticeOutcome = 'nailed-it' | 'needs-practice' | 'too-hard'

export interface YoutubeVideo {
  videoId: string
  title: string
  channelName: string
  thumbnailUrl: string
  url: string
}

export interface ScenarioChallenge {
  prompt: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface Technique {
  id: string
  title: string
  whyItMatters: string
  difficulty: Difficulty
  section: Section
  estimatedMinutes: number
  youtubeSearchQueries: string[]
  videos: YoutubeVideo[]
  readingPoints: string[]
  practicePrompt: string
  commonMistakes: string[]
  scenarioChallenge?: ScenarioChallenge
}

export interface Plan {
  hobbyId: string
  hobby: string
  hobbyCategory: HobbyCategory
  level: HobbyLevel
  goal: HobbyGoal
  techniques: Technique[]
  generatedAt: string
  estimatedTotalHours: number
}

export interface PlanRequestBody {
  hobby: string
  level: HobbyLevel
  goal: HobbyGoal
  chatHistory?: Array<{ role: string, content: string }>
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