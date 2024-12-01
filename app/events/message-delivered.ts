import type { SocketIOEvent } from '~types'

export const messageDelivered = async ({ io, socket, data }: SocketIOEvent) => {
	console.log(data)
}
