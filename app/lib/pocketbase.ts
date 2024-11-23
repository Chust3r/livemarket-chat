import PocketBase from 'pocketbase'
import { POCKETBASE_URL } from '~consts'

export const pb = new PocketBase(POCKETBASE_URL)
