<template>
  <view class="card-date">
    <view class="card-date-month">{{ title }}</view>
    <view class="card-date-day">{{ text }}</view>
  </view>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  name: 'DateItem',
  components: {}
})
export default class DateItem extends Vue {
  @Prop()
  title = ''

  @Prop()
  text = ''
}
</script>
<style scoped>
.card-date {
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0px 3px 6px rgba(172, 172, 172, 0.47);
}

.card-date-month {
  background: #dc4453;
  color: #fff;
  font-size: 28rpx;
  text-align: center;
  padding: 10rpx;
}

.card-date-day {
  text-align: center;
  font-weight: bold;
  font-size: 36rpx;
  padding: 10rpx 10rpx;
  background: #fff;
  color: #333;
}
</style>