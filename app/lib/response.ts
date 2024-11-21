interface IResponse<T> {
	status: 'success' | 'error'
	message: string
	data?: T
	errors?: Record<string, string>
}

export const makeResponse = <T>(
	status: 'success' | 'error',
	message: string,
	payload: {
		data?: T
		errors?: Record<string, string>
	}
): IResponse<T> => {
	return {
		status,
		message,
		...payload,
	}
}
