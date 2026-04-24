import Groq from 'groq-sdk'
import { z, ZodError } from 'zod'
import type { HobbyGoal, HobbyLevel, Plan, Technique } from '../types/plan.types'
import { buildPlanPrompt } from './prompt.builder'
import { searchVideos } from './youtube.service'

const scenarioSchema = z.object({
    prompt: z.string(),
    options: z.array(z.string()),
    correctIndex: z.number(),
    explanation: z.string()
}).optional()

const techniqueSchema = z.object({
    id: z.string().min(1),
    title: z.string().min(1),
    whyItMatters: z.string().min(1),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
    section: z.enum(['foundation', 'building', 'advanced']),
    estimatedMinutes: z.number().min(5),
    youtubeSearchQueries: z.array(z.string()).min(1),
    readingPoints: z.array(z.string().min(1)).min(1),
    practicePrompt: z.string().min(1),
    commonMistakes: z.array(z.string().min(1)).min(1),
    scenarioChallenge: scenarioSchema
})

const planResponseSchema = z.object({
    hobbyCategory: z.enum(['physical', 'strategic', 'creative', 'technical']),
    estimatedTotalHours: z.number().min(1),
    techniques: z.array(techniqueSchema).min(5).max(8),
})

const buildHobbyId = (hobby: string): string => {
    return `${hobby.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`
}

const stripMarkdownFences = (raw: string): string => {
    return raw
        .replace(/```json\s*/gi, '')
        .replace(/```\s*/g, '')
        .trim()
}

const parsePlanResponse = (rawText: string): any => {
    const cleaned = stripMarkdownFences(rawText)
    const jsonStr = cleaned.startsWith('{') ? cleaned : '{' + cleaned
    const parsed: unknown = JSON.parse(jsonStr)
    return planResponseSchema.parse(parsed)
}

const planCache = new Map<string, Plan>()
const validationCache = new Map<string, boolean>()

const getPlanCacheKey = (hobby: string, level: HobbyLevel, goal: HobbyGoal): string => {
    return `${hobby.toLowerCase().trim()}-${level}-${goal}`
}

const callGroqWithRetry = async (prompt: string, maxAttempts = 3): Promise<string> => {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    let lastError: any;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            const response = await groq.chat.completions.create({
                messages: [
                    { role: 'user', content: prompt }
                ],
                model: 'llama-3.3-70b-versatile',
                temperature: 0.7,
                response_format: { type: 'json_object' },
                max_tokens: 4000,
            });
            return response.choices[0]?.message?.content || '';
        } catch (err: any) {
            lastError = err;

            if (err.status === 429 || (err.message && err.message.includes('429'))) {
                console.error(`[ai] Quota exceeded for Groq:`, err.message);
            }

            if (attempt < maxAttempts) {
                const waitTime = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
                await new Promise(resolve => setTimeout(resolve, waitTime));
                continue;
            }
            break;
        }
    }
    throw lastError;
};

export const generatePlan = async (hobby: string, level: HobbyLevel, goal: HobbyGoal, chatHistory?: any[]): Promise<Plan> => {
    const cacheKey = getPlanCacheKey(hobby, level, goal)
    const cachedPlan = planCache.get(cacheKey)
    if (cachedPlan && !chatHistory) return cachedPlan

    const prompt = buildPlanPrompt(hobby, level, goal, chatHistory)
    const rawText = await callGroqWithRetry(prompt)
    const validatedData = parsePlanResponse(rawText)

    const techniquesWithVideos: Technique[] = await Promise.all(
        validatedData.techniques.map(async (tech: any) => {
            const searchPromises = tech.youtubeSearchQueries.slice(0, 1).map((q: string) => searchVideos(q, 1));
            const videoResults = await Promise.all(searchPromises);
            const flatVideos = videoResults.flat();
            return {
                ...tech,
                videos: flatVideos
            };
        })
    );

    const plan: Plan = {
        hobbyId: buildHobbyId(hobby),
        hobby,
        hobbyCategory: validatedData.hobbyCategory,
        level,
        goal,
        techniques: techniquesWithVideos,
        generatedAt: new Date().toISOString(),
        estimatedTotalHours: validatedData.estimatedTotalHours
    }

    planCache.set(cacheKey, plan)
    return plan
}

export const validateIsHobby = async (input: string): Promise<boolean> => {
    const normalizedInput = input.trim().toLowerCase();
    if (validationCache.has(normalizedInput)) return validationCache.get(normalizedInput)!;
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    try {
        const response = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: 'You are a strict hobby validator. A hobby must be a learnable activity, skill, or pastime. Nouns that are just objects (e.g., "Pen", "Banana") are NOT hobbies unless part of an activity. Answer ONLY with "YES" or "NO".'
                },
                { role: 'user', content: `Is "${input}" a hobby?` }
            ],
            model: 'llama-3.1-8b-instant',
            temperature: 0,
            max_tokens: 5,
        });
        const answer = response.choices[0]?.message?.content?.trim().toUpperCase() || '';
        const isValid = answer.includes('YES') && !answer.includes('NO');
        validationCache.set(normalizedInput, isValid);
        return isValid;
    } catch (error) {
        return true;
    }
}

export const getHobbyFacts = async (hobby: string): Promise<string[]> => {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    try {
        const response = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: 'You generate fun facts about hobbies. Return ONLY a JSON array of exactly 5 short one-liner fun facts (max 15 words each). No markdown, no explanation, just the JSON array of strings.'
                },
                { role: 'user', content: `Give me 5 fun facts about ${hobby}` }
            ],
            model: 'llama-3.1-8b-instant',
            temperature: 0.7,
            max_tokens: 300,
        });
        const raw = response.choices[0]?.message?.content?.trim() || '[]';
        const cleaned = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
        const facts = JSON.parse(cleaned);
        if (Array.isArray(facts) && facts.length > 0) return facts.slice(0, 5);
        return [`${hobby} is a wonderful skill to learn!`];
    } catch (error) {
        return [
            `${hobby} is a wonderful skill to learn!`,
            `Many people around the world enjoy ${hobby}.`,
            `Learning ${hobby} can boost creativity and focus.`,
            `${hobby} has a rich history spanning centuries.`,
            `Practicing ${hobby} daily leads to rapid improvement.`
        ];
    }
}

const spellingCache = new Map<string, string>()

export const correctHobbySpelling = async (input: string): Promise<string> => {
    const normalizedInput = input.trim().toLowerCase()
    if (spellingCache.has(normalizedInput)) return spellingCache.get(normalizedInput)!

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
    try {
        const response = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: 'You are a spelling corrector. The user will give you a hobby or skill name that may be misspelled. Return ONLY the corrected spelling with proper capitalization. Do not add any explanation, quotes, or extra text. If the spelling is already correct, return the word as-is with proper capitalization. Examples: "gitar" → "Guitar", "chesss" → "Chess", "swiming" → "Swimming", "photography" → "Photography".'
                },
                { role: 'user', content: input.trim() }
            ],
            model: 'llama-3.1-8b-instant',
            temperature: 0,
            max_tokens: 20,
        })
        const corrected = response.choices[0]?.message?.content?.trim() || input.trim()

        if (corrected.length > input.length * 3 || corrected.includes('\n')) {
            spellingCache.set(normalizedInput, input.trim())
            return input.trim()
        }
        spellingCache.set(normalizedInput, corrected)
        return corrected
    } catch (error) {
        console.error('[ai] Spelling correction failed:', error)
        return input.trim()
    }
}