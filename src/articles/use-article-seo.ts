import { usePageSeo } from '../hooks/usePageSeo'

export function useHomeSeo({ title, description }: { title: string; description: string }) {
  usePageSeo({
    title,
    description,
    path: '/',
  })
}
