import { next } from '@vercel/functions/middleware'

const FINGERPRINT_HEADERS = ['server', 'x-vercel-id', 'x-vercel-cache'] as const

export default function middleware() {
  const response = next()
  for (const header of FINGERPRINT_HEADERS) {
    response.headers.delete(header)
  }
  return response
}
