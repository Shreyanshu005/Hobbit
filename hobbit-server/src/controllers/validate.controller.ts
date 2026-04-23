import type { Request, Response } from 'express'
import { validateIsHobby } from '../services/ai.service'
import { sendError, sendSuccess } from '../utils/response'

export const checkHobby = async (req: Request, res: Response): Promise<void> => {
  const { hobby } = req.body

  if (!hobby || typeof hobby !== 'string' || hobby.trim().length < 3) {
    sendError(res, 'Please enter a valid hobby name', 400)
    return
  }

  try {
    const isValid = await validateIsHobby(hobby.trim())
    console.log(`[validate] Hobby "${hobby}": ${isValid ? 'VALID' : 'INVALID'}`);

    if (!isValid) {
      sendError(res, `Hi! I can only help you master actual hobbies or skills (like Guitar, Chess, or Coding). Let's try something else!`, 422)
      return
    }

    sendSuccess(res, { valid: true, hobby: hobby.trim() })
  } catch (error) {
    console.error('[validate] Error during AI validation:', error);
    sendSuccess(res, { valid: true, hobby: hobby.trim() })
  }
}
