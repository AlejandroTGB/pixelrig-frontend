import { createContext, useContext, useEffect, useState } from 'react'
import { fetchAuthSession, signIn, signOut } from 'aws-amplify/auth'
import '../config/cognito'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)

  // Al montar la app: recuperar la sesión existente, si la hay
  useEffect(() => {
    async function recuperarSesion() {
      try {
        const sesion = await fetchAuthSession()
        if (sesion.tokens?.accessToken) {
          setUsuario(extraerDatos(sesion))
        }
      } catch {
        setUsuario(null)
      } finally {
        setCargando(false)
      }
    }
    recuperarSesion()
  }, [])

  // Los grupos vienen en el claim "cognito:groups" del access token
  function extraerDatos(sesion) {
    const claims = sesion.tokens.accessToken.payload
    return {
      username: claims.username,
      grupos: claims['cognito:groups'] ?? [],
      token: sesion...ng()
    }
  }

  async function iniciarSesion(email, password) {
    const { isSignedIn, nextStep } = await signIn({
      username: email,
      password
    })

    if (!isSignedIn) {
      throw new Error(`Paso de autenticación no soportado: ${nextStep.signInStep}`)
    }

    const sesion = await fetchAuthSession()
    setUsuario(extraerDatos(sesion))
  }

  async function cerrarSesion() {
    await signOut()
    setUsuario(null)
  }

  const valor = {
    usuario,
    cargando,
    autenticado: usuario !== null,
    esAdmin: usuario?.grupos.includes('ADMIN') ?? false,
    iniciarSesion,
    cerrarSesion
  }

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const contexto = useContext(AuthContext)
  if (!contexto) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  }
  return contexto
}