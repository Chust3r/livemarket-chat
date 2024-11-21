import { SignJWT, jwtVerify, type JWTPayload } from 'jose'
import { JWT_SECRET, JWT_EXPIRATION_TIME } from '~consts'

const encode = new TextEncoder()

const SECRET = encode.encode(JWT_SECRET)

export const createJwt = async (payload: JWTPayload) => {
	const jwt = await new SignJWT(payload)
		.setProtectedHeader({
			alg: 'HS256',
		})
		.setIssuedAt()
		.setExpirationTime(JWT_EXPIRATION_TIME)
		.sign(SECRET)

	return jwt
}

export const verifyJwt = async (jwt: string) => {
	try {
		const { payload } = await jwtVerify(jwt, SECRET)
		return payload
	} catch (e) {
		return null
	}
}
