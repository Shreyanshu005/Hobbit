import cors from 'cors'
import express, { type Application } from 'express'
import morgan from 'morgan'
import planRouter from './routes/plan.routes'
import validateRouter from './routes/validate.routes'

const createApp = (): Application => {
    const app = express()

    const allowedOriginsFromEnv = (process.env.FRONTEND_URL ?? '')
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean)

    const allowedOrigins = allowedOriginsFromEnv.length
        ? allowedOriginsFromEnv
        : ['https://hobbit-chi.vercel.app', 'http://localhost:5173']

    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    app.use(
        cors({
            origin: (origin, callback) => {
                if (!origin) {
                    callback(null, true)
                    return
                }

                if (allowedOrigins.includes(origin)) {
                    callback(null, true)
                    return
                }

                callback(new Error(`CORS blocked for origin: ${origin}`))
            },
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true,
            optionsSuccessStatus: 204,
        })
    )


    app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))

    app.get('/health', (_req, res) => {
        res.json({ status: 'ok', timestamp: new Date().toISOString() })
    })

    app.use('/api/plan', planRouter)
    app.use('/api/validate', validateRouter)

    app.use((_req, res) => {
        res.status(404).json({ success: false, error: 'Please check your network and try again.' })
    })

    return app
}

export default createApp