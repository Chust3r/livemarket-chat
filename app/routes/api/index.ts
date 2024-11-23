import { Hono } from 'hono'
import { usersRouter } from './users'
import { filesRouter } from './files'

export const apiRouter = new Hono().basePath('/api')

apiRouter.route('/', usersRouter)

apiRouter.route('/', filesRouter)
