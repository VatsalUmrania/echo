import React from 'react'
import { render } from '@testing-library/react'
import RootLayout from '../layout'
import '@testing-library/jest-dom'

// Mock the Providers component
jest.mock('../providers', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="providers">{children}</div>
  ),
}))

// Mock next/font/google
jest.mock('next/font/google', () => ({
  Inter: () => ({
    variable: '--font-sans',
  }),
  JetBrains_Mono: () => ({
    variable: '--font-mono',
  }),
}))

describe('RootLayout - Wrapper Div Changes', () => {
  const mockChildren = <div data-testid="child-content">Test Content</div>

  describe('Layout Structure', () => {
    it('should wrap children in a div with w-screen and h-screen classes', () => {
      const { container } = render(
        <RootLayout>{mockChildren}</RootLayout>
      )

      const wrapperDiv = container.querySelector('.w-screen.h-screen')
      expect(wrapperDiv).toBeInTheDocument()
    })

    it('should render children inside the wrapper div', () => {
      const { getByTestId } = render(
        <RootLayout>{mockChildren}</RootLayout>
      )

      const childContent = getByTestId('child-content')
      expect(childContent).toBeInTheDocument()
      
      // Check that child is inside the wrapper
      const wrapperDiv = childContent.closest('.w-screen.h-screen')
      expect(wrapperDiv).toBeInTheDocument()
    })

    it('should nest wrapper div inside Providers', () => {
      const { getByTestId } = render(
        <RootLayout>{mockChildren}</RootLayout>
      )

      const providers = getByTestId('providers')
      const wrapperDiv = providers.querySelector('.w-screen.h-screen')
      
      expect(providers).toBeInTheDocument()
      expect(wrapperDiv).toBeInTheDocument()
    })
  })

  describe('CSS Classes', () => {
    it('should have exactly w-screen and h-screen classes on wrapper', () => {
      const { container } = render(
        <RootLayout>{mockChildren}</RootLayout>
      )

      const wrapperDiv = container.querySelector('div.w-screen.h-screen')
      expect(wrapperDiv).toHaveClass('w-screen')
      expect(wrapperDiv).toHaveClass('h-screen')
    })

    it('should maintain body classes', () => {
      const { container } = render(
        <RootLayout>{mockChildren}</RootLayout>
      )

      const body = container.querySelector('body')
      expect(body).toHaveClass('font-sans')
      expect(body).toHaveClass('antialiased')
    })

    it('should include font variables in body className', () => {
      const { container } = render(
        <RootLayout>{mockChildren}</RootLayout>
      )

      const body = container.querySelector('body')
      const bodyClasses = body?.className || ''
      
      expect(bodyClasses).toContain('font-sans')
      expect(bodyClasses).toContain('antialiased')
    })
  })

  describe('HTML Structure', () => {
    it('should render valid HTML structure', () => {
      const { container } = render(
        <RootLayout>{mockChildren}</RootLayout>
      )

      const html = container.querySelector('html')
      const body = container.querySelector('body')
      
      expect(html).toBeInTheDocument()
      expect(body).toBeInTheDocument()
      expect(html?.getAttribute('lang')).toBe('en')
    })

    it('should set lang attribute to "en"', () => {
      const { container } = render(
        <RootLayout>{mockChildren}</RootLayout>
      )

      const html = container.querySelector('html')
      expect(html).toHaveAttribute('lang', 'en')
    })

    it('should suppress hydration warning on html element', () => {
      const { container } = render(
        <RootLayout>{mockChildren}</RootLayout>
      )

      const html = container.querySelector('html')
      expect(html).toHaveAttribute('suppressHydrationWarning')
    })
  })

  describe('Children Rendering', () => {
    it('should render single child component', () => {
      const { getByTestId } = render(
        <RootLayout>
          <div data-testid="single-child">Single Child</div>
        </RootLayout>
      )

      expect(getByTestId('single-child')).toBeInTheDocument()
    })

    it('should render multiple children', () => {
      const { getByTestId } = render(
        <RootLayout>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
          <div data-testid="child-3">Child 3</div>
        </RootLayout>
      )

      expect(getByTestId('child-1')).toBeInTheDocument()
      expect(getByTestId('child-2')).toBeInTheDocument()
      expect(getByTestId('child-3')).toBeInTheDocument()
    })

    it('should handle complex nested children', () => {
      const { getByTestId } = render(
        <RootLayout>
          <div data-testid="parent">
            <div data-testid="nested-child">
              <span data-testid="deeply-nested">Deep</span>
            </div>
          </div>
        </RootLayout>
      )

      expect(getByTestId('parent')).toBeInTheDocument()
      expect(getByTestId('nested-child')).toBeInTheDocument()
      expect(getByTestId('deeply-nested')).toBeInTheDocument()
    })

    it('should handle empty children', () => {
      const { container } = render(
        <RootLayout>{null}</RootLayout>
      )

      const wrapperDiv = container.querySelector('.w-screen.h-screen')
      expect(wrapperDiv).toBeInTheDocument()
      expect(wrapperDiv?.children.length).toBe(0)
    })
  })

  describe('Wrapper Div Specifics', () => {
    it('should be a direct child of Providers', () => {
      const { getByTestId, container } = render(
        <RootLayout>{mockChildren}</RootLayout>
      )

      const providers = getByTestId('providers')
      const wrapperDiv = providers.querySelector(':scope > .w-screen.h-screen')
      
      expect(wrapperDiv).toBeInTheDocument()
    })

    it('should contain all children within wrapper div', () => {
      const { getByTestId } = render(
        <RootLayout>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
        </RootLayout>
      )

      const child1 = getByTestId('child-1')
      const child2 = getByTestId('child-2')
      const wrapper = child1.closest('.w-screen.h-screen')
      
      expect(wrapper).toContainElement(child1)
      expect(wrapper).toContainElement(child2)
    })

    it('should not have any other classes on wrapper div', () => {
      const { container } = render(
        <RootLayout>{mockChildren}</RootLayout>
      )

      const wrapperDiv = container.querySelector('.w-screen.h-screen')
      const classes = Array.from(wrapperDiv?.classList || [])
      
      expect(classes).toEqual(['w-screen', 'h-screen'])
    })
  })

  describe('Layout Viewport', () => {
    it('should create full viewport dimensions with w-screen and h-screen', () => {
      const { container } = render(
        <RootLayout>{mockChildren}</RootLayout>
      )

      const wrapperDiv = container.querySelector('.w-screen.h-screen')
      
      expect(wrapperDiv).toHaveClass('w-screen')
      expect(wrapperDiv).toHaveClass('h-screen')
    })

    it('should maintain viewport sizing across different content', () => {
      const largeContent = (
        <div style={{ height: '2000px' }} data-testid="large-content">
          Large Content
        </div>
      )

      const { container } = render(
        <RootLayout>{largeContent}</RootLayout>
      )

      const wrapperDiv = container.querySelector('.w-screen.h-screen')
      expect(wrapperDiv).toHaveClass('w-screen')
      expect(wrapperDiv).toHaveClass('h-screen')
    })
  })

  describe('Integration with Providers', () => {
    it('should pass children through Providers to wrapper div', () => {
      const { getByTestId } = render(
        <RootLayout>
          <div data-testid="test-child">Test</div>
        </RootLayout>
      )

      const providers = getByTestId('providers')
      const testChild = getByTestId('test-child')
      
      expect(providers).toContainElement(testChild)
    })

    it('should maintain correct component hierarchy', () => {
      const { container, getByTestId } = render(
        <RootLayout>
          <div data-testid="test-child">Test</div>
        </RootLayout>
      )

      const body = container.querySelector('body')
      const providers = getByTestId('providers')
      const wrapper = container.querySelector('.w-screen.h-screen')
      const child = getByTestId('test-child')

      // Verify hierarchy: body > providers > wrapper > child
      expect(body).toContainElement(providers)
      expect(providers).toContainElement(wrapper)
      expect(wrapper).toContainElement(child)
    })
  })

  describe('Edge Cases', () => {
    it('should handle undefined children', () => {
      const { container } = render(
        <RootLayout>{undefined}</RootLayout>
      )

      const wrapperDiv = container.querySelector('.w-screen.h-screen')
      expect(wrapperDiv).toBeInTheDocument()
    })

    it('should handle string children', () => {
      const { container } = render(
        <RootLayout>Plain text content</RootLayout>
      )

      const wrapperDiv = container.querySelector('.w-screen.h-screen')
      expect(wrapperDiv).toBeInTheDocument()
      expect(wrapperDiv?.textContent).toContain('Plain text content')
    })

    it('should handle mixed content types', () => {
      const { getByTestId } = render(
        <RootLayout>
          Text
          <div data-testid="element">Element</div>
          {123}
          {true && <span data-testid="conditional">Conditional</span>}
        </RootLayout>
      )

      expect(getByTestId('element')).toBeInTheDocument()
      expect(getByTestId('conditional')).toBeInTheDocument()
    })
  })

  describe('Comparison with Previous Implementation', () => {
    it('should wrap children instead of rendering them directly', () => {
      const { container } = render(
        <RootLayout>{mockChildren}</RootLayout>
      )

      // The wrapper div should exist between Providers and children
      const providers = container.querySelector('[data-testid="providers"]')
      const wrapperDiv = providers?.querySelector('.w-screen.h-screen')
      
      expect(wrapperDiv).toBeInTheDocument()
      expect(wrapperDiv).toContainElement(container.querySelector('[data-testid="child-content"]'))
    })

    it('should have added the wrapper div without changing other structure', () => {
      const { container } = render(
        <RootLayout>{mockChildren}</RootLayout>
      )

      const html = container.querySelector('html')
      const body = container.querySelector('body')
      const providers = container.querySelector('[data-testid="providers"]')

      // Basic structure should remain the same
      expect(html).toBeInTheDocument()
      expect(body).toBeInTheDocument()
      expect(providers).toBeInTheDocument()
      
      // New wrapper should be added
      const wrapperDiv = container.querySelector('.w-screen.h-screen')
      expect(wrapperDiv).toBeInTheDocument()
    })
  })
})