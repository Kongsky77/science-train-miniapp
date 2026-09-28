<template>
  <view class="feedback-page">
    <view class="contact-card">
      <view class="contact-icon" aria-hidden="true">
        <view class="contact-dot"></view>
        <view class="contact-dot"></view>
        <view class="contact-dot"></view>
      </view>
      <view class="contact-title">需要帮助？</view>
      <view class="contact-description">点击下方按钮联系在线客服</view>

      <!-- #ifdef MP-WEIXIN -->
      <button
        class="contact-button"
        open-type="contact"
        session-from="activity-users-mp"
        send-message-title="活动咨询"
        send-message-path="/pages/tab/index"
        :show-message-card="true"
        @error="onContactError"
      >
        联系在线客服
      </button>
      <!-- #endif -->

      <!-- #ifndef MP-WEIXIN -->
      <button class="contact-button" @click="showUnsupported">
        联系在线客服
      </button>
      <!-- #endif -->
    </view>
  </view>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({ name: 'Feedback' })
export default class Feedback extends Vue {
  onContactError () {
    uni.showToast({
      title: '客服暂时无法连接，请稍后重试',
      icon: 'none'
    })
  }

  showUnsupported () {
    uni.showToast({
      title: '请在微信小程序中联系客服',
      icon: 'none'
    })
  }
}
</script>

<style scoped lang="scss">
.feedback-page {
  box-sizing: border-box;
  min-height: 100vh;
  padding: 72rpx 36rpx;
  background: #f5f6f8;
}

.contact-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 88rpx 48rpx 76rpx;
  border-radius: 30rpx;
  background: #fff;
  box-shadow: 0 18rpx 50rpx rgba(39, 45, 58, 0.08);
}

.contact-icon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 118rpx;
  height: 92rpx;
  border-radius: 46rpx;
  background: linear-gradient(145deg, #b91f29, #e42b2b);
  box-shadow: 0 14rpx 30rpx rgba(185, 31, 41, 0.22);
}

.contact-icon::after {
  content: '';
  position: absolute;
  left: 18rpx;
  bottom: -10rpx;
  width: 26rpx;
  height: 26rpx;
  background: #b91f29;
  transform: rotate(35deg);
}

.contact-dot {
  position: relative;
  z-index: 1;
  width: 10rpx;
  height: 10rpx;
  margin: 0 7rpx;
  border-radius: 50%;
  background: #fff;
}

.contact-title {
  margin-top: 42rpx;
  color: #22252b;
  font-size: 38rpx;
  font-weight: 600;
}

.contact-description {
  margin-top: 16rpx;
  color: #8b919a;
  font-size: 25rpx;
}

.contact-button {
  width: 100%;
  height: 88rpx;
  margin-top: 56rpx;
  border: 0;
  border-radius: 44rpx;
  color: #fff;
  background: linear-gradient(90deg, #b91f29, #e42b2b);
  font-size: 29rpx;
  font-weight: 500;
  line-height: 88rpx;
  box-shadow: 0 14rpx 28rpx rgba(185, 31, 41, 0.18);
}

.contact-button::after {
  border: 0;
}
</style>
