import { pb } from '~lib/pocketbase'
import { POCKETBASE_URL } from '~consts'

interface Storage {
	upload: (file: File) => Promise<string | null>
	delete: (id: string) => Promise<boolean>
}

class PocketBaseStorage implements Storage {
	async upload(file: File) {
		try {
			const res = await pb.collection('storage').create({ file })

			if (res.code === '400') {
				return null
			}

			const id = res.id
			const filename = res.file
			const collectionId = res.collectionId

			const url = `${POCKETBASE_URL}/api/files/${collectionId}/${id}/${filename}`

			return url
		} catch (e) {
			return null
		}
	}

	async delete(id: string) {
		try {
			const res = await pb.collection('storage').delete(id)

			return !res
		} catch (e) {
			return false
		}
	}
}

export const storage = new PocketBaseStorage()
