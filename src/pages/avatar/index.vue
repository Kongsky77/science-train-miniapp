<template>
  <view class="page" :class="{ 'page--kjg': isKjgTheme }">
    <view class="up-box">
      <view class="sex-box">
        <image class="avatar" :src="currentAvatar" mode="widthFix"></image>
        <view class="sex-toggle">
          <view class="left-arrow" @click="toggleSex"
            ><van-icon name="arrow-left" color="#adadad"
          /></view>
          <view class="sex-type">{{ sex }}</view>
          <view class="right-arrow" @click="toggleSex"
            ><van-icon name="arrow" color="#adadad"
          /></view>
        </view>
      </view>
      <view class="avatar-box">
        <view
          class="avatar-item"
          :class="{ 'avatar-item--active': currentAvatar === avatar }"
          v-for="(avatar, index) of avatars"
          :key="index"
          @click="setAvatar(avatar)"
        >
          <image class="avatar" :src="avatar" mode="widthFix"></image>
        </view>
      </view>
    </view>
    <view class="btn-box">
      <view class="submit-btn" @click="submit"> 确认 </view>
    </view>
  </view>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AddChildRequest from "@/beans/children/req/AddChildRequest";
import { isMockMode } from "@/common/utils/MockMode";
import KjgMockAccount from "@/common/utils/KjgMockAccount";
import SexEnum from "@/enums/common/SexEnum";
import ChildrenService from "@/service/ChildrenService";
import ChannelManagement from "@/management/channel/ChannelManagement";
import ChannelKeyEnum from "@/definition/common/ChannelKeyEnum";

@Component({
  name: "Avatar",
  components: {},
})
export default class Avatar extends Vue {
  childrenService = new ChildrenService();
  isBoy = true;
  preData: any = {};
  pages = [];
  avatars: Array<string> = [];
  currentAvatar: string = `${this.imgUrl}/avatar_blue.png`;

  get sex() {
    return this.isBoy ? "男" : "女";
  }

  get isKjgTheme() {
    return process.env.VUE_APP_THEME_TYPE === "kjg";
  }

  created() {
    this.initAvaTar();
  }

  initAvaTar() {
    const theme: string = process.env.VUE_APP_THEME_TYPE;
    switch (theme) {
      default:
        this.currentAvatar = `${this.imgUrl}/avatar_blue.png`;
        this.avatars = [
          `${this.imgUrl}/avatar_blue.png`,
          `${this.imgUrl}/avatar_green.png`,
          `${this.imgUrl}/avatar_purple.png`,
          `${this.imgUrl}/avatar_yellow.png`,
          `${this.imgUrl}/avatar_orange.png`,
          `${this.imgUrl}/avatar_red.png`,
        ];
        break;
    }
  }

  get imgUrl() {
    return `${process.env.VUE_APP_BLOB_IMAGE_URL_NEW}/profile`;
  }

  toggleSex() {
    this.isBoy = !this.isBoy;
  }

  onLoad(options: any) {
    const data = JSON.parse(options.data);
    this.preData = data;
    console.log(data);
    const pages = getCurrentPages();
    this.pages = pages.map((item) => item.route);
  }

  setAvatar(avatar: string) {
    this.currentAvatar = avatar;
  }

