import { Hono } from 'hono'
import { validate, registerSchema } from '~lib/validation'
import { makeResponse } from '~lib/response'
import { hashPassword } from '~lib/password'
import { createUser, getUserByEmail } from '~actions/user'

export const register = new Hono().basePath('/register')

//→ ENDPOINT TO REGISTER A NEW USER

register.post('/', async (c) => {
	try {
		//→ PARSE BODY TO JSON

		const body = await c.req.json()

		//→ VALIDATE BODY

		const { success, output, issues } = validate(registerSchema, body)

		if (!success) {
			//→ CREATE OBJECT WITH ERRORS

			const errors = issues.reduce((acc, issue) => {
				// @ts-ignore
				acc[issue.path[0]] = issue.message
				return acc
			}, {})

			//→ CREATE RESPONSE

			const response = makeResponse('error', 'Validation error', {
				errors,
			})

			//→ RETURN RESPONSE

			return c.json(response, 400)
		}

		//→ CHECK IF USER ALREADY EXISTS VIA EMAIL

		const user = await getUserByEmail(body.email)

		if (!!user) {
			const response = makeResponse('error', 'User already exists', {})

			return c.json(response, 409)
		}

		//→ HASH PASSWORD

		const hashedPassword = await hashPassword(output.password)

		//→ SAVE A NEW USER

		const newUser = await createUser({
			...output,
			password: hashedPassword,
		})

		//→ CREATE RESPONSE

		const response = makeResponse('success', 'User created', {
			data: newUser,
		})

		//→ RETURN RESPONSE

		return c.json(response, 201)
	} catch (e) {
		console.log('[USER REGISTER] ERROR', e)

		const response = makeResponse('error', 'Something went wrong', {})

		return c.json(response, 500)
	}
})
