import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import './index.css'
import { ClassEditorPage } from './pages/ClassEditorPage'
import { ClassesPage } from './pages/ClassesPage'
import { FiguresPage } from './pages/FiguresPage'
import { KnowledgePage } from './pages/KnowledgePage'
import { LibraryPage } from './pages/LibraryPage'
import { PrintPage } from './pages/PrintPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <ClassesPage /> },
      { path: 'biblioteca', element: <LibraryPage /> },
      { path: 'saber', element: <KnowledgePage /> },
      { path: 'figuras', element: <FiguresPage /> },
      { path: 'aula/:id', element: <ClassEditorPage /> },
    ],
  },
  { path: '/aula/:id/imprimir', element: <PrintPage /> },
], {
  // Em GitHub Pages a app vive em /yoga-planner/; em desenvolvimento em /.
  basename: import.meta.env.BASE_URL.replace(/\/$/, '') || '/',
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
