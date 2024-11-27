class ClientsManager {
	private clients = new Map<string, string>()

	has(userId: string) {
		return this.clients.has(userId)
	}

	set(userId: string, clientId: string) {
		this.clients.set(userId, clientId)
	}

	get(userId: string) {
		return this.clients.get(userId)
	}

	remove(userId: string) {
		this.clients.delete(userId)
	}
}

export const clients = new ClientsManager()
