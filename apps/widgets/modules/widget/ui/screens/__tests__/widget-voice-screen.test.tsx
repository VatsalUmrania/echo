import React from 'react'
import { render, screen } from '@testing-library/react'
import { useAtomValue } from 'jotai'
import { WidgetVoiceScreen } from '../widget-voice-screen'
import '@testing-library/jest-dom'

// Mock jotai
jest.mock('jotai', () => ({
  useAtomValue: jest.fn(),
  useSetAtom: jest.fn(),
}))

// Mock AIConversation component
jest.mock('@workspace/ui/components/ai-conversation', () => ({
  AIConversation: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="ai-conversation" className={className}>
      {children}
    </div>
  ),
  AIMessage: ({ children, from }: { children: React.ReactNode; from: string }) => (
    <div data-testid={`ai-message-${from}`}>{children}</div>
  ),
}))

describe('WidgetVoiceScreen - CSS Class Changes', () => {
  const mockUseAtomValue = useAtomValue as jest.MockedFunction<typeof useAtomValue>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('AIConversation className Update', () => {
    it('should use "h-full" class without "flex-1" when transcript exists', () => {
      const mockTranscript = [
        { role: 'user', text: 'Hello' },
        { role: 'assistant', text: 'Hi there' },
      ]

      mockUseAtomValue.mockReturnValue(mockTranscript)

      const { container } = render(<WidgetVoiceScreen />)

      const aiConversation = screen.getByTestId('ai-conversation')
      expect(aiConversation).toBeInTheDocument()
      expect(aiConversation).toHaveClass('h-full')
    })

    it('should not have "flex-1" class on AIConversation', () => {
      const mockTranscript = [
        { role: 'user', text: 'Test message' },
      ]

      mockUseAtomValue.mockReturnValue(mockTranscript)

      const { container } = render(<WidgetVoiceScreen />)

      const aiConversation = screen.getByTestId('ai-conversation')
      expect(aiConversation).not.toHaveClass('flex-1')
    })

    it('should maintain h-full class with multiple messages', () => {
      const mockTranscript = [
        { role: 'user', text: 'Message 1' },
        { role: 'assistant', text: 'Response 1' },
        { role: 'user', text: 'Message 2' },
        { role: 'assistant', text: 'Response 2' },
      ]

      mockUseAtomValue.mockReturnValue(mockTranscript)

      render(<WidgetVoiceScreen />)

      const aiConversation = screen.getByTestId('ai-conversation')
      expect(aiConversation).toHaveClass('h-full')
      expect(aiConversation.className).toContain('h-full')
      expect(aiConversation.className).not.toContain('flex-1')
    })

    it('should render correctly with empty transcript', () => {
      mockUseAtomValue.mockReturnValue([])

      const { container } = render(<WidgetVoiceScreen />)

      // When transcript is empty, AIConversation should not be rendered
      const aiConversation = screen.queryByTestId('ai-conversation')
      expect(aiConversation).not.toBeInTheDocument()
    })

    it('should handle single message transcript', () => {
      const mockTranscript = [
        { role: 'user', text: 'Single message' },
      ]

      mockUseAtomValue.mockReturnValue(mockTranscript)

      render(<WidgetVoiceScreen />)

      const aiConversation = screen.getByTestId('ai-conversation')
      expect(aiConversation).toHaveClass('h-full')
    })
  })

  describe('Layout and Styling', () => {
    it('should maintain proper height constraint', () => {
      const mockTranscript = [
        { role: 'user', text: 'Test' },
      ]

      mockUseAtomValue.mockReturnValue(mockTranscript)

      render(<WidgetVoiceScreen />)

      const aiConversation = screen.getByTestId('ai-conversation')
      
      // h-full should take full height of parent
      expect(aiConversation).toHaveClass('h-full')
    })

    it('should not affect other elements layout', () => {
      const mockTranscript = [
        { role: 'user', text: 'Test message' },
      ]

      mockUseAtomValue.mockReturnValue(mockTranscript)

      const { container } = render(<WidgetVoiceScreen />)

      const aiConversation = screen.getByTestId('ai-conversation')
      
      // Should only have h-full, not flex-1
      const classList = Array.from(aiConversation.classList)
      expect(classList).toContain('h-full')
      expect(classList).not.toContain('flex-1')
    })

    it('should work with long conversation history', () => {
      const longTranscript = Array.from({ length: 50 }, (_, i) => ({
        role: i % 2 === 0 ? 'user' : 'assistant',
        text: `Message ${i}`,
      }))

      mockUseAtomValue.mockReturnValue(longTranscript)

      render(<WidgetVoiceScreen />)

      const aiConversation = screen.getByTestId('ai-conversation')
      expect(aiConversation).toHaveClass('h-full')
      expect(aiConversation).not.toHaveClass('flex-1')
    })
  })

  describe('Message Rendering', () => {
    it('should render all messages with correct className', () => {
      const mockTranscript = [
        { role: 'user', text: 'Hello' },
        { role: 'assistant', text: 'Hi' },
        { role: 'user', text: 'How are you?' },
      ]

      mockUseAtomValue.mockReturnValue(mockTranscript)

      render(<WidgetVoiceScreen />)

      const userMessages = screen.getAllByTestId(/ai-message-user/)
      const assistantMessages = screen.getAllByTestId(/ai-message-assistant/)

      expect(userMessages).toHaveLength(2)
      expect(assistantMessages).toHaveLength(1)
    })

    it('should maintain message order with updated className', () => {
      const mockTranscript = [
        { role: 'user', text: 'First' },
        { role: 'assistant', text: 'Second' },
        { role: 'user', text: 'Third' },
      ]

      mockUseAtomValue.mockReturnValue(mockTranscript)

      render(<WidgetVoiceScreen />)

      const messages = screen.getAllByTestId(/ai-message-/)
      expect(messages).toHaveLength(3)
    })
  })

  describe('Edge Cases', () => {
    it('should handle undefined transcript', () => {
      mockUseAtomValue.mockReturnValue(undefined)

      const { container } = render(<WidgetVoiceScreen />)

      // Component should still render without crashing
      expect(container).toBeInTheDocument()
    })

    it('should handle null transcript', () => {
      mockUseAtomValue.mockReturnValue(null)

      const { container } = render(<WidgetVoiceScreen />)

      expect(container).toBeInTheDocument()
    })

    it('should handle transcript with mixed message types', () => {
      const mockTranscript = [
        { role: 'user', text: 'User message' },
        { role: 'assistant', text: 'Assistant response' },
        { role: 'system', text: 'System message' },
      ]

      mockUseAtomValue.mockReturnValue(mockTranscript)

      render(<WidgetVoiceScreen />)

      const aiConversation = screen.getByTestId('ai-conversation')
      expect(aiConversation).toHaveClass('h-full')
    })

    it('should handle messages with special characters', () => {
      const mockTranscript = [
        { role: 'user', text: 'Hello <script>alert("test")</script>' },
        { role: 'assistant', text: 'Response with "quotes" and \'apostrophes\'' },
      ]

      mockUseAtomValue.mockReturnValue(mockTranscript)

      render(<WidgetVoiceScreen />)

      const aiConversation = screen.getByTestId('ai-conversation')
      expect(aiConversation).toHaveClass('h-full')
      expect(aiConversation).not.toHaveClass('flex-1')
    })
  })

  describe('Comparison with Previous Implementation', () => {
    it('should not contain the old "flex-1" class', () => {
      const mockTranscript = [
        { role: 'user', text: 'Test' },
      ]

      mockUseAtomValue.mockReturnValue(mockTranscript)

      render(<WidgetVoiceScreen />)

      const aiConversation = screen.getByTestId('ai-conversation')
      
      // Verify the exact className string
      const classNameStr = aiConversation.className
      expect(classNameStr).toContain('h-full')
      expect(classNameStr).not.toContain('flex-1')
    })

    it('should maintain backward compatibility for other features', () => {
      const mockTranscript = [
        { role: 'user', text: 'Test message' },
        { role: 'assistant', text: 'Test response' },
      ]

      mockUseAtomValue.mockReturnValue(mockTranscript)

      const { container } = render(<WidgetVoiceScreen />)

      // All messages should still render correctly
      const messages = screen.getAllByTestId(/ai-message-/)
      expect(messages.length).toBe(2)

      // AIConversation should still be present
      const aiConversation = screen.getByTestId('ai-conversation')
      expect(aiConversation).toBeInTheDocument()
    })
  })

  describe('Responsive Behavior', () => {
    it('should maintain h-full on different viewport sizes', () => {
      const mockTranscript = [
        { role: 'user', text: 'Test' },
      ]

      mockUseAtomValue.mockReturnValue(mockTranscript)

      render(<WidgetVoiceScreen />)

      const aiConversation = screen.getByTestId('ai-conversation')
      expect(aiConversation).toHaveClass('h-full')
    })

    it('should handle dynamic content updates', () => {
      const { rerender } = render(<WidgetVoiceScreen />)

      // Start with one message
      mockUseAtomValue.mockReturnValue([
        { role: 'user', text: 'First' },
      ])
      rerender(<WidgetVoiceScreen />)

      let aiConversation = screen.getByTestId('ai-conversation')
      expect(aiConversation).toHaveClass('h-full')

      // Add more messages
      mockUseAtomValue.mockReturnValue([
        { role: 'user', text: 'First' },
        { role: 'assistant', text: 'Second' },
        { role: 'user', text: 'Third' },
      ])
      rerender(<WidgetVoiceScreen />)

      aiConversation = screen.getByTestId('ai-conversation')
      expect(aiConversation).toHaveClass('h-full')
      expect(aiConversation).not.toHaveClass('flex-1')
    })
  })
})