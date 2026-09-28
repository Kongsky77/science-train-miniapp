<template>
  <view
    class="page"
    :class="{ 'page--kjg': isKjgTheme }"
    v-if="!uiHidden"
  >
    <view class="title">填写信息</view>
    <view class="text">完善用户资料，便于记录科普旅程</view>
    <view class="form-list">
      <view class="form-row">
        <van-icon
          class-prefix="iconfont"
          name="iconfont icon-name"
          color="#929292"
        />
        <van-field
          :value="name"
          placeholder="姓名(选填)"
          :border="false"
          @change="onNameChange"
        />
      </view>
      <view class="form-row form-row--address">
        <van-icon name="location-o" color="#929292" />
        <textarea
          class="address-input"
          :value="recipientAddress"
          auto-height
          maxlength="120"
          placeholder="收件地址（选填）"
          placeholder-class="address-input__placeholder"
          aria-label="收件地址"
          @input="onRecipientAddressInput"
        ></textarea>
      </view>
    </view>
    <view class="submit-btn" @click="submit">下一步</view>
    <view class="bottom-tip">姓名和收件地址均为选填；收件地址仅用于奖品寄送。</view>
  </view>
  <write-fill-children-info v-else />
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import RoleEnum from "@/enums/common/RoleEnum";
import LangEnum from "@/definition/lang/LangEnum";
import WriteFillChildrenInfo from "@/pages/fillChildInfo/index.vue";

@Component({
  name: "FillInfo",
  components: {
    WriteFillChildrenInfo
  }
})
export default class FillInfo extends Vue {
  uiHidden = false;
  name = "";
  recipientAddress = "";

  get isKjgTheme() {
    return process.env.VUE_APP_THEME_TYPE === "kjg";
  }

  onNameChange(event: any) {
    const name = event.detail;
    this.name = name.replace(/\s*/g, "");
  }

  onRecipientAddressInput(event: any) {
    this.recipientAddress = String(
      event && event.detail ? event.detail.value || "" : ""
    );
  }

  mounted() {
    if (uni.getStorageSync(LangEnum.IS_HIDDEN_KEY)) {
      this.uiHidden = true;
    } else {
      this.uiHidden = false;
    }
  }

  // 下拉刷新
  onPullDownRefresh() {
    uni.stopPullDownRefresh();
  }

  submit() {
    const recipientAddress = this.recipientAddress.trim();

    const form: any = {
      realName: this.name,
      role: RoleEnum.STUDENT,
      recipientAddress,
    };

    if (form.realName === "") {
      form.realName = "无名宝" + this.randomString();
    }

    const data = JSON.stringify(form);
    uni.navigateTo({
      url: `/pages/avatar/index?data=${data}`
    });
  }

  randomString() {
    const e = 11;
    var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
      a = t.length,
      n = "";
    for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
    return n;
  }

}
</script>
<style >
@import "@/css/iconfont.css";
page {
  background: #fff;
}
</style>
<style lang="scss" scoped>
.page {
  padding: 40rpx 60rpx;
  height: 100%;
  box-sizing: border-box;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center bottom;
  background-image: $ai121-theme-bg;
}

.title {
  color: #969393;
  font-size: 64rpx;
  margin-bottom: 20rpx;
}

.text {
  color: #969393;
  font-size: 28rpx;
  margin-bottom: 40rpx;
}

.form-row {
  display: flex;
  padding: 20rpx;
  border-bottom: 1px solid #efefef;
  height: 80rpx;
  align-items: center;
}

.form-row--address {
  height: auto;
  min-height: 120rpx;
  align-items: flex-start;
  padding-top: 24rpx;
  padding-bottom: 24rpx;
}

.address-input {
  flex: 1;
  min-width: 0;
  min-height: 72rpx;
  margin-left: 30rpx;
  padding: 0;
  box-sizing: border-box;
  background: transparent;
  color: #17365f;
  font-size: 28rpx;
  line-height: 1.55;
}

.address-input__placeholder {
  color: #c8c9cc;
}

.submit-btn {
  margin-top: 60rpx;
  color: #fff;
  background: $ai121-theme-color;
  padding: 30rpx 20rpx;
  text-align: center;
  border-radius: 10rpx;
  font-size: 32rpx;
}

.bottom-tip {
  color: #504f4f;
  font-size: 30rpx;
  text-align: left;
  margin-top: 40rpx;
  font-weight: 600;

}

.page--kjg {
  min-height: 100vh;
  height: auto;
  padding: 44rpx 32rpx 70rpx;
  background: linear-gradient(180deg, #f7f3ea 0%, #edf7f7 58%, #f8fbfa 100%);

  .title {
    margin-bottom: 8rpx;
    color: #123d73;
    font-size: 44rpx;
    font-weight: 700;
    line-height: 1.35;
    letter-spacing: 1rpx;
  }

  .text {
    margin-bottom: 34rpx;
    color: #718194;
    font-size: 25rpx;
    line-height: 1.6;
  }

  .form-list {
    overflow: hidden;
    padding: 0 26rpx;
    border: 2rpx solid #c6e1e7;
    border-radius: 24rpx;
    background: rgba(255, 253, 249, 0.97);
    box-shadow: 0 12rpx 30rpx rgba(18, 71, 103, 0.07);
  }

  .form-row {
    min-height: 104rpx;
    height: auto;
    padding: 0;
    border-bottom: 2rpx solid #e3eef0;

    &:last-child {
      border-bottom: 0;
    }
  }

  .form-row--address {
    min-height: 138rpx;
    align-items: flex-start;
    padding-top: 22rpx;
  }

  /deep/ .van-cell {
    background: transparent;
    color: #17365f;
    font-size: 28rpx;
  }

  /deep/ .van-field__control {
    color: #17365f;
  }

  .submit-btn {
    margin-top: 42rpx;
    padding: 24rpx 20rpx;
    border-radius: 16rpx;
    background: #1b63d9;
    box-shadow: 0 10rpx 24rpx rgba(27, 99, 217, 0.18);
    font-size: 29rpx;
    font-weight: 600;
  }

  .bottom-tip {
    margin-top: 26rpx;
    color: #718194;
    font-size: 23rpx;
    font-weight: 400;
    line-height: 1.7;
    text-align: center;
  }
}
</style>
