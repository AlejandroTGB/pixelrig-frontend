import { useState } from 'react'
import api from '../api/axiosClient'

const VACIO = { nombre: '', email: '', mensaje: '' }

export default function Contacto() {
  const [formulario, setFormulario] = useState(VACIO)
  const [enviando, setEnviando] = useState(false)
  const [exito, setExito] = useState('')
  const [error, setError] = useState('')

  function cambiar(campo, valor) {
    setFormulario({ ...formulario, [campo]: valor })
  }

  async function enviar(evento) {
    evento.preventDefault()
    setError('')
    setExito('')
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
    <section className="vista">
      <h1 className="titulo">CONTACTO</h1>
      <p className="subtitulo">Escríbenos y te respondemos al correo.</p>

      <form className="formulario contacto" onSubmit={enviar}>
        <div className="campo">
          <label htmlFor="nombre">NOMBRE</label>
          <input id="nombre" value={formulario.nombre} onChange={(evento) => cambiar('nombre', evento.target.value)} required />
        </div>

        <div className="campo">
          <label htmlFor="email">CORREO</label>
          <input id="email" type="email" value={formulario.email} onChange={(evento) => cambiar('email', evento.target.value)} required />
        </div>

        <div className="campo">
          <label htmlFor="mensaje">MENSAJE</label>
          <textarea id="mensaje" value={formulario.mensaje} onChange={(evento) => cambiar('mensaje', evento.target.value)} maxLength={1000} required />
        </div>

        {exito && <p className="mensaje exito">{exito}</p>}
        {error && <p className="mensaje error">{error}</p>}

        <button className="boton" type="submit" disabled={enviando}>
          {enviando ? 'ENVIANDO...' : 'ENVIAR MENSAJE'}
        </button>
      </form>
    </section>
  )
}