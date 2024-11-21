import { hash, argon2id, verify } from 'argon2'

export const hashPassword = (password: string) => {
	const hashedPassword = hash(password, {
		type: argon2id,
		memoryCost: 2 ** 17,
		hashLength: 32,
		timeCost: 5,
	})
	return hashedPassword
}

export const verifyPassword = async (
	password: string,
	hashedPassword: string
) => {
	const isValid = await verify(hashedPassword, password)
	return isValid
}
