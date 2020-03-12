import { Component, Prop } from 'vue-property-decorator'
import { ITextStyles } from './Text.types'
import { classNamesFunction } from '@uifabric-vue/utilities'
import { CreateElement, RenderContext } from 'vue'
import StatelessComponent from '../StatelessComponent'
import { ITheme } from '@uifabric/styling'
import { IStyleFunctionOrObject } from '@uifabric/merge-styles'

const getClassNames = classNamesFunction<any, ITextStyles>()

interface Props {
  theme: ITheme
  styles: IStyleFunctionOrObject<any, any>
  block: boolean
  nowrap: boolean
  variant: string
}

@Component
export default class Text extends StatelessComponent {
  render (h: CreateElement, context: RenderContext) {
    console.log(context)
    const { theme, styles, block, nowrap, variant } = context.data.props as Props
    const classNames = getClassNames(styles, {
      theme,
      block,
      nowrap,
      variant,
    })

    return (
      <span {...context.data} class={classNames.root}>
        {context.children}
      </span>
    )
  }
}
