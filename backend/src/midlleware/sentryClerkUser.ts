import type { RequestHandler } from "express";
import * as Sentry from "@sentry/node"
import { getAuth } from "@clerk/express";

// Error 3 Jam masalahnya karena kurang next() di bagian bawah cokkkkk
export const sentryClerkUserMiddleware: RequestHandler = (req, _res, next) => {
    const { userId } = getAuth(req)
    Sentry.getIsolationScope().setUser(userId ? { id: userId } : null)
    next()
}