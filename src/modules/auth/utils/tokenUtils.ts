export const getToken = (): string | null => {
    return localStorage.getItem('token')
}

export const setToken = (token: string): void => {
    localStorage.setItem('token', token)
}

export const removeToken = (): void => {
    localStorage.removeItem('token')
}

export const isTokenExpired = (token: string): boolean => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        const currentTime = Date.now() / 1000
        return payload.exp < currentTime
    } catch {
        return true
    }
}
