<template>
  <div>
    <h1>Slider</h1>
    <div class="content--inner ms-depth-8">
      <h2>Overview</h2>
    </div>

    <div class="content--inner ms-depth-8">
      <h2>Best Practices</h2>
    </div>

    <div class="content--inner ms-depth-8">
      <h2>Usage</h2>
      <h2>Horizontal Sliders</h2>
      <f-slider label="Basic Example"
                :min="0"
                :max="10"
                :value="3" />
      <f-slider label="Snapping Slider Example"
                :min="0"
                :max="50"
                :step="10"
                :value="10"
                snap-to-step />
      <f-slider label="Disabled example"
                :min="50"
                :max="500"
                :step="50"
                :default-value="300"
                show-value
                disabled />
      <f-slider v-model="value1"
                :label="`Controlled example - ${value1}`"
                :min="0"
                :max="10" />
      <f-slider label="Example with formatted value"
                :min="0"
                :max="100"
                :default-value="55"
                show-value>
        <template #value="{ value }">
          {{ value }}%
        </template>
      </f-slider>
      <f-slider label="Origin from zero"
                :min="-5"
                :max="15"
                :default-value="3"
                origin-from-zero />

      <h2>Vertical Sliders</h2>
      <div style="display: flex; height: 250px">
        <f-slider label="Basic"
                  :min="0"
                  :max="10"
                  :value="3"
                  vertical />
        <f-slider label="Disabled"
                  :min="0"
                  :max="10"
                  :value="3"
                  vertical
                  disabled />
        <f-slider label="Origin from zero"
                  :min="-5"
                  :max="15"
                  :default-value="3"
                  vertical
                  origin-from-zero />
      </div>
    </div>

    <div class="content--inner ms-depth-8">
      <h2>Implementation</h2>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
  components: {
  },
})
export default class SliderPage extends Vue {
  value1: number = 3
}
</script>

<style lang="scss" module>
</style>
