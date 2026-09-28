<template>
  <view class="page">
    <view class="box">
      <view class="box-up">
        <image
          class="icon"
          mode="widthFix"
          src="@/static/icon/phone-placeholder.png"
        ></image>
        <view class="title">你的手机号：{{ phone }}</view>
        <view class="tip">你可以点击下方按钮更换绑定手机号</view>
      </view>
      <view class="btn" @click="changePhone">更换手机号</view>
    </view>
  </view>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { State, Mutation } from 'vuex-class'
import UserInfoResponse from '@/beans/common/UserInfoResponse'

@Component({
  name: 'BindPhone',
  components: {}
})
export default class BindPhone extends Vue {
  @State(state => state.user) private user!: UserInfoResponse

  phone = ''

  onLoad () {
    this.phone = this.user.phoneNumber
  }

  changePhone () {
    uni.navigateTo({
      url: '/pages/bindPhone/Form'
    })
  }
}
</script>
<style lang="scss" scoped>
.page {
  padding: 40rpx;
  display: flex;
  flex-direction: column;
  min-height: 100%;
  box-sizing: border-box;
  font-size: 32rpx;
  color: #888888;
  text-align: center;
}

.box {
  background: #fff;
  border-radius: 20rpx;
  flex: 1;
  padding: 40rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.btn {
  background: $ai121-theme-color;
  color: #fff;
  padding: 30rpx 20rpx;
  text-align: center;
  border-radius: 10rpx;
  font-size: 32rpx;
  margin: 20rpx;
}

.icon {
  width: 120rpx;
  height: 200rpx;
  margin-bottom: 40rpx;
}

.title {
  margin-bottom: 20rpx;
}
</style>
