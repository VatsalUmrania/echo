import React from 'react'
import { render, screen } from '@testing-library/react'
import { useAtomValue } from 'jotai'
import { WidgetView } from '../widget-view'
import '@testing-library/jest-dom'

// Mock jotai
jest.mock('jotai', () => ({
  useAtomValue: jest.fn(),
}))

// Mock all screen components
jest.mock('../../screens/widget-selection-screen', () => ({
  WidgetSelectionScreen: () => <div data-testid="selection-screen">Selection Screen</div>,
}))

jest.mock('../../screens/widget-chat-screen', () => ({
  WidgetChatScreen: () => <div data-testid="chat-screen">Chat Screen</div>,
}))

jest.mock('../../screens/widget-inbox-screen', () => ({
  WidgetInboxScreen: () => <div data-testid="inbox-screen">Inbox Screen</div>,
}))

jest.mock('../../screens/widget-voice-screen', () => ({
  WidgetVoiceScreen: () => <div data-testid="voice-screen">Voice Screen</div>,
}))

jest.mock('../../screens/widget-contact-screen', () => ({
  WidgetContactScreen: () => <div data-testid="contact-screen">Contact Screen</div>,
}))

jest.mock('../../screens/widget-auth-screen', () => ({
  WidgetAuthScreen: () => <div data-testid="auth-screen">Auth Screen</div>,
}))

jest.mock('../../screens/widget-error-screen', () => ({
  WidgetErrorScreen: () => <div data-testid="error-screen">Error Screen</div>,
}))

jest.mock('../../screens/widget-loading-screen', () => ({
  WidgetLoadingScreen: () => <div data-testid="loading-screen">Loading Screen</div>,
}))

