export const getUpdatedProperties = <T extends Record<string, any>>(
	original: T,
	updated: Partial<T>
): { isDifferences: boolean; data: Partial<T> } => {
	const differences: Partial<T> = {}
	let isDifferences = false

	for (const key in original) {
		if (key in updated && original[key] !== updated[key]) {
			differences[key] = updated[key]
			isDifferences = true
		}
	}

	return {
		isDifferences,
		data: differences,
	}
}
