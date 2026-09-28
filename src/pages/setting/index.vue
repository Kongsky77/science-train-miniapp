<template>
  <view class="page" :class="{ 'page--kjg': isKjgTheme }">
    <view v-if="isInitIndex" class="participant-select">
      <UserSelect
        v-if="isLogin"
        :childs="userSelectItems"
        :currentItem="currentSwiperItem"
        :showAddBtn="false"
        @change="onChangeChild"
      />
    </view>
    <view v-if="isInitIndex" class="info-panel">
      <view class="panel-title">用户信息</view>
      <view class="item-row item-row--field">
        <view class="label">姓名</view>
        <input
          class="profile-name-input"
          :value="currentChild.realName"
          type="text"
          maxlength="20"
          placeholder="请输入姓名"
          placeholder-class="profile-name-input__placeholder"
          aria-label="姓名"
          @input="onRealNameInput"
        />
      </view>
      <view class="item-row">
        <view class="label">性别</view>
        <view class="content">
          <van-radio-group
            :value="currentChild.gender"
            @change="onGenderChange"
            direction="horizontal"
          >
            <van-radio :name="SexEnum.BOY">男</van-radio>
            <van-radio :name="SexEnum.GIRL">女</van-radio>
          </van-radio-group>
        </view>
      </view>
      <view class="item-row item-row--field item-row--address">
        <view class="label">收件地址</view>
        <textarea
          class="profile-address-input"
          :value="currentChild.recipientAddress"
          auto-height
          maxlength="120"
          placeholder="选填"
          placeholder-class="profile-address-input__placeholder"
          aria-label="收件地址"
          @input="onRecipientAddressInput"
        ></textarea>
      </view>
    </view>
    <view v-if="!isInitIndex && isLogin" class="page-loading">
      正在加载用户信息
    </view>

    <view class="action-box" v-if="isLogin">
      <view
        class="save-btn"
        data-action="save-profile"
        hover-class="action-button--pressed"
        role="button"
        @tap.stop="saveProfile"
      >
        保存修改
      </view>
      <view
        class="log-out-btn"
        data-action="logout"
        hover-class="action-button--pressed"
        role="button"
        @tap.stop="requestLogout"
      >
        退出登录
      </view>
    </view>
  </view>
</template>
<script lang="ts">
import { State } from "vuex-class";
import UserInfoResponse from "@/beans/common/UserInfoResponse";
import { Component, Vue } from "vue-property-decorator";
import UserService from "@/service/UserService";
import TokenManagement from "@/management/token/TokenManagement";
import LoginManagement from "@/management/login/LoginManagement";
import UserInfoManagement from "@/management/user/UserInfoManagement";
import SearchHistoryManagement from "@/management/search/SearchHistoryManagement";
import UserSelect from "@/components/common/UserSelect.vue";
import ChildrenService from "@/service/ChildrenService";
import AddChildRequest from "@/beans/children/req/AddChildRequest";
import SexEnum from "@/enums/common/SexEnum";
import { isMockMode } from "@/common/utils/MockMode";
import KjgMockAccount from "@/common/utils/KjgMockAccount";

const RECIPIENT_ADDRESS_CACHE_KEY = "kjgRecipientAddressCache";

class UserSelectItem {
  avatar = "";
  realName = "";
  userId = "";
  ident = 0;
  recipientAddress = "";
  gender = SexEnum.PRIVATE;
}

@Component({
  name: "Setting",
  components: {
    UserSelect,
  },
})
export default class Setting extends Vue {
  @State((state) => state.user) private user!: UserInfoResponse;
  userService = new UserService();
  isLogin = false;
  checked = true;
  SexEnum = SexEnum;

  // 用户信息
  userSelectItems: Array<UserSelectItem> = [];
  childrenService = new ChildrenService();
  // 当前中的孩子
  currentChild = new UserSelectItem();
  // 当前选中的孩子的index
  currentSwiperItem = null;
  // 是否初始化页面
  isInitIndex = false;

  // 当前选中孩子id
  currentId = "";

  get isKjgTheme() {
    return process.env.VUE_APP_THEME_TYPE === "kjg";
  }

