import { db } from '~db'
import { messages } from '~tables'
import type { Message } from '~types'

type IMessage = Omit<
	Message,
	'id' | 'createdAt' | 'updatedAt' | 'isDeleted' | 'isEdited'
>

export const saveMessage = async (message: IMessage) => {
	const messageSaved = await db
		.insert(messages)
		.values(message)
		.returning()

    return messageSaved
}
