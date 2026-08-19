import { i18n } from '@lingui/core'

import { fireEvent, render, screen } from '@testing-library/react'

import { ModalHeader } from '.'

i18n.load('en-US', {})
i18n.activate('en-US')

describe('ModalHeader', () => {
  it('forwards a contextual accessible name and delegates Escape to the owning overlay', () => {
    const onClose = jest.fn()

    render(
      <ModalHeader
        title="Order receipt"
        onClose={onClose}
        closeOnEscape={false}
        closeAriaLabel="Close order receipt"
      />,
    )

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: 'Close order receipt' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
