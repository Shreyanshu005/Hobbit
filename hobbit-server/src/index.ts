import 'dotenv/config'

const REQUIRED_ENV_VARS = ['GEMINI_API_KEY', 'FRONTEND_URL'] as const

for (const key of REQUIRED_ENV_VARS) {
  if (!process.env[key]) {
    console.error(`[startup] Missing required environment variable: ${key}`)
    process.exit(1)
  }
}

import createApp from './app'

const PORT = Number(process.env.PORT) || 3000

const app = createApp()

app.listen(PORT, () => {
  console.log(`[server] Running on port ${PORT} in ${process.env.NODE_ENV ?? 'development'} mode`)
})