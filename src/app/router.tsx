import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '@/layouts/Layout'
import { Home } from '@/pages/Home'
import { NotFound } from '@/pages/NotFound'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { ToolSkeleton } from '@/components/ui/tool-skeleton'
import { tools } from '@/features/tool-registry/registry'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      ...tools.map(({ path, load }) => {
        const Tool = lazy(load)
        return {
          path: path.slice(1),
          element: (
            <ErrorBoundary key={path}>
              <Suspense fallback={<ToolSkeleton />}>
                <Tool />
              </Suspense>
            </ErrorBoundary>
          ),
        }
      }),
      { path: '*', element: <NotFound /> },
    ],
  },
])
