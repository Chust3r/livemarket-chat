import { Hono } from 'hono'
import { usersRouter } from './users'

export const apiRouter = new Hono().basePath('/api')

apiRouter.route('/', usersRouter)
