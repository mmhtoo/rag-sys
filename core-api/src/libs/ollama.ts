import {Ollama, OllamaEmbeddings} from '@langchain/ollama'
import {env} from '../configs'
import {OllamaEmbeddingFunction} from 'chromadb'

export const bgeEmbedding = new OllamaEmbeddings({
  baseUrl: env.OLLAMA_URL,
  model: env.EMBEDDING_MODEL_NAME,
})

export const ollamaLLM = new Ollama({
  baseUrl: env.OLLAMA_URL,
  model: env.LLM_NAME,
})

export const ollamaEmbeddingFunction = new OllamaEmbeddingFunction({
  url: env.OLLAMA_URL,
  model: env.EMBEDDING_MODEL_NAME,
})
