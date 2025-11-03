import { Options } from 'express-rate-limit'

export const RATE_LIMIT_CONFIG: Partial<Options> = {
    windowMs: 5 * 60 * 1000, // 5 Min
    max: 100,
    message: 'So much fetch, try later.'
}

/*
export const LOGIN_RATE_LIMIT_CONFIG: Partial<Options> = {
    windowMs: 5 * 60 * 1000, // 5 Min
    max: 5,
    message: "So much fetch, try later.",
}
*/
