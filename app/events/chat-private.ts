import { createOrGetPrivateChat } from '~actions/chat'
import { clients } from '~lib/clients-manager'
import type { SocketIOEvent } from '~lib/types'

export const chatPrivate = async ({ io, socket, data }: SocketIOEvent) => {
	//→ GET USER ID FROM SOCKET (ONLY IF WAS AUTHENTICATED)

	const userId = socket.data.userId as string

	//→ GET OTHER USER ID FROM DATA

	const { to } = JSON.parse(data) as { to: string }

	//→ GET OR CREATE PRIVATE CHAT

	const chat = await createOrGetPrivateChat(userId, to)

	//→ IF CHAT NOT EXISTS RETURN

	if (!chat) return

	//→ JOIN PRIVATE CHAT

	socket.join(chat)

	//→ SEND CHAT ID TO CLIENT

	socket.emit('chat:private', {
		id: chat,
	})

	//→ TRY JOIN OTHER USER CHAT IF IS CONNECTED

	const secondClientSocketId = clients.get(to)

	if (!secondClientSocketId) return

	//→ GET SOCKET OF OTHER USER

	const secondSocket = io.sockets.sockets.get(secondClientSocketId)

	//→ JOIN PRIVATE CHAT

	secondSocket?.join(chat)
}
