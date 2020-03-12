import Vue from 'vue'
import { Prop, Component } from 'vue-property-decorator'
import { IProcessedStyleSet } from '@uifabric/merge-styles'
import { css } from '@uifabric-vue/utilities'
import { getTheme, ITheme } from '@uifabric/styling'

@Component({
  // @ts-ignore
  functional: true,
  provide: {},
})
export default abstract class StatelessComponent<TProps = {}> extends Vue {
  @Prop({ type: Object, default: () => {} }) private readonly props!: TProps

  css () {
    return css(...arguments)
  }
}
