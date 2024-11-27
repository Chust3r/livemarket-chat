import { Hono } from 'hono'
import { getUserByEmail } from '~actions/user'
import { createJwt } from '~lib/jwt'
import { verifyPassword } from '~lib/password'
import { makeResponse } from '~lib/response'
import { validate, loginSchema } from '~lib/validation'

export const login = new Hono().basePath('/login')

//→ ENPOINT TO LOGIN

login.post('/', async (c) => {
	try {
		//→ PARSE BODY TO JSON

		const body = await c.req.json()

		//→ VALIDATE BODY

		const { success, issues, output } = validate(loginSchema, body)

		if (!success) {
			const errors = issues.reduce((acc, issue) => {
				// @ts-ignore
				const field = issue.path[0]?.key
				if (field) {
					// @ts-ignore
					acc[field] = issue.message
				}
				return acc
			}, {})

			const response = makeResponse('error', 'Validation error', {
				errors,
			})

			//→ RETURN RESPONSE

			return c.json(response, 400)
		}

		//→ CHECK IF USER EXISTS

		const user = await getUserByEmail(output.email)

		if (!user) {
			const response = makeResponse('error', 'Invalid credentials', {})

			return c.json(response, 401)
		}

		//→ CHECK IF PASSWORD IS CORRECT

		const isPasswordCorrect = await verifyPassword(
			output.password,
			user.password
		)

		//→ IF PASSWORD IS NOT CORRECT RETUNR UNAUTHORIZED

		if (!isPasswordCorrect) {
			const response = makeResponse('error', 'Invalid credentials', {})

			return c.json(response, 401)
		}

		//→ GENERATE JWT TOKEN

		const token = await createJwt({
			userId: user.id,
			username: user.username,
			email: user.email,
		})

		//→ RETURN RESPONSE

		const response = makeResponse('success', 'Login successful', {
			data: {
				token,
			},
		})

		return c.json(response, 200)
	} catch (e) {
		console.log('[USER LOGIN] ERROR', e)

		const response = makeResponse('error', 'Something went wrong', {})

		return c.json(response, 500)
	}
})
