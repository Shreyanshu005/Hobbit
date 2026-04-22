import rateLimit from 'express-rate-limit'
import { sendError } from '../utils/response'

export const planRateLimit = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res) => {
        sendError(res, 'Too many requests. Please wait a minute.', 429)
    },
})