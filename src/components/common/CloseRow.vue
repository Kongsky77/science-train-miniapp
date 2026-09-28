<template>
  <view class="close-row">
    <view class="close-btn">
      <van-icon name="cross" />
    </view>
  </view>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'CloseRow',
  components: {}
})
export default class CloseRow extends Vue {}
</script>
<style scoped>
.close-row {
  display: flex;
  justify-content: flex-end;
}

.close-btn {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 40rpx;
}
</style>