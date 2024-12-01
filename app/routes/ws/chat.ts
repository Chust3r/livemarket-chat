import type { Server, Socket } from 'socket.io'
import { authSocket } from '~middlewares/auth'
import {
	chatPrivate,
	connect,
	disconnect,
	messageSend,
	messageEdit,
	messageDelivered,
	messageRead,
	messageDelete,
	messageHistory,
} from '~events'

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

		//→ MESSAGE SEND

		socket.on('message:send', async (data) =>
			messageSend({
				...params,
				data,
			})
		)

		//→ MESSAGE EDIT

		socket.on('message:edit', async (data) => {
			messageEdit({
				...params,
				data,
			})
		})

		//→ MESSAGE DELIVERED

		socket.on('message:delivered', async (data) => {
			messageDelivered({
				...params,
				data,
			})
		})

		//→ MESSAGE READ

		socket.on('message:read', async (data) => {
			messageRead({
				...params,
				data,
			})
		})

		//→ MESSAGE DELETE

		socket.on('message:delete', async (data) => {
			messageDelete({
				...params,
				data,
			})
		})

		//→ MESSAGE HISTORY

		socket.on('message:history', async (data) => {
			messageHistory({
				...params,
				data,
			})
		})
	})
}
