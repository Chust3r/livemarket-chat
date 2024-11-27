import type { Server, Socket } from 'socket.io'
import { createOrGetPrivateChat } from '~actions/chat'
import { verifyJwt } from '~lib/jwt'

//→ CLIENTS MAP (ONLY USERS CONNECTED)

const clients = new Map<string, string>()

export const chatWs = (io: Server) => {
	//→ ON CONNECT

	io.use(async (socket, next) => {
		//→ GET JWT TOKEN

		const token = socket.handshake.auth.token

		if (!token) return next(new Error('Authentication error'))

		//→ CHECK IF TOKEN IS VALID

		const payload = await verifyJwt(token)

		if (!payload) return next(new Error('Authentication error'))

		//→ GET USER ID FROM PAYLOAD

		const userId = payload.userId as string

		//→ SET USER ID TO SOCKET

		socket.data.userId = userId

		next()
	})

	//→ CONNECT A NEW USER TO THE CHAT

	io.on('connect', (socket: Socket) => {
		console.log('USER CONNECTED')

		//→ GET USER ID FROM SOCKET DATA

		const userId = socket.data.userId as string

		//→ TODO:GET ALL CHATS OF THE USER & LISTEN EVENTS

		//→ ADD USER TO CLIENTS MAP

		clients.set(userId, socket.id)

		//→ LISTEN EVENTS

		//→ GET PRIVATE CHAT BETWEEN USERS

		socket.on('chat:private', async (data) => {
			//→ PARSE DATA & GET DATA

			const { to } = JSON.parse(data) as { to: string }

			//→ GET OR CREATE PRIVATE CHAT

			const chat = await createOrGetPrivateChat(userId, to)

			//→ IF CHAT IS NULL RETURN

			if (!chat) return

			//→ JOIN CURRENT USER TO CHAT

			socket.join(chat)

			//→ SEND CHAT ID TO CLIENT

			socket.emit('chat:private', {
				id: chat,
			})

			//→ JOIN SECOND USER TO CHAT IF IS CONNECTED

			const secondClientSocketId = clients.get(to)

			//→ IF SECOND CLIENT IS CONNECTED

			if (secondClientSocketId) {
				//→ JOIN SECOND USER TO CHAT

				const secondSocket = io.sockets.sockets.get(secondClientSocketId)

				secondSocket?.join(chat)
			}

			
		})

		//→ SEND MESSAGE TO CHAT

		socket.on('message:send', (data) => {
			console.log('CLIENT SEND MESSAGE')
		})

		//→ RECEIVE MESSAGE FROM CHAT

		socket.on('message:receive', (data) => {
			console.log('CLIENT RECEIVE MESSAGE')
		})

		//→ MESSAGE DELIVERED

		socket.on('message:delivered', (data) => {
			console.log('CLIENT MESSAGE DELIVERED')
		})

		//→ MESSAGE READ

		socket.on('message:read', (data) => {
			console.log('CLIENT MESSAGE READ')
		})

		//→ ON RECONNECT

		socket.on('reconnect', () => {
			console.log('USER RECONNECTED')
		})

		//→ ON DISCONNECT

		socket.on('disconnect', () => {
			//→ REMOVE USER FROM CLIENTS MAP

			clients.delete(userId)

			console.log('USER DISCONNECTED')
		})
	})
}
