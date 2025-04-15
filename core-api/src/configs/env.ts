// config environments
export const env = {
  PORT: process.env.PORT || 3000,
  OLLAMA_URL: process.env.OLLAMA_URL || 'http://localhost:11434',
  EMBEDDING_MODEL_NAME: process.env.EMBEDDING_MODEL_NAME || 'bge-m3:latest',
  LLM_NAME: process.env.LLM_NAME || 'llama3.2:latest',
  DISABLED_LOGGING: process.env.DISABLED_LOGGING === 'true' || false,
  SUPABASE_URL: process.env.SUPABASE_URL || '',
  SUPABASE_KEY: process.env.SUPABASE_KEY || '',
  DEFAULT_BUCKET_NAME: process.env.DEFAULT_BUCKET_NAME || 'rag-sys',
}
