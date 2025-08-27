export async function GET(request) {
  // Mock login response
  const mockResponse = {
    success: true,
    token: 'mock-jwt-token-' + Date.now(),
    user: {
      id: 'user-123',
      name: 'John Doe',
      email: 'john.doe@example.com',
      nin: '12345678901',
      phone: '+2348012345678'
    }
  }

  return Response.json(mockResponse)
}
