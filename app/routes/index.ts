import { Hono } from 'hono'
import { authRouter } from './auth'
import { apiRouter } from './api'
export * from "./ws"

export const routes = new Hono()

//→ LOAD API ROUTES

routes.route('/', apiRouter)

//→ LOAD AUTH ROUTES

routes.route('/', authRouter)
