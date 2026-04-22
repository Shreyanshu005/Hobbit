import { GoogleGenerativeAI } from '@google/generative-ai'
import { z, ZodError } from 'zod'
import type { HobbyGoal, HobbyLevel, Plan, Technique } from '../types/plan.types'
import { buildPlanPrompt } from './prompt.builder'

const techniqueSchema = z.object({
    id: z.string().min(1),
    title: z.string().min(1),
    whyItMatters: z.string().min(1),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
    primaryYoutubeSearchQuery: z.string().min(1),
    prerequisiteId: z.string().nullable(),
    readingPoints: z.array(z.string().min(1)).min(1).max(5),
})

const planResponseSchema = z.object({
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

const parseTechniques = (rawText: string): Technique[] => {
    const cleaned = stripMarkdownFences(rawText)
    const jsonStr = cleaned.startsWith('{') ? cleaned : '{' + cleaned
    const parsed: unknown = JSON.parse(jsonStr)
    const validated = planResponseSchema.parse(parsed)
    return validated.techniques
}

const planCache = new Map<string, Plan>()

const getPlanCacheKey = (hobby: string, level: HobbyLevel, goal: HobbyGoal): string => {
    return `${hobby.toLowerCase().trim()}-${level}-${goal}`
}

let cachedModelName: string | null = null;

async function getDiscoveredModel(apiKey: string): Promise<string> {
    if (cachedModelName) return cachedModelName;

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch models');
        
        const data = await response.json();
        const models = (data as any).models || [];
        
        const flashModel = models.find((m: any) => 
            m.supportedGenerationMethods.includes('generateContent') && 
            m.name.includes('flash')
        );
        
        const backupModel = models.find((m: any) => 
            m.supportedGenerationMethods.includes('generateContent')
        );

        const selected = flashModel?.name || backupModel?.name || 'models/gemini-pro';
        cachedModelName = selected.replace('models/', '');
        console.log(`[ai] Discovered model: ${cachedModelName}`);
        return cachedModelName;
    } catch (error) {
        console.error('[ai] Model discovery failed, falling back to gemini-pro', error);
        return 'gemini-pro';
    }
}

const callGeminiWithRetry = async (
    prompt: string,
    maxAttempts = 2
): Promise<string> => {
    const apiKey = process.env.GEMINI_API_KEY as string;
    const modelName = await getDiscoveredModel(apiKey);
    
    const client = new GoogleGenerativeAI(apiKey);
    const model = client.getGenerativeModel({ model: modelName });

    let lastError: unknown;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            const result = await model.generateContent(prompt);
            return result.response.text();
        } catch (err) {
            lastError = err;
            if (attempt < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            }
        }
    }

    throw lastError;
};

export const generatePlan = async (
    hobby: string,
    level: HobbyLevel,
    goal: HobbyGoal
): Promise<Plan> => {
    const cacheKey = getPlanCacheKey(hobby, level, goal)
    const cachedPlan = planCache.get(cacheKey)
    
    if (cachedPlan) {
        console.log(`[cache] Hit for ${cacheKey}`)
        return cachedPlan
    }

    const prompt = buildPlanPrompt(hobby, level, goal)
    const rawText = await callGeminiWithRetry(prompt)

    let techniques: Technique[]

    try {
        techniques = parseTechniques(rawText)
    } catch (error) {
        if (error instanceof ZodError) {
            const message = error.issues[0]?.message || 'Schema validation failed'
            throw new Error(`AI response failed schema validation: ${message}`)
        }
        if (error instanceof SyntaxError) {
            throw new Error('AI returned malformed JSON')
        }
        throw error
    }

    const plan: Plan = {
        hobbyId: buildHobbyId(hobby),
        hobby,
        level,
        goal,
        techniques,
        generatedAt: new Date().toISOString(),
    }

    planCache.set(cacheKey, plan)
    console.log(`[cache] Miss for ${cacheKey}. Stored new plan.`)
    
    return plan
}