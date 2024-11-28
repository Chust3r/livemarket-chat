import { getUserChats } from '~actions/chat'
import { clients } from '~lib/clients-manager'
import type { SocketIOEvent } from '~lib/types'

export const connect = async ({ io, socket, data }: SocketIOEvent) => {
	//→ GET USER ID FROM SOCKET (ONLY IF WAS AUTHENTICATED)

	const userId = socket.data.userId as string

	//→ SET USER ID TO CLIENTS MANAGER

	clients.set(userId, socket.id)

	//→ GET ALL CHATS WHERE THE USER IS PARTICIPANT

	const chats = await getUserChats(userId)

	//→ ADD CHAT ID'S TO CLIENT & SUSCRIBE

	socket.data.chats = socket.data.chats || new Set()

	for (const chat of chats) {
		socket.data.chats.add(chat.chatId)
		socket.join(chat.chatId)
	}
}
