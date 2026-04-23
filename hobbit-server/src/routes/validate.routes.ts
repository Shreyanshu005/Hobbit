import { Router } from 'express'
import { checkHobby } from '../controllers/validate.controller'
import { hobbyFacts } from '../controllers/hobby.controller'
import { planRateLimit } from '../middleware/rateLimit'

const validateRouter = Router()

validateRouter.post('/hobby', planRateLimit, checkHobby)
validateRouter.get('/hobby/facts', hobbyFacts)

export default validateRouter
