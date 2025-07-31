import { http, HttpResponse } from 'msw'
import { mockUser, mockDatabase, createMockApiResponse, createMockApiError } from '../utils'

const API_BASE_URL = 'http://localhost:5000/api/v1'

export const handlers = [
  // Auth endpoints
  http.post(`${API_BASE_URL}/auth/login`, async ({ request }) => {
    const body = await request.json() as { email: string; password: string }
    
    if (body.email === 'test@example.com' && body.password === 'password') {
      return HttpResponse.json(createMockApiResponse({
        user: mockUser,
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token'
      }))
    }
    
    return HttpResponse.json(
      createMockApiError('Invalid credentials'),
      { status: 401 }
    )
  }),

  http.post(`${API_BASE_URL}/auth/register`, async ({ request }) => {
    const body = await request.json() as { 
      email: string
      password: string
      username: string
      firstName?: string
      lastName?: string
    }
    
    return HttpResponse.json(createMockApiResponse({
      user: { ...mockUser, ...body },
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token'
    }))
  }),

  http.get(`${API_BASE_URL}/auth/me`, ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        createMockApiError('Unauthorized'),
        { status: 401 }
      )
    }
    
    return HttpResponse.json(createMockApiResponse(mockUser))
  }),

  http.post(`${API_BASE_URL}/auth/logout`, () => {
    return HttpResponse.json(createMockApiResponse({ message: 'Logged out successfully' }))
  }),

  http.post(`${API_BASE_URL}/auth/refresh-token`, () => {
    return HttpResponse.json(createMockApiResponse({
      accessToken: 'new-mock-access-token'
    }))
  }),

  // Database endpoints
  http.get(`${API_BASE_URL}/databases`, ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    
    const databases = Array.from({ length: 5 }, (_, i) => ({
      ...mockDatabase,
      id: `database-${i + 1}`,
      name: `Database ${i + 1}`,
    }))
    
    return HttpResponse.json(createMockApiResponse({
      databases,
      pagination: {
        page,
        limit,
        total: databases.length,
        totalPages: Math.ceil(databases.length / limit)
      }
    }))
  }),

  http.get(`${API_BASE_URL}/databases/:id`, ({ params }) => {
    const { id } = params
    
    return HttpResponse.json(createMockApiResponse({
      ...mockDatabase,
      id: id as string,
    }))
  }),

  http.post(`${API_BASE_URL}/databases`, async ({ request }) => {
    const body = await request.json() as Partial<typeof mockDatabase>
    
    return HttpResponse.json(createMockApiResponse({
      ...mockDatabase,
      ...body,
      id: 'new-database-id',
    }), { status: 201 })
  }),

  http.put(`${API_BASE_URL}/databases/:id`, async ({ params, request }) => {
    const { id } = params
    const body = await request.json() as Partial<typeof mockDatabase>
    
    return HttpResponse.json(createMockApiResponse({
      ...mockDatabase,
      ...body,
      id: id as string,
    }))
  }),

  http.delete(`${API_BASE_URL}/databases/:id`, ({ params }) => {
    const { id } = params
    
    return HttpResponse.json(createMockApiResponse({
      message: `Database ${id} deleted successfully`
    }))
  }),

  // Users endpoints
  http.get(`${API_BASE_URL}/users`, () => {
    const users = Array.from({ length: 3 }, (_, i) => ({
      ...mockUser,
      id: `user-${i + 1}`,
      email: `user${i + 1}@example.com`,
      username: `user${i + 1}`,
    }))
    
    return HttpResponse.json(createMockApiResponse(users))
  }),

  // Catch-all for unhandled requests
  http.all('*', ({ request }) => {
    console.warn(`Unhandled ${request.method} request to ${request.url}`)
    return HttpResponse.json(
      createMockApiError('Not Found'),
      { status: 404 }
    )
  }),
]
