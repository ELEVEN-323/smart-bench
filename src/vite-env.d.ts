/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USE_MOCK: string
  readonly VITE_LLM_PROVIDER: string
  readonly VITE_LLM_API_KEY: string
  readonly VITE_LLM_BASE_URL: string
  readonly VITE_AMAP_KEY: string
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