  onLoad(options) {
    this.currentId = options.currentId || null;
    const isLogin = new LoginManagement().isLogin();
    this.isLogin = isLogin;

    if (isLogin) {
      this.getChildrenList(this.currentId);
    } else {
      uni.navigateTo({
        url:
          "/pages/login/index?pathKey=" +
          encodeURIComponent(JSON.stringify('/pages/setting/index')),
      });
    }
  }

  // 单人提交
  saveProfile() {
    const realName = String(this.currentChild.realName || "").trim();
    const recipientAddress = this.currentChild.recipientAddress.trim();

    if (!realName) {
      uni.showToast({
        title: "请输入姓名",
        duration: 2000,
        icon: "none",
      });
      return;
    }

    if (isMockMode()) {
      KjgMockAccount.updateParticipant(this.currentChild.userId, {
        avatar: this.currentChild.avatar,
        gender: Number(this.currentChild.gender),
        name: realName,
        recipientAddress,
      });
      uni.showToast({
        title: "修改成功",
        duration: 2000,
        icon: "success",
      });
      this.getChildrenList(this.currentChild.userId);
      return;
    }
    const { gender, ident } = this.currentChild;
    const form: AddChildRequest = {
      gender,
      ident,
      realName,
      recipientAddress,
    };

    const requestData: AddChildRequest = {
      ...form,
      referer: process.env.VUE_APP_PROJECT_NAME,
    };

    console.log("这里是为了测试form表单里的数据类型", requestData);

    this.childrenService
      .editChildInfoPreservingSession(this.currentChild.userId, requestData)
      .then((res) => {
        if (res.success) {
          const savedChild = {
            ...this.currentChild,
            realName,
            recipientAddress,
          };
          this.currentChild = savedChild;
          this.saveRecipientAddressCache(savedChild.userId, recipientAddress);
          this.userSelectItems = this.userSelectItems.map((child) =>
            child.userId === savedChild.userId ? savedChild : child
          );
          uni.showToast({
            title: "修改成功！",
            duration: 2000,
            icon: "success",
          });
        } else {
          uni.showToast({
            title: res.error || "保存失败，请稍后重试",
            duration: 2000,
            icon: "none",
          });
        }
      })
      .catch(() => {
        uni.showToast({
          title: "保存失败，请检查网络后重试",
          duration: 2000,
          icon: "none",
        });
      });
  }
  // 修改性别
  onGenderChange(val) {
    this.currentChild = {
      ...this.currentChild,
      gender: val.detail,
    };
  }

  onRealNameInput(event: any) {
    this.currentChild = {
      ...this.currentChild,
      realName: String(
        event && event.detail ? event.detail.value || "" : ""
      ),
    };
  }

  onRecipientAddressInput(event: any) {
    this.currentChild = {
      ...this.currentChild,
      recipientAddress: String(
        event && event.detail ? event.detail.value || "" : ""
      ),
    };
  }

  // 获取孩子列表
  getChildrenList(currenId?: string) {
    if (isMockMode()) {
      this.isInitIndex = true;
      const participants = KjgMockAccount.getParticipants();
      this.userSelectItems = participants.map((participant) => ({
        avatar: participant.avatar || "https://contentdevsa-blob.ai121.net/testcontainer/621684277780484154_621684965985294154.png",
        realName: participant.name,
        userId: participant.id,
        ident: 0,
        recipientAddress: participant.recipientAddress || "",
        gender: participant.gender || SexEnum.PRIVATE,
      }));

      const activeId =
        currenId || KjgMockAccount.getActiveParticipant()?.id || "";
      const activeIndex = this.userSelectItems.findIndex(
        (participant) => participant.userId === activeId
      );
      this.currentSwiperItem = activeIndex >= 0 ? activeIndex : 0;
      if (this.userSelectItems.length > 0) {
        this.onChangeChild(this.userSelectItems[this.currentSwiperItem]);
      }
      return;
    }
    this.childrenService.getChildrens().then((res) => {
      this.isInitIndex = true;
      if (res.success && res.data) {
        const data = res.data;

        const userSelectItems = data.map(
          ({
            avatar,
            realName,
            userId,
            ident,
            gender,
            recipientAddress,
          }) => ({
            avatar,
            realName,
            userId,
            ident: parseInt(ident),
            gender: parseInt(gender),
            recipientAddress: recipientAddress || "",
          })
        );
        console.log("获取孩子列表",userSelectItems);
        
        this.userSelectItems = userSelectItems;

        if (currenId) {
          for (let i = 0; i < userSelectItems.length; i++) {
            if (currenId === userSelectItems[i].userId) {
              this.currentSwiperItem = i;
            }
          }
        }
        if (!this.currentSwiperItem) {
          this.currentSwiperItem = 0;
        }
        this.onChangeChild(this.userSelectItems[this.currentSwiperItem])

      }
    });
  }

