<template>
  <view class="page">
    <image
      class="login-background"
      src="https://contentdevsa-blob.ai121.net/testcontainer/621684277780484154_621684965985324158.jpg"
      mode="aspectFill"
      role="img"
    />
    <view class="content-box">
      <view class="btn-row">
        <button
          class="primary-btn"
          open-type="getPhoneNumber"
          type="primary"
          @getphonenumber="onGetPhoneNumber"
        >
          <text class="primary-btn-label">手机号快捷登录</text>
          <text class="primary-btn-arrow" aria-hidden="true">›</text>
        </button>
      </view>
      <!-- <view class="btn-row">
        <button class="plain-btn" type="default" @click="goSmsLogin">
          验证码登录
        </button>
      </view> -->
    </view>
    <view class="footer-box">
      <view class="footer-text">温馨提示：登录时我们将未注册的用户默认注册</view>
    </view>
  </view>
</template>
<script lang="ts">
import { State, Mutation } from "vuex-class";
import { Component, Vue } from "vue-property-decorator";
import UserService from "@/service/UserService";
import TokenManagement from "@/management/token/TokenManagement";
import UserInfoResponse from "@/beans/common/UserInfoResponse";
import PageManagement from "@/management/page/PageManagement";
import store from "@/store/index";
import UserInfoManagement from "@/management/user/UserInfoManagement";
import MessageService from "@/service/MessageService";
import ChannelManagement from "@/management/channel/ChannelManagement";
import ChannelKeyEnum from "@/definition/common/ChannelKeyEnum";
import { isMockMode } from "@/common/utils/MockMode";
import { resolvePostLoginPath } from "@/logic/navigation/LoginRedirectLogic";

@Component({
  name: "WechatLogin",
})
export default class WechatLogin extends Vue {
  wxLoginCode: string = "";
  jumpPath = "";
  active = -1;
  subUserId = "";
  activityId = "";
  userInfoManagement = new UserInfoManagement();
  @State((state) => state.user) private user!: UserInfoResponse;
  @Mutation("setUser") private setUser!: Function;

  mounted() {
    // 进入页面就自动获取微信 login code
    this.getWxLoginCode().then((code) => (this.wxLoginCode = code));
  }

  onLoad(option) {
    if (option.pathKey !== undefined) {
      try {
        this.jumpPath = resolvePostLoginPath(
          JSON.parse(decodeURIComponent(option.pathKey))
        );
      } catch {}
    }

    console.log(option);

    if (option.activtyId) {
      this.activityId = option.activtyId;
    }

    if (option.subUserId !== undefined || null) {
      this.subUserId = option.subUserId;
    }

    if (option.active !== undefined || null) {
      this.active = Number(option.active);
    }
  }

  /**
   * 微信手机号码授权回调
   */
  onGetPhoneNumber(event: any) {
    if (isMockMode()) {
      this.doWxPhoneQuickLogin(
        this.wxLoginCode,
        "kjg-mock-phone-encrypted-data",
        "kjg-mock-phone-iv"
      );
      return;
    }
    if (event.detail.errMsg === "getPhoneNumber:ok") {
      const detail = event.detail;

      const phoneEncryptedData = detail.encryptedData;
      const phoneIv = detail.iv;
      // 执行登录
      this.doWxPhoneQuickLogin(this.wxLoginCode, phoneEncryptedData, phoneIv);
    } else {
      this.showLoginError("需要授权手机号后才能登录");
      this.refreshWxLoginCode();
    }
  }

