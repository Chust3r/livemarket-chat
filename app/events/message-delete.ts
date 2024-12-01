import type { SocketIOEvent } from '~types'

export const messageDelete = async ({ io, socket, data }: SocketIOEvent) => {
	console.log(data)
}
