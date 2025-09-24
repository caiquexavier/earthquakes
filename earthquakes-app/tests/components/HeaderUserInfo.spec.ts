import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HeaderUserInfo from '../../src/components/layout/HeaderUserInfo.vue'

describe('HeaderUserInfo', () => {
  it('renders without crashing', () => {
    const wrapper = mount(HeaderUserInfo)
    expect(wrapper.exists()).toBe(true)
  })

  it('does not display app title text', () => {
    const wrapper = mount(HeaderUserInfo)
    expect(wrapper.text()).not.toContain('earthquakes-app')
  })

  it('displays the logo', () => {
    const wrapper = mount(HeaderUserInfo)
    const logo = wrapper.find('img[alt="Earthquakes App Logo"]')
    expect(logo.exists()).toBe(true)
    expect(logo.classes()).toContain('logo')
  })

  it('has proper logo styling', () => {
    const wrapper = mount(HeaderUserInfo)
    const logo = wrapper.find('.logo')
    expect(logo.exists()).toBe(true)
    expect(logo.attributes('alt')).toBe('Earthquakes App Logo')
  })

  it('displays user menu', () => {
    const wrapper = mount(HeaderUserInfo)
    expect(wrapper.find('.v-menu').exists()).toBe(true)
    expect(wrapper.text()).toContain('John Doe')
  })

  it('has logo container for centering', () => {
    const wrapper = mount(HeaderUserInfo)
    const logoContainer = wrapper.find('.logo-container')
    expect(logoContainer.exists()).toBe(true)
  })

  it('has proper logo dimensions', () => {
    const wrapper = mount(HeaderUserInfo)
    const logo = wrapper.find('.logo')
    expect(logo.exists()).toBe(true)
    expect(logo.attributes('alt')).toBe('Earthquakes App Logo')
    // Logo should have 40px height and auto width to maintain aspect ratio
    expect(logo.element.style.height).toBe('40px')
    expect(logo.element.style.width).toBe('auto')
  })
})
