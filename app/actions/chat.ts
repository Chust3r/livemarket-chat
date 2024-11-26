import { db } from '~db'
import { chats, chatParticipants } from '~tables'
import { validateUsersIds } from '~actions/user'
import { sql } from 'drizzle-orm'

export const createOrGetPrivateChat = async (
	userId1: string,
	userId2: string
) => {
	//→ CHECK IF USERS ID'S ARE VALID

	const areValid = await validateUsersIds(userId1, userId2)

	//→ IF SOME ID'S ARE INVALID RETURN NULL

	if (!areValid) return null

	//→ CHECK IF CHAT EXISTS OR CREATE

	const query = sql`
        SELECT
            CH.id chatId
        FROM
        chats CH
        INNER JOIN chat_participants CH_P
        ON CH.id = CH_P.chatId
        WHERE 
            CH.type = 'private' AND
            CH_P.userId IN (${userId1}, ${userId2})
        GROUP BY
            CH.id
        HAVING 
            COUNT(CH_P.userId) = ${2}
        LIMIT 1
    `

	const { rows } = await db.run(query)

	const chatId = rows[0]?.chatId

	if (chatId) return chatId

	//→ CREATE CHAT

	const chatName = `chat:${userId1}:${userId2}`

	const chat = await db
		.insert(chats)
		.values({ type: 'private', name: chatName })
		.returning({ id: chats.id })

	//→ CHECK IF CHAT WAS CREATED

	if (!chat) return null

	//→ ADD USERS TO CHAT

	const newChatId = chat[0].id

	const participants = await db
		.insert(chatParticipants)
		.values([
			{
				chatId: newChatId,
				userId: userId1,
			},
			{
				chatId: newChatId,
				userId: userId2,
			},
		])
		.returning({ id: chatParticipants.userId })

	//→ CHECK IF PARTICIPANTS WERE ADDED

	if (!participants.length) return null

	return newChatId
}
