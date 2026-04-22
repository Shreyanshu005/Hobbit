import type { HobbyGoal, HobbyLevel } from '../types/plan.types'

const LEVEL_CONTEXT: Record<HobbyLevel, string> = {
    beginner: 'a complete beginner with no prior experience',
    intermediate: 'someone with some experience who wants structured improvement',
    casual: 'someone who wants to enjoy the hobby without intense commitment',
}

const GOAL_CONTEXT: Record<HobbyGoal, string> = {
    'just-for-fun': 'purely for personal enjoyment and relaxation',
    perform: 'to eventually perform or demonstrate to others',
    compete: 'to reach a competitive or advanced skill level',
    social: 'to participate socially with others who share this hobby',
}

export const buildPlanPrompt = (
    hobby: string,
    level: HobbyLevel,
    goal: HobbyGoal
): string => {
    return `You are an expert hobby learning coach. Create a focused, practical learning plan.

Person details:
- Hobby they want to learn: ${hobby}
- Current level: ${LEVEL_CONTEXT[level]}
- Their goal: ${GOAL_CONTEXT[goal]}

CRITICAL RULES FOR RESOURCE TYPES:
- Physical or performance hobbies (guitar, dance, sport, cooking, drawing, martial arts): prioritise video demonstrations. Reading points should only give context, never replace doing.
- Strategic or analytical hobbies (chess, poker, coding, investing, board games): decision frameworks and conceptual reading are appropriate alongside videos.
- Creative hobbies (painting, writing, photography, crafts): balance visual examples with conceptual understanding.
- YouTube search query MUST be a single, highly specific string. Good: "open G chord finger placement close up beginner slow".
- Structure the curriculum logically using prerequisiteId to link techniques.

RULES:
- Generate exactly 5 to 8 techniques
- Order them from most foundational to most advanced
- Each technique id must be a unique kebab-case string
- Return ONLY raw valid JSON — no markdown, no code fences, no explanation

Required JSON shape:
{
  "techniques": [
    {
      "id": "unique-kebab-case-id",
      "title": "Short technique name",
      "whyItMatters": "One clear sentence on why this is important for their specific goal",
      "difficulty": "beginner",
      "primaryYoutubeSearchQuery": "highly specific search string",
      "prerequisiteId": "id-of-previous-technique-or-null",
      "readingPoints": [
        "Concise concept point 1",
        "Concise concept point 2"
      ]
    }
  ]
}

{`
}