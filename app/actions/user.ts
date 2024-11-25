import { eq } from 'drizzle-orm'
import { db } from '~db'
import { users } from '~tables'
import type { User } from '~types'

interface IUser {
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

export const createUser = async (user: IUser) => {
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

export const updateUserInfo = async (id: string, data: Partial<User>) => {
	const userUpdated = await db
		.update(users)
		.set(data)
		.where(eq(users.id, id))
		.returning({
			id: users.id,
			email: users.email,
			username: users.username,
			status: users.status,
			avatarUrl: users.avatarUrl,
			createdAt: users.createdAt,
			updatedAt: users.updatedAt,
		})

	return userUpdated
}

export const validateUsersIds = async (...ids: string[]) => {
	const users = await db.query.users.findMany({
		where: (users, { inArray }) => inArray(users.id, ids),
		columns: {
			id: true,
		},
	})

	if (users.length !== ids.length) return false

	return true
}
