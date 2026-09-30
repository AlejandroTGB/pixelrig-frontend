import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const MENSAJES = {
  'Incorrect username or password.': 'CORREO O CONTRASEÑA INCORRECTOS',
  'User does not exist.': 'CORREO O CONTRASEÑA INCORRECTOS',
  'User is not confirmed.': 'LA CUENTA AÚN NO ESTÁ CONFIRMADA',
  'User is disabled.': 'LA CUENTA ESTÁ DESHABILITADA',
  'Password attempts exceeded': 'DEMASIADOS INTENTOS, ESPERA UN MINUTO',
  'There is already a signed in user.': 'YA HAY UNA SESIÓN INICIADA'
}

function traducir(mensaje) {
  const clave = Object.keys(MENSAJES).find((texto) => mensaje?.includes(texto))
  return clave ? MENSAJES[clave] : 'NO SE PUDO INICIAR SESIÓN'
}

function validar(correo, clave) {
  const avisos = {}
  if (!correo.trim()) {
    avisos.email = 'ESCRIBE TU CORREO'
  } else if (!CORREO_VALIDO.test(correo.trim())) {
    avisos.email = 'FORMATO DE CORREO NO VÁLIDO'
  }
  if (!clave) avisos.password = 'ESCRIBE TU CONTRASEÑA'
  return avisos
}

export default function Login() {
  const { autenticado, iniciarSesion } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [avisos, setAvisos] = useState({})
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  const navigate = useNavigate()
  const { state } = useLocation()
  const destino = state?.desde ?? '/productos'

  if (autenticado) {
    return <Navigate to={destino} replace />
  }

  function cambiarEmail(valor) {
    setEmail(valor)
    if (error) setError('')
    if (avisos.email) setAvisos({ ...avisos, email: validar(valor, password).email })
  }

  function cambiarPassword(valor) {
    setPassword(valor)
    if (error) setError('')
    if (avisos.password) setAvisos({ ...avisos, password: validar(email, valor).password })
  }

  async function enviar(evento) {
    evento.preventDefault()
    const nuevos = validar(email, password)
    setAvisos(nuevos)
    setError('')

    if (Object.keys(nuevos).length > 0) return

    setEnviando(true)
    try {
      await iniciarSesion(email.trim(), password)
      navigate(destino, { replace: true })
    } catch (err) {
      setError(traducir(err.message))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <main className={error ? 'login con-fallo' : 'login'}>
      <div className="panel">
        <h1 className="titulo">INICIAR SESIÓN</h1>
        <p className="subtitulo">Accede con tu cuenta para ver el catálogo</p>

        <form className="formulario" onSubmit={enviar} noValidate>
          <div className={avisos.email ? 'campo con-error' : 'campo'}>
            <label htmlFor="email">CORREO</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(evento) => cambiarEmail(evento.target.value)}
              autoComplete="username"
              aria-invalid={Boolean(avisos.email)}
              aria-describedby={avisos.email ? 'aviso-email' : undefined}
            />
            {avisos.email && (
              <p className="aviso" id="aviso-email">{avisos.email}</p>
            )}
          </div>

          <div className={avisos.password ? 'campo con-error' : 'campo'}>
            <label htmlFor="password">CONTRASEÑA</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(evento) => cambiarPassword(evento.target.value)}
              autoComplete="current-password"
              aria-invalid={Boolean(avisos.password)}
              aria-describedby={avisos.password ? 'aviso-password' : undefined}
            />
            {avisos.password && (
              <p className="aviso" id="aviso-password">{avisos.password}</p>
            )}
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
