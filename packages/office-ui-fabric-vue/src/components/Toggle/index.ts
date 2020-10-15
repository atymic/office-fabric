import { styled } from '../styled'
import ToggleBase from './Toggle.base.vue'
import { getStyles } from './Toggle.styles'
import { VueConstructor } from 'vue'

export * from './Toggle.types'

export const Toggle: VueConstructor = styled(
  ToggleBase,
  getStyles,
  undefined,
  { scope: 'Toggle' },
)
