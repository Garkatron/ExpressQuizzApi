import { Options } from 'express-slow-down'
export const SLOWDOWN_CONFIG: Partial<Options> = {
    windowMs: 15 * 60 * 1000,
    delayAfter: 50,
    delayMs: () => 500,
    maxDelayMs: 3000,
    skipSuccessfulRequests: false
}
