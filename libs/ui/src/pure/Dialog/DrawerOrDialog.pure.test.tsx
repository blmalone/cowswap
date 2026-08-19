import type { ReactElement } from 'react'

import { useMediaQuery } from '@cowprotocol/common-hooks'

import { render } from '@testing-library/react'

import { Dialog, type DialogProps } from './Dialog.pure'
import { DrawerOrDialog } from './DrawerOrDialog.pure'

import { Media } from '../../consts'
import { BottomDrawer, type BottomDrawerProps } from '../BottomDrawer/BottomDrawer.pure'
import { ModalHeader, type ModalHeaderProps } from '../ModalHeader'

jest.mock('@cowprotocol/common-hooks', () => ({
  useMediaQuery: jest.fn(),
}))

jest.mock('../BottomDrawer/BottomDrawer.pure', () => ({
  BottomDrawer: jest.fn(() => null),
}))

jest.mock('./Dialog.pure', () => ({
  Dialog: jest.fn(() => null),
}))

const mockUseMediaQuery = useMediaQuery as jest.MockedFunction<typeof useMediaQuery>
const mockBottomDrawer = jest.mocked(BottomDrawer)
const mockDialog = jest.mocked(Dialog)

describe('DrawerOrDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('forwards drawer-only configuration and delegates Escape to the drawer primitive', () => {
    mockUseMediaQuery.mockReturnValue(true)
    const onOpenChange = jest.fn()

    render(
      <DrawerOrDialog isOpen onOpenChange={onOpenChange} title="Order receipt" nested fullScreen>
        <span>Receipt</span>
      </DrawerOrDialog>,
    )
    const props = mockBottomDrawer.mock.calls[0]?.[0] as BottomDrawerProps | undefined

    if (!props) throw new Error('Expected BottomDrawer to render')

    const header = props.header as ReactElement<ModalHeaderProps>

    expect(mockUseMediaQuery).toHaveBeenCalledWith(Media.upToLarge(false))
    expect(props.nested).toBe(true)
    expect(props.fullScreen).toBe(true)
    expect(header.type).toBe(ModalHeader)
    expect(header.props.closeOnEscape).toBe(false)
  })

  it('keeps nested drawer configuration out of the desktop dialog branch', () => {
    mockUseMediaQuery.mockReturnValue(false)

    render(
      <DrawerOrDialog isOpen onOpenChange={jest.fn()} title="Order receipt" nested fullScreen>
        <span>Receipt</span>
      </DrawerOrDialog>,
    )
    const props = mockDialog.mock.calls[0]?.[0] as
      | (DialogProps & { fullScreen?: boolean; nested?: boolean })
      | undefined

    if (!props) throw new Error('Expected Dialog to render')

    expect(props.nested).toBeUndefined()
    expect(props.fullScreen).toBeUndefined()
  })
})
