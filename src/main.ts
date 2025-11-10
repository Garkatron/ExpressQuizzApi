// ? Show errors
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err instanceof Error ? err.stack : err)
})

process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason instanceof Error ? reason.stack : reason)
})

// * |> ------------------------------------------------------------------------- <|
// ? Important imports!
import express, { NextFunction, Request, Response } from 'express'

// ? Environment
import { fileURLToPath } from 'url'
import path from 'path'
import dotenv from 'dotenv'

// ? Security
import helmet from 'helmet'
import cors, { CorsOptions } from 'cors'
import rateLimit from 'express-rate-limit'
import slowDown from 'express-slow-down'

// ? Documentation
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

// ? Logging
import logger from '#helpers/logger'
import pinoHttp from 'pino-http'

// ? Configuration
import SWAGGER_CONFIG from '#configs/swagger'
import CORS_CONFIG from '#configs/cors'
import { RATE_LIMIT_CONFIG } from '#configs/ratelimit'
import { asyncHandler } from '#helpers/utils'
import { SLOWDOWN_CONFIG } from '#configs/slowdown'

// ? User routes
import userRoutes from '#routes/UserRoutes'
import questionRoutes from '#routes/QuestionRoutes'
import collectionRoutes from '#routes/CollectionRoutes'
import { connectDB } from '#databases/mongoose'

// * |> ------------------------------------------------------------------------- <|

switch (process.env.NODE_ENV) {
    case 'production':
        dotenv.config({ path: '.env.production' })
        break
    case 'test':
        dotenv.config({ path: '.env.test' })
        break
    default:
        dotenv.config({ path: '.env' })
        break
}

const PORT = process.env.PORT || 3000

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// ? Basic
app.set('port', PORT)
app.use(express.json())

// ? Security
app.use(cors(CORS_CONFIG as CorsOptions))

// ? https://stackoverflow.com/questions/60706823/what-modules-of-helmet-should-i-use-in-my-rest-api
// ? https://blog.logrocket.com/using-helmet-node-js-secure-application/
//* Headers
app.use(helmet())

// * Clickjacking: X-Frame-Options SAMEORIGIN
app.use(helmet.frameguard({ action: 'sameorigin' }))

// * MIME Sniffing: X-Content-Type-Options nosniff
app.use(helmet.noSniff())

app.use(helmet.xssFilter())

// * Keep users https
app.use(helmet.hsts())

// * Hide technology
app.use(helmet.hidePoweredBy())

// * Avoid more shit
app.use(helmet.permittedCrossDomainPolicies())

// * Scrapping
app.use(rateLimit(RATE_LIMIT_CONFIG)) // General
app.use(slowDown(SLOWDOWN_CONFIG))

// = Middleware de errores
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err)
    res.status(err.status || 500).json({ error: err.message || 'Server error...' })
})

// ? Public
app.use('/shared', express.static(path.join(__dirname, '../shared')))
app.use(express.static('public'))

// ? Loggin
app.use((pinoHttp as any)({ logger }))

// ? Database
await connectDB()

// ? Root Get
app.get(
    '/',
    asyncHandler(async (req: Request, res: Response) => {
        req.log.info('Route /')
        res.status(200).json({ message: 'My Express + Mongoose + Typescript API!' })
    })
)

// * routes

const API_PREFIX: string = process.env.API_PREFIX as string
const API_VERSION: string = process.env.API_VERSION as string

const PREFIX = `${API_PREFIX}/${API_VERSION}`

logger.info(`Using prefix: ${PREFIX}`)

app.use(`${PREFIX}/users`, userRoutes)
app.use(`${PREFIX}/questions`, questionRoutes)
app.use(`${PREFIX}/collections`, collectionRoutes)

// ? ApiDoc
const swaggerSpec = swaggerJSDoc(SWAGGER_CONFIG)
app.use(
    `${PREFIX}/docs`,
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
        customSiteTitle: 'Quiz API Docs',
        customCss: `
      .swagger-ui .topbar { 
        display: none 
      }
    `
    })
)

// ? Finished setup
app.listen(app.get('port'), () => {
    console.log(`Server running on port ${app.get('port')}`)
})

export default app
