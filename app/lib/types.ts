import type { InferSelectModel } from 'drizzle-orm'
import type { schema } from '~tables'

export type Chat = InferSelectModel<typeof schema.chats>
export type User = InferSelectModel<typeof schema.users>
export type Message = InferSelectModel<typeof schema.messages>
export type Product = InferSelectModel<typeof schema.products>