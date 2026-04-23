export type HobbyLevel = 'beginner' | 'intermediate' | 'casual'
export type HobbyGoal = 'just-for-fun' | 'perform' | 'compete' | 'social'
export type HobbyCategory = 'physical' | 'strategic' | 'creative' | 'technical'
export type Difficulty = 'beginner' | 'intermediate' | 'advanced'
export type Section = 'foundation' | 'building' | 'advanced'
export type TechniqueStatus = 'pending' | 'in-progress' | 'done' | 'skipped'
export type TechniqueUserStatus = TechniqueStatus
export type PracticeOutcome = 'nailed-it' | 'needs-practice' | 'too-hard'

export interface UserProgress {
  hobbyId: string
  completedTechniqueIds: string[]
  skippedTechniqueIds: string[]
  lastActive: string
  streak: number
  startedAt: string
}

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
  chatHistory?: Message[]
}

export interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}
