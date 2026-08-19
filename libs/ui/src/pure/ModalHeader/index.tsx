import { ReactNode } from 'react'

import clsx from 'clsx'

import * as styledEl from './styled'

export interface ModalHeaderProps {
  sticky?: boolean
  title?: ReactNode
  children?: ReactNode
  rightSlot?: ReactNode
  onBack?(): void
  onClose?(): void
  /** Disable when the owning overlay primitive already handles Escape. */
  closeOnEscape?: boolean
  closeAriaLabel?: string
  className?: string
}

// TODO: Move inside modal Modal directory

export function ModalHeader({
  sticky,
  title,
  children,
  rightSlot,
  className,
  onBack,
  onClose,
  closeOnEscape = true,
  closeAriaLabel,
}: ModalHeaderProps): ReactNode {
  const hasBack = !!onBack
  const hasClose = !!onClose
  const rootClass = clsx(className, hasBack && 'hasBack', hasClose && 'hasClose', sticky && 'sticky')

  return (
    <styledEl.Header className={rootClass} withoutBorder>
      <styledEl.Inner>
        <styledEl.BackButton aria-hidden={!hasBack} disabled={!hasBack} onClick={onBack} backOnEscape={closeOnEscape} />

        <styledEl.Title>{title || children}</styledEl.Title>

        {rightSlot ? <styledEl.RightSlot>{rightSlot}</styledEl.RightSlot> : null}

        <styledEl.CloseButton
          aria-label={closeAriaLabel}
          aria-hidden={!hasClose}
          disabled={!hasClose}
          onClick={onClose}
          closeOnEscape={closeOnEscape}
        />
      </styledEl.Inner>
    </styledEl.Header>
  )
}
