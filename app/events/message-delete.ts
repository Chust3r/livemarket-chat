import type { SocketIOEvent } from '~types'
import { validate, messageDeleteSchema } from '~lib/validation'
import { deleteMessage, getMessageByIdAndChatId } from '~actions/message'

export const messageDelete = async ({ io, socket, data }: SocketIOEvent) => {
	//→ VALIDATE MESSAGE

	const { success, output, issues } = validate(
		messageDeleteSchema,
		JSON.parse(data)
	)

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

	const { messageId, chatId } = output

	const message = await getMessageByIdAndChatId(messageId, chatId)

	//→ IF MESSAGE DON'T EXISTS SEND MESSAGE:ERROR WITH ERRORS

	if (!message) {
		return socket.emit('message:error', {
			errors: {
				messageId: 'Message not found',
			},
		})
	}

	//→ IF MESSAGE IS READED DONT ALLOW TO DELETE

	if (message.isReaded || message.isDeleted) {
		socket.emit('message:error', {
			errors: {
				message: 'Unnable to delete a message that has been read',
			},
		})
		return
	}

	//→ DELETE MESSAGE

	const isDeleted = await deleteMessage(messageId)

	//→ IF IS NOT DELETED SEND MESSAGE:ERROR WITH ERRORS

	if (!isDeleted) {
		socket.emit('message:error', {
			errors: {
				messageId: 'Message not deleted',
			},
		})
	}
}
