import axios from 'axios'
import { fetchAuthSession } from 'aws-amplify/auth'

const api = axios.create({
  baseURL: 'http://localhost:8081/api'
})

api.interceptors.request.use(async (config) => {
  try {
    const sesion = await fetchAuthSession()
    const token = sesion.tokens?.accessToken?.toString()

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  } catch {
  }

  return config
})

export default api
