import type { Socket, ExtendedError } from 'socket.io'
import { verifyJwt } from '~lib/jwt'

type Next = (err?: ExtendedError) => void

export const authSocket = async (socket: Socket, next: Next) => {
	try {
		const token = socket.handshake.auth.token

		if (!token) return next(new Error('Authentication error'))

		//→ CHECK IF TOKEN IS VALID

		const payload = await verifyJwt(token)

		if (!payload) return next(new Error('Authentication error'))

		//→ GET USER ID FROM PAYLOAD

		const userId = payload.userId as string

		//→ SET USER ID TO SOCKET

		socket.data.userId = userId

		next()
	} catch (err) {
		console.error('[AUTH MIDDLEWARE] ERROR', err)
		next(new Error('Something went wrong'))
	}
}
