import cors from 'cors'
import express, { type Application } from 'express'
import morgan from 'morgan'
import planRouter from './routes/plan.routes'

const createApp = (): Application => {
    const app = express()

    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    app.use(
        cors({
            origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
            methods: ['GET', 'POST'],
            allowedHeaders: ['Content-Type'],
        })
    )

    app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))

    app.get('/health', (_req, res) => {
        res.json({ status: 'ok', timestamp: new Date().toISOString() })
    })

    app.use('/api/plan', planRouter)

    app.use((_req, res) => {
        res.status(404).json({ success: false, error: 'Route not found' })
    })

    return app
}

export default createApp