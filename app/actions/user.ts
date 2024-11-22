import { db } from '~db'
import { users } from '~tables'

interface User {
	username: string
	email: string
	password: string
}

export const getUserByEmail = async (email: string) => {
	const user = await db.query.users.findFirst({
		where: (users, { eq }) => eq(users.email, email),
	})

	return user
}

export const createUser = async (user: User) => {
	const createdUser = await db.insert(users).values(user).returning({
		id: users.id,
		email: users.email,
		username: users.username,
		createdAt: users.createdAt,
	})

	return createdUser
}

export const getUserInfo = async (id: string) => {
	const user = await db.query.users.findFirst({
		where: (users, { eq }) => eq(users.id, id),
		columns: {
			id: true,
			email: true,
			username: true,
			avatarUrl: true,
			status: true,
			createdAt: true,
		},
	})

	return user
}
