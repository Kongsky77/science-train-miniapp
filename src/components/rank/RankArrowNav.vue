<style lang="scss" scoped>
@import './RankArrowNav.scss';
</style>
<template>
  <view class="arrow-nav">
    <view class="arrow-left" @click="onClickLeftArrow">
      <image
        class="arrow-icon left"
        mode="aspectFill"
        src="https://contentdevsa-blob.ai121.net/testcontainer/activity/image/f3fbe30e-e5b2-42cd-a0be-a7f731d7a4f0.svg"
      ></image>
    </view>
    <view class="arrow-nav-text">{{ text }}</view>
    <view class="arrow-right" @click="onClickRightArrow">
      <image
        class="arrow-icon right"
        mode="aspectFill"
        src="https://contentdevsa-blob.ai121.net/testcontainer/activity/image/f3fbe30e-e5b2-42cd-a0be-a7f731d7a4f0.svg"
      ></image>
    </view>
  </view>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  name: 'ArrowNav'
})
export default class ArrowNav extends Vue {
  @Prop() options?: any
  @Prop() activeId?: string

  get text () {
    const { options, activeId } = this
    let text = ''
    options.forEach((option) => {
      if (option.id === activeId) {
        text = option.text
      }
    })
    return text
  }

  onClickLeftArrow () {
    const nextIndex = this.options.reduce(
      (nextIndex, arrowNav, index, array) => {
        if (arrowNav.id === this.activeId) {
          if (index > 0) {
            return index - 1
          } else {
            return array.length - 1
          }
        }

        return nextIndex
      },
      0
    )

    this.$emit('onArrowNavClick', this.options[nextIndex].id)
  }

  onClickRightArrow () {
    const nextIndex = this.options.reduce(
      (nextIndex, arrowNav, index, array) => {
        if (arrowNav.id === this.activeId) {
          if (index < array.length - 1) {
            return index + 1
          } else {
            return 0
          }
        }

        return nextIndex
      },
      0
    )

    this.$emit('onArrowNavClick', this.options[nextIndex].id)
  }
}
</script>
