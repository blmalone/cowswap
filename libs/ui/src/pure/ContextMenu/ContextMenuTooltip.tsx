import { MouseEvent, ReactNode, useRef, useState, useEffect } from 'react'

import { t } from '@lingui/core/macro'

import * as styledEl from './styled'

import { Tooltip } from '../Tooltip'

interface ContextMenuTooltipProps {
  children: ReactNode
  content: ReactNode
  ariaLabel?: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
  containerRef?: React.RefObject<HTMLDivElement | null>
  disableHoverBackground?: boolean
  triggerSize?: number
}

export function ContextMenuTooltip({
  children,
  content,
  ariaLabel = t`More options`,
  placement = 'bottom',
  containerRef,
  disableHoverBackground,
  triggerSize,
}: ContextMenuTooltipProps): ReactNode {
  const contextMenuRef = useRef<HTMLDivElement>(null)
  const defaultContainerRef = useRef<HTMLButtonElement>(null)
  const [openTooltip, setOpenTooltip] = useState(false)

  const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation?.()
    event.preventDefault?.()
    setOpenTooltip((prev) => !prev)
  }

  // Click outside handler
  useEffect(() => {
    if (!openTooltip) return

    const handleClickOutside = (event: Event): void => {
      const target = event.target as HTMLElement

      // Only close if clicking outside the context menu
      if (!contextMenuRef.current?.contains(target)) {
        setOpenTooltip(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [openTooltip])

  // Custom click handler that allows anchor tags to work
  const handleTooltipClick = (event: MouseEvent<HTMLDivElement>): void => {
    const target = event.target as HTMLElement

    // Don't prevent default for anchor tags - let them work naturally
    if (target.tagName === 'A' || target.closest('a')) {
      return
    }

    // For other elements, toggle the tooltip
    event.preventDefault()
    setOpenTooltip((prev) => !prev)
  }

  return (
    <Tooltip
      content={
        <styledEl.ContextMenuContent ref={contextMenuRef} role="menu" onClick={handleTooltipClick}>
          {content}
        </styledEl.ContextMenuContent>
      }
      placement={placement}
      wrapInContainer={false}
      show={openTooltip}
      containerRef={(containerRef as React.RefObject<HTMLElement>) || defaultContainerRef}
    >
      <styledEl.ContextMenuTooltipButton
        ref={defaultContainerRef}
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="menu"
        aria-expanded={openTooltip}
        onClick={handleClick}
        disableHoverBackground={disableHoverBackground}
        $triggerSize={triggerSize}
      >
        {children}
      </styledEl.ContextMenuTooltipButton>
    </Tooltip>
  )
}
