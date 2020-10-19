import { getTheme, IPartialTheme } from '@uifabric/styling'
import Vue, { VNode } from 'vue'
import { Component, Prop, Provide, ProvideReactive } from 'vue-property-decorator'

@Component({
  provide () {
    return {
      // @ts-ignore
      $theme: () => this.theme,
    }
  },
})
export class ThemeProvider extends Vue {
  @Prop({ type: Object, default: () => getTheme() }) readonly theme!: IPartialTheme

  render () {
    return this.$slots.default
  }
}