  submit() {
    const isBoy = this.isBoy;
    const avatar = this.currentAvatar;
    const preData = this.preData;
    const requestData: AddChildRequest = {
      avatar,
      gender: isBoy ? SexEnum.BOY : SexEnum.GIRL,
      realName: preData.realName,
      ident: preData.role,
      recipientAddress: preData.recipientAddress,
      referer: process.env.VUE_APP_PROJECT_NAME,
    };
    if (ChannelManagement.getChannelId(ChannelKeyEnum.KOC) !== "") {
      requestData.kocId = ChannelManagement.getChannelId(ChannelKeyEnum.KOC);
    }

    if (isMockMode()) {
      const participant = KjgMockAccount.addParticipant({
        avatar: requestData.avatar || "",
        gender: requestData.gender,
        name: requestData.realName || "未命名用户",
        school: "",
        grade: "",
        recipientAddress: requestData.recipientAddress || "",
      });
      KjgMockAccount.setActiveParticipant(participant.id);
      uni.navigateBack({
        delta: 2,
      });
      return;
    }

    this.childrenService
      .addChildInfo(requestData)
      .then((res) => {
        if (res.success && res.data) {
          // 更新首页到个人中心
          let count = 0;
          for (let i = this.pages.length - 1; i >= 0; i--) {
            if (
              this.pages[i] === "pages/activityDetail/index" ||
              this.pages[i] === "pages/kjgActivityDetail/index" ||
              this.pages[i] === "pages/join-team/JoinTeam"
            ) {
              uni.$emit("backToactive");
              uni.navigateBack({
                delta: count,
              });
              break;
            }
            count++;
          }
          if (count === this.pages.length) {
            uni.redirectTo({
              url: "/pages/tab/index",
              // url: `/pages/tab/index?to=profile`
            });
          }
        } else {
          const error = res.error;
          uni.showToast({
            title: error,
            duration: 2000,
            icon: "none",
          });
        }
      })
      .catch((error: any) => {
        const isTimeout =
          error && String(error.errMsg || error.message).indexOf("timeout") !== -1;
        uni.showToast({
          title: isTimeout
            ? "创建用户超时，请返回报名页刷新后确认"
            : "创建用户失败，请检查网络后重试",
          duration: 3500,
          icon: "none",
        });
        console.error("[KJG] 创建用户失败", error);
      });
  }
}
</script>
<style>
page {
  background: #fff;
}
</style>
<style lang="scss" scoped>
.page {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.avatar {
  width: 200rpx;
}

.sex-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
  border-bottom: 10rpx solid #f8f8f8;
}

.sex-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
}

.sex-type {
  margin: 40rpx 80rpx;
  color: #969393;
}

.avatar-box {
  display: flex;
  flex-wrap: wrap;
}

.avatar-item {
  width: 33.33%;
  display: flex;
  justify-content: center;
  padding: 40rpx 0;
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

.btn-box {
  padding: 40rpx;
}

.up-box {
  flex: 1;
}

.page--kjg {
  min-height: 100vh;
  height: auto;
  padding: 30rpx 24rpx 44rpx;
  box-sizing: border-box;
  background: linear-gradient(180deg, #f7f3ea 0%, #edf7f7 62%, #f8fbfa 100%);

  .up-box {
    overflow: hidden;
    border: 2rpx solid #c6e1e7;
    border-radius: 26rpx;
    background: rgba(255, 253, 249, 0.97);
    box-shadow: 0 12rpx 30rpx rgba(18, 71, 103, 0.07);
  }

  .sex-box {
    padding: 42rpx 30rpx 28rpx;
    border-bottom: 2rpx solid #dcecef;
    background: linear-gradient(180deg, #f6fbfb 0%, #fffdfa 100%);

    > .avatar {
      width: 218rpx;
      border: 8rpx solid #fff;
      border-radius: 50%;
      background: #eaf5f5;
      box-shadow: 0 10rpx 28rpx rgba(18, 71, 103, 0.13);
    }
  }

  .sex-toggle {
    margin-top: 24rpx;
  }

  .left-arrow,
  .right-arrow {
    display: flex;
    width: 62rpx;
    height: 62rpx;
    align-items: center;
    justify-content: center;
    border: 2rpx solid #c5e0e6;
    border-radius: 50%;
    background: #fffdfa;
  }

  .sex-type {
    min-width: 110rpx;
    margin: 0 34rpx;
    color: #123d73;
    font-size: 30rpx;
    font-weight: 600;
    text-align: center;
  }

  .avatar-box {
    padding: 20rpx 16rpx 28rpx;
  }

  .avatar-item {
    position: relative;
    width: 33.333%;
    padding: 22rpx 0;

    .avatar {
      width: 150rpx;
      border: 4rpx solid transparent;
      border-radius: 50%;
      background: #edf6f7;
      box-sizing: border-box;
    }
  }

  .avatar-item--active {
    &::after {
      position: absolute;
      right: 20rpx;
      bottom: 20rpx;
      width: 34rpx;
      height: 34rpx;
      border: 4rpx solid #fffdfa;
      border-radius: 50%;
      background: #168f88;
      box-shadow: 0 4rpx 10rpx rgba(22, 143, 136, 0.22);
      content: "";
    }

    .avatar {
      border-color: #1b63d9;
      box-shadow: 0 8rpx 18rpx rgba(27, 99, 217, 0.15);
    }
  }

  .btn-box {
    padding: 34rpx 0 0;
  }

  .submit-btn {
    margin-top: 0;
    padding: 24rpx 20rpx;
    border-radius: 16rpx;
    background: #1b63d9;
    box-shadow: 0 10rpx 24rpx rgba(27, 99, 217, 0.18);
    font-size: 29rpx;
    font-weight: 600;
  }
}
</style>

