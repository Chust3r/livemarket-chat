import { defineConfig } from 'drizzle-kit'
import { DB_FILE_NAME } from '~lib/consts'

export default defineConfig({
	dialect: 'sqlite',
	schema: './drizzle/schema.ts',
	out: './drizzle',
	dbCredentials: {
		url: DB_FILE_NAME,
	},
})
