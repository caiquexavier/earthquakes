// GeoJSON minimal types used by the app
export interface GeoJsonProperties {
  mag?: number
  place?: string
  time?: number
  updated?: number
  url?: string
  detail?: string
  title?: string
  magType?: string
  type?: string
  status?: string
  tsunami?: number
  sig?: number
  net?: string
  code?: string
  ids?: string
  types?: string
  [key: string]: unknown
}

export interface GeoPointGeometry {
  type: 'Point'
  coordinates: [number, number, number?] // [lon, lat, depthKm]
}

export interface GeoJsonFeature {
  type: 'Feature'
  properties: GeoJsonProperties
  geometry: GeoPointGeometry | { type: string; [key: string]: unknown }
  id: string
}

export interface GeoJsonFeatureCollection {
  type: 'FeatureCollection'
  metadata?: Record<string, unknown>
  features: GeoJsonFeature[]
}

// View-friendly type for list/detail UI
export interface Earthquake {
  id: string
  title: string
  magnitude?: number
  place?: string
  time?: number
  updated?: number
  coordinates?: { lat: number; lon: number; depthKm?: number }
  usgsUrl?: string
  detailUrl?: string
}
