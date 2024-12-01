import type { SocketIOEvent } from '~lib/types'

export const messageEdit = async ({ io, socket, data }: SocketIOEvent) => {
	console.log(data)
}
