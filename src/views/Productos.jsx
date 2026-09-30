import { useEffect, useState } from 'react'
import api from '../api/axiosClient'

const CATEGORIAS = [
  { nombre: 'CPU', color: 'var(--cpu)', descripcion: 'Procesadores', left: '0%', top: '31.86%' },
  { nombre: 'FUENTE', color: 'var(--fuente)', descripcion: 'Certificadas 80+', left: '0%', top: '67.57%' },
  { nombre: 'RAM', color: 'var(--ram)', descripcion: 'DDR4 y DDR5', left: '80%', top: '31.86%' },
  { nombre: 'GPU', color: 'var(--gpu)', descripcion: 'Tarjetas de video', left: '80%', top: '46.14%' },
  { nombre: 'ALMACENAMIENTO', color: 'var(--almacenamiento)', descripcion: 'SSD y HDD', left: '80%', top: '60.43%' }
]

const LINEAS = [
  { de: 200, a: 371.7, y: 250, color: 'var(--cpu)' },
  { de: 800, a: 548.6, y: 250, color: 'var(--ram)' },
  { de: 800, a: 618.7, y: 350, color: 'var(--gpu)' },
  { de: 800, a: 558.8, y: 450, color: 'var(--almacenamiento)' },
  { de: 200, a: 263.8, y: 500, color: 'var(--fuente)' }
]

const COLORES = {
  CPU: 'var(--cpu)',
  RAM: 'var(--ram)',
  GPU: 'var(--gpu)',
  ALMACENAMIENTO: 'var(--almacenamiento)',
  FUENTE: 'var(--fuente)'
}

function estadoDelStock(stock) {
  if (!stock || stock <= 0) return { tipo: 'nada', texto: 'Sin stock' }
  if (stock <= 3) return { tipo: 'poco', texto: `Últimas ${stock} unidades` }
  return { tipo: 'ok', texto: `Stock: ${stock}` }
}

function precioCLP(valor) {
  return '$' + valor.toLocaleString('es-CL')
}

export default function Productos() {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [filtro, setFiltro] = useState(null)

  useEffect(() => {
    async function cargar() {
      try {
        const { data } = await api.get('/products')
        setProductos(data)
      } catch (err) {
        setError(err.response?.data?.message ?? 'No se pudo cargar el catálogo')
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [])

  const visibles = filtro
    ? productos.filter((producto) => producto.categoria?.toUpperCase() === filtro)
    : productos

  return (
    <>
      <section className="hero">
        <h1 className="titulo">ARMA TU RIG</h1>
        <p className="subtitulo">Catálogo de componentes con stock real. Filtra haciendo clic en una pieza del diagrama.</p>
      </section>

      <div className="diagrama">
        <svg viewBox="0 0 1000 700" preserveAspectRatio="none">
          {LINEAS.map((linea) => (
            <g key={`${linea.y}-${linea.a}`}>
              <line x1={linea.de} y1={linea.y} x2={linea.a} y2={linea.y} style={{ stroke: 'var(--fondo-hondo)' }} strokeWidth="6" opacity="0.8" />
              <line x1={linea.de} y1={linea.y} x2={linea.a} y2={linea.y} style={{ stroke: linea.color }} strokeWidth="2" />
            </g>
          ))}
        </svg>

        <div className="pc">
          <img src="/torre.png" alt="Torre de PC en pixel art" />
        </div>

        {CATEGORIAS.map((categoria) => (
          <button
            key={categoria.nombre}
            className={filtro === categoria.nombre ? 'cat activo' : 'cat'}
            style={{ left: categoria.left, top: categoria.top, '--c': categoria.color }}
            onClick={() => setFiltro(filtro === categoria.nombre ? null : categoria.nombre)}
          >
            <span className="nom"><i></i>{categoria.nombre}</span>
            <span className="desc">{categoria.descripcion}</span>
          </button>
        ))}
      </div>

      <div className="barra-seccion">
        <h2>{filtro ?? 'COMPONENTES'}</h2>
        <span className="resumen">
          {cargando ? 'Cargando...' : `${visibles.length} de ${productos.length} componentes`}
        </span>
      </div>

      {cargando && <p className="cargando vista">Cargando catálogo...</p>}
      {error && <p className="mensaje error vista">{error}</p>}

      {!cargando && !error && (
        <div className="grid">
          {visibles.map((producto) => {
            const estado = estadoDelStock(producto.stock)
            return (
              <article className="card" key={producto.id}>
                <div className="chip" style={{ '--c': COLORES[producto.categoria] ?? 'var(--texto-suave)' }}>
                  <i></i>{producto.categoria}
                </div>
                <h3>{producto.nombre}</h3>
                <p className="marca-prod">{producto.marca}</p>
                <p className="desc">{producto.descripcion}</p>
                <div className="pie">
                  <span className="precio">{precioCLP(producto.precio)}</span>
                  <span className={`estado ${estado.tipo}`}><i></i>{estado.texto}</span>
                </div>
              </article>
            )
          })}
          {visibles.length === 0 && (
            <p className="estado-vacio">No hay componentes en esta categoría. Prueba con otra pieza del diagrama.</p>
          )}
        </div>
      )}
    </>
  )
}