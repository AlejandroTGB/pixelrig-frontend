import { useState } from 'react'
import api from '../api/axiosClient'

const VACIO = { nombre: '', email: '', mensaje: '' }
const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validar(datos) {
  const avisos = {}
  if (!datos.nombre.trim()) avisos.nombre = 'ESCRIBE TU NOMBRE'
  if (!datos.email.trim()) avisos.email = 'ESCRIBE TU CORREO'
  else if (!CORREO_VALIDO.test(datos.email.trim())) avisos.email = 'FORMATO DE CORREO NO VÁLIDO'
  if (!datos.mensaje.trim()) avisos.mensaje = 'ESCRIBE TU MENSAJE'
  else if (datos.mensaje.trim().length < 10) avisos.mensaje = 'CUÉNTANOS UN POCO MÁS'
  return avisos
}

export default function Contacto() {
  const [formulario, setFormulario] = useState(VACIO)
  const [enviando, setEnviando] = useState(false)
  const [exito, setExito] = useState('')
  const [error, setError] = useState('')
  const [avisos, setAvisos] = useState({})

  function cambiar(campo, valor) {
    setFormulario({ ...formulario, [campo]: valor })
    if (error) setError('')
    if (avisos[campo]) setAvisos({ ...avisos, [campo]: validar({ ...formulario, [campo]: valor })[campo] })
  }

  async function enviar(evento) {
    evento.preventDefault()
    const nuevos = validar(formulario)
    setAvisos(nuevos)
    setError('')
    setExito('')
    if (Object.keys(nuevos).length > 0) return

    setEnviando(true)

    try {
      await api.post('/contact', formulario)
      setExito('Mensaje enviado. Te responderemos a tu correo.')
      setFormulario(VACIO)
    } catch (err) {
      setError(err.response?.data?.message ?? 'No se pudo enviar el mensaje')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section className="vista centrada">
      <h1 className="titulo">CONTACTO</h1>
      <p className="subtitulo">Escríbenos y te respondemos al correo.</p>

      <form className="formulario contacto" onSubmit={enviar} noValidate>
        <div className={avisos.nombre ? 'campo con-error' : 'campo'}>
          <label htmlFor="nombre">NOMBRE</label>
          <input
            id="nombre"
            value={formulario.nombre}
            onChange={(evento) => cambiar('nombre', evento.target.value)}
            aria-invalid={Boolean(avisos.nombre)}
            aria-describedby={avisos.nombre ? 'aviso-nombre' : undefined}
          />
          {avisos.nombre && <p className="aviso" id="aviso-nombre">{avisos.nombre}</p>}
        </div>

        <div className={avisos.email ? 'campo con-error' : 'campo'}>
          <label htmlFor="email">CORREO</label>
          <input
            id="email"
            type="email"
            value={formulario.email}
            onChange={(evento) => cambiar('email', evento.target.value)}
            aria-invalid={Boolean(avisos.email)}
            aria-describedby={avisos.email ? 'aviso-email-f' : undefined}
          />
          {avisos.email && <p className="aviso" id="aviso-email-f">{avisos.email}</p>}
        </div>

        <div className={avisos.mensaje ? 'campo con-error' : 'campo'}>
          <label htmlFor="mensaje">MENSAJE</label>
          <textarea
            id="mensaje"
            value={formulario.mensaje}
            onChange={(evento) => cambiar('mensaje', evento.target.value)}
            maxLength={1000}
            aria-invalid={Boolean(avisos.mensaje)}
            aria-describedby={avisos.mensaje ? 'aviso-mensaje' : undefined}
          />
          {avisos.mensaje && <p className="aviso" id="aviso-mensaje">{avisos.mensaje}</p>}
        </div>

        {exito && <p className="mensaje exito">MENSAJE ENVIADO. TE RESPONDEREMOS A TU CORREO.</p>}
        {error && <p className="mensaje error">{error}</p>}

        <button className="boton" type="submit" disabled={enviando}>
          {enviando ? 'ENVIANDO...' : 'ENVIAR MENSAJE'}
        </button>
      </form>
    </section>
  )
}