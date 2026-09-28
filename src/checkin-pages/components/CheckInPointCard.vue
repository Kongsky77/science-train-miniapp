<template>
  <view class="point-card" :class="pointClass">
    <view class="carriage-mark">
      <text class="carriage-label">打卡点</text>
      <text class="carriage-number">{{ displayIndex }}</text>
    </view>

    <view class="point-main">
      <view class="point-heading">
        <view class="point-title">{{ point.name }}</view>
        <view class="status-tag" :class="statusClass">
          {{ statusText }}
        </view>
      </view>

      <view v-if="point.address" class="point-address">{{ point.address }}</view>

      <view class="point-meta">
        <view class="meta-item meta-item--score">+{{ formatScore(point.score) }} 积分</view>
        <view class="meta-item">范围 {{ point.radiusMeter }} 米</view>
        <view v-if="point.photoRequired" class="meta-item">需照片</view>
      </view>

      <view v-if="timeText" class="point-time">{{ timeText }}</view>

      <view v-if="point.status === statusEnum.COMPLETED" class="completed-box">
        <view>
          <view class="completed-title">已完成</view>
          <view class="completed-time">{{ completedTime }}</view>
        </view>
        <image
          v-if="point.photoUrl"
          class="completed-photo"
          mode="aspectFill"
          :src="point.photoUrl"
          @click.stop="previewPhoto"
        ></image>
      </view>

      <view class="point-actions">
        <view class="location-link" @click.stop="$emit('open-location', point)">
          <van-icon name="location-o" size="28rpx" />
          <text class="location-link-text">查看位置</text>
        </view>
        <van-button
          v-if="point.status === statusEnum.AVAILABLE"
          size="small"
          round
          color="#e42b2b"
          :loading="busy"
          :disabled="busy"
          @click.stop="$emit('check-in', point)"
        >{{ busy ? "处理中" : "立即打卡" }}</van-button>
      </view>
    </view>

    <view class="wheel wheel--left"></view>
    <view class="wheel wheel--right"></view>
  </view>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import dayjs from 'dayjs'
import CheckInPoint from '@/beans/check-in/CheckInPoint'
import CheckInPointStatus from '@/definition/check-in/CheckInPointStatus'

@Component({ name: 'CheckInPointCard' })
export default class CheckInPointCard extends Vue {
  @Prop({ required: true }) point!: CheckInPoint
  @Prop({ default: 0 }) index!: number
  @Prop({ default: false }) busy!: boolean

  statusEnum = CheckInPointStatus

  get displayIndex (): string {
    const value = String(this.index + 1)
    return value.length < 2 ? `0${value}` : value
  }

  get pointClass (): string {
    return `point-card--${this.point.status.toLowerCase()}`
  }

  get statusClass (): string {
    return `status-tag--${this.point.status.toLowerCase()}`
  }

  get statusText (): string {
    const statusTextMap = {
      [CheckInPointStatus.NOT_STARTED]: '未开始',
      [CheckInPointStatus.AVAILABLE]: '可打卡',
      [CheckInPointStatus.COMPLETED]: '已完成',
      [CheckInPointStatus.ENDED]: '已结束',
      [CheckInPointStatus.DISABLED]: '已停用'
    }
    return statusTextMap[this.point.status]
  }

  get timeText (): string {
    if (!this.point.startTime && !this.point.endTime) return ''
    const start = this.point.startTime ? dayjs(this.point.startTime).format('MM月DD日 HH:mm') : ''
    const end = this.point.endTime ? dayjs(this.point.endTime).format('MM月DD日 HH:mm') : ''
    if (start && end) return `${start} — ${end}`
    return start ? `${start} 开始` : `${end} 结束`
  }

  get completedTime (): string {
    return this.point.checkedInAt ? dayjs(this.point.checkedInAt).format('YYYY-MM-DD HH:mm') : ''
  }

  formatScore (score: number): string {
    return Number(score.toFixed(4)).toString()
  }

