import axios from 'axios'
import { fetchAuthSession } from 'aws-amplify/auth'

const api = axios.create({
  baseURL: 'https://t1o4e3p31h.execute-api.us-east-1.amazonaws.com/api'
})

api.interceptors.request.use(async (config) => {
  try {
    const sesion = await fetchAuthSession()
    const token = sesion.tokens?.idToken?.toString()

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  } catch {
  }

  return config
})

export default api
