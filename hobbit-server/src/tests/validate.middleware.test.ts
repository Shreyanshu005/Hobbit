import express from 'express'
import request from 'supertest'
import { validatePlanRequest } from '../middleware/validate'
import { sendSuccess } from '../utils/response'

const buildTestApp = () => {
    const app = express()
    app.use(express.json())
    app.post('/test', validatePlanRequest, (_req, res) => sendSuccess(res, { ok: true }))
    return app
}

describe('validatePlanRequest middleware', () => {
    const app = buildTestApp()

    it('passes valid request body', async () => {
        const res = await request(app).post('/test').send({
            hobby: 'guitar',
            level: 'beginner',
            goal: 'just-for-fun',
        })
        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
    })

    it('rejects missing hobby', async () => {
        const res = await request(app).post('/test').send({
            level: 'beginner',
            goal: 'just-for-fun',
        })
        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
    })

    it('rejects invalid level', async () => {
        const res = await request(app).post('/test').send({
            hobby: 'guitar',
            level: 'expert',
            goal: 'just-for-fun',
        })
        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
    })

    it('rejects hobby that is too short', async () => {
        const res = await request(app).post('/test').send({
            hobby: 'a',
            level: 'beginner',
            goal: 'just-for-fun',
        })
        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
    })
})