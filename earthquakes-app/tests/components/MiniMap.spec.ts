import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import MiniMap from '../../src/components/MiniMap.vue'

// Mock Leaflet
const mockMap = {
  setView: vi.fn(),
  remove: vi.fn()
}

const mockTileLayer = {
  addTo: vi.fn()
}

const mockMarker = {
  addTo: vi.fn(),
  setLatLng: vi.fn()
}

vi.mock('leaflet', () => ({
  default: {
    map: vi.fn(() => mockMap),
    tileLayer: vi.fn(() => mockTileLayer),
    marker: vi.fn(() => mockMarker)
  }
}))

describe('MiniMap', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing given lat and lon', () => {
    const wrapper = mount(MiniMap, {
      props: {
        lat: 40.7128,
        lon: -74.0060
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('[data-testid="mini-map"]').exists()).toBe(true)
  })

  it('applies default zoom=6 when none provided', () => {
    mount(MiniMap, {
      props: {
        lat: 40.7128,
        lon: -74.0060
      }
    })

    // The map should be initialized with zoom 6
    expect(mockMap.setView).toHaveBeenCalledWith([40.7128, -74.0060], 6)
  })

  it('uses custom zoom when provided', () => {
    mount(MiniMap, {
      props: {
        lat: 40.7128,
        lon: -74.0060,
        zoom: 10
      }
    })

    expect(mockMap.setView).toHaveBeenCalledWith([40.7128, -74.0060], 10)
  })

  it('applies custom height when provided', () => {
    const wrapper = mount(MiniMap, {
      props: {
        lat: 40.7128,
        lon: -74.0060,
        height: '200px'
      }
    })

    const container = wrapper.find('[data-testid="mini-map"]')
    expect(container.attributes('style')).toContain('height: 200px')
  })

  it('applies default height when none provided', () => {
    const wrapper = mount(MiniMap, {
      props: {
        lat: 40.7128,
        lon: -74.0060
      }
    })

    const container = wrapper.find('[data-testid="mini-map"]')
    expect(container.attributes('style')).toContain('height: 160px')
  })

  it('creates a marker at the specified coordinates', () => {
    mount(MiniMap, {
      props: {
        lat: 40.7128,
        lon: -74.0060
      }
    })

    expect(mockMarker.addTo).toHaveBeenCalledWith(mockMap)
  })

  it('has data-testid="mini-map" on the map container', () => {
    const wrapper = mount(MiniMap, {
      props: {
        lat: 40.7128,
        lon: -74.0060
      }
    })

    const container = wrapper.find('[data-testid="mini-map"]')
    expect(container.exists()).toBe(true)
  })
})