  previewPhoto () {
    if (!this.point.photoUrl) return
    uni.previewImage({
      current: this.point.photoUrl,
      urls: [this.point.photoUrl]
    })
  }
}
</script>

<style scoped lang="scss">
.point-card {
  position: relative;
  display: flex;
  margin-bottom: 30rpx;
  padding: 28rpx 26rpx 34rpx 22rpx;
  border: 1rpx solid rgba(203, 37, 42, 0.12);
  border-radius: 26rpx;
  background: #fff;
  box-shadow: 0 12rpx 30rpx rgba(42, 49, 68, 0.08);
  overflow: visible;
}

.point-card::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 8rpx;
  border-radius: 26rpx 26rpx 0 0;
  background: linear-gradient(90deg, #b91f29, #e42b2b 55%, #f1c36a);
}

.point-card--completed {
  border-color: rgba(33, 145, 95, 0.18);
}

.point-card--completed::before {
  background: linear-gradient(90deg, #16875a, #43b477);
}

.point-card--not_started,
.point-card--ended {
  background: #fbfbfc;
}

.carriage-mark {
  width: 88rpx;
  min-width: 88rpx;
  height: 88rpx;
  margin: 8rpx 22rpx 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 18rpx;
  color: #fff;
  background: linear-gradient(145deg, #c8232d, #93131c);
  box-shadow: inset 0 0 0 3rpx rgba(255, 255, 255, 0.18);
}

.carriage-label {
  font-size: 18rpx;
  opacity: 0.86;
}

.carriage-number {
  margin-top: 2rpx;
  font-size: 32rpx;
  font-weight: 700;
}

.point-main {
  flex: 1;
  min-width: 0;
}

.point-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.point-title {
  flex: 1;
  padding-right: 16rpx;
  color: #22252b;
  font-size: 32rpx;
  line-height: 1.35;
  font-weight: 600;
}

.status-tag {
  flex-shrink: 0;
  padding: 6rpx 14rpx;
  border-radius: 999rpx;
  color: #8a5c21;
  background: #fff4dc;
  font-size: 20rpx;
}

.status-tag--completed {
  color: #14754e;
  background: #e8f7ef;
}

.status-tag--ended,
.status-tag--disabled {
  color: #777d86;
  background: #eff1f4;
}

.status-tag--not_started {
  color: #416b99;
  background: #eaf3fb;
}

.point-address,
.point-time {
  margin-top: 12rpx;
  color: #777e88;
  font-size: 24rpx;
  line-height: 1.5;
}

.point-time {
  color: #969ca5;
  font-size: 22rpx;
}

.point-meta {
  display: flex;
  flex-wrap: wrap;
  margin-top: 18rpx;
}

.meta-item {
  margin: 0 10rpx 10rpx 0;
  padding: 6rpx 12rpx;
  border-radius: 8rpx;
  color: #6e747d;
  background: #f3f5f7;
  font-size: 20rpx;
}

.meta-item--score {
  color: #a6252d;
  background: #fff0f0;
}

.completed-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20rpx;
  padding: 18rpx;
  border-radius: 16rpx;
  background: #f0f9f4;
}

.completed-title {
  color: #16875a;
  font-size: 24rpx;
  font-weight: 600;
}

.completed-time {
  margin-top: 6rpx;
  color: #7c9185;
  font-size: 20rpx;
}

.completed-photo {
  width: 88rpx;
  height: 88rpx;
  border-radius: 12rpx;
}

.point-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 22rpx;
}

.location-link {
  display: flex;
  align-items: center;
  color: #8b5d35;
  font-size: 23rpx;
}

.location-link-text {
  margin-left: 6rpx;
}

.wheel {
  position: absolute;
  bottom: -11rpx;
  width: 22rpx;
  height: 22rpx;
  border: 5rpx solid #434750;
  border-radius: 50%;
  background: #d9dce1;
}

.wheel--left {
  left: 98rpx;
}

.wheel--right {
  right: 48rpx;
}
</style>
