import type { Server,Socket } from 'socket.io'

export const chatWs = (io: Server) => {
	//→ ON CONNECT

	io.on('connect', (socket:Socket) => {
		console.log('A user connected')

		
	})
}
