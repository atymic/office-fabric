
import { Vue, Component, Prop } from 'vue-property-decorator'
import BaseComponent from '../BaseComponent'
import { classNamesFunction, getWindow, getDocument, assign, IRectangle } from '@uifabric-vue/utilities'
import { IPosition, ICalloutPositionedInfo, positionCallout } from '../../utilities/positioning'
import { getStyles } from './CalloutContent.styles'
import { concatStyleSetsWithProps } from '@uifabric/merge-styles'
import { clickedOutside } from '../../utilities/clickedOutside'
import { CreateElement } from 'vue'

const getClassNames = classNamesFunction()

@Component
export class CalloutContentBase extends BaseComponent {
  $refs!: {
    hostElement: HTMLDivElement
    calloutElement: HTMLDivElement
  }

  @Prop({ type: HTMLElement, required: true }) target!: HTMLElement
  @Prop({ type: Number, default: null }) calloutWidth!: number
  @Prop({ type: Number, default: 16 }) beakWidth!: number
  @Prop({ type: Number, default: 8 }) minPagePadding!: number
  @Prop({ type: Boolean, default: true }) isBeakVisible!: boolean
  @Prop({ type: Boolean, default: false }) coverTarget!: boolean
  @Prop({ type: Number, default: 0 }) gapSpace!: number
  @Prop({ type: Number, default: undefined }) finalHeight!: number
  @Prop({ type: Number, default: undefined }) calloutMaxWidth!: number
  @Prop({ type: String, default: undefined }) backgroundColor!: string

  private internalKey = new Date()
  private positions: any = null

  positionAttempts = 0;

  created () {
    window.addEventListener('click', this.onGlobalClick, true)
    window.addEventListener('scroll', this.onGlobalScroll, true)
  }

  beforeDestroy () {
    window.removeEventListener('click', this.onGlobalClick, true)
    window.removeEventListener('scroll', this.onGlobalScroll, true)
  }

  updated () {
    this.internalKey = new Date()
  }

  mounted () {
    this.updatePosition()
  }

  get classNames (): any {
    const { theme, className, calloutMaxWidth, backgroundColor, finalHeight, positions, styles, calloutWidth, beakWidth } = this

    return getClassNames(styles!, {
      theme: theme!,
      className,
      overflowYHidden: !!finalHeight,
      calloutWidth,
      positions,
      beakWidth,
      backgroundColor,
      calloutMaxWidth,
    })
  }

  get actualBeakWidth () {
    return Math.sqrt(this.beakWidth * this.beakWidth * 2)
  }

  private get positionCss () {
    if (!this.positions) return null
    const positionCss = this.positions
    for (const key in positionCss.elementPosition) {
      positionCss.elementPosition[key] = `${positionCss.elementPosition[key]}px`
    }
    for (const key in positionCss.beakPosition.elementPosition) {
      positionCss.beakPosition.elementPosition[key] = `${positionCss.beakPosition.elementPosition[key]}px`
    }
    return positionCss
  }

  private updatePosition () {
    const positions = this.positions

    const currentProps: any = { ...this.$props }
    currentProps!.bounds = this.bounds
    currentProps!.target = this.target!
    const newPositions = positionCallout(currentProps, this.$refs.hostElement, this.$refs.calloutElement, this.positions)

    if (
      (!positions && newPositions) ||
        (positions && newPositions && !this._arePositionsEqual(positions, newPositions) && this.positionAttempts < 5)
    ) {
      this.positionAttempts++
      this.positions = newPositions
    } else if (this.positionAttempts > 0) {
      this.positionAttempts = 0
      this.$emit('positioned', this.positions)
    }
  }

  private onGlobalClick (e: Event) {
    const outside = clickedOutside(e, this.$refs.calloutElement)
    if (outside) this.$emit('dismiss', true)
  }

  private onGlobalScroll (e: Event) {
    this.$emit('dismiss', true)
  }

  private get bounds (): IRectangle {
    return {
      top: 0 + this.minPagePadding!,
      left: 0 + this.minPagePadding!,
      right: window.innerWidth - this.minPagePadding!,
      bottom: window.innerHeight - this.minPagePadding!,
      width: window.innerWidth - this.minPagePadding! * 2,
      height: window.innerHeight - this.minPagePadding! * 2,
    }
  }

  private _arePositionsEqual (positions: ICalloutPositionedInfo, newPosition: ICalloutPositionedInfo): boolean {
    return (
      this._comparePositions(positions.elementPosition, newPosition.elementPosition) &&
      this._comparePositions(positions.beakPosition.elementPosition, newPosition.beakPosition.elementPosition)
    )
  }

  private _comparePositions (oldPositions: IPosition, newPositions: IPosition): boolean {
    for (const key in newPositions) {
      // This needs to be checked here and below because there is a linting error if for in does not immediately have an if statement
      if (newPositions.hasOwnProperty(key)) {
        const oldPositionEdge = oldPositions[key]
        const newPositionEdge = newPositions[key]

        if (oldPositionEdge !== undefined && newPositionEdge !== undefined) {
          if (oldPositionEdge.toFixed(2) !== newPositionEdge.toFixed(2)) {
            return false
          }
        } else {
          return false
        }
      }
    }
    return true
  }

  render (h: CreateElement) {
    const { classNames, positionCss, isBeakVisible } = this

    return h('div', {
      ref: 'hostElement',
      class: classNames.container,
    }, [
      h('div', {
        ref: 'calloutElement',
        class: classNames.root,
        style: positionCss ? positionCss.elementPosition : null,
      }, [
        isBeakVisible && h('div', {
          class: classNames.beak,
          style: (positionCss && positionCss.beakPosition) ? positionCss.beakPosition.elementPosition : null,
        }),
        isBeakVisible && h('div', { class: classNames.beakCurtain }),
        h('div', { class: classNames.calloutMain }, [
          this.$slots.default,
        ]),
      ]),
    ])
  }
}
