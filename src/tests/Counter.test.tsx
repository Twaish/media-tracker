import Counter from '@/components/Counter'
import { useCountStore } from '@/stores/useCountStore'
import { fireEvent, render } from '@testing-library/react'
import { beforeEach, describe, expect, test } from 'vitest'

describe('Counter', () => {
  beforeEach(() => {
    useCountStore.setState({ count: 0 })
  })

  test('renders buttons and count', () => {
    const { getByText } = render(<Counter />)

    expect(getByText('Inc')).toBeInTheDocument()
    expect(getByText('Dec')).toBeInTheDocument()
    expect(getByText('0')).toBeInTheDocument()
  })

  test('increments count when clicking Inc', () => {
    const { getByText } = render(<Counter />)

    const incButton = getByText('Inc')
    fireEvent.click(incButton)

    expect(getByText('1')).toBeInTheDocument()
  })

  test('decrements count when clicking Dec', () => {
    const { getByText } = render(<Counter />)

    const decButton = getByText('Dec')
    fireEvent.click(decButton)

    expect(getByText('-1')).toBeInTheDocument()
  })

  test('increments and decrements correctly', () => {
    const { getByText } = render(<Counter />)

    const incButton = getByText('Inc')
    const decButton = getByText('Dec')

    fireEvent.click(incButton)
    fireEvent.click(incButton)
    fireEvent.click(decButton)

    expect(getByText('1')).toBeInTheDocument()
  })
})