  // 切换孩子
  onChangeChild(child: UserSelectItem) {
    const userId = String(child.userId || "");
    const cachedAddress = this.getRecipientAddressCache(userId);
    this.currentChild = {
      ...child,
      recipientAddress: child.recipientAddress || cachedAddress,
    };
    if (isMockMode()) {
      KjgMockAccount.setActiveParticipant(child.userId);
      return;
    }

    this.childrenService
      .getChildInfoPreservingSession(userId)
      .then((res) => {
        if (
          !res.success ||
          !res.data ||
          String(this.currentChild.userId) !== userId
        ) {
          return;
        }
        const recipientAddress =
          String(res.data.recipientAddress || "").trim() || cachedAddress;
        const detailedChild = {
          ...this.currentChild,
          realName:
            String(res.data.realName || "").trim() ||
            this.currentChild.realName,
          recipientAddress,
        };
        this.currentChild = detailedChild;
        this.userSelectItems = this.userSelectItems.map((item) =>
          String(item.userId) === userId ? detailedChild : item
        );
      })
      .catch(() => undefined);
  }

  getRecipientAddressCache(userId: string) {
    const cache = uni.getStorageSync(RECIPIENT_ADDRESS_CACHE_KEY);
    if (!cache || typeof cache !== "object") {
      return "";
    }
    return typeof cache[userId] === "string" ? cache[userId] : "";
  }

  saveRecipientAddressCache(userId: string, recipientAddress: string) {
    const storedCache = uni.getStorageSync(RECIPIENT_ADDRESS_CACHE_KEY);
    const cache =
      storedCache && typeof storedCache === "object" ? storedCache : {};
    if (recipientAddress) {
      cache[userId] = recipientAddress;
    } else {
      delete cache[userId];
    }
    uni.setStorageSync(RECIPIENT_ADDRESS_CACHE_KEY, cache);
  }

  // 退出登录前校验点击目标，避免相邻操作发生事件串线
  requestLogout(event: any) {
    const action =
      event && event.currentTarget && event.currentTarget.dataset
        ? event.currentTarget.dataset.action
        : "";
    if (action !== "logout") {
      return;
    }

    uni.showModal({
      title: "退出登录",
      content: "确认退出当前账号？",
      confirmText: "退出",
      confirmColor: "#d95151",
      success: (result) => {
        if (result.confirm) {
          this.performLogout();
        }
      },
    });
  }

  performLogout() {
    this.userService
      .loginOut()
      .then((res) => {
        new TokenManagement().clearStorage();
        new UserInfoManagement().clearStorage();
        SearchHistoryManagement.getInstance().removeSearchHistory();
        uni.reLaunch({
          url: "/pages/login/index",
        });
      })
      .catch(() => {
        new TokenManagement().clearStorage();
        new UserInfoManagement().clearStorage();
        SearchHistoryManagement.getInstance().removeSearchHistory();
        uni.reLaunch({
          url: "/pages/login/index",
        });
      });
  }
}
</script>
<style lang="scss" scoped>
.page {
  position: relative;
  height: 100%;
  width: 100%;
  overflow-y: auto;
  background: #f5f8fc;
  box-sizing: border-box;

  .item-row {
    padding: 20rpx 56rpx;
    font-size: 40rpx;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.75);
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    margin-bottom: 40rpx;
    &:last-child {
      padding-bottom: 280rpx;
    }
    .label {
      margin-right: 18rpx;
    }
    .content {
      flex: 1;
      white-space: pre-wrap;
      word-break: break-all;
    }
  }

  .save-btn,
  .log-out-btn {
    position: fixed;
    bottom: 68rpx;
    left: 50%;
    width: 95%;
    transform: translateX(-50%);
    background: #d95151;
    border-radius: 16rpx;
    box-shadow: 0rpx 0rpx 12rpx 2rpx rgba(0, 0, 0, 0.16);
    font-size: 32rpx;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
  }
  .save-btn {
    bottom: 196rpx;
    background: #5181d9;
  }
}

