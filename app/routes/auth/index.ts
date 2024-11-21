import { Hono } from 'hono'
import { login } from './login'
import { register } from './register'

export const authRouter = new Hono().basePath('/auth')

//→ LOAD AUTH ROUTES

authRouter.route('/', login)

authRouter.route('/', register)