  /**
   * 微信手机号一键登录
   * @param code wx.login返回的code
   * @param phoneEncryptedData 手机号码解密数据
   * @param phoneIv 手机号码加密数据的iv
   */
  async doWxPhoneQuickLogin(
    code: string,
    phoneEncryptedData: string,
    phoneIv: string
  ) {
    if (!code) {
      // 重新获取 login code
      code = await this.getWxLoginCode();
    } else if (!(await this.checkWxLoginSession())) {
      code = await this.getWxLoginCode();
    }

    new UserService()
      .wechatLogin({
        phoneEncryptedData,
        phoneIv,
        code,
      })
      .then((res) => {
        if (res.success && res.data && res.data.accessToken) {
          this.setUser(res.data.user);
          this.userInfoManagement.saveUserInfo(res.data.user);
          const token = res.data.accessToken;
          store.commit("setUser", res.data.user);
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
          } else if (this.activityId !== "") {
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
        } else {
          this.showLoginError(res.error || res.code || "服务端未返回错误信息");
          this.refreshWxLoginCode();
        }
      })
      .catch((error) => {
        const message = error && error.errMsg ? error.errMsg : "请检查网络及服务器域名配置";
        this.showLoginError(message);
        this.refreshWxLoginCode();
      });

    // new MessageService().getUnreadMessage().then((res) =>{
    //   store.commit('setUnreadMessage',res.data)
    // })
  }

  showLoginError(message: string) {
    uni.showToast({
      icon: "none",
      title: `登录失败：${message}`,
      duration: 3000,
    });
  }

  refreshWxLoginCode() {
    this.getWxLoginCode()
      .then((code) => (this.wxLoginCode = code))
      .catch(() => (this.wxLoginCode = ""));
  }
  goSmsLogin() {
    uni.navigateTo({
      url:
        "/pages/smsLogin/index?pathKey=" +
        encodeURIComponent(JSON.stringify(this.jumpPath)) +
        "&active=" +
        this.active +
        "&subUserId=" +
        this.subUserId +
        "&activityId=" +
        this.activityId,
    });
  }

  /**
   * 获取微信 login code
   */
  getWxLoginCode(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      wx.login({
        success: (res) => {
          if (res.errMsg === "login:ok") {
            resolve(res.code);
          } else {
            reject(res.errMsg);
          }
        },
        fail: (res) => reject(res.errMsg),
      });
    });
  }

  /**
   * 检查微信 login session
   */
  checkWxLoginSession(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      wx.checkSession({
        success: (res) => {
          if (res.errMsg === "checkSession:ok") {
            resolve(true);
          } else {
            resolve(false);
          }
        },
        fail: (res) => resolve(false),
      });
    });
  }
}
</script>
<style lang="scss" scoped>
.page {
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  overflow: hidden;
  background: #f8fcff;

  .login-background {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 0;
    width: 100%;
    height: 100%;
  }

  .content-box {
    width: 100%;
    position: relative;
    z-index: 1;
    flex: 1;

    .btn-row {
      position: absolute;
      right: 72rpx;
      bottom: calc(86rpx + env(safe-area-inset-bottom));
      left: 72rpx;
    }

    .primary-btn {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      height: 82rpx;
      padding: 0;
      overflow: visible;
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.96) 0%,
        rgba(235, 248, 255, 0.94) 100%
      );
      border: 2rpx solid rgba(18, 105, 205, 0.72);
      border-radius: 42rpx;
      box-shadow: 0 12rpx 30rpx rgba(28, 104, 176, 0.18);
      color: #0758b8;
      font-size: 28rpx;
      font-weight: 600;
      line-height: 82rpx;
      letter-spacing: 2rpx;

      &::after {
        border: 0;
      }
    }

    .primary-btn-label {
      line-height: 1;
    }

    .primary-btn-arrow {
      position: absolute;
      top: 50%;
      right: 16rpx;
      width: 50rpx;
      height: 50rpx;
      border-radius: 50%;
      background: linear-gradient(135deg, #1685e8 0%, #0758b8 100%);
      box-shadow: 0 6rpx 14rpx rgba(7, 88, 184, 0.2);
      color: #fff;
      font-family: Arial, sans-serif;
      font-size: 38rpx;
      font-weight: 400;
      line-height: 46rpx;
      text-align: center;
      transform: translateY(-50%);
    }

    .plain-btn {
      background: #1692ef;
      border: none;
      color: #fff;
      font-size: 32rpx;
      line-height: 88rpx;
    }
  }

  .footer-box {
    position: absolute;
    right: 28rpx;
    bottom: calc(24rpx + env(safe-area-inset-bottom));
    left: 28rpx;
    z-index: 1;
  }

  .footer-text {
    color: #6684a4;
    font-size: 22rpx;
    text-align: center;
  }
}
</style>

