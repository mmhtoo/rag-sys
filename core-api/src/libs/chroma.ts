import {ChromaClient} from 'chromadb'
import {env} from '../configs'

export const chromaClient = new ChromaClient({
  path: env.CHROMA_URL,
})
