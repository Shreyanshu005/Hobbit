import type { HobbyGoal, HobbyLevel } from '../types/plan.types'

const LEVEL_CONTEXT: Record<HobbyLevel, string> = {
  beginner: 'a complete beginner with zero prior experience',
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
): string => `You are an expert hobby learning coach. Generate a focused, opinionated learning plan.

PERSON:
- Hobby: ${hobby}
- Level: ${LEVEL_CONTEXT[level]}
- Goal: ${GOAL_CONTEXT[goal]}

STEP 1 — CLASSIFY THE HOBBY:
Determine which category fits best:
- "physical": guitar, dance, sport, cooking, martial arts — muscle memory and doing matters most
- "strategic": chess, poker, investing, board games — thinking frameworks and decisions matter
- "creative": painting, writing, photography, crafts — expression and taste matter
- "technical": coding, electronics, woodworking — building and problem solving matter

STEP 2 — GENERATE EXACTLY 5 TO 8 TECHNIQUES:
You MUST generate an array of at least 5 techniques, but no more than 8.
Order from most foundational to most advanced.
Group them into sections:
- "foundation": first 2–3 techniques, absolute basics, zero assumptions
- "building": middle techniques, core skill development
- "advanced": last 1–2 techniques, refinement, expression, or mastery

RULES PER CATEGORY:
physical:
  - readingPoints give context only — never replace doing
  - practicePrompt must be a physical action ("pick up your guitar and do X for 10 minutes")
  - commonMistakes must be physical errors ("pressing too far from the fret")
  - omit scenarioChallenge entirely

strategic:
  - readingPoints can include frameworks and mental models
  - practicePrompt is a thinking exercise ("study this position for 5 minutes, find the tactic")
  - commonMistakes are thinking errors ("playing too fast without calculating")
  - include scenarioChallenge with a realistic single decision scenario

creative:
  - readingPoints balance concept and visual awareness
  - practicePrompt is a small creative exercise ("sketch 5 thumbnails in 10 minutes")
  - commonMistakes are habit errors ("overworking a painting because it feels unfinished")
  - omit scenarioChallenge

technical:
  - readingPoints explain concepts and mental models
  - practicePrompt is a mini build ("build a function that does X")
  - commonMistakes are process errors ("copying code without understanding it")
  - omit scenarioChallenge

YOUTUBE SEARCH QUERY RULES:
- 2 queries per technique — one foundational, one deeper dive
- Must be specific and findable — include "tutorial", "beginner", "how to", "lesson"
- Bad: "guitar chords". Good: "how to play open G chord guitar beginner close up slow motion"

IMPORTANT:
- Return ONLY raw valid JSON
- No markdown, no code fences, no explanation text
- readingPoints MUST follow "Heading: Detailed explanation with at least 2-3 bullet points" format (e.g. "Core Concept: This is the main idea. • Point one • Point two")
- Bullet points must be separated by the " • " symbol.
- estimatedMinutes must be realistic (10–45 min range)
- practicePrompt must start with an action verb and specify a time ("Spend X minutes...")
- scenarioChallenge only for strategic hobbies — omit key entirely for others

- "techniques" MUST be an array containing between 5 and 8 items. Do not provide fewer than 5 items.

JSON SHAPE:
{
  "hobbyCategory": "physical",
  "estimatedTotalHours": 14,
  "techniques": [
    {
      "id": "unique-kebab-case-id",
      "title": "Technique name",
      "whyItMatters": "One sentence — why this is essential for their specific goal",
      "difficulty": "beginner",
      "section": "foundation",
      "estimatedMinutes": 20,
      "youtubeSearchQueries": [
        "specific foundational query",
        "specific deeper dive query"
      ],
      "readingPoints": [
        "Core Concept: Detailed explanation of the main idea. • Essential part one • Essential part two",
        "Key Detail: Specific nuance to understand. • Sub-point A • Sub-point B",
        "Practical Tip: How to apply this immediately. • Implementation step • Expected result"
      ],
      "practicePrompt": "Spend 10 minutes doing exactly this: [specific action]",
      "commonMistakes": [
        "Most common mistake beginners make",
        "Second mistake to watch for"
      ],
      "scenarioChallenge": {
        "prompt": "Scenario description — only present for strategic hobbies",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctIndex": 1,
        "explanation": "Why this option is correct and the others are not"
      }
    }
  ]
}`