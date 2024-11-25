import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'
import { randomUUID } from 'node:crypto'

// → CHATS

export const chats = sqliteTable('chats', {
	id: text()
		.primaryKey()
		.$default(() => randomUUID()),
	type: text({
		enum: ['private', 'group'],
	}).notNull(),
	name: text().notNull(),
	createdAt: text().default(sql`(CURRENT_TIMESTAMP)`),
	updatedAt: text()
		.default(sql`(CURRENT_TIMESTAMP)`)
		.$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
})

// → USERS

export const users = sqliteTable('users', {
	id: text()
		.primaryKey()
		.$default(() => randomUUID()),
	username: text({ length: 30 }).notNull(),
	email: text().notNull(),
	password: text().notNull(),
	avatarUrl: text(),
	status: text({
		enum: ['online', 'offline'],
	})
		.default('online')
		.notNull(),
	createdAt: text().default(sql`(CURRENT_TIMESTAMP)`),
	updatedAt: text()
		.default(sql`(CURRENT_TIMESTAMP)`)
		.$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
})

// → MESSAGES

export const messages = sqliteTable('messages', {
	id: text()
		.primaryKey()
		.$default(() => randomUUID()),
	chatId: text()
		.notNull()
		.references(() => chats.id),
	senderId: integer({ mode: 'number' })
		.notNull()
		.references(() => users.id),
	content: text().notNull(),
	type: text({
		enum: ['text', 'image', 'file'],
	})
		.notNull()
		.default('text'),
	isDeleted: integer({ mode: 'boolean' }).notNull().default(false),
	isEdited: integer({ mode: 'boolean' }).notNull().default(false),
	createdAt: text().default(sql`(CURRENT_TIMESTAMP)`),
	updatedAt: text()
		.default(sql`(CURRENT_TIMESTAMP)`)
		.$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
})

// → PRODUCTS

export const products = sqliteTable('products', {
	id: text()
		.primaryKey()
		.$default(() => randomUUID()),
	name: text().notNull(),
	description: text().notNull(),
	price: integer({ mode: 'number' }).notNull(),
	url: text().notNull(),
	images: text({ mode: 'json' })
		.notNull()
		.$type<string[]>()
		.default(sql`(json_array())`),
	createdAt: text().default(sql`(CURRENT_TIMESTAMP)`),
	updatedAt: text()
		.default(sql`(CURRENT_TIMESTAMP)`)
		.$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
})

// → CHAT PARTICIPANTS

export const chatParticipants = sqliteTable('chat_participants', {
	chatId: text()
		.notNull()
		.references(() => chats.id),
	userId: text()
		.notNull()
		.references(() => users.id),
})

// → RELATIONS

export const schema = {
	users,
	messages,
	products,
	chats,
	chatParticipants,
}
