import { clients } from '~lib/clients-manager'
import type { SocketIOEvent } from '~lib/types'

export const connect = async ({ io, socket, data }: SocketIOEvent) => {
    
	//→ GET USER ID FROM SOCKET (ONLY IF WAS AUTHENTICATED)

	const userId = socket.data.userId as string

	//→ SET USER ID TO CLIENTS MANAGER

	clients.set(userId, socket.id)

	//→ TODO: GET ALL CHATS WHERE THE USER IS PARTICIPANT

	console.log('USER CONNECTED', userId)
}
