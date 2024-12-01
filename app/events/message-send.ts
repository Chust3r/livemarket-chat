import { saveMessage } from '~actions/message'
import type { SocketIOEvent } from '~lib/types'
import { validate, messageSchema } from '~lib/validation'

export const messageSend = async ({ io, socket, data }: SocketIOEvent) => {
	//→ GET USER ID FROM SOCKET (ONLY IF WAS AUTHENTICATED)

	const userId = socket.data.userId as string

	//→ VALIDATE MESSAGE

	const { success, output, issues } = validate(messageSchema, JSON.parse(data))

	//→ IF MESSAGE IS NOT VALID SEND MESSAGE:ERROR WITH ERRORS

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

		//→ SEND ERROR

		return socket.emit('message:error', { errors })
	}

	const { chatId, content, type } = output

	//→ CHECK IF CHAT EXISTS IN SOCKET DATA

	socket.data.chats = socket.data.chats || new Set()

	if (!socket.data.chats.has(chatId)) {
		return socket.emit('message:error', {
			errors: { chatId: 'Chat not found' },
		})
	}

	const message = await saveMessage({
		chatId,
		content,
		type,
		senderId: userId,
	})

	//→ IF MESSAGE SAVED SEND MESSAGE:RECEIVE & MESSAGE:SENT

	if (message) {
		socket.broadcast.to(chatId).emit('message:receive', message)
		socket.emit('message:sent', message)
	}
}
