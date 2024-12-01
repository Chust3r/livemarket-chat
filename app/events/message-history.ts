import type { SocketIOEvent } from '~types'

export const messageHistory = async ({ io, socket, data }: SocketIOEvent) => {
	console.log(data)
}
