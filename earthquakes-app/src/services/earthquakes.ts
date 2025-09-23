import type { Earthquake } from '../types/earthquake'

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://127.0.0.1:8080'
const API_KEY = import.meta.env.VITE_API_KEY ?? 'your_dev_key'

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

function mapToEarthquake(item: any): Earthquake {
  return {
    id: typeof item.id === 'number' ? item.id : 0,
    geo_id: typeof item.geo_id === 'string' ? item.geo_id : '',
    title: typeof item.title === 'string' ? item.title : '',
    image: typeof item.image === 'string' ? item.image : '',
    description: typeof item.description === 'string' ? item.description : ''
  }
}

export async function list(): Promise<Earthquake[]> {
  try {
    const response = await fetch(`${API_BASE}/api/getEarthquakes`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-API-Key': API_KEY
      }
    })

    if (!response.ok) {
      throw new ApiError(response.status, `HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    
    if (!Array.isArray(data)) {
      throw new Error('Invalid response: expected array')
    }

    return data.map(mapToEarthquake)
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    if (error instanceof SyntaxError) {
      throw new Error('Invalid JSON response')
    }
    throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function getById(id: number): Promise<Earthquake | undefined> {
  const earthquakes = await list()
  return earthquakes.find(earthquake => earthquake.id === id)
}
