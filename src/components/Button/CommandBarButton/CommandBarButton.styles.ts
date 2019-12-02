import { concatStyleSets } from '@uifabric/merge-styles'
import { ButtonGlobalClassNames } from '../BaseButton.classNames'
import { HighContrastSelector, getFocusStyle, ITheme } from '@/styling'
import { IButtonStyles } from '../Button.types'
import { memoizeFunction } from '@/utilities'

import { getStyles as getBaseButtonStyles } from '../BaseButton.styles'

export const getStyles = memoizeFunction(
  (theme: ITheme, customStyles?: IButtonStyles, focusInset?: string, focusColor?: string): IButtonStyles => {
    const baseButtonStyles: IButtonStyles = getBaseButtonStyles(theme)
    const baseSplitButtonStyles: IButtonStyles = {}// getSplitButtonStyles(theme)

    const { palette: p, semanticColors } = theme

    const commandButtonHighContrastFocus = {
      left: 4,
      top: 4,
      bottom: 4,
      right: 4,
      border: 'none',
    }

    const commandButtonStyles: IButtonStyles = {
      root: [
        getFocusStyle(theme, { inset: 2, highContrastStyle: commandButtonHighContrastFocus, borderColor: 'transparent' }),
        theme.fonts.medium,
        {
          minWidth: '40px',
          backgroundColor: p.white,
          color: p.neutralPrimary,
          padding: '0 4px',
          border: 'none',
          borderRadius: 0,
          selectors: {
            [HighContrastSelector]: {
              border: 'none',
            },
          },
        },
      ],

      rootHovered: {
        backgroundColor: p.neutralLighter,
        color: p.neutralDark,
        selectors: {
          [HighContrastSelector]: {
            color: 'Highlight',
          },
          [`.${ButtonGlobalClassNames.msButtonIcon}`]: {
            color: p.themeDarkAlt,
          },
          [`.${ButtonGlobalClassNames.msButtonMenuIcon}`]: {
            color: p.neutralPrimary,
          },
        },
      },

      rootPressed: {
        backgroundColor: p.neutralLight,
        color: p.neutralDark,
        selectors: {
          [`.${ButtonGlobalClassNames.msButtonIcon}`]: {
            color: p.themeDark,
          },
          [`.${ButtonGlobalClassNames.msButtonMenuIcon}`]: {
            color: p.neutralPrimary,
          },
        },
      },

      rootChecked: {
        backgroundColor: p.neutralLight,
        color: p.neutralDark,
        selectors: {
          [`.${ButtonGlobalClassNames.msButtonIcon}`]: {
            color: p.themeDark,
          },
          [`.${ButtonGlobalClassNames.msButtonMenuIcon}`]: {
            color: p.neutralPrimary,
          },
        },
      },

      rootCheckedHovered: {
        backgroundColor: p.neutralQuaternaryAlt,
        selectors: {
          [`.${ButtonGlobalClassNames.msButtonIcon}`]: {
            color: p.themeDark,
          },
          [`.${ButtonGlobalClassNames.msButtonMenuIcon}`]: {
            color: p.neutralPrimary,
          },
        },
      },

      rootExpanded: {
        backgroundColor: p.neutralLight,
        color: p.neutralDark,
        selectors: {
          [`.${ButtonGlobalClassNames.msButtonIcon}`]: {
            color: p.themeDark,
          },
          [`.${ButtonGlobalClassNames.msButtonMenuIcon}`]: {
            color: p.neutralPrimary,
          },
        },
      },

      rootExpandedHovered: {
        backgroundColor: p.neutralQuaternaryAlt,
      },

      rootDisabled: {
        backgroundColor: p.white,
        selectors: {
          [`.${ButtonGlobalClassNames.msButtonIcon}`]: {
            color: semanticColors.disabledBodySubtext,
          },
        },
      },

      // Split button styles
      splitButtonContainer: {
        height: '100%',
        selectors: {
          [HighContrastSelector]: {
            border: 'none',
          },
        },
      },

      splitButtonDivider: {
        backgroundColor: p.neutralTertiaryAlt,
      },

      splitButtonMenuButton: {
        backgroundColor: p.white,
        border: 'none',
        borderTopRightRadius: '0',
        borderBottomRightRadius: '0',
        color: p.neutralSecondary,
        selectors: {
          ':hover': {
            backgroundColor: p.neutralLighter,
            color: p.neutralDark,
            selectors: {
              [HighContrastSelector]: {
                color: 'Highlight',
              },
              [`.${ButtonGlobalClassNames.msButtonIcon}`]: {
                color: p.neutralPrimary,
              },
            },
          },
          ':active': {
            backgroundColor: p.neutralLight,
            selectors: {
              [`.${ButtonGlobalClassNames.msButtonIcon}`]: {
                color: p.neutralPrimary,
              },
            },
          },
        },
      },

      splitButtonMenuButtonDisabled: {
        backgroundColor: p.white,
      },

      splitButtonMenuButtonChecked: {
        backgroundColor: p.neutralLight,
        color: p.neutralDark,
        selectors: {
          ':hover': {
            backgroundColor: p.neutralQuaternaryAlt,
          },
        },
      },

      splitButtonMenuButtonExpanded: {
        backgroundColor: p.neutralLight,
        color: p.black,
        selectors: {
          ':hover': {
            backgroundColor: p.neutralQuaternaryAlt,
          },
        },
      },

      splitButtonMenuIcon: {
        color: p.neutralPrimary,
      },

      splitButtonMenuIconDisabled: {
        color: p.neutralTertiary,
      },

      label: {
        fontWeight: 'normal', // theme.fontWeights.semibold,
      },

      icon: {
        color: p.themePrimary,
      },

      menuIcon: {
        color: p.neutralSecondary,
      },
    }

    return concatStyleSets(baseButtonStyles, baseSplitButtonStyles, commandButtonStyles, customStyles)!
  }
)