<template>
  <div :class="classNames.root">
    <Label :class="classNames.label" :for="`Toggle${uid}`">
      <slot name="label"
            :checked="internalChecked"
            :disabled="disabled"
            :label="label">
        {{ label }}
      </slot>
    </Label>

    <div :class="classNames.container">
      <button :id="`Toggle${uid}`"
              ref="toggleButton"
              :class="classNames.pill"
              @click="onClick">
        <div :class="classNames.thumb" />
      </button>
      <Label v-if="(internalChecked && onText) || (!internalChecked && offText)"
             :class="classNames.text"
             :for="`Toggle${uid}`">
        {{ internalChecked ? onText : offText }}
      </Label>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch, Model } from 'vue-property-decorator'
import { Label } from '../Label'
import BaseComponent from '../BaseComponent'
import { IToggleProps, IToggleStyles, IToggleStyleProps } from './Toggle.types'
import { classNamesFunction } from '@uifabric-vue/utilities'
import { CreateElement } from 'vue'

const getClassNames = classNamesFunction<IToggleStyleProps, IToggleStyles>()

@Component
export default class ToggleBase extends BaseComponent<IToggleProps, IToggleStyles> {
  $refs!: {
    toggleButton: HTMLButtonElement
  }

  @Model('input', { type: Boolean, default: false }) checked!: boolean
  @Prop({ type: String, default: '' }) label!: string
  @Prop({ type: Boolean, default: false }) defaultChecked!: boolean
  @Prop({ type: Boolean, default: false }) disabled!: boolean
  @Prop({ type: Boolean, default: false }) inlineLabel!: boolean

  @Prop({ type: String, default: null }) onText!: string
  @Prop({ type: String, default: null }) offText!: string

  internalChecked: boolean = this.defaultChecked || this.checked

  @Watch('checked')
  onCheckedChanged (checked: boolean) {
    this.internalChecked = checked
  }

  get classNames () {
    const { theme, className, disabled, internalChecked, inlineLabel, onText, offText } = this
    return getClassNames(this.styles, {
      theme: theme,
      className: className,
      disabled: disabled,
      checked: internalChecked,
      inlineLabel: inlineLabel,
      onOffMissing: !onText && !offText,
    })
  }

  public focus () {
    this.$refs.toggleButton.focus()
  }

  private onClick () {
    if (this.disabled) return
    this.internalChecked = !this.internalChecked
    this.$emit('input', this.internalChecked)
  }
}
</script>
