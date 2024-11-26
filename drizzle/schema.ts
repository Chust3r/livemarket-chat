import { sqliteTable } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'
import { randomUUID } from 'node:crypto'

// → CHATS

export const chats = sqliteTable('chats', (t) => ({
	id: t
		.text()
		.primaryKey()
		.$default(() => randomUUID()),
	type: t
		.text({
			enum: ['private', 'group'],
		})
		.notNull(),
	name: t.text().notNull(),
	createdAt: t.text().default(sql`(CURRENT_TIMESTAMP)`),
	updatedAt: t
		.text()
		.default(sql`(CURRENT_TIMESTAMP)`)
		.$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
}))

// → USERS

export const users = sqliteTable('users', (t) => ({
	id: t
		.text()
		.primaryKey()
		.$default(() => randomUUID()),
	username: t.text({ length: 30 }).notNull(),
	email: t.text().notNull(),
	password: t.text().notNull(),
	avatarUrl: t.text(),
	status: t
		.text({
			enum: ['online', 'offline'],
		})
		.default('online')
		.notNull(),
	createdAt: t.text().default(sql`(CURRENT_TIMESTAMP)`),
	updatedAt: t
		.text()
		.default(sql`(CURRENT_TIMESTAMP)`)
		.$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
}))

// → MESSAGES

export const messages = sqliteTable('messages', (t) => ({
	id: t
		.text()
		.primaryKey()
		.$default(() => randomUUID()),
	chatId: t
		.text()
		.notNull()
		.references(() => chats.id), //→ RELATION WITH CHATS
	senderId: t
		.integer({ mode: 'number' })
		.notNull()
		.references(() => users.id), //→ RELATION WITH USERS
	content: t.text().notNull(),
	type: t
		.text({
			enum: ['text', 'image', 'file'],
		})
		.notNull()
		.default('text'),
	isDeleted: t.integer({ mode: 'boolean' }).notNull().default(false),
	isEdited: t.integer({ mode: 'boolean' }).notNull().default(false),
	createdAt: t.text().default(sql`(CURRENT_TIMESTAMP)`),
	updatedAt: t
		.text()
		.default(sql`(CURRENT_TIMESTAMP)`)
		.$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
}))

// → PRODUCTS

export const products = sqliteTable('products', (t) => ({
	id: t
		.text()
		.primaryKey()
		.$default(() => randomUUID()),
	name: t.text().notNull(),
	description: t.text().notNull(),
	price: t.integer({ mode: 'number' }).notNull(),
	url: t.text().notNull(),
	images: t
		.text({ mode: 'json' })
		.notNull()
		.$type<string[]>()
		.default(sql`(json_array())`),
	createdAt: t.text().default(sql`(CURRENT_TIMESTAMP)`),
	updatedAt: t
		.text()
		.default(sql`(CURRENT_TIMESTAMP)`)
		.$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
}))

// → CHAT PARTICIPANTS

export const chatParticipants = sqliteTable('chat_participants', (t) => ({
	chatId: t
		.text()
		.notNull()
		.references(() => chats.id, { onDelete: 'cascade' }), //→ RELATION WITH CHATS
	userId: t
		.text()
		.notNull()
		.references(() => users.id), //→ RELATION WITH USERS
}))

// → RELATIONS

export const schema = {
	users,
	messages,
	products,
	chats,
	chatParticipants,
}
