import axios from 'axios'

export async function login(email: string, password: string) {
  const { data } = await axios.post('/api/auth/login', { email, password })
  return data
}
