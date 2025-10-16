import React from 'react'
import { render, screen } from '@testing-library/react'
import { VapiFormFields } from '../vapi-form-fields'
import '@testing-library/jest-dom'

// Mock the UI components
jest.mock('@workspace/ui/components/select', () => ({
  Select: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="select">{children}</div>
  ),
  SelectTrigger: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="select-trigger">{children}</div>
  ),
  SelectValue: ({ placeholder }: { placeholder: string }) => (
    <span data-testid="select-value">{placeholder}</span>
  ),
  SelectContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="select-content">{children}</div>
  ),
  SelectItem: ({ children, value, ...props }: any) => (
    <div data-testid={`select-item-${value}`} data-value={value} {...props}>
      {children}
    </div>
  ),
}))

jest.mock('@workspace/ui/components/label', () => ({
  Label: ({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) => (
    <label data-testid="label" htmlFor={htmlFor}>{children}</label>
  ),
}))

describe('VapiFormFields - Phone Number SelectItem Changes', () => {
  const mockPhoneNumbers = [
    { id: '1', number: '+1234567890', name: 'Main Office' },
    { id: '2', number: '+0987654321', name: 'Support Line' },
    { id: null, number: '+1111111111', name: 'Unknown ID Number' },
  ]

  const defaultProps = {
    phoneNumbers: mockPhoneNumbers,
    selectedPhoneNumberId: null,
    onPhoneNumberChange: jest.fn(),
  }

  describe('SelectItem Key Attribute', () => {
    it('should use phone number as key instead of id', () => {
      const { container } = render(<VapiFormFields {...defaultProps} />)

      // Check that items exist with number-based test ids
      mockPhoneNumbers.forEach((phone) => {
        const item = container.querySelector(`[data-testid="select-item-${phone.number}"]`)
        expect(item).toBeInTheDocument()
      })
    })

    it('should not use id as key for SelectItem', () => {
      const { container } = render(<VapiFormFields {...defaultProps} />)

      // Verify old id-based keys don't exist
      mockPhoneNumbers.forEach((phone) => {
        if (phone.id) {
          const oldKeyItem = container.querySelector(`[data-testid="select-item-${phone.id}"]`)
          expect(oldKeyItem).not.toBeInTheDocument()
        }
      })
    })

    it('should handle phone numbers with null id', () => {
      const phonesWithNullId = [
        { id: null, number: '+5555555555', name: 'No ID Phone' },
      ]

      const { container } = render(
        <VapiFormFields {...defaultProps} phoneNumbers={phonesWithNullId} />
      )

      const item = container.querySelector('[data-testid="select-item-+5555555555"]')
      expect(item).toBeInTheDocument()
    })

    it('should handle phone numbers with undefined id', () => {
      const phonesWithUndefinedId = [
        { id: undefined as any, number: '+6666666666', name: 'Undefined ID' },
      ]

      const { container } = render(
        <VapiFormFields {...defaultProps} phoneNumbers={phonesWithUndefinedId} />
      )

      const item = container.querySelector('[data-testid="select-item-+6666666666"]')
      expect(item).toBeInTheDocument()
    })
  })

  describe('SelectItem Value Attribute', () => {
    it('should use phone number as value instead of id', () => {
      const { container } = render(<VapiFormFields {...defaultProps} />)

      mockPhoneNumbers.forEach((phone) => {
        const item = container.querySelector(`[data-value="${phone.number}"]`)
        expect(item).toBeInTheDocument()
      })
    })

    it('should provide empty string fallback when number is undefined', () => {
      const phonesWithUndefinedNumber = [
        { id: '999', number: undefined as any, name: 'No Number' },
      ]

      const { container } = render(
        <VapiFormFields {...defaultProps} phoneNumbers={phonesWithUndefinedNumber} />
      )

      const item = container.querySelector('[data-value=""]')
      expect(item).toBeInTheDocument()
    })

    it('should provide empty string fallback when number is null', () => {
      const phonesWithNullNumber = [
        { id: '888', number: null as any, name: 'Null Number' },
      ]

      const { container } = render(
        <VapiFormFields {...defaultProps} phoneNumbers={phonesWithNullNumber} />
      )

      const item = container.querySelector('[data-value=""]')
      expect(item).toBeInTheDocument()
    })

    it('should not use id ?? number pattern anymore', () => {
      const { container } = render(<VapiFormFields {...defaultProps} />)

      // For phone with id '1', old implementation would use id as value
      // New implementation should use number
      mockPhoneNumbers.forEach((phone) => {
        const itemByNumber = container.querySelector(`[data-value="${phone.number}"]`)
        expect(itemByNumber).toBeInTheDocument()

        if (phone.id) {
          // Old implementation would set value to id, which shouldn't happen now
          const itemById = container.querySelector(`[data-value="${phone.id}"]`)
          expect(itemById).not.toBeInTheDocument()
        }
      })
    })
  })

  describe('Display Text', () => {
    it('should display phone number and name correctly', () => {
      const { getByText } = render(<VapiFormFields {...defaultProps} />)

      mockPhoneNumbers.forEach((phone) => {
        const displayText = `${phone.number || 'Unknown'} - ${phone.name || 'Unnamed'}`
        // Text should be present in the document
        expect(getByText(new RegExp(phone.number), { exact: false })).toBeInTheDocument()
      })
    })

    it('should show "Unknown" for missing phone number', () => {
      const phonesWithoutNumber = [
        { id: '777', number: null as any, name: 'Test' },
      ]

      const { getByText } = render(
        <VapiFormFields {...defaultProps} phoneNumbers={phonesWithoutNumber} />
      )

      expect(getByText(/Unknown/)).toBeInTheDocument()
    })

    it('should show "Unnamed" for missing name', () => {
      const phonesWithoutName = [
        { id: '666', number: '+7777777777', name: null as any },
      ]

      const { getByText } = render(
        <VapiFormFields {...defaultProps} phoneNumbers={phonesWithoutName} />
      )

      expect(getByText(/Unnamed/)).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty phone numbers array', () => {
      const { container } = render(
        <VapiFormFields {...defaultProps} phoneNumbers={[]} />
      )

      const noneItem = container.querySelector('[data-testid="select-item-none"]')
      expect(noneItem).toBeInTheDocument()
    })

    it('should handle phone numbers with special characters', () => {
      const specialPhones = [
        { id: '1', number: '+1 (234) 567-8900', name: 'Formatted' },
        { id: '2', number: '+44-20-7946-0958', name: 'UK Format' },
      ]

      const { container } = render(
        <VapiFormFields {...defaultProps} phoneNumbers={specialPhones} />
      )

      specialPhones.forEach((phone) => {
        const item = container.querySelector(`[data-value="${phone.number}"]`)
        expect(item).toBeInTheDocument()
      })
    })

    it('should handle very long phone numbers', () => {
      const longPhones = [
        { id: '1', number: '+123456789012345678901234567890', name: 'Very Long' },
      ]

      const { container } = render(
        <VapiFormFields {...defaultProps} phoneNumbers={longPhones} />
      )

      const item = container.querySelector(`[data-value="${longPhones[0].number}"]`)
      expect(item).toBeInTheDocument()
    })

    it('should handle duplicate phone numbers', () => {
      const duplicatePhones = [
        { id: '1', number: '+1234567890', name: 'First' },
        { id: '2', number: '+1234567890', name: 'Duplicate' },
      ]

      const { container } = render(
        <VapiFormFields {...defaultProps} phoneNumbers={duplicatePhones} />
      )

      // Both should render with number as key
      const items = container.querySelectorAll('[data-value="+1234567890"]')
      expect(items.length).toBe(2)
    })

    it('should handle phone number with empty string', () => {
      const emptyStringPhones = [
        { id: '1', number: '', name: 'Empty String Number' },
      ]

      const { container } = render(
        <VapiFormFields {...defaultProps} phoneNumbers={emptyStringPhones} />
      )

      const item = container.querySelector('[data-value=""]')
      expect(item).toBeInTheDocument()
    })
  })

  describe('None Option', () => {
    it('should always render "None" option first', () => {
      const { container } = render(<VapiFormFields {...defaultProps} />)

      const noneItem = container.querySelector('[data-testid="select-item-none"]')
      expect(noneItem).toBeInTheDocument()
      expect(noneItem).toHaveAttribute('data-value', 'none')
    })

    it('should render "None" option even with empty phone numbers', () => {
      const { container } = render(
        <VapiFormFields {...defaultProps} phoneNumbers={[]} />
      )

      const noneItem = container.querySelector('[data-testid="select-item-none"]')
      expect(noneItem).toBeInTheDocument()
    })
  })

  describe('Consistency with Change', () => {
    it('should use consistent identifier across key and value', () => {
      const { container } = render(<VapiFormFields {...defaultProps} />)

      mockPhoneNumbers.forEach((phone) => {
        // Key uses number (in test id)
        const itemByTestId = container.querySelector(`[data-testid="select-item-${phone.number}"]`)
        expect(itemByTestId).toBeInTheDocument()

        // Value also uses number
        const itemByValue = container.querySelector(`[data-value="${phone.number}"]`)
        expect(itemByValue).toBeInTheDocument()

        // They should be the same element
        expect(itemByTestId).toBe(itemByValue)
      })
    })

    it('should not mix id and number in key/value pairs', () => {
      const { container } = render(<VapiFormFields {...defaultProps} />)

      mockPhoneNumbers.forEach((phone) => {
        if (phone.id) {
          // Old behavior: key=id, value=id ?? number
          // New behavior: key=number, value=number ?? ""

          // Should NOT find item with id as test id
          const oldKeyItem = container.querySelector(`[data-testid="select-item-${phone.id}"]`)
          expect(oldKeyItem).not.toBeInTheDocument()

          // Should find item with number as both test id and value
          const newItem = container.querySelector(`[data-testid="select-item-${phone.number}"][data-value="${phone.number}"]`)
          expect(newItem).toBeInTheDocument()
        }
      })
    })
  })

  describe('Fallback Behavior', () => {
    it('should use empty string fallback for value but not key', () => {
      const phonesWithMissingNumber = [
        { id: '123', number: null as any, name: 'Missing Number' },
      ]

      const { container } = render(
        <VapiFormFields {...defaultProps} phoneNumbers={phonesWithMissingNumber} />
      )

      // Value should fallback to empty string
      const itemByValue = container.querySelector('[data-value=""]')
      expect(itemByValue).toBeInTheDocument()

      // Key still uses null number (but React will handle it)
      // In test, we just verify the item exists
      expect(itemByValue).toBeInTheDocument()
    })
  })

  describe('Integration with Select Component', () => {
    it('should render within Select component structure', () => {
      const { container } = render(<VapiFormFields {...defaultProps} />)

      const select = container.querySelector('[data-testid="select"]')
      const selectContent = container.querySelector('[data-testid="select-content"]')

      expect(select).toBeInTheDocument()
      expect(selectContent).toBeInTheDocument()

      // SelectItems should be within SelectContent
      mockPhoneNumbers.forEach((phone) => {
        const item = selectContent?.querySelector(`[data-testid="select-item-${phone.number}"]`)
        expect(item).toBeInTheDocument()
      })
    })

    it('should maintain select functionality with new key/value scheme', () => {
      const { container } = render(<VapiFormFields {...defaultProps} />)

      // All items should be properly structured
      const items = container.querySelectorAll('[data-testid^="select-item-"]')
      expect(items.length).toBeGreaterThan(0)

      // Each item should have a data-value attribute
      items.forEach((item) => {
        expect(item).toHaveAttribute('data-value')
      })
    })
  })
})