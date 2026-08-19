import { ReactNode, useCallback } from 'react'

import { useMediaQuery } from '@cowprotocol/common-hooks'

import { Dialog } from './Dialog.pure'
import { getOverlayA11yTitle, resolveOverlayHeader } from './resolveOverlayHeader'

import { Media } from '../../consts'
import { BottomDrawer } from '../BottomDrawer/BottomDrawer.pure'

export interface DrawerOrDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  children: ReactNode
  title?: ReactNode
  onBack?: () => void
  header?: ReactNode
  footer?: ReactNode
  className?: string
  /** Dialog-mode CSS `width`. Ignored in drawer mode. */
  width?: number | string
  /** Dialog-mode CSS `max-width`. Ignored in drawer mode. */
  maxWidth?: number | string
  /** Renders drawer mode above another open BottomDrawer. Ignored in dialog mode. */
  nested?: boolean
  /** Makes drawer mode fill the dynamic viewport. Ignored in dialog mode. */
  fullScreen?: boolean
}

export function DrawerOrDialog({
  isOpen,
  onOpenChange,
  children,
  title,
  onBack,
  header,
  footer,
  className,
  width,
  maxWidth,
  nested = false,
  fullScreen = false,
}: DrawerOrDialogProps): ReactNode {
  const isUpToLarge = useMediaQuery(Media.upToLarge(false))

  const handleClose = useCallback(() => {
    onOpenChange(false)
  }, [onOpenChange])

  if (isUpToLarge) {
    const resolvedHeader = resolveOverlayHeader({
      header,
      title,
      onBack,
      onClose: handleClose,
    })

    return (
      <BottomDrawer
        open={isOpen}
        onOpenChange={onOpenChange}
        title={getOverlayA11yTitle(title, 'Drawer')}
        className={className}
        header={resolvedHeader}
        footer={footer}
        nested={nested}
        fullScreen={fullScreen}
      >
        {children}
      </BottomDrawer>
    )
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onOpenChange}
      title={title}
      onBack={onBack}
      className={className}
      header={header}
      footer={footer}
      width={width}
      maxWidth={maxWidth}
    >
      {children}
    </Dialog>
  )
}
