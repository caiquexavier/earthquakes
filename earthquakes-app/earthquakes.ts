import type { Earthquake, GeoJsonFeature, GeoJsonFeatureCollection } from '../types/earthquake'

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://127.0.0.1:8080'
const API_KEY = import.meta.env.VITE_API_KEY ?? 'your_dev_key'

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

function mapFeatureToEarthquake(feature: GeoJsonFeature): Earthquake {
  const props = feature.properties || {}
  const geometry = feature.geometry
  let coordinates: Earthquake['coordinates'] | undefined
  if (geometry && geometry.type === 'Point' && Array.isArray((geometry as any).coordinates)) {
    const coords = (geometry as any).coordinates as [number, number, number?]
    coordinates = {
      lat: typeof coords[1] === 'number' ? coords[1] : undefined as unknown as number,
      lon: typeof coords[0] === 'number' ? coords[0] : undefined as unknown as number,
      depthKm: typeof coords[2] === 'number' ? coords[2] : undefined
    }
  }

  const mag = typeof props.mag === 'number' ? props.mag : undefined
  const place = typeof props.place === 'string' ? props.place : undefined
  const titleProp = typeof props.title === 'string' ? props.title : undefined

  return {
    id: String(feature.id),
    title: titleProp ?? `M ${mag ?? '?'} - ${place ?? 'Unknown location'}`,
    magnitude: mag,
    place,
    time: typeof props.time === 'number' ? props.time : undefined,
    updated: typeof props.updated === 'number' ? props.updated : undefined,
    coordinates,
    usgsUrl: typeof props.url === 'string' ? props.url : undefined,
    detailUrl: typeof props.detail === 'string' ? props.detail : undefined
  }
}

export async function list(): Promise<Earthquake[]> {
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

  const data: unknown = await response.json()

  const isFeatureCollection =
    typeof data === 'object' && data !== null && (data as any).type === 'FeatureCollection' &&
    Array.isArray((data as any).features)

  if (!isFeatureCollection) {
    throw new Error('Invalid response: expected GeoJSON FeatureCollection')
  }

  const collection = data as GeoJsonFeatureCollection
  return collection.features.map(mapFeatureToEarthquake)
}

export function filterEarthquakes(earthquakes: Earthquake[], timebox: 'H'|'D'|'W'|'M', magnitude: '4.5+'|'2.5+'|'1.0+'|'all'): Earthquake[] {
  const now = Date.now()
  const timeboxMs = {
    'H': 60 * 60 * 1000,      // 1 hour
    'D': 24 * 60 * 60 * 1000,  // 1 day
    'W': 7 * 24 * 60 * 60 * 1000,  // 1 week
    'M': 30 * 24 * 60 * 60 * 1000  // 1 month
  }[timebox]

  const magnitudeThreshold = {
    '4.5+': 4.5,
    '2.5+': 2.5,
    '1.0+': 1.0,
    'all': 0
  }[magnitude]

  return earthquakes.filter(earthquake => {
    // Filter by timebox
    if (earthquake.time) {
      const earthquakeTime = earthquake.time
      if (now - earthquakeTime > timeboxMs) {
        return false
      }
    }

    // Filter by magnitude
    if (earthquake.magnitude !== undefined) {
      if (earthquake.magnitude < magnitudeThreshold) {
        return false
      }
    }

    return true
  })
}

export async function fetchDetail(detailUrl: string): Promise<GeoJsonFeature | null> {
  try {
    const response = await fetch(detailUrl, {
      headers: {
        'Accept': 'application/json'
      }
    })
    if (!response.ok) return null
    const data: unknown = await response.json()
    if (
      typeof data === 'object' && data !== null &&
      (data as any).type === 'Feature' &&
      (data as any).properties && (data as any).geometry
    ) {
      return data as GeoJsonFeature
    }
    return null
  } catch {
    return null
  }
}
