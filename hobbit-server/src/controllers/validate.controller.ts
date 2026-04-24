import type { Request, Response } from 'express'
import { validateIsHobby, correctHobbySpelling } from '../services/ai.service'
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
      sendError(res, `Hi! I am Hobbit, your personal guide to learning. I can only help you master real-world hobbies or skills (like Guitar, Chess, or Coding). Please suggest a valid skill!`, 422)
      return
    }

    const correctedHobby = await correctHobbySpelling(hobby.trim())
    sendSuccess(res, { valid: true, hobby: correctedHobby })
  } catch (error) {
    console.error('[validate] Error during AI validation:', error);
    const correctedHobby = await correctHobbySpelling(hobby.trim())
    sendSuccess(res, { valid: true, hobby: correctedHobby })
  }
}
