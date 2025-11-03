import { Options } from 'swagger-jsdoc'

const SWAGGER_CONFIG: Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Quizz API',
            version: '1.0.0'
        }
    },
    apis: ['./routes/*.ts', './models/*.ts']
}

export default SWAGGER_CONFIG
