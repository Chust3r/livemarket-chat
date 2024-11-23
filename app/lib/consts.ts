import 'dotenv/config'

export const PORT = Number(process.env.PORT) || 5000

export const DB_FILE_NAME = process.env.DB_FILE_NAME || 'file:local.db'

export const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret'

export const JWT_EXPIRATION_TIME = process.env.JWT_EXPIRATION_TIME || '24h'

export const POCKETBASE_URL =
	process.env.POCKETBASE_URL || 'http://localhost:8090'
