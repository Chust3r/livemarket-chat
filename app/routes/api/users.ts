import { Hono } from 'hono'
import { getUserInfo, updateUserInfo } from '~actions/user'
import { makeResponse } from '~lib/response'
import { validate, updateUserSchema } from '~lib/validation'
import { getUpdatedProperties } from '~lib/utils'

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

//→ UPDATE USER INFO

usersRouter.put('/:id', async (c) => {
	try {
		//→ GET PARAM (USER ID)

		const id = c.req.param('id')

		//→ PARSE BODY TO JSON

		const body = await c.req.json()

		//→ VALIDATE BODY

		const { success, issues, output } = validate(updateUserSchema, body)

		if (!success) {
			const errors = issues.reduce((acc, issue) => {
				// @ts-ignore
				acc[issue.path[0]] = issue.message
				return acc
			}, {})

			const response = makeResponse('error', 'Validation error', {
				errors,
			})

			//→ RETURN RESPONSE

			return c.json(response, 400)
		}

		//→ GET USER INFO

		const userInfo = await getUserInfo(id)

		if (!userInfo) {
			const response = makeResponse('error', 'User not found', {})

			return c.json(response, 404)
		}

		//→ CHECK IF DATA IS DIFERENT & RETURN ONLY CHANGED DATA

		const { isDifferences, data } = getUpdatedProperties(userInfo, output)

		//→ IS NOT DIFERENT

		if (!isDifferences) {
			const response = makeResponse('error', 'No changes detected', {})

			return c.json(response, 400)
		}

		//→ UPDATE USER INFO

		const userUpdated = await updateUserInfo(id, data)

		const response = makeResponse('success', 'User info updated', {
			data: userUpdated,
		})

		//→ RETURN RESPONSE

		return c.json(response, 200)
	} catch (e) {
		console.log('[USER UPDATE INFO] ERROR', e)

		const response = makeResponse('error', 'Something went wrong', {})

		return c.json(response, 500)
	}
})
