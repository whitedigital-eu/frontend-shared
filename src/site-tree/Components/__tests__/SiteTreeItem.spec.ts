import { render } from '@testing-library/vue'
import SiteTreeItem from '../SiteTreeItem.vue'
import { mockProjectSettings } from '../../TestUtils/mocks'
import { vi } from 'vitest'

// Mock router-link component
vi.mock('vue-router', () => ({
  RouterLink: vi.fn()
}))

// Add global component
import { config } from '@vue/test-utils'
config.global.components = {
  'router-link': {
    name: 'RouterLink',
    props: ['to'],
    template: '<a><slot /></a>'
  }
}

describe('SiteTreeItem', () => {
  it('correctly renders a hidden, invisible item', () => {
    const screen = render(SiteTreeItem, {
      props: {
        node: {
          id: 1,
          title: 'Gallery',
          children: [],
          isActive: false,
          isVisible: false,
        },
        hasChildren: false,
        isOpen: false,
        isSelected: false,
        projectSettings: mockProjectSettings,
      },
    })

    expect(screen.findByText('Gallery')).toBeTruthy()
    expect(screen.getByTestId('invisible-badge')).toBeTruthy()
    expect(screen.getByTestId('inactive-badge')).toBeTruthy()
  })

  it('correctly renders a visible, active item', () => {
    const screen = render(SiteTreeItem, {
      props: {
        node: {
          id: 1,
          title: 'Gallery',
          children: [],
          isActive: true,
          isVisible: true,
        },
        hasChildren: false,
        isOpen: false,
        isSelected: false,
        projectSettings: mockProjectSettings,
      },
    })

    expect(screen.findByText('Gallery')).toBeTruthy()
    expect(screen.queryByTestId('invisible-badge')).toBeNull()
    expect(screen.queryByTestId('inactive-badge')).toBeNull()
  })

  it('emits correct events when buttons clicked', () => {
    const screen = render(SiteTreeItem, {
      props: {
        node: {
          id: 1,
          title: 'Gallery',
          children: [],
          isActive: true,
          isVisible: true,
        },
        hasChildren: false,
        isOpen: false,
        isSelected: false,
        projectSettings: mockProjectSettings,
      },
    })

    ;['edit', 'duplicate', 'add', 'delete'].forEach((btn) => {
      screen.getByTestId(`btn-${btn}`).click()
      const emitted = screen.emitted()
      expect(emitted).toHaveProperty(`click:${btn}`)
      expect(emitted[`click:${btn}`]).toHaveLength(1)
    })
  })
})
