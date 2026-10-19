import { Settings } from 'lucide-react'
import { useEffect } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { PoseFigure } from './components/PoseFigure'
import { getPose } from './data/poses'
import { useClassStore } from './store/useClassStore'

export default function App() {
  const inicializar = useClassStore((s) => s.inicializar)
  useEffect(() => {
    inicializar()
  }, [inicializar])

  const logo = getPose('sukhasana')

  return (
    <div className="app">
      <nav className="topnav">
        <Link to="/" className="brand">
          <span className="brand-logo">{logo && <PoseFigure figura={logo.figura} chao={false} cor="#fff" />}</span>
          <span className="brand-text">Yoga Planner</span>
        </Link>
        <div className="topnav-links">
          <NavLink to="/" end>
            Aulas
          </NavLink>
          <NavLink to="/biblioteca">Biblioteca</NavLink>
          <NavLink to="/saber">Saber</NavLink>
          <NavLink to="/definicoes" className="nav-settings" title="Definições">
            <Settings size={16} />
            <span>Definições</span>
          </NavLink>
        </div>
      </nav>
      <Outlet />
    </div>
  )
}
