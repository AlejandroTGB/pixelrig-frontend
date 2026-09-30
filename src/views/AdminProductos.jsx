import { useEffect, useState } from 'react'
import api from '../api/axiosClient'

const CATEGORIAS = ['CPU', 'RAM', 'GPU', 'ALMACENAMIENTO', 'FUENTE']
const VACIO = { nombre: '', marca: '', descripcion: '', categoria: 'CPU', precio: '', stock: '' }

function precioCLP(valor) {
  return '$' + valor.toLocaleString('es-CL')
}

export default function AdminProductos() {
  const [productos, setProductos] = useState([])
  const [formulario, setFormulario] = useState(VACIO)
  const [editando, setEditando] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [aviso, setAviso] = useState('')
  const [error, setError] = useState('')

  async function cargar() {
    try {
      const { data } = await api.get('/products')
      setProductos(data)
    } catch (err) {
      setError(err.response?.data?.message ?? 'No se pudo cargar la lista')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargar()
  }, [])

  function cambiar(campo, valor) {
    setFormulario({ ...formulario, [campo]: valor })
  }

  function editar(producto) {
    setEditando(producto.id)
    setFormulario({
      nombre: producto.nombre ?? '',
      marca: producto.marca ?? '',
      descripcion: producto.descripcion ?? '',
      categoria: producto.categoria ?? 'CPU',
      precio: producto.precio ?? '',
      stock: producto.stock ?? ''
    })
    setAviso('')
    setError('')
  }

  function cancelar() {
    setEditando(null)
    setFormulario(VACIO)
  }

  async function guardar(evento) {
    evento.preventDefault()
    setAviso('')
    setError('')
    setEnviando(true)

    const cuerpo = {
      ...formulario,
      precio: Number(formulario.precio),
      stock: Number(formulario.stock || 0)
    }

    try {
      if (editando) {
        await api.put(`/products/${editando}`, cuerpo)
        setAviso(`Producto #${editando} actualizado.`)
      } else {
        await api.post('/products', cuerpo)
        setAviso('Producto creado.')
      }
      cancelar()
      await cargar()
    } catch (err) {
      setError(err.response?.data?.message ?? 'No se pudo guardar el producto')
    } finally {
      setEnviando(false)
    }
  }

  async function eliminar(producto) {
    if (!confirm(`¿Eliminar "${producto.nombre}"?`)) return

    setAviso('')
    setError('')

    try {
      await api.delete(`/products/${producto.id}`)
      setAviso(`Producto #${producto.id} eliminado.`)
      if (editando === producto.id) cancelar()
      await cargar()
    } catch (err) {
      setError(err.response?.data?.message ?? 'No se pudo eliminar el producto')
    }
  }

  return (
    <section className="vista">
      <h1 className="titulo">MANTENEDOR DE PRODUCTOS</h1>
      <p className="subtitulo">Crea, edita y elimina componentes del catálogo.</p>

      <div className="admin">
        <form className="formulario panel" onSubmit={guardar}>
          <h2 className="admin-titulo">{editando ? `EDITANDO #${editando}` : 'NUEVO PRODUCTO'}</h2>

          <div className="campo">
            <label htmlFor="nombre">NOMBRE</label>
            <input id="nombre" value={formulario.nombre} onChange={(evento) => cambiar('nombre', evento.target.value)} required />
          </div>

          <div className="campo">
            <label htmlFor="marca">MARCA</label>
            <input id="marca" value={formulario.marca} onChange={(evento) => cambiar('marca', evento.target.value)} />
          </div>

          <div className="campo">
            <label htmlFor="categoria">CATEGORIA</label>
            <select id="categoria" value={formulario.categoria} onChange={(evento) => cambiar('categoria', evento.target.value)}>
              {CATEGORIAS.map((categoria) => (
                <option key={categoria} value={categoria}>{categoria}</option>
              ))}
            </select>
          </div>

          <div className="campo">
            <label htmlFor="precio">PRECIO (CLP)</label>
            <input id="precio" type="number" min="0" value={formulario.precio} onChange={(evento) => cambiar('precio', evento.target.value)} required />
          </div>

          <div className="campo">
            <label htmlFor="stock">STOCK</label>
            <input id="stock" type="number" min="0" value={formulario.stock} onChange={(evento) => cambiar('stock', evento.target.value)} />
          </div>

          <div className="campo">
            <label htmlFor="descripcion">DESCRIPCION</label>
            <textarea id="descripcion" value={formulario.descripcion} onChange={(evento) => cambiar('descripcion', evento.target.value)} maxLength={500} />
          </div>

          <div className="admin-acciones">
            <button className="boton" type="submit" disabled={enviando}>
              {enviando ? 'GUARDANDO...' : editando ? 'GUARDAR CAMBIOS' : 'CREAR PRODUCTO'}
            </button>
            {editando && (
              <button className="boton secundario" type="button" onClick={cancelar}>CANCELAR</button>
            )}
          </div>

          {aviso && <p className="mensaje exito">{aviso}</p>}
          {error && <p className="mensaje error">{error}</p>}
        </form>

        <div>
          <table className="tabla">
            <thead>
              <tr>
                <th>ID</th>
                <th>NOMBRE</th>
                <th>CATEGORIA</th>
                <th>PRECIO</th>
                <th>STOCK</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.id}>
                  <td>{producto.id}</td>
                  <td>{producto.nombre}</td>
                  <td>{producto.categoria}</td>
                  <td>{precioCLP(producto.precio)}</td>
                  <td>{producto.stock ?? 0}</td>
                  <td className="acciones">
                    <button className="boton secundario" type="button" onClick={() => editar(producto)}>EDITAR</button>
                    <button className="boton peligro" type="button" onClick={() => eliminar(producto)}>ELIMINAR</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {cargando && <p className="cargando">Cargando...</p>}
          {!cargando && productos.length === 0 && <p className="cargando">Todavía no hay productos cargados.</p>}
        </div>
      </div>
    </section>
  )
}