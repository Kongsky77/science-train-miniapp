<template>
  <view class="success-page">
    <view class="success-board">
      <view class="status-header">
        <view class="eyebrow">科普列车川渝黔行</view>
      </view>

      <view class="result-mark">
        <view class="check-circle">✓</view>
        <view class="rail-line"></view>
      </view>

      <view class="result-copy">
        <view class="result-title">报名成功</view>
        <view class="result-description">
          该用户已加入活动；如需切换，请在首页点击头像。
        </view>
      </view>

      <view class="participant-block">
        <image
          class="participant-avatar"
          :src="participant.avatar || 'https://contentdevsa-blob.ai121.net/testcontainer/621684277780484154_621684965985294154.png'"
          mode="aspectFill"
        />
        <view class="participant-info">
          <view class="participant-label">已报名用户</view>
          <view class="participant-name">{{ participant.name }}</view>
          <view v-if="participant.orgName || participant.grade" class="participant-meta">
            {{ participant.orgName }}{{ participant.orgName && participant.grade ? " · " : "" }}{{ participant.grade }}
          </view>
        </view>
      </view>

      <view class="primary-action" @click="backHome">
        <text>返回首页</text>
        <text class="action-arrow">←</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

interface RegistrationParticipant {
  id: string;
  name: string;
  avatar: string;
  orgName: string;
  grade: string;
}

@Component({
  name: "KjgRegistrationSuccessPage",
})
export default class KjgRegistrationSuccessPage extends Vue {
  participant: RegistrationParticipant = {
    id: "",
    name: "未命名用户",
    avatar: "",
    orgName: "",
    grade: "",
  };

  onLoad(options: any) {
    this.participant = {
      id: this.decodeOption(options, "participantId"),
      name: this.decodeOption(options, "name") || "未命名用户",
      avatar: this.decodeOption(options, "avatar"),
      orgName: this.decodeOption(options, "orgName"),
      grade: this.decodeOption(options, "grade"),
    };
  }

  decodeOption(options: any, key: string) {
    const value = options && options[key] ? String(options[key]) : "";
    return value ? decodeURIComponent(value) : "";
  }

  backHome() {
    uni.reLaunch({ url: "/pages/tab/index" });
  }
}
</script>

<style lang="scss" scoped>
$home-bg: #fefde1;
$home-surface: #fffdfa;
$home-navy: #103873;
$home-blue: #165ddb;
$home-blue-soft: #b9dce8;
$home-teal: #078c83;
$home-text: #17233c;
$home-muted: #667085;

.success-page {
  box-sizing: border-box;
  min-height: 100vh;
  padding: 28rpx;
  background: linear-gradient(180deg, #fff 0%, #fff 24%, $home-bg 100%);
  color: $home-text;
  font-family: "PingFang SC", "Microsoft YaHei", Arial, sans-serif;
}

.success-board {
  box-sizing: border-box;
  min-height: calc(100vh - 56rpx);
  padding: 42rpx 36rpx;
  overflow: hidden;
  border: 2rpx solid rgba(185, 220, 232, 0.9);
  border-radius: 32rpx;
  background: rgba(255, 253, 250, 0.96);
  box-shadow: 0 14rpx 36rpx rgba(16, 56, 115, 0.08);
}

.status-header,
.result-mark,
.participant-block,
.primary-action {
  display: flex;
  align-items: center;
}

.status-header {
  align-items: flex-start;
  justify-content: space-between;
  gap: 24rpx;
}

.eyebrow {
  color: #FAC12A;
  font-size: 22rpx;
  font-weight: 700;
  letter-spacing: 2rpx;
}

.result-mark {
  margin-top: 56rpx;
}

.check-circle {
  display: flex;
  flex: 0 0 126rpx;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 126rpx;
  height: 126rpx;
  border: 4rpx solid $home-teal;
  border-radius: 50%;
  background: rgba(7, 140, 131, 0.1);
  box-shadow: 0 10rpx 24rpx rgba(7, 140, 131, 0.12);
  color: #FAC12A;
  font-size: 64rpx;
  font-weight: 700;
}

.rail-line {
  flex: 1;
  height: 8rpx;
  margin-left: 22rpx;
  background: repeating-linear-gradient(
    to right,
    $home-blue 0,
    $home-blue 28rpx,
    transparent 28rpx,
    transparent 42rpx
  );
}

.result-copy {
  margin-top: 48rpx;
}

.result-title {
  color: $home-navy;
  font-size: 60rpx;
  font-weight: 700;
  line-height: 1.1;
}

.result-description {
  margin-top: 18rpx;
  color: $home-muted;
  font-size: 25rpx;
  line-height: 1.75;
}

.participant-block {
  gap: 24rpx;
  margin-top: 42rpx;
  padding: 26rpx 24rpx;
  border: 2rpx solid $home-blue-soft;
  border-radius: 24rpx;
  background: rgba(226, 242, 246, 0.58);
}

.participant-avatar {
  flex: 0 0 104rpx;
  width: 104rpx;
  height: 104rpx;
  border: 2rpx solid $home-blue-soft;
  border-radius: 50%;
  background: $home-surface;
}

.participant-info {
  flex: 1;
  min-width: 0;
}

.participant-label {
  color: #FAC12A;
  font-size: 20rpx;
  font-weight: 700;
  letter-spacing: 2rpx;
}

.participant-name {
  margin-top: 7rpx;
  color: $home-navy;
  font-size: 38rpx;
  font-weight: 700;
}

.participant-meta {
  margin-top: 7rpx;
  color: $home-muted;
  font-size: 23rpx;
  line-height: 1.5;
}

.primary-action {
  justify-content: space-between;
  box-sizing: border-box;
  min-height: 92rpx;
  margin-top: 40rpx;
  padding: 0 28rpx;
  border: 2rpx solid $home-blue;
  border-radius: 46rpx;
  background: linear-gradient(135deg, #1685e8 0%, $home-blue 100%);
  box-shadow: 0 10rpx 22rpx rgba(22, 93, 219, 0.18);
  color: #fff;
  font-size: 27rpx;
  font-weight: 700;
}

.primary-action:active {
  opacity: 0.86;
}

.action-arrow {
  font-size: 38rpx;
}

</style>
