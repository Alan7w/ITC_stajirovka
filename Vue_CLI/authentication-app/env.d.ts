/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_PROXY_URL: string
  readonly VITE_FILE_URL: string
  readonly VITE_AUTH_REDIRECT_URI: string
  readonly VITE_SSO_REDIRECT_URI: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
