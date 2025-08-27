export async function POST(request) {
  const body = await request.json()
  
  // Mock discovery response
  const mockResponse = {
    discoveryId: 'discovery-' + Date.now(),
    component: body.component || 'LoginPage',
    status: 'success'
  }

  return Response.json(mockResponse)
}
