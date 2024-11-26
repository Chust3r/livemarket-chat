import type { Server, Socket } from 'socket.io'
import { createOrGetPrivateChat } from '~actions/chat'
import { validateUsersIds } from '~actions/user'

export const chatWs = (io: Server) => {
	//→ ON CONNECT

	io.use((socket, next) => {
		//→ ADD VALIDATION & GET CLIENT ID / VENDOR ID

		//→ JWT CONTAINS USER INFO, IF NOT RETURN ERROR

		next()
	})

	//→ CONNECT A NEW USER TO THE CHAT

	io.on('connect', (socket: Socket) => {
		socket.on('chat', async (data) => {
			const userId1 = '1f5569fb-a606-4137-b989-26b34b6c662e'
			const userId2 = '538a28fe-7750-4814-937d-521519f2232c'

			const chat = await createOrGetPrivateChat(userId1, userId2)

			console.log(chat)
		})
	})
}
