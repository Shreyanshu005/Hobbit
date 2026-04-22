import type { Response } from 'express'

export const sendSuccess = <T>(res: Response, data: T, status = 200): void => {
    res.status(status).json({ success: true, data })
}

export const sendError = (res: Response, message: string, status = 400): void => {
    res.status(status).json({ success: false, error: message })
}