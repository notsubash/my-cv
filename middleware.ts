import { next } from '@vercel/functions/middleware'

/** Obscure platform fingerprint headers where the edge allows overrides. */
export default function middleware() {
  return next({
    headers: {
      Server: 'webserver',
    },
  })
}
