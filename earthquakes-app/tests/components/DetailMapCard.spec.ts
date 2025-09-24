import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import DetailMapCard from '../../src/components/map/DetailMapCard.vue'

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

const mockDivIcon = vi.fn(() => ({}))

vi.mock('leaflet', () => ({
  default: {
    map: vi.fn(() => mockMap),
    tileLayer: vi.fn(() => mockTileLayer),
    marker: vi.fn(() => mockMarker),
    divIcon: mockDivIcon
  }
}))

describe('DetailMapCard', () => {
  it('renders without crashing given lat and lon', () => {
    const wrapper = mount(DetailMapCard, {
      props: {
        lat: 40.7128,
        lon: -74.0060
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('[data-testid="detail-map"]').exists()).toBe(true)
  })

  it('shows only the map without coordinate information', () => {
    const wrapper = mount(DetailMapCard, {
      props: {
        lat: 40.7128,
        lon: -74.0060,
        depthKm: 10.5,
        zoom: 8
      }
    })

    // Should not display coordinate information
    expect(wrapper.text()).not.toContain('40.7128, -74.0060')
    expect(wrapper.text()).not.toContain('10.5 km')
    expect(wrapper.text()).not.toContain('Zoom Level: 8')
    
    // Should only have the map
    expect(wrapper.find('[data-testid="detail-map"]').exists()).toBe(true)
  })

  it('applies default zoom when none provided', () => {
    mount(DetailMapCard, {
      props: {
        lat: 40.7128,
        lon: -74.0060
      }
    })

    expect(mockMap.setView).toHaveBeenCalledWith([40.7128, -74.0060], 8)
  })

  it('has proper card structure without title', () => {
    const wrapper = mount(DetailMapCard, {
      props: {
        lat: 40.7128,
        lon: -74.0060
      }
    })

    // Should not have title
    expect(wrapper.find('.v-card-title').exists()).toBe(false)
    expect(wrapper.find('.v-card-text').exists()).toBe(true)
  })

  it('creates a marker with custom icon', () => {
    mount(DetailMapCard, {
      props: {
        lat: 40.7128,
        lon: -74.0060
      }
    })

    expect(mockDivIcon).toHaveBeenCalled()
    expect(mockMarker.addTo).toHaveBeenCalledWith(mockMap)
  })
})
