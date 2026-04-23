import type { Request, Response } from 'express'
import { getHobbyFacts } from '../services/ai.service'
import { sendSuccess, sendError } from '../utils/response'

export const hobbyFacts = async (req: Request, res: Response): Promise<void> => {
    const hobby = req.query.hobby as string

    if (!hobby || typeof hobby !== 'string' || hobby.trim().length < 2) {
        sendError(res, 'Please provide a valid hobby name', 400)
        return
    }

    try {
        const facts = await getHobbyFacts(hobby.trim())
        sendSuccess(res, { facts })
    } catch (error) {
        console.error('[hobby] Error fetching facts:', error)
        sendSuccess(res, { facts: [`${hobby} is a wonderful skill to learn!`] })
    }
}
