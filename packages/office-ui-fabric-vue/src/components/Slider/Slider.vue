<template>
  <div :class="classNames.root">
    <Label :class="classNames.titleLabel" v-text="props.label" />
    <div :class="classNames.container">
      <div :class="classNames.slideBox"
           :tabindex="props.disabled ? void 0 : 0"
           @mousedown="onMouseDown"
           @keydown="onKeyDown">
        <div ref="sliderLine" :class="classNames.line">
          <span v-if="props.originFromZero"
                :class="classNames.zeroTick"
                :style="{ [props.vertical ? 'bottom' : 'left']: `${zeroOffsetPercent}%` }" />
          <span :class="classNames.thumb"
                :style="{ [props.vertical ? 'bottom' : 'left']: `${thumbOffsetPercent}%` }" />

          <template v-if="props.originFromZero">
            <span :class="css(classNames.lineContainer, classNames.inactiveSection)"
                  :style="{ [lengthString]: `${Math.min(thumbOffsetPercent, zeroOffsetPercent)}%` }" />
            <span :class="css(classNames.lineContainer, classNames.activeSection)"
                  :style="{ [lengthString]: `${Math.abs(zeroOffsetPercent - thumbOffsetPercent)}%` }" />
            <span :class="css(classNames.lineContainer, classNames.inactiveSection)"
                  :style="{ [lengthString]: `${Math.min(100 - thumbOffsetPercent, 100 - zeroOffsetPercent)}%` }" />
          </template>
          <template v-else>
            <span :class="css(classNames.lineContainer, classNames.activeSection)"
                  :style="{ [lengthString]: `${thumbOffsetPercent}%` }" />
            <span :class="css(classNames.lineContainer, classNames.inactiveSection)"
                  :style="{ [lengthString]: `${100 - thumbOffsetPercent}%` }" />
          </template>
        </div>
      </div>
      <Label :class="classNames.valueLabel">
        <slot name="value" :value="value">
          {{ value }}
        </slot>
      </Label>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Label } from '../Label/'
import { ISliderProps, ISliderStyles } from './Slider.types'
import BaseComponent from '../BaseComponent'
import { KeyCodes, classNamesFunction } from '@uifabric-vue/utilities'

const getClassNames = classNamesFunction()

export const ONKEYDOWN_TIMEOUT_DURATION = 1000

interface IProps {
  value: number
  defaultValue: number
  min: number
  [key: string]: any
}

export interface ISliderState {
  value?: number;
  renderedValue?: number;
}

@Component({
  components: { Label },
})
export default class Slider extends BaseComponent<IProps, ISliderState> {
  public static defaultProps: ISliderProps = {
    step: 1,
    min: 0,
    max: 10,
    showValue: true,
    disabled: false,
    vertical: false,
    buttonProps: {},
    originFromZero: false,
  };

  $refs!: {
    sliderLine: HTMLDivElement
  }

  private onKeyDownTimer = -1;

  constructor () {
    super()
    this.state = {
      value: this.props.value || this.props.defaultValue || this.props.min,
      renderedValue: undefined,
    }
  }

  get classNames () {
    const { className, disabled, vertical, renderedValue, value, showValue, theme, styles } = this.props
    return getClassNames(styles, {
      className,
      disabled,
      vertical,
      showTransitions: renderedValue === value,
      showValue,
      theme: theme!,
    })
  }

  get thumbOffsetPercent () {
    const { min, max } = this.props
    const { renderedValue } = this
    return min === max ? 0 : ((renderedValue! - min!) / (max! - min!)) * 100
  }

  get zeroOffsetPercent () {
    const { min, max } = this.props
    return min! >= 0 ? 0 : (-min! / (max! - min!)) * 100
  }

  get lengthString () {
    return this.props.vertical ? 'height' : 'width'
  }

  public get value (): number | undefined {
    const { value = this.state.value } = this.props
    if (this.props.min === undefined || this.props.max === undefined || value === undefined) {
      return undefined
    } else {
      return Math.max(this.props.min, Math.min(this.props.max, value))
    }
  }

  private get renderedValue (): number | undefined {
    // renderedValue is expected to be defined while user is interacting with control, otherwise `undefined`. Fall back to `value`.
    const { renderedValue = this.value } = this.state
    return renderedValue
  }

