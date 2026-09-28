<style lang="scss" scoped>
@import './RankTab.scss';
</style>
<template>
  <view class="tab-box">
    <view
      @click="onClickItem(option)"
      class="tab-item"
      :class="{ active: activeId === option.id }"
      v-for="option of options"
      :key="option.id"
      >{{ option.text }}</view
    >
    <!-- <view class="tab-item">历史排行榜</view> -->
  </view>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  name: 'RankTab'
})
export default class RankTab extends Vue {
  @Prop() options?: any
  @Prop() activeId?: string

  onClickItem (option) {
    this.$emit('onTabClick', option)
  }
}
</script>
