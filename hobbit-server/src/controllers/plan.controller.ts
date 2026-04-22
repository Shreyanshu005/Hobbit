import type { Request, Response } from 'express'
import { generatePlan } from '../services/ai.service'
import type { PlanRequestBody } from '../types/plan.types'
import { sendError, sendSuccess } from '../utils/response'

export const createPlan = async (
    req: Request<object, object, PlanRequestBody>,
    res: Response
): Promise<void> => {
    const { hobby, level, goal } = req.body

    try {
        const plan = await generatePlan(hobby, level, goal)
        sendSuccess(res, plan, 201)
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('malformed JSON') || error.message.includes('schema validation')) {
                sendError(res, 'AI returned an invalid response. Please try again.', 502)
                return
            }
        }
        console.error('Plan generation error:', error)
        sendError(res, 'Failed to generate plan. Please try again.', 502)
    }
}