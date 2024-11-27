import type { Server, Socket } from 'socket.io'
import { authSocket } from '~middlewares/auth'
import { chatPrivate, connect, disconnect } from '~events'

export const chatWs = (io: Server) => {
	//→ USE AUTH MIDDLEWARE

	io.use(authSocket)

	//→ SOCKET EVENTS

	io.on('connect', async (socket: Socket) => {
		//→ ON CONNECTION

		const params = { io, socket, data: {} }

		await connect(params)

		//→ ON DISCONNECTION

		socket.on('disconnect', () => disconnect(params))

		//→ PRIVATE CHAT

		socket.on('chat:private', async (data) =>
			chatPrivate({
				...params,
				data,
			})
		)
	})
}
