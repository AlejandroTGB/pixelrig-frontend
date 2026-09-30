import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, rolesPermitidos }) {
  const { autenticado, cargando, usuario } = useAuth()
  const ubicacion = useLocation()

  // Mientras se comprueba la sesión guardada, no decidimos nada todavía
  if (cargando) {
    return <p>Verificando sesión...</p>
  }

  // Sin sesión: al login, y recordamos a dónde quería entrar
  if (!autenticado) {
    return <Navigate to="/login" state={{ desde: ubicacion.pathname }} replace />
  }

  // Con sesión pero sin el rol requerido: fuera de la pantalla de administración
  if (rolesPermitidos && !rolesPermitidos.some((rol) => usuario.grupos.includes(rol))) {
    return <Navigate to="/productos" replace />
  }

  return children
}
