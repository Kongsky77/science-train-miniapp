<template>
  <view
    class="page"
    :style="{
      background: background || '',
    }"
  >
    <view class="content-box">
      <image
        class="header-pic"
        mode="widthFix"
        role="img"
        :src="indexImgUrl() + '/header_text.png'"
      />
      <view class="input-row">
        <view class="input-icon-box">
          <van-icon size="52rpx" color="#979797" name="phone-o" />
        </view>
        <view class="input-box">
          <input type="text" placeholder="请输入手机号" v-model="phone" />
        </view>
      </view>
      <view class="input-row">
        <view class="input-icon-box">
          <van-icon size="52rpx" color="#979797" name="chat-o" />
        </view>
        <view class="input-box">
          <input type="text" placeholder="请输入验证码" v-model="code" />
        </view>
        <view class="input-right-box">
          <button
            type="primary"
            class="primary-btn"
            @click="getSmsCode"
            v-show="!isCount"
          >
            获取验证码
          </button>
          <button type="primary" style="width: 220rpx;" class="disable-btn" v-show="isCount">
            {{ countBtnText }}
          </button>
        </view>
      </view>
      <view class="btn-row">
        <button type="primary" class="primary-btn" @click="login">登录</button>
      </view>
      <view class="btn-row btn-row2 ">
        <button type="default" class="plain-btn" @click="goWechatLogin">
          手机号快捷登录
        </button>
      </view>
      <view class="footer-box">
        <view class="footer-text"
          >温馨提示：登录时我们将未注册的用户默认注册</view
        >
      </view>
    </view>
  </view>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Count from "@/management/common/Count";
import TokenManagement from "@/management/token/TokenManagement";
import SmsService from "@/service/sms/SmsService";
import UserService from "@/service/UserService";
import BizType from "@/enums/common/BizTypeEnum";
import { resolvePostLoginPath } from "@/logic/navigation/LoginRedirectLogic";

const staticImageBaseUrl =
  process.env.VUE_APP_BLOB_IMAGE_URL_NEW ||
  "https://contentdevsa-blob.ai121.net/kjg-static";

const isValidPhone = (phone: string) => {
  return /^1[0-9]{10}$/.test(phone);
};

@Component({
  name: "Login",
})
export default class Login extends Vue {
  countBtnText = "获取验证码";
  isCount = false;
  phone = "";
  code = "";
  subUserId = "";

  jumpPath = "";
  active = -1;

  activityId = "";

  mounted() {}
  onLoad(option) {
    if (option.pathKey !== undefined) {
      try {
        this.jumpPath = resolvePostLoginPath(
          JSON.parse(decodeURIComponent(option.pathKey))
        );
      } catch {}
    }

    if (option.activityId !== "") {
      this.activityId = option.activityId;
    }

    if (option.subUserId !== undefined || null) {
      this.subUserId = option.subUserId;
    }

    if (option.active !== undefined || null) {
      this.active = option.active;
    }
  }

  updateCountBtn(second: string) {
    this.countBtnText = `剩余${second}秒`;
  }

  finishCount() {
    this.countBtnText = "获取验证码";
  }

  getSmsCode() {
    const phone = this.phone;
    if (isValidPhone(phone)) {
      const smsService = new SmsService();
      smsService.getSmsCode(phone, BizType.LOGIN).then((res) => {
        if (res.success) {
          this.isCount = true;
          const count = new Count({
            onUpdate: this.updateCountBtn,
            onFinish: this.finishCount,
          });
          count.start();
        } else {
          uni.showToast({
            icon: "none",
            title: `登录失败:${res.error}`,
            duration: 2000,
          });
        }
      });
    } else {
      uni.showToast({
        icon: "none",
        title: "请输入正确的手机号",
        duration: 2000,
      });
    }
  }

  login() {
    const userService = new UserService();
    userService.login(this.phone, this.code).then((res) => {
      if (res.success && res.data) {
        const token = res.data.accessToken;
        const tokenManagement = new TokenManagement();
        tokenManagement.saveToken(token);
        if (this.jumpPath !== "" && this.active > -1) {
          uni.reLaunch({
            url: this.jumpPath + "?active=" + this.active,
          });
        } else if (this.jumpPath != "" && this.subUserId !== "") {
          uni.reLaunch({
            url: this.jumpPath + "?subUserId=" + this.subUserId,
          });
        } else if (this.jumpPath !== "" && this.activityId !== "") {
          uni.reLaunch({
            url: this.jumpPath + "?id=" + this.activityId,
          });
        } else if (this.jumpPath !== "") {
          uni.reLaunch({
            url: this.jumpPath,
          });
        } else {
          uni.reLaunch({
            url: "/pages/tab/index",
          });
        }
      }
    });
  }
  get background() {
    return `url("${staticImageBaseUrl}/index/index_bg.png") repeat 100% 100%`;
  }
  indexImgUrl(folderName = "/login") {
    return `${staticImageBaseUrl}${folderName}`;
  }

  goWechatLogin() {
    uni.navigateBack({
      delta: 1,
    });
  }
}
</script>
<style lang="scss" scoped>
.page {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center bottom;

  .content-box {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    position: relative;
    width: 100%;
    left: 50%;
    transform: translateX(-50%);
    .header-pic {
      width: 60%;
      display: block;
      box-sizing: border-box;
      margin: 200rpx auto 100rpx;
    }

    .input-row {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 32rpx 34rpx 0;
      height: 88rpx;
      line-height: 88rpx;
      background: #fff;
      box-shadow: 0rpx 0rpx 12rpx 2rpx rgba(0, 0, 0, 0.16);
      border-radius: 20rpx ;
    }

    .input-icon-box {
      // width: 80rpx;
      // height: 88rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 10rpx;
      padding: 0 36rpx;
    }

    // .input-icon {
    //   width: 54rpx;
    // }

    .input-box {
      flex: 1;
      padding-right: 8rpx;
      height: 88rpx;
      line-height: 88rpx;
      input{
        height: 88rpx;
        font-size: 32rpx;
        line-height: 88rpx;
      }
    }

    .text-row {
      padding: 30rpx 0;
      margin-bottom: 60rpx;
    }

    .btn-row {
      padding: 16rpx 34rpx;
      width: 100%;
      box-sizing: border-box;
      margin-top: 280rpx;
      &.btn-row2 {
        margin-top: 0rpx;
      }
    }

    .primary-btn {
      background: #1792ef;
      color: #fff;
      font-size: 32rpx;
      height: 88rpx;
      line-height: 88rpx;
    }
    .input-right-box {
      button::after{
        display: none;
      }
      .primary-btn {
        width: 220rpx;
        height: 68rpx;
        position: static;
        margin-right: 8rpx;
        line-height: 68rpx;
        border-radius: 20rpx;
        font-size: 28rpx;
      }
    }

    .disable-btn {
      color: #fff;
      font-size: 32rpx;
      height: 88rpx;
      line-height: 88rpx;
    }

    .plain-btn {
      color: #fff;
      background: #2ebf4b;
      font-size: 32rpx;
      border: none;
      height: 88rpx;
      line-height: 88rpx;
    }
  }

  .footer-box {
    padding: 40rpx;
  }

  .footer-text {
    font-size: 24rpx;
    text-align: center;
    color: #ececec;
  }
}
</style>

