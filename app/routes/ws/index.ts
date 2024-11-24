import type { ServerType } from '@hono/node-server'
import { Server } from 'socket.io'
import { chatWs } from './chat'

export const socketIO = (server: ServerType) => {
    
	const io = new Server(server, {
		cors: {
			origin: '*',
			methods: ['GET', 'POST'],
		},
		path: '/ws/chat',
		addTrailingSlash: false,
	})

	//→ LOAD WS ROUTES

	chatWs(io)
}
