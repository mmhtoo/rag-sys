// config environments
export const env = {
  PORT: process.env.PORT || 3000,
  OLLAMA_URL: process.env.OLLAMA_URL || 'http://localhost:11434',
  EMBEDDING_MODEL_NAME: process.env.EMBEDDING_MODEL_NAME || 'bge-m3:latest',
  LLM_NAME: process.env.LLM_NAME || 'llama3.2:latest',
  DISABLED_LOGGING: process.env.DISABLED_LOGGING === 'true' || false,
  SUPABASE_URL: process.env.SUPABASE_URL || '',
  SUPABASE_KEY: process.env.SUPABASE_KEY || '',
  DEFAULT_BUCKET_NAME: process.env.DEFAULT_BUCKET_NAME || 'rag-bucket',
  ALLOWED_FILE_TYPES: process.env.ALLOWED_FILE_TYPES || '',
  MAX_FILE_SIZE: Number(process.env.MAX_FILE_SIZE) || 3145728,
  CHROMA_URL: process.env.CHROMA_URL || 'http://localhost:8000',
  DEFAULT_VECTOR_COLLECTION_NAME:
    process.env.DEFAULT_VECTOR_COLLECTION_NAME || 'rag_collection',
  DEFAULT_QUEUE_NAME: process.env.DEFAULT_QUEUE_NAME || 'embed-queue',
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: Number(process.env.REDIS_PORT) || 6379,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || 'password',
  ALLOWED_EXTENSIONS_FOR_SYNC: process.env.ALLOWED_EXTENSIONS_FOR_SYNC || '',
}
