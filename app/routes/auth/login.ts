import { Hono } from 'hono'

export const login = new Hono().basePath('/login')

login.post('/', async (c) => {})
