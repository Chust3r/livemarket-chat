import { clients } from '~lib/clients-manager'
import type { SocketIOEvent } from '~lib/types'

export const disconnect = async ({ io, socket, data }: SocketIOEvent) => {
	//→ GET USER ID FROM SOCKET (ONLY IF WAS AUTHENTICATED)

	const userId = socket.data.userId as string

	//→ DELETE USER ID FROM CLIENTS MANAGER

	clients.remove(userId)

	console.log('USER DISCONNECTED', userId)
}
