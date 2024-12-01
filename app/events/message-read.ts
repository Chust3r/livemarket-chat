import type { SocketIOEvent } from '~types'

export const messageRead = async ({ io, socket, data }: SocketIOEvent) => {
	console.log(data)
}
