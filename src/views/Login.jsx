import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { autenticado, iniciarSesion } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  const navigate = useNavigate()
  const { state } = useLocation()
  const destino = state?.desde ?? '/productos'

  if (autenticado) {
    return <Navigate to={destino} replace />
  }

  async function enviar(evento) {
    evento.preventDefault()
    setError('')
    setEnviando(true)

    try {
      await iniciarSesion(email, password)
      navigate(destino, { replace: true })
    } catch (err) {
      setError(err.message ?? 'No se pudo iniciar sesión')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <main className="login">
      <div className="panel">
        <h1 className="titulo">INICIAR SESIÓN</h1>
        <p className="subtitulo">Accede con tu cuenta de PixelRig para ver el catálogo</p>

        <form className="formulario" onSubmit={enviar}>
          <div className="campo">
            <label htmlFor="email">CORREO</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(evento) => setEmail(evento.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="campo">
            <label htmlFor="password">CONTRASEÑA</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(evento) => setPassword(evento.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {error && <p className="mensaje error">{error}</p>}

          <button className="boton" type="submit" disabled={enviando}>
            {enviando ? 'ENTRANDO...' : 'ENTRAR'}
          </button>
        </form>
      </div>
    </main>
  )
}