import { eq } from 'drizzle-orm'
import { db } from '~db'
import { messages } from '~tables'
import type { Message } from '~types'

type IMessage = Omit<
	Message,
	'id' | 'createdAt' | 'updatedAt' | 'isDeleted' | 'isEdited' | 'isReaded'
>

export const saveMessage = async (message: IMessage) => {
	const messageSaved = await db.insert(messages).values(message).returning()

	return messageSaved[0]
}

export const getMessageByIdAndChatId = async (
	messageId: string,
	chatId: string
) => {
	const message = await db.query.messages.findFirst({
		where: (message, { eq, and }) =>
			and(eq(message.id, messageId), eq(message.chatId, chatId)),
	})

	return message
}

export const deleteMessage = async (id: string) => {
	const isDeleted = await db
		.update(messages)
		.set({ isDeleted: true })
		.where(eq(messages.id, id))
		.returning()

	return Boolean(isDeleted)
}