describe('WidgetView', () => {
  const mockUseAtomValue = useAtomValue as jest.MockedFunction<typeof useAtomValue>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Screen Rendering', () => {
    it('should render selection screen when screen is "selection"', () => {
      mockUseAtomValue.mockReturnValue('selection')

      render(<WidgetView organizationId="test-org-123" />)

      expect(screen.getByTestId('selection-screen')).toBeInTheDocument()
      expect(screen.queryByTestId('chat-screen')).not.toBeInTheDocument()
      expect(screen.queryByTestId('inbox-screen')).not.toBeInTheDocument()
      expect(screen.queryByTestId('voice-screen')).not.toBeInTheDocument()
      expect(screen.queryByTestId('contact-screen')).not.toBeInTheDocument()
    })

    it('should render chat screen when screen is "chat"', () => {
      mockUseAtomValue.mockReturnValue('chat')

      render(<WidgetView organizationId="test-org-456" />)

      expect(screen.getByTestId('chat-screen')).toBeInTheDocument()
      expect(screen.queryByTestId('selection-screen')).not.toBeInTheDocument()
    })

    it('should render inbox screen when screen is "inbox"', () => {
      mockUseAtomValue.mockReturnValue('inbox')

      render(<WidgetView organizationId="test-org-789" />)

      expect(screen.getByTestId('inbox-screen')).toBeInTheDocument()
    })

    it('should render voice screen when screen is "voice"', () => {
      mockUseAtomValue.mockReturnValue('voice')

      render(<WidgetView organizationId="test-org-012" />)

      expect(screen.getByTestId('voice-screen')).toBeInTheDocument()
    })

    it('should render contact screen when screen is "contact"', () => {
      mockUseAtomValue.mockReturnValue('contact')

      render(<WidgetView organizationId="test-org-345" />)

      expect(screen.getByTestId('contact-screen')).toBeInTheDocument()
    })

    it('should render error screen when screen is "error"', () => {
      mockUseAtomValue.mockReturnValue('error')

      render(<WidgetView organizationId="test-org" />)

      expect(screen.getByTestId('error-screen')).toBeInTheDocument()
    })

    it('should render loading screen when screen is "loading"', () => {
      mockUseAtomValue.mockReturnValue('loading')

      render(<WidgetView organizationId="test-org" />)

      expect(screen.getByTestId('loading-screen')).toBeInTheDocument()
    })

    it('should render auth screen when screen is "auth"', () => {
      mockUseAtomValue.mockReturnValue('auth')

      render(<WidgetView organizationId="test-org" />)

      expect(screen.getByTestId('auth-screen')).toBeInTheDocument()
    })
  })

  describe('Props Handling', () => {
    it('should handle null organizationId', () => {
      mockUseAtomValue.mockReturnValue('selection')

      render(<WidgetView organizationId={null} />)

      expect(screen.getByTestId('selection-screen')).toBeInTheDocument()
    })

    it('should handle empty string organizationId', () => {
      mockUseAtomValue.mockReturnValue('chat')

      render(<WidgetView organizationId="" />)

      expect(screen.getByTestId('chat-screen')).toBeInTheDocument()
    })

    it('should handle very long organizationId', () => {
      mockUseAtomValue.mockReturnValue('inbox')

      const longOrgId = 'a'.repeat(1000)
      render(<WidgetView organizationId={longOrgId} />)

      expect(screen.getByTestId('inbox-screen')).toBeInTheDocument()
    })
  })

  describe('Layout Structure', () => {
    it('should render main element with correct classes', () => {
      mockUseAtomValue.mockReturnValue('selection')

      const { container } = render(<WidgetView organizationId="test-org" />)

      const mainElement = container.querySelector('main')
      expect(mainElement).toBeInTheDocument()
      expect(mainElement).toHaveClass('flex', 'h-full', 'w-full', 'flex-col', 'overflow-hidden', 'rounded-xl', 'border', 'bg-muted')
    })

    it('should not have min-h-screen or min-w-screen classes', () => {
      mockUseAtomValue.mockReturnValue('selection')

      const { container } = render(<WidgetView organizationId="test-org" />)

      const mainElement = container.querySelector('main')
      expect(mainElement).not.toHaveClass('min-h-screen')
      expect(mainElement).not.toHaveClass('min-w-screen')
    })

    it('should maintain consistent layout across all screens', () => {
      const screens = ['selection', 'chat', 'inbox', 'voice', 'contact', 'error', 'loading', 'auth'] as const

      screens.forEach(screen => {
        mockUseAtomValue.mockReturnValue(screen)
        const { container } = render(<WidgetView organizationId="test-org" />)
        
        const mainElement = container.querySelector('main')
        expect(mainElement).toHaveClass('flex', 'h-full', 'w-full', 'flex-col')
      })
    })
  })

  describe('Screen Transitions', () => {
    it('should transition between screens correctly', () => {
      const { rerender } = render(<WidgetView organizationId="test-org" />)

      mockUseAtomValue.mockReturnValue('selection')
      rerender(<WidgetView organizationId="test-org" />)
      expect(screen.getByTestId('selection-screen')).toBeInTheDocument()

      mockUseAtomValue.mockReturnValue('chat')
      rerender(<WidgetView organizationId="test-org" />)
      expect(screen.getByTestId('chat-screen')).toBeInTheDocument()
      expect(screen.queryByTestId('selection-screen')).not.toBeInTheDocument()

      mockUseAtomValue.mockReturnValue('contact')
      rerender(<WidgetView organizationId="test-org" />)
      expect(screen.getByTestId('contact-screen')).toBeInTheDocument()
      expect(screen.queryByTestId('chat-screen')).not.toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle undefined screen value gracefully', () => {
      mockUseAtomValue.mockReturnValue(undefined)

      const { container } = render(<WidgetView organizationId="test-org" />)

      const mainElement = container.querySelector('main')
      expect(mainElement).toBeInTheDocument()
    })

    it('should handle invalid screen value', () => {
      mockUseAtomValue.mockReturnValue('invalid-screen' as any)

      const { container } = render(<WidgetView organizationId="test-org" />)

      const mainElement = container.querySelector('main')
      expect(mainElement).toBeInTheDocument()
    })

    it('should re-render when organizationId changes', () => {
      mockUseAtomValue.mockReturnValue('selection')

      const { rerender } = render(<WidgetView organizationId="org-1" />)
      expect(screen.getByTestId('selection-screen')).toBeInTheDocument()

      rerender(<WidgetView organizationId="org-2" />)
      expect(screen.getByTestId('selection-screen')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should use semantic main element', () => {
      mockUseAtomValue.mockReturnValue('selection')

      const { container } = render(<WidgetView organizationId="test-org" />)

      const mainElement = container.querySelector('main')
      expect(mainElement?.tagName.toLowerCase()).toBe('main')
    })

    it('should maintain proper document structure', () => {
      mockUseAtomValue.mockReturnValue('chat')

      const { container } = render(<WidgetView organizationId="test-org" />)

      const mainElement = container.querySelector('main')
      expect(mainElement?.children.length).toBeGreaterThan(0)
    })
  })

  describe('CSS Classes Verification', () => {
    it('should have overflow-hidden class', () => {
      mockUseAtomValue.mockReturnValue('selection')

      const { container } = render(<WidgetView organizationId="test-org" />)

      const mainElement = container.querySelector('main')
      expect(mainElement).toHaveClass('overflow-hidden')
    })

    it('should have rounded-xl class for border radius', () => {
      mockUseAtomValue.mockReturnValue('selection')

      const { container } = render(<WidgetView organizationId="test-org" />)

      const mainElement = container.querySelector('main')
      expect(mainElement).toHaveClass('rounded-xl')
    })

    it('should have bg-muted class for background', () => {
      mockUseAtomValue.mockReturnValue('selection')

      const { container } = render(<WidgetView organizationId="test-org" />)

      const mainElement = container.querySelector('main')
      expect(mainElement).toHaveClass('bg-muted')
    })
  })
})