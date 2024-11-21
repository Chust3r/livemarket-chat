import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import { DB_FILE_NAME } from '~consts'
import { schema } from '../../drizzle/schema'

const client = createClient({ url: DB_FILE_NAME })

export const db = drizzle({
	client,
	schema,
})
