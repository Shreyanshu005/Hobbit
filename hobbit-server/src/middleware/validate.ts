import type { NextFunction, Request, Response } from 'express'
import { z, ZodError } from 'zod'
import { sendError } from '../utils/response'

export const planRequestSchema = z.object({
    hobby: z
        .string({ required_error: 'Hobby is required' })
        .min(3, 'Hobby must be at least 3 characters')
        .max(50, 'Hobby name is too long')
        .trim()
        .regex(/^[a-zA-Z\s\-']+$/, 'Hobby name must contain only letters')
        .refine(
            val => val.trim().split(/\s+/).every(word => word.length >= 2),
            'Please enter a valid hobby name'
        ),
    level: z.enum(['beginner', 'intermediate', 'casual'], {
        errorMap: () => ({ message: 'Level must be beginner, intermediate, or casual' }),
    }),
    goal: z.enum(['just-for-fun', 'perform', 'compete', 'social'], {
        errorMap: () => ({ message: 'Goal must be just-for-fun, perform, compete, or social' }),
    }),
})

export const validatePlanRequest = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        req.body = planRequestSchema.parse(req.body)
        next()
    } catch (error) {
        if (error instanceof ZodError) {
            const message = error.issues[0]?.message || 'Invalid request data'
            sendError(res, message, 400)
            return
        }
        sendError(res, 'Invalid request body', 400)
    }
}