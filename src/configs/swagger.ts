import path from 'path'
import { Options } from 'swagger-jsdoc'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SWAGGER_CONFIG: Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Quizz API',
            version: '1.0.0'
        }
    },
    apis: [path.join(__dirname, '../routes/*.ts'), path.join(__dirname, '../models/*.ts')]
}

export default SWAGGER_CONFIG
