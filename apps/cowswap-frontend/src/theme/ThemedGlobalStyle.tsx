import { baseGlobalStyles, Media, ThemeColorVars, UI } from '@cowprotocol/ui'

import { createGlobalStyle } from 'styled-components/macro'

export const ThemedGlobalStyle = createGlobalStyle`
  ${ThemeColorVars}
  ${baseGlobalStyles}

  *, *:after, *:before {
    box-sizing: border-box;
  }

  ::selection {
    background: var(${UI.COLOR_PRIMARY});
    color: var(${UI.COLOR_BUTTON_TEXT});
  }

  html {
    font-family: var(${UI.FONT_FAMILY_PRIMARY}), Arial, sans-serif;
    font-size: 16px;
    font-variant: none;
    font-variant-ligatures: none;
    text-rendering: optimizeLegibility;
    font-feature-settings:
      'liga' off,
      'kern' on,
      'ss01' on,
      'ss02' on,
      'cv01' on,
      'cv03' on;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    color: var(${UI.COLOR_TEXT});
    background-color: ${({ theme }) => (theme.isWidget ? 'transparent' : `var(${UI.COLOR_CONTAINER_BG_02})`)};
  }

  body {
    background: transparent;
    min-height: ${({ theme }) => (theme.isWidget ? 'auto' : '100vh')};

    &.noScroll {
      overflow: hidden;
    }
  }

  // TODO: Can be removed once we control this component
  [data-reach-dialog-overlay] {
    z-index: 1000 !important;

    ${Media.upToMedium()} {
      top: 0 !important;
      bottom: 0 !important;
    }
  }

  // Walletconnect V2 mobile override
  body #wcm-modal.wcm-overlay {
    ${Media.upToSmall()} {
      align-items: flex-start;
    }

    a {
      text-decoration: none;

      :hover {
        text-decoration: underline;
      }
    }
  }

  button,
  textarea,
  select,
  // Using where to avoid specificity issues with the input type selectors:
  input:where(:not([type='checkbox'], [type='radio'], [type='range'])) {
    border: none;
    padding: 0;
    margin: 0;
    background: none;
    outline: none;
    font: inherit;
    color: inherit;
    appearance: none;
  }

  button {
    user-select: none;
    cursor: pointer;

    &:disabled {
      cursor: not-allowed;
    }
  }

  a {
    // color: ${({ theme }) => theme.blue1};
    color: inherit;
  }
`