  private onMouseDown (event: any) {
    if (this.props.disabled) return
    if (event.type === 'mousedown') {
      window.addEventListener('mousemove', this.onMove, true)
      window.addEventListener('mouseup', this.onMouseUp, true)
    } else if (event.type === 'touchstart') {
      window.addEventListener('touchmove', this.onMove, true)
      window.addEventListener('touchend', this.onMouseUp, true)
    }
    this.onMove(event)
  }

  private onMouseUp (event: any) {
    if (this.props.disabled) return
    this.setState({
      renderedValue: this.state.value,
    })
    window.removeEventListener('mousemove', this.onMove, true)
    window.removeEventListener('mouseup', this.onMouseUp, true)
    window.removeEventListener('touchmove', this.onMove, true)
    window.removeEventListener('touchend', this.onMouseUp, true)
  }

  private onMove (event: any) {
    window.requestAnimationFrame(() => {
      const { max, min, step, vertical } = this.props
      const steps: number = (max! - min!) / step!
      const sliderPositionRect: ClientRect = this.$refs.sliderLine.getBoundingClientRect()
      const sliderLength: number = !vertical
        ? sliderPositionRect.width
        : sliderPositionRect.height
      const stepLength: number = sliderLength / steps
      let currentSteps: number | undefined
      let distance: number | undefined

      if (!vertical) {
        const left: number | undefined = this.getPosition(event, vertical)
        distance = left! - sliderPositionRect.left
        currentSteps = distance / stepLength
      } else {
        const bottom: number | undefined = this.getPosition(event, vertical)
        distance = sliderPositionRect.bottom - bottom!
        currentSteps = distance / stepLength
      }

      let value: number
      let renderedValue: number

      // The value shouldn't be bigger than max or be smaller than min.
      if (currentSteps! > Math.floor(steps)) {
        renderedValue = value = max as number
      } else if (currentSteps! < 0) {
        renderedValue = value = min as number
      } else {
        renderedValue = min! + step! * currentSteps!
        value = min! + step! * Math.round(currentSteps!)
      }

      this.updateValue(value, renderedValue)
    })
  }

  private getPosition (event: MouseEvent | TouchEvent, vertical: boolean | undefined): number | undefined {
    let currentPosition: number | undefined
    switch (event.type) {
      case 'mousedown':
      case 'mousemove':
        currentPosition = !vertical
          ? (event as MouseEvent).clientX
          : (event as MouseEvent).clientY
        break
      case 'touchstart':
      case 'touchmove':
        currentPosition = !vertical
          ? (event as TouchEvent).touches[0].clientX
          : (event as TouchEvent).touches[0].clientY
        break
    }
    return currentPosition
  }

  private updateValue (value: number, renderedValue: number): void {
    const { step, snapToStep } = this.props
    let numDec = 0
    if (isFinite(step!)) {
      while (Math.round(step! * Math.pow(10, numDec)) / Math.pow(10, numDec) !== step!) {
        numDec++
      }
    }
    // Make sure value has correct number of decimal places based on number of decimals in step
    const roundedValue = parseFloat(value.toFixed(numDec))
    const valueChanged = roundedValue !== this.value

    if (snapToStep) {
      renderedValue = roundedValue
    }

    this.setState({
      value: roundedValue,
      renderedValue,
    })
    this.$emit('input', this.state.value)
  }

  private onKeyDown (event: KeyboardEvent): void {
    let value: number | undefined = this.value
    const { max, min, step } = this.props

    let diff: number | undefined = 0

    switch (event.which) {
      case KeyCodes.left:
      case KeyCodes.down:
        diff = -(step as number)

        this.clearOnKeyDownTimer()
        this.setOnKeyDownTimer(event)

        break
      case KeyCodes.right:
      case KeyCodes.up:
        diff = step

        this.clearOnKeyDownTimer()
        this.setOnKeyDownTimer(event)

        break

      case KeyCodes.home:
        value = min
        break

      case KeyCodes.end:
        value = max
        break

      default:
        return
    }

    const newValue: number = Math.min(max as number, Math.max(min as number, value! + diff!))

    this.updateValue(newValue, newValue)

    event.preventDefault()
    event.stopPropagation()
  }

  private clearOnKeyDownTimer (): void {
    clearTimeout(this.onKeyDownTimer)
  };

  private setOnKeyDownTimer (event: KeyboardEvent): void {
    this.onKeyDownTimer = setTimeout(() => {
    }, ONKEYDOWN_TIMEOUT_DURATION)
  };
}
</script>
