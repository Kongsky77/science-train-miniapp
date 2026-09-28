<style lang="scss" scoped>
@import './RankNav.scss';
</style>
<template>
  <view class="nav-box">
    <view
      @click="onClickItem(option)"
      class="nav-item"
      :class="{ active: activeId === option.id }"
      v-for="option of options"
      :key="option.id"
      >
        <view class="cycle">{{ option.cycle }}</view>
        <view class="text">{{option.text}}</view>
      </view
    >
    <!-- <view class="nav-item">历史排行榜</view> -->
  </view>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  name: 'RankNav'
})
export default class RankNav extends Vue {
  @Prop() options?: any
  @Prop() activeId?: string

  onClickItem (option) {
    this.$emit('onNavClick', option)
  }
}
</script>
