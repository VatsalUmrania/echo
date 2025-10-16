import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useAtomValue, useSetAtom } from 'jotai'
import { WidgetContactScreen } from '../widget-contact-screen'
import '@testing-library/jest-dom'

// Mock jotai hooks
jest.mock('jotai', () => ({
  useAtomValue: jest.fn(),
  useSetAtom: jest.fn(),
}))

// Mock Next.js Link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
})

describe('WidgetContactScreen', () => {
  const mockSetScreen = jest.fn()
  const mockUseSetAtom = useSetAtom as jest.MockedFunction<typeof useSetAtom>
  const mockUseAtomValue = useAtomValue as jest.MockedFunction<typeof useAtomValue>

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseSetAtom.mockReturnValue(mockSetScreen)
    
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn(() => Promise.resolve()),
      },
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Component Rendering', () => {
    it('should render the contact screen with phone number', () => {
      const phoneNumber = '+1234567890'
      mockUseAtomValue.mockReturnValue({
        vapiSetting: { phoneNumber },
      })

      render(<WidgetContactScreen />)

      expect(screen.getByText('Contact Us')).toBeInTheDocument()
      expect(screen.getByText(phoneNumber)).toBeInTheDocument()
      expect(screen.getByText('Available 24/7')).toBeInTheDocument()
    })

    it('should render back button with ArrowLeftIcon', () => {
      mockUseAtomValue.mockReturnValue({
        vapiSetting: { phoneNumber: '+1234567890' },
      })

      render(<WidgetContactScreen />)

      const backButton = screen.getByRole('button', { name: /arrow/i })
      expect(backButton).toBeInTheDocument()
    })

    it('should render copy and call buttons', () => {
      mockUseAtomValue.mockReturnValue({
        vapiSetting: { phoneNumber: '+1234567890' },
      })

      render(<WidgetContactScreen />)

      expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /call now/i })).toBeInTheDocument()
    })

    it('should render phone icon in the center section', () => {
      mockUseAtomValue.mockReturnValue({
        vapiSetting: { phoneNumber: '+1234567890' },
      })

      const { container } = render(<WidgetContactScreen />)

      // Phone icon should be present
      const phoneIcons = container.querySelectorAll('svg')
      expect(phoneIcons.length).toBeGreaterThan(0)
    })
  })

  describe('Navigation', () => {
    it('should call setScreen with "selection" when back button is clicked', () => {
      mockUseAtomValue.mockReturnValue({
        vapiSetting: { phoneNumber: '+1234567890' },
      })

      render(<WidgetContactScreen />)

      const backButton = screen.getByRole('button', { name: /arrow/i })
      fireEvent.click(backButton)

      expect(mockSetScreen).toHaveBeenCalledWith('selection')
      expect(mockSetScreen).toHaveBeenCalledTimes(1)
    })
  })

  describe('Copy Functionality', () => {
    it('should copy phone number to clipboard when copy button is clicked', async () => {
      const phoneNumber = '+1234567890'
      mockUseAtomValue.mockReturnValue({
        vapiSetting: { phoneNumber },
      })

      render(<WidgetContactScreen />)

      const copyButton = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(copyButton)

      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(phoneNumber)
      })
    })

    it('should show "Copied" text with CheckIcon after successful copy', async () => {
      mockUseAtomValue.mockReturnValue({
        vapiSetting: { phoneNumber: '+1234567890' },
      })

      render(<WidgetContactScreen />)

      const copyButton = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(copyButton)

      await waitFor(() => {
        expect(screen.getByText('Copied')).toBeInTheDocument()
      })
    })

    it('should revert to "Copy" text after 2 seconds', async () => {
      jest.useFakeTimers()
      mockUseAtomValue.mockReturnValue({
        vapiSetting: { phoneNumber: '+1234567890' },
      })

      render(<WidgetContactScreen />)

      const copyButton = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(copyButton)

      await waitFor(() => {
        expect(screen.getByText('Copied')).toBeInTheDocument()
      })

      // Fast-forward time by 2 seconds
      jest.advanceTimersByTime(2000)

      await waitFor(() => {
        expect(screen.getByText('Copy')).toBeInTheDocument()
      })

      jest.useRealTimers()
    })

    it('should handle copy error gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      const error = new Error('Copy failed')
      
      Object.assign(navigator, {
        clipboard: {
          writeText: jest.fn(() => Promise.reject(error)),
        },
      })

      mockUseAtomValue.mockReturnValue({
        vapiSetting: { phoneNumber: '+1234567890' },
      })

      render(<WidgetContactScreen />)

      const copyButton = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(copyButton)

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(error)
      })

      consoleErrorSpy.mockRestore()
    })

    it('should not copy when phone number is undefined', async () => {
      mockUseAtomValue.mockReturnValue({
        vapiSetting: {},
      })

      render(<WidgetContactScreen />)

      const copyButton = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(copyButton)

      await waitFor(() => {
        expect(navigator.clipboard.writeText).not.toHaveBeenCalled()
      })
    })

    it('should not copy when phone number is null', async () => {
      mockUseAtomValue.mockReturnValue({
        vapiSetting: { phoneNumber: null },
      })

      render(<WidgetContactScreen />)

      const copyButton = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(copyButton)

      await waitFor(() => {
        expect(navigator.clipboard.writeText).not.toHaveBeenCalled()
      })
    })
  })

  describe('Call Functionality', () => {
    it('should render call now link with correct tel: href', () => {
      const phoneNumber = '+1234567890'
      mockUseAtomValue.mockReturnValue({
        vapiSetting: { phoneNumber },
      })

      render(<WidgetContactScreen />)

      const callLink = screen.getByRole('link', { name: /call now/i })
      expect(callLink).toHaveAttribute('href', `tel:${phoneNumber}`)
    })

    it('should handle phone number with special characters', () => {
      const phoneNumber = '+1 (234) 567-8900'
      mockUseAtomValue.mockReturnValue({
        vapiSetting: { phoneNumber },
      })

      render(<WidgetContactScreen />)

      const callLink = screen.getByRole('link', { name: /call now/i })
      expect(callLink).toHaveAttribute('href', `tel:${phoneNumber}`)
    })
  })

  describe('Edge Cases', () => {
    it('should handle missing widgetSettings gracefully', () => {
      mockUseAtomValue.mockReturnValue(null)

      render(<WidgetContactScreen />)

      expect(screen.getByText('Contact Us')).toBeInTheDocument()
      expect(screen.getByText('Available 24/7')).toBeInTheDocument()
    })

    it('should handle missing vapiSetting gracefully', () => {
      mockUseAtomValue.mockReturnValue({})

      render(<WidgetContactScreen />)

      expect(screen.getByText('Contact Us')).toBeInTheDocument()
    })

    it('should render with empty string phone number', () => {
      mockUseAtomValue.mockReturnValue({
        vapiSetting: { phoneNumber: '' },
      })

      render(<WidgetContactScreen />)

      expect(screen.getByText('Contact Us')).toBeInTheDocument()
    })

    it('should handle very long phone numbers', () => {
      const longPhoneNumber = '+123456789012345678901234567890'
      mockUseAtomValue.mockReturnValue({
        vapiSetting: { phoneNumber: longPhoneNumber },
      })

      render(<WidgetContactScreen />)

      expect(screen.getByText(longPhoneNumber)).toBeInTheDocument()
    })

    it('should handle international phone numbers', () => {
      const phoneNumber = '+44 20 7946 0958'
      mockUseAtomValue.mockReturnValue({
        vapiSetting: { phoneNumber },
      })

      render(<WidgetContactScreen />)

      expect(screen.getByText(phoneNumber)).toBeInTheDocument()
    })
  })

  describe('UI Structure', () => {
    it('should have correct layout structure', () => {
      mockUseAtomValue.mockReturnValue({
        vapiSetting: { phoneNumber: '+1234567890' },
      })

      const { container } = render(<WidgetContactScreen />)

      // Should have header section
      const header = container.querySelector('div.flex.items-center.gap-x-2')
      expect(header).toBeInTheDocument()

      // Should have footer with buttons
      const footer = container.querySelector('.border-t.bg-background.p-4')
      expect(footer).toBeInTheDocument()
    })

    it('should apply correct styling classes', () => {
      mockUseAtomValue.mockReturnValue({
        vapiSetting: { phoneNumber: '+1234567890' },
      })

      const { container } = render(<WidgetContactScreen />)

      // Check for main content section with proper flex layout
      const mainContent = container.querySelector('.flex.h-full.flex-col.items-center.justify-center.gap-y-4')
      expect(mainContent).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have accessible button labels', () => {
      mockUseAtomValue.mockReturnValue({
        vapiSetting: { phoneNumber: '+1234567890' },
      })

      render(<WidgetContactScreen />)

      const copyButton = screen.getByRole('button', { name: /copy/i })
      expect(copyButton).toBeVisible()

      const callLink = screen.getByRole('link', { name: /call now/i })
      expect(callLink).toBeVisible()
    })

    it('should maintain focus management', () => {
      mockUseAtomValue.mockReturnValue({
        vapiSetting: { phoneNumber: '+1234567890' },
      })

      render(<WidgetContactScreen />)

      const backButton = screen.getByRole('button', { name: /arrow/i })
      backButton.focus()
      expect(backButton).toHaveFocus()
    })
  })

  describe('Button Interactions', () => {
    it('should handle multiple rapid clicks on copy button', async () => {
      jest.useFakeTimers()
      mockUseAtomValue.mockReturnValue({
        vapiSetting: { phoneNumber: '+1234567890' },
      })

      render(<WidgetContactScreen />)

      const copyButton = screen.getByRole('button', { name: /copy/i })
      
      // Click multiple times rapidly
      fireEvent.click(copyButton)
      fireEvent.click(copyButton)
      fireEvent.click(copyButton)

      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalled()
      })

      jest.useRealTimers()
    })

    it('should handle multiple clicks on back button', () => {
      mockUseAtomValue.mockReturnValue({
        vapiSetting: { phoneNumber: '+1234567890' },
      })

      render(<WidgetContactScreen />)

      const backButton = screen.getByRole('button', { name: /arrow/i })
      
      fireEvent.click(backButton)
      fireEvent.click(backButton)

      expect(mockSetScreen).toHaveBeenCalledTimes(2)
      expect(mockSetScreen).toHaveBeenCalledWith('selection')
    })
  })
})