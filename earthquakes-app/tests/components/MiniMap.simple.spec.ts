import { describe, it, expect } from 'vitest'

// Simple test to verify the component can be imported
describe('MiniMap Component', () => {
  it('can be imported without errors', async () => {
    const { default: MiniMap } = await import('../../src/components/MiniMap.vue')
    expect(MiniMap).toBeDefined()
    expect(MiniMap.name).toBe('MiniMap')
  })

  it('has required props defined', async () => {
    const { default: MiniMap } = await import('../../src/components/MiniMap.vue')
    expect(MiniMap.props).toBeDefined()
    expect(MiniMap.props.lat).toBeDefined()
    expect(MiniMap.props.lon).toBeDefined()
  })
})
