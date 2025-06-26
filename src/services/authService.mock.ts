export async function login(email: string, password: string) {
  console.log(`[mock] login called`)
  await new Promise((r) => setTimeout(r, 400))

  if (email && password) {
    return {
      user: { id: 1, name: 'MockUser', email },
      token: 'mock-jwt-token',
    }
  }
  throw new Error('Credenciais invalidas.')
}
