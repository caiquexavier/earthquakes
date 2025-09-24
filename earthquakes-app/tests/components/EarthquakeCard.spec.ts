import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import EarthquakeCard from '../../src/components/earthquakes/EarthquakeCard.vue'
import type { Earthquake } from '../../src/types/earthquake'

// Mock MiniMap component
vi.mock('../../src/components/MiniMap.vue', () => ({
  default: {
    name: 'MiniMap',
    template: '<div data-testid="feature-mini-map">MiniMap</div>',
    props: ['lat', 'lon', 'zoom', 'interactive', 'height']
  }
}))

// Mock router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
    { path: '/earthquake/:id', name: 'earthquake-detail', component: { template: '<div>Detail</div>' } }
  ]
})

const mockEarthquake: Earthquake = {
  id: 'test-1',
  title: 'Test Earthquake',
  magnitude: 4.5,
  place: 'Test Location',
  time: Date.now(),
  coordinates: {
    lat: 40.7128,
    lon: -74.0060,
    depthKm: 10.5
  },
  usgsUrl: 'https://example.com',
  detailUrl: 'https://example.com/detail'
}

const mockEarthquakeWithoutCoords: Earthquake = {
  id: 'test-2',
  title: 'Test Earthquake No Coords',
  magnitude: 3.0,
  place: 'Test Location',
  time: Date.now()
}

describe('EarthquakeCard', () => {
  it('renders earthquake information correctly', () => {
    const wrapper = mount(EarthquakeCard, {
      props: {
        earthquake: mockEarthquake
      },
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.text()).toContain('Test Earthquake')
    expect(wrapper.text()).toContain('M 4.5')
    expect(wrapper.text()).toContain('40.71, -74.01')
    expect(wrapper.text()).toContain('Depth 10.5 km')
  })

  it('renders MiniMap at the top when coordinates are available', () => {
    const wrapper = mount(EarthquakeCard, {
      props: {
        earthquake: mockEarthquake
      },
      global: {
        plugins: [router]
      }
    })

    const miniMap = wrapper.find('[data-testid="feature-mini-map"]')
    expect(miniMap.exists()).toBe(true)
    expect(miniMap.text()).toBe('MiniMap')
    
    // Verify the map is at the top by checking it comes before the card text
    const cardText = wrapper.find('.v-card-text')
    const miniMapSection = wrapper.find('.mini-map-section')
    expect(miniMapSection.element.compareDocumentPosition(cardText.element) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('does not render MiniMap when coordinates are not available', () => {
    const wrapper = mount(EarthquakeCard, {
      props: {
        earthquake: mockEarthquakeWithoutCoords
      },
      global: {
        plugins: [router]
      }
    })

    const miniMap = wrapper.find('[data-testid="feature-mini-map"]')
    expect(miniMap.exists()).toBe(false)
  })

  it('passes correct props to MiniMap', () => {
    const wrapper = mount(EarthquakeCard, {
      props: {
        earthquake: mockEarthquake
      },
      global: {
        plugins: [router]
      }
    })

    const miniMapComponent = wrapper.findComponent({ name: 'MiniMap' })
    expect(miniMapComponent.exists()).toBe(true)
    expect(miniMapComponent.props()).toEqual({
      lat: 40.7128,
      lon: -74.0060,
      zoom: 6,
      interactive: false,
      height: '160px'
    })
  })

  it('applies correct magnitude badge styling for high magnitude', () => {
    const wrapper = mount(EarthquakeCard, {
      props: {
        earthquake: { ...mockEarthquake, magnitude: 5.0 }
      },
      global: {
        plugins: [router]
      }
    })

    const chip = wrapper.find('.v-chip')
    expect(chip.attributes('style')).toContain('background-color: #f24949')
  })

  it('applies correct magnitude badge styling for medium magnitude', () => {
    const wrapper = mount(EarthquakeCard, {
      props: {
        earthquake: { ...mockEarthquake, magnitude: 3.0 }
      },
      global: {
        plugins: [router]
      }
    })

    const chip = wrapper.find('.v-chip')
    expect(chip.attributes('style')).toContain('background-color: #edf249')
  })

  it('applies correct magnitude badge styling for low magnitude', () => {
    const wrapper = mount(EarthquakeCard, {
      props: {
        earthquake: { ...mockEarthquake, magnitude: 2.0 }
      },
      global: {
        plugins: [router]
      }
    })

    const chip = wrapper.find('.v-chip')
    expect(chip.attributes('style')).toContain('background-color: #49a3f2')
  })
})
