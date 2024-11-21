import { Hono } from 'hono'

export const usersRouter = new Hono().basePath('/users')

//→ GET INFO FROM USER (ONLY PUBLIC INFO)

usersRouter.get('/:id', async (c) => {})
