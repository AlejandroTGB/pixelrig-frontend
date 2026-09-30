import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './views/Login'
import Productos from './views/Productos'
import Contacto from './views/Contacto'
import AdminProductos from './views/AdminProductos'

function Layout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<Layout />}>
        <Route path="/productos" element={<ProtectedRoute><Productos /></ProtectedRoute>} />
        <Route path="/contacto" element={<ProtectedRoute><Contacto /></ProtectedRoute>} />
        <Route
          path="/admin/productos"
          element={
            <ProtectedRoute rolesPermitidos={['ADMIN']}>
              <AdminProductos />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/productos" replace />} />
    </Routes>
  )
}
