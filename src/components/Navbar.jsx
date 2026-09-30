import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { autenticado, usuario, esAdmin, cerrarSesion } = useAuth()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  async function salir() {
    await cerrarSesion()
    navigate('/login')
  }

  function clase(ruta) {
    return pathname === ruta ? 'enlace activo' : 'enlace'
  }

  return (
    <nav className="navbar">
      <div className="logo">PIXEL<span>R</span>IG</div>

      <Link to="/productos" className={clase('/productos')}>PRODUCTOS</Link>
      <Link to="/contacto" className={clase('/contacto')}>CONTACTO</Link>
      {esAdmin && <Link to="/admin/productos" className={clase('/admin/productos')}>ADMIN</Link>}

      {autenticado && (
        <div className="derecha">
          <div className="rol">{usuario.grupos[0] ?? 'SIN ROL'}</div>
          <div className="correo">{usuario.username}</div>
          <button className="boton" onClick={salir}>SALIR</button>
        </div>
      )}
    </nav>
  )
}
