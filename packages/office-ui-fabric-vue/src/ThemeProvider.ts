import { getTheme, IPartialTheme } from '@uifabric/styling'
import Vue, { VNode } from 'vue'
import { Component, Prop, Provide, ProvideReactive } from 'vue-property-decorator'

@Component
export class ThemeProvider extends Vue {
  @Prop({ type: Object, default: () => getTheme() }) readonly theme!: IPartialTheme

  created () {

  }

  render () {
    return this.$slots.default
  }
}
