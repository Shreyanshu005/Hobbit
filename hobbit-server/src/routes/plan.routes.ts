import { Router } from 'express'
import { createPlan } from '../controllers/plan.controller'
import { planRateLimit } from '../middleware/rateLimit'
import { validatePlanRequest } from '../middleware/validate'

const planRouter = Router()

planRouter.post('/', planRateLimit, validatePlanRequest, createPlan)

export default planRouter