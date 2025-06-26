import * as real from './authService.real'
import * as mock from './authService.mock'

const useMock = import.meta.env.VITE_USE_MOCK === 'true'

export const login = useMock ? mock.login : real.login
