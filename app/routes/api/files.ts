import { Hono } from 'hono'
import { storage } from '~lib/storage'
import { makeResponse } from '~lib/response'

export const filesRouter = new Hono().basePath('/files')

//→ UPLOAD FILE

filesRouter.post('/', async (c) => {
	try {
		//→ PARSE BODY TO FORMDATA

		const formData = await c.req.formData()

		//→ GET FILE

		const file = formData.get('file') as File

		//→ SAVE FILE

		const url = await storage.upload(file)

		//→ CHECK IF URL IS DIFERENT TO NULL

		if (!url) {
			const response = makeResponse('error', 'Error Upload', {})

			return c.json(response, 400)
		}

		const response = makeResponse('success', 'Success', {
			data: {
				url,
			},
		})

		//→ RETURN RESPONSE

		return c.json(response, 201)
	} catch (e) {
		console.log('[FILE UPLOAD] ERROR', e)

		const response = makeResponse('error', 'Something went wrong', {})

		return c.json(response, 500)
	}
})
