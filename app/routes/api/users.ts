import { Hono } from 'hono'
import { getUserInfo } from '~actions/user'
import { makeResponse } from '~lib/response'

export const usersRouter = new Hono().basePath('/users')

//→ GET INFO FROM USER (ONLY PUBLIC INFO)

usersRouter.get('/:id', async (c) => {
	try {
		//→ GET PARAM (USER ID)

		const id = c.req.param('id')

		//→ GET USER INFO

		const user = await getUserInfo(id)

		//→ CREATE RESPONSE

		const response = makeResponse('success', 'User info', {
			data: user,
		})

		//→ RETURN RESPONSE

		return c.json(response, 200)
	} catch (e) {
		console.log('[USER INFO] ERROR', e)

		const response = makeResponse('error', 'Something went wrong', {})

		return c.json(response, 500)
	}
})