.page--kjg {
  min-height: 100vh;
  height: auto;
  padding: 18rpx 20rpx 250rpx;
  background: linear-gradient(180deg, #f7f3ea 0%, #edf7f7 60%, #f8fbfa 100%);
  color: #17365f;

  .participant-select {
    overflow: hidden;
    border: 2rpx solid #c6e1e7;
    border-radius: 26rpx 26rpx 0 0;
    background: rgba(255, 253, 249, 0.96);
  }

  /deep/ .avatar-select .swiper-view {
    width: 100%;
  }

  /deep/ .avatar-select .swiper-box {
    height: 250rpx;
  }

  /deep/ .avatar-select .avatar {
    border: 6rpx solid #fff;
    background: #eaf5f5;
    box-shadow: 0 8rpx 22rpx rgba(16, 74, 108, 0.12);
  }

  /deep/ .avatar-select .avatar.active {
    width: 180rpx;
    height: 180rpx;
    border-color: #1b63d9;
    box-shadow: 0 8rpx 24rpx rgba(27, 99, 217, 0.18);
  }

  .info-panel {
    overflow: hidden;
    border: 2rpx solid #c6e1e7;
    border-top: 0;
    border-radius: 0 0 26rpx 26rpx;
    background: rgba(255, 253, 249, 0.96);
    box-shadow: 0 12rpx 30rpx rgba(18, 71, 103, 0.07);
  }

  .panel-title {
    padding: 26rpx 28rpx 14rpx;
    color: #123d73;
    font-size: 30rpx;
    font-weight: 700;
  }

  .item-row {
    min-height: 92rpx;
    margin: 0 28rpx;
    padding: 0;
    border-bottom: 2rpx solid #e4eff1;
    color: #243e5c;
    font-size: 28rpx;
    align-items: center;

    &:last-child {
      padding-bottom: 0;
      border-bottom: 0;
    }

    .label {
      width: 124rpx;
      margin-right: 18rpx;
      color: #718194;
    }

    .content {
      min-width: 0;
      color: #17365f;
      text-align: right;
    }
  }

  .item-row--field {
    align-items: center;
  }

  .item-row--address {
    min-height: 128rpx;
    align-items: flex-start;
    padding: 20rpx 0;
    box-sizing: border-box;
  }

  .profile-address-input {
    flex: 1;
    min-width: 0;
    min-height: 72rpx;
    padding: 0;
    box-sizing: border-box;
    background: transparent;
    color: #17365f;
    font-size: 28rpx;
    line-height: 1.55;
    text-align: right;
  }

  .profile-name-input {
    flex: 1;
    min-width: 0;
    height: 92rpx;
    padding: 0;
    box-sizing: border-box;
    background: transparent;
    color: #17365f;
    font-size: 28rpx;
    line-height: 92rpx;
    text-align: right;
  }

  .profile-name-input__placeholder {
    color: #8998a6;
  }

  .profile-address-input__placeholder {
    color: #8998a6;
  }

  .page-loading {
    padding: 120rpx 30rpx;
    color: #718194;
    font-size: 26rpx;
    text-align: center;
  }

  .action-box {
    position: fixed;
    right: 20rpx;
    bottom: calc(24rpx + env(safe-area-inset-bottom));
    left: 20rpx;
    z-index: 20;
    padding: 16rpx;
    border: 2rpx solid rgba(185, 220, 228, 0.9);
    border-radius: 24rpx;
    background: rgba(255, 253, 249, 0.96);
    box-shadow: 0 10rpx 28rpx rgba(18, 71, 103, 0.12);
  }

  .save-btn,
  .log-out-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    position: static;
    width: 100%;
    height: 82rpx;
    transform: none;
    border-radius: 16rpx;
    box-shadow: none;
    font-size: 28rpx;
    line-height: 82rpx;

  }

  .action-button--pressed {
    opacity: 0.78;
  }

  .save-btn {
    background: #1b63d9;
    color: #fff;
  }

  .log-out-btn {
    height: 66rpx;
    margin-top: 6rpx;
    background: transparent;
    color: #77889a;
    line-height: 66rpx;
  }
}
</style>

