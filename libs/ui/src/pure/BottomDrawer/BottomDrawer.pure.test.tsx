import { ReactNode, useState } from 'react'

import { fireEvent, render } from '@testing-library/react'

import { BottomDrawer } from './BottomDrawer.pure'

describe('BottomDrawer', () => {
  it('forces the backdrop to render for a nested drawer', () => {
    const { container } = render(
      <BottomDrawer open onOpenChange={jest.fn()}>
        <BottomDrawer open nested onOpenChange={jest.fn()}>
          Nested content
        </BottomDrawer>
      </BottomDrawer>,
    )

    const backdrops = container.ownerDocument.querySelectorAll<HTMLElement>('[data-bottom-drawer-backdrop]')
    const viewports = container.ownerDocument.querySelectorAll<HTMLElement>('[data-bottom-drawer-viewport]')

    expect(backdrops).toHaveLength(2)
    expect(viewports).toHaveLength(2)
    expect(getComputedStyle(backdrops[0]).zIndex).toBe('1000')
    expect(getComputedStyle(backdrops[1]).zIndex).toBe('1002')
    expect(getComputedStyle(viewports[0]).zIndex).toBe('1001')
    expect(getComputedStyle(viewports[1]).zIndex).toBe('1003')
  })

  it('exposes whether its content has been scrolled', () => {
    const { container } = render(
      <BottomDrawer open onOpenChange={jest.fn()}>
        Content
      </BottomDrawer>,
    )
    const content = container.ownerDocument.querySelector<HTMLElement>('[data-drawer-content]')

    expect(content).not.toBeNull()
    expect(content?.hasAttribute('data-scrolled')).toBe(false)

    if (!content) {
      return
    }

    Object.defineProperty(content, 'scrollTop', { configurable: true, value: 12 })
    fireEvent.scroll(content)

    expect(content.getAttribute('data-scrolled')).toBe('true')

    Object.defineProperty(content, 'scrollTop', { configurable: true, value: 0 })
    fireEvent.scroll(content)

    expect(content.hasAttribute('data-scrolled')).toBe(false)
  })

  it('closes only the nested drawer and restores focus to its opener', () => {
    const onParentOpenChange = jest.fn()
    const onNestedOpenChange = jest.fn()

    function Harness(): ReactNode {
      const [isNestedOpen, setIsNestedOpen] = useState(false)

      return (
        <BottomDrawer open onOpenChange={onParentOpenChange}>
          <button type="button" onClick={() => setIsNestedOpen(true)}>
            Open receipt
          </button>
          <BottomDrawer
            open={isNestedOpen}
            nested
            onOpenChange={(open) => {
              onNestedOpenChange(open)
              setIsNestedOpen(open)
            }}
          >
            Receipt
          </BottomDrawer>
        </BottomDrawer>
      )
    }

    const { getByRole, queryByText } = render(<Harness />)
    const opener = getByRole('button', { name: 'Open receipt' })

    opener.focus()
    fireEvent.click(opener)
    expect(queryByText('Receipt')).not.toBeNull()

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(onNestedOpenChange).toHaveBeenCalledWith(false)
    expect(onParentOpenChange).not.toHaveBeenCalled()
    expect(queryByText('Receipt')).toBeNull()
    expect(document.activeElement).toBe(opener)

    fireEvent.click(opener)

    const nestedBackdrop = document.querySelectorAll<HTMLElement>('[data-bottom-drawer-backdrop]')[1]

    if (!nestedBackdrop) throw new Error('Expected nested drawer backdrop')

    fireEvent.pointerDown(nestedBackdrop, { button: 0, pointerType: 'mouse' })
    fireEvent.click(nestedBackdrop)

    expect(onNestedOpenChange).toHaveBeenCalledTimes(2)
    expect(onNestedOpenChange).toHaveBeenLastCalledWith(false)
    expect(onParentOpenChange).not.toHaveBeenCalled()
    expect(queryByText('Receipt')).toBeNull()
    expect(document.activeElement).toBe(opener)
  })
})
