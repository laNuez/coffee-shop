/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_IMAGE_PREFIX_URL: string
  readonly VITE_APP_NAME: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
