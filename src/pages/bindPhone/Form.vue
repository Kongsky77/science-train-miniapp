<template>
  <view class="page">
    <view class="box">
      <view class="box-up">
        <view class="form-row">
          <van-field
            :value="value"
            placeholder="输入新的电话号码"
            :border="false"
            @change="onPhoneChange"
          />
        </view>
        <view class="form-row">
          <van-field
            :value="code"
            center
            clearable
            placeholder="请输入短信验证码"
            :border="false"
            use-button-slot
            @change="onCodeChange"
          >
            <van-button
              slot="button"
              size="small"
              type="primary"
              color="#3646A5"
              @click="getSmsCode"
              v-show="!isCount"
            >
              发送验证码
            </van-button>
            <van-button
              slot="button"
              size="small"
              type="primary"
              color="#3646A5"
              v-show="isCount"
              disabled
            >
              {{ countBtnText }}
            </van-button>
          </van-field>
        </view>
      </view>

      <view class="btn" @click="submit">更换手机号</view>
    </view>
  </view>
</template>
<script lang="ts">
import { Action } from 'vuex-class'

import { Component, Vue } from 'vue-property-decorator'
import SmsService from '@/service/sms/SmsService'
import BizType from '@/enums/common/BizTypeEnum'
import Count from '@/management/common/Count'
import UserService from '@/service/UserService'

const isValidPhone = (phone: string) => {
  return /^1[0-9]{10}$/.test(phone)
}

@Component({
  name: 'BindPhoneForm',
  components: {}
})
export default class BindPhoneForm extends Vue {
  @Action('getUser') private getUser!: Function
  countBtnText = '获取验证码'
  isCount = false
  phone = ''
  code = ''

  onPhoneChange (event: any) {
    const value = event.detail
    this.phone = value
  }

  onCodeChange (event: any) {
    const value = event.detail
    this.code = value
  }

  updateCountBtn (second: string) {
    this.countBtnText = `剩余${second}秒`
  }

  finishCount () {
    this.countBtnText = '获取验证码'
    this.isCount = false
  }

  getSmsCode () {
    const phone = this.phone
    if (isValidPhone(phone)) {
      const smsService = new SmsService()
      smsService.getSmsCode(phone, BizType.CHANGE_PASSWORD).then(res => {
        if (res.success) {
          this.isCount = true
          const count = new Count({
            onUpdate: this.updateCountBtn,
            onFinish: this.finishCount
          })
          count.start()
          uni.showToast({
            icon: 'none',
            title: '获取验证码成功',
            duration: 2000
          })
        } else {
          uni.showToast({
            icon: 'none',
            title: `获取验证码失败:${res.error}`,
            duration: 2000
          })
        }
      })
    } else {
      uni.showToast({
        icon: 'none',
        title: '请输入正确的手机号',
        duration: 2000
      })
    }
  }

  submit () {
    const userService = new UserService()
    userService.changePhone(this.phone, this.code).then(res => {
      if (res.success) {
        uni.navigateBack({
          delta: 2
        })
        uni.$emit('changePhone')
        this.getUser()
      } else {
        uni.showToast({
          icon: 'none',
          title: res.error,
          duration: 2000
        })
      }
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

.form-row {
  border-bottom: 1px solid #efefef;
}
</style>
