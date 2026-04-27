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
  goal: HobbyGoal,
  chatHistory?: Array<{ role: string, content: string }>
): string => {
  const historyText = chatHistory && chatHistory.length > 0
    ? `\n\nUSER CONVERSATION CONTEXT:\n${chatHistory.map(m => `${m.role}: ${m.content}`).join('\n')}\n(Use this context to deeply personalize the plan!)`
    : '';

  return `You are an expert hobby learning coach. Generate a focused, opinionated learning plan.

PERSON:
- Hobby: ${hobby}
- Level: ${LEVEL_CONTEXT[level]}
- Goal: ${GOAL_CONTEXT[goal]}${historyText}

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

IMPORTANT FOR VERBOSITY AND DETAIL:
- The user is hungry for deep, detailed knowledge. BE EXTREMELY VERBOSE AND COMPREHENSIVE in your descriptions!
- "whyItMatters" should be a rich, inspiring paragraph explaining the deep mechanics of why this technique unlocks mastery.
- "readingPoints" MUST be highly detailed paragraphs. Explain the "HOW" and the "WHY" comprehensively. Use the format "Heading: Extremely detailed explanation of the concept. • Point one • Point two • Point three". Give deep, actionable insights.
- "practicePrompt" must be highly detailed, breaking down the practice routine step-by-step.
- "commonMistakes" should explain not just what the mistake is, but WHY it happens and exactly HOW to fix it.
- "scenarioChallenge.prompt" and "scenarioChallenge.explanation" should be highly detailed, reading like a mini case study.
- Return ONLY raw valid JSON. No markdown, no code fences.
- Bullet points MUST be separated by the " • " symbol.
- estimatedMinutes must be realistic (20–60 min range)
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
      "whyItMatters": "A highly detailed, rich, and inspiring paragraph explaining the deep mechanics and philosophy of why this technique unlocks mastery.",
      "difficulty": "beginner",
      "section": "foundation",
      "estimatedMinutes": 45,
      "youtubeSearchQueries": [
        "specific foundational query",
        "specific deeper dive query"
      ],
      "readingPoints": [
        "Core Concept: Provide an extremely detailed, multi-sentence explanation of the concept, breaking down the mechanics. • Provide deep, actionable insight one • Provide deep actionable insight two • Provide an advanced tip",
        "Key Detail: Go deeply into the nuance of this specific part of the technique. • Sub-point A with explanation • Sub-point B with explanation",
        "Practical Tip: A highly specific, step-by-step breakdown of how to apply this. • Implementation step one • Expected result and feeling"
      ],
      "practicePrompt": "A highly detailed, step-by-step breakdown of the practice routine. Do exactly this: 1. Start by... 2. Then focus on... 3. Finally...",
      "commonMistakes": [
        "Detailed explanation of the most common mistake, WHY it happens, and exactly HOW to fix it.",
        "Detailed explanation of the second mistake to watch for, its root cause, and the mental model to overcome it."
      ],
      "scenarioChallenge": {
        "prompt": "A highly detailed scenario description reading like a deep case study. Only present for strategic hobbies.",
        "options": ["Detailed Option A", "Detailed Option B", "Detailed Option C", "Detailed Option D"],
        "correctIndex": 1,
        "explanation": "A comprehensive breakdown of exactly why this option is correct, analyzing the mechanics, and why the others fail."
      }
    }
  ]
  }`
}