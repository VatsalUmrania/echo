import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { useAtomValue, useSetAtom } from 'jotai'
import { WidgetSelectionScreen } from '../widget-selection-screen'
import '@testing-library/jest-dom'

// Mock jotai hooks
jest.mock('jotai', () => ({
  useAtomValue: jest.fn(),
  useSetAtom: jest.fn(),
}))

describe('WidgetSelectionScreen - Contact Button Changes', () => {
  const mockSetScreen = jest.fn()
  const mockUseSetAtom = useSetAtom as jest.MockedFunction<typeof useSetAtom>
  const mockUseAtomValue = useAtomValue as jest.MockedFunction<typeof useAtomValue>

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseSetAtom.mockReturnValue(mockSetScreen)
    mockUseAtomValue.mockReturnValue({
      vapiSetting: { phoneNumber: '+1234567890' },
    })
  })

  describe('Contact Button Text Update', () => {
    it('should display "Contact Us" instead of "Start Voice Call"', () => {
      render(<WidgetSelectionScreen />)

      expect(screen.getByText('Contact Us')).toBeInTheDocument()
      expect(screen.queryByText('Start Voice Call')).not.toBeInTheDocument()
    })

    it('should navigate to contact screen when contact button is clicked', () => {
      render(<WidgetSelectionScreen />)

      const contactButton = screen.getByText('Contact Us').closest('button')
      expect(contactButton).toBeInTheDocument()
      
      if (contactButton) {
        fireEvent.click(contactButton)
        expect(mockSetScreen).toHaveBeenCalledWith('contact')
      }
    })

    it('should have PhoneCallIcon next to "Contact Us" text', () => {
      const { container } = render(<WidgetSelectionScreen />)

      const contactButton = screen.getByText('Contact Us').closest('button')
      expect(contactButton).toBeInTheDocument()

      // Check that the button contains an icon (svg element)
      const icon = contactButton?.querySelector('svg')
      expect(icon).toBeInTheDocument()
    })

    it('should have ChevronRightIcon on the contact button', () => {
      const { container } = render(<WidgetSelectionScreen />)

      const contactButton = screen.getByText('Contact Us').closest('button')
      
      // Should have multiple icons (PhoneCall and ChevronRight)
      const icons = contactButton?.querySelectorAll('svg')
      expect(icons?.length).toBeGreaterThan(1)
    })

    it('should maintain button styling and layout', () => {
      const { container } = render(<WidgetSelectionScreen />)

      const contactButton = screen.getByText('Contact Us').closest('button')
      
      // Check button has proper flex layout
      const buttonContent = contactButton?.querySelector('.flex.items-center.gap-x-2')
      expect(buttonContent).toBeInTheDocument()
    })
  })

  describe('Button Interactions', () => {
    it('should be clickable and call setScreen with "contact"', () => {
      render(<WidgetSelectionScreen />)

      const contactButton = screen.getByText('Contact Us').closest('button')
      
      if (contactButton) {
        fireEvent.click(contactButton)
        expect(mockSetScreen).toHaveBeenCalledTimes(1)
        expect(mockSetScreen).toHaveBeenCalledWith('contact')
      }
    })

    it('should handle multiple clicks correctly', () => {
      render(<WidgetSelectionScreen />)

      const contactButton = screen.getByText('Contact Us').closest('button')
      
      if (contactButton) {
        fireEvent.click(contactButton)
        fireEvent.click(contactButton)
        fireEvent.click(contactButton)
        
        expect(mockSetScreen).toHaveBeenCalledTimes(3)
        expect(mockSetScreen).toHaveBeenCalledWith('contact')
      }
    })

    it('should be keyboard accessible', () => {
      render(<WidgetSelectionScreen />)

      const contactButton = screen.getByText('Contact Us').closest('button')
      
      if (contactButton) {
        contactButton.focus()
        expect(contactButton).toHaveFocus()

        fireEvent.keyDown(contactButton, { key: 'Enter' })
        expect(mockSetScreen).toHaveBeenCalled()
      }
    })
  })

  describe('Visual Consistency', () => {
    it('should have consistent button structure with other selection buttons', () => {
      const { container } = render(<WidgetSelectionScreen />)

      // Get all buttons in the selection screen
      const buttons = container.querySelectorAll('button')
      
      // Contact button should exist and have similar structure
      const contactButton = screen.getByText('Contact Us').closest('button')
      expect(contactButton).toBeInTheDocument()
      
      // Should have gap-x-2 class for consistent spacing
      const buttonContent = contactButton?.querySelector('.gap-x-2')
      expect(buttonContent).toBeInTheDocument()
    })

    it('should maintain text and icon alignment', () => {
      const { container } = render(<WidgetSelectionScreen />)

      const contactButton = screen.getByText('Contact Us').closest('button')
      const buttonContent = contactButton?.querySelector('.flex.items-center')
      
      expect(buttonContent).toBeInTheDocument()
      expect(buttonContent).toHaveClass('items-center')
    })
  })

  describe('Text Content Verification', () => {
    it('should use exact text "Contact Us"', () => {
      render(<WidgetSelectionScreen />)

      const contactText = screen.getByText('Contact Us')
      expect(contactText.textContent).toBe('Contact Us')
    })

    it('should not contain old text "Start Voice Call"', () => {
      render(<WidgetSelectionScreen />)

      expect(screen.queryByText('Start Voice Call')).not.toBeInTheDocument()
      expect(screen.queryByText(/start voice call/i)).not.toBeInTheDocument()
    })
  })

  describe('Integration with Widget Flow', () => {
    it('should integrate properly with the selection screen flow', () => {
      mockUseAtomValue.mockReturnValue({
        vapiSetting: { phoneNumber: '+1234567890' },
      })

      render(<WidgetSelectionScreen />)

      const contactButton = screen.getByText('Contact Us').closest('button')
      
      if (contactButton) {
        fireEvent.click(contactButton)
        
        // Verify it sets the screen to 'contact' which should lead to WidgetContactScreen
        expect(mockSetScreen).toHaveBeenCalledWith('contact')
      }
    })

    it('should work when phone number is available', () => {
      mockUseAtomValue.mockReturnValue({
        vapiSetting: { phoneNumber: '+1-800-555-0123' },
      })

      render(<WidgetSelectionScreen />)

      const contactButton = screen.getByText('Contact Us')
      expect(contactButton).toBeInTheDocument()
    })

    it('should still render when phone number is missing', () => {
      mockUseAtomValue.mockReturnValue({
        vapiSetting: {},
      })

      render(<WidgetSelectionScreen />)

      const contactButton = screen.getByText('Contact Us')
      expect(contactButton).toBeInTheDocument()
    })
  })
})