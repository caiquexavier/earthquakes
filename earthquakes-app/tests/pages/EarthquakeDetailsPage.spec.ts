import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import EarthquakeDetailsPage from '../../src/pages/EarthquakeDetailsPage.vue'
import type { GeoJsonFeature } from '../../src/types/earthquake'

// Mock the earthquakes service
vi.mock('../../src/services/earthquakes', () => ({
  fetchDetail: vi.fn(() => Promise.resolve(mockFeature))
}))

// Mock DetailMapCard component
vi.mock('../../src/components/map/DetailMapCard.vue', () => ({
  default: {
    name: 'DetailMapCard',
    template: '<div data-testid="detail-map-card">DetailMapCard</div>',
    props: ['lat', 'lon', 'depthKm', 'zoom']
  }
}))

// Mock HeaderUserInfo component
vi.mock('../../src/components/layout/HeaderUserInfo.vue', () => ({
  default: {
    name: 'HeaderUserInfo',
    template: '<div data-testid="header-user-info">HeaderUserInfo</div>'
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

const mockFeature: GeoJsonFeature = {
  type: 'Feature',
  id: 'test-1',
  properties: {
    mag: 4.5,
    place: 'Test Location',
    time: Date.now(),
    updated: Date.now(),
    status: 'reviewed',
    tsunami: 0,
    sig: 100,
    net: 'us',
    code: '12345678',
    types: 'origin,phase-data',
    url: 'https://example.com',
    title: 'M 4.5 - Test Location'
  },
  geometry: {
    type: 'Point',
    coordinates: [-74.0060, 40.7128, 10.5]
  }
}

describe('EarthquakeDetailsPage', () => {
  it('renders without crashing', () => {
    const wrapper = mount(EarthquakeDetailsPage, {
      global: {
        plugins: [router],
        mocks: {
          $route: {
            query: { detail: 'https://example.com/detail' }
          }
        }
      }
    })

    expect(wrapper.exists()).toBe(true)
    // No title/heading should be present
    expect(wrapper.find('h1').exists()).toBe(false)
    // Should have back button
    expect(wrapper.find('.back-button').exists()).toBe(true)
  })

  it('displays loading state without text', () => {
    const wrapper = mount(EarthquakeDetailsPage, {
      global: {
        plugins: [router],
        mocks: {
          $route: {
            query: { detail: 'https://example.com/detail' }
          }
        }
      }
    })

    // Should show loading spinner but no text
    expect(wrapper.find('.v-progress-circular').exists()).toBe(true)
    expect(wrapper.text()).not.toContain('Loading earthquake details')
  })

  it('renders 2-column layout when data is loaded', async () => {
    const wrapper = mount(EarthquakeDetailsPage, {
      global: {
        plugins: [router],
        mocks: {
          $route: {
            query: { detail: 'https://example.com/detail' }
          }
        }
      }
    })

    // Wait for async operations
    await wrapper.vm.$nextTick()
    
    // Should have 2 columns
    const columns = wrapper.findAll('.v-col')
    expect(columns.length).toBeGreaterThanOrEqual(2)
  })

  it('displays GeoJSON data in expandable panel', async () => {
    const wrapper = mount(EarthquakeDetailsPage, {
      global: {
        plugins: [router],
        mocks: {
          $route: {
            query: { detail: 'https://example.com/detail' }
          }
        }
      }
    })

    await wrapper.vm.$nextTick()
    
    // Should have expansion panel for GeoJSON
    expect(wrapper.find('.v-expansion-panels').exists()).toBe(true)
    expect(wrapper.text()).toContain('View Complete GeoJSON')
  })

  it('shows error state when detail URL is missing', () => {
    const wrapper = mount(EarthquakeDetailsPage, {
      global: {
        plugins: [router],
        mocks: {
          $route: {
            query: {}
          }
        }
      }
    })

    expect(wrapper.find('.v-alert').exists()).toBe(true)
    expect(wrapper.text()).toContain('Failed to load earthquake')
  })
})
