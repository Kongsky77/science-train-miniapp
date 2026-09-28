<template>
  <view class="page">
    <scroll-view
      :scroll-y="true"
      class="list"
    >
      <view
        v-for="user of list"
        :key="user.id"
        class="item"
        @click="toggleChild(user)"
      >
        <image
          :src="user.avatar"
          class="avatar"
        ></image>
        <view class="info">
          <view class="name">{{ user.name }}</view>
          <view class="school">{{ user.school }}</view>
        </view>

        <!--不在活动范围-->

        <!--不在已经报名范围-->
        <view
          v-if="isShowUserIsEntry(user)"
          class="entry-ok"
        > 已报名</view>
        <view
          v-else-if="
            user.isEntry &&
              !user.isBought &&
              isPayment &&
              paymentModel === paymentModelEnum.ADVANCE_PAYMENT
          "
          class="un-paid"
        >未付费</view>
        <view
          v-else-if="
            (!user.inActivityRange || !user.inActivityAgeRange) && !user.isEntry
          "
          class="radio-item disable"
        >
          <van-icon
            color="#fff"
            name="cross"
          />
        </view>
        <view
          v-else-if="isAble(user)"
          :class="{ active: user.active }"
          class="radio-item"
        >
          <van-icon
            color="#fff"
            name="success"
          />
        </view>
        <!-- <view class="radio-item joined" v-if="user.isEntry && user.team">
          <van-icon name="success" color="#fff" />
        </view> -->
      </view>
      <view
        class="item"
        @click="onAddChild"
      >
        <view class="add-user-item-box">
          <view class="add-user-item">
            <van-icon name="plus" />
          </view>
        </view>
        <view class="info">
          <view class="school"> 添加用户</view>
        </view>
      </view>
    </scroll-view>
    <van-empty
      v-if="!list.length"
      description="还未添加子账号哦"
    />
    <view class="action-btn-row">
      <van-button
        block
        type="default"
        @click="onEnterClick"
      >确定</van-button>
    </view>
    <van-toast id="van-toast" />
    <view class="model-box">
      <view
        class="container"
        v-if="isModelShow"
      >
        <view class="box">
          <view
            class="close-icon"
            @click="onClickCloseIcon"
          >
            <van-icon
              name="cross"
              size="40rpx"
            />
          </view>
          <view class="title">参赛协议与原创说明</view>
          <view class="protocol">{{ lang.ACTIVITY_DETAIL_NOTICE }}</view>
          <view
            class="read-btn"
            @click="onReadNotice"
          >我同意该协议</view>
        </view>
      </view>
    </view>
  </view>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import ChildrenService from "@/service/ChildrenService";
import LoginManagement from "@/management/login/LoginManagement";
import ActivityService from "@/service/ActivityService";
import SubmitActivityFormRequest from "@/beans/activity/req/SubmitActivityFormRequest";
import ShowMsgEnum from "@/definition/lang/ShowMsgEnum";
import ChannelManagement from "@/management/channel/ChannelManagement";
import ChannelKeyEnum from "@/definition/common/ChannelKeyEnum";
import LangEnum from "@/definition/lang/LangEnum";
import PaymentModel from "@/definition/order/PaymentModel";
import PageLinkEnum from "@/definition/lang/PageLinkEnum";

class Child {
  id = "";
  avatar = "";
  name = "";
  school = "";
  inActivityRange = false;
  inActivityAgeRange = false;
  isEntry = false;
  isBought = false;
  active?: boolean = false;
  team?: Object;
}

@Component({
  name: "ChildrenInfo",
  components: {},
})
export default class ChildrenInfo extends Vue {
  @Prop({
    default: "",
  })
  activityId!: string;
  @Prop({
    default: false,
  })
  isRefresh: boolean;
  @Prop({
    default: false,
  })
  teamEnabled: boolean;
  @Prop({
    default: false,
  })
  teamForceCreate: boolean;
  @Prop({
    default: PaymentModel.ADVANCE_PAYMENT,
    required: true,
  })
  paymentModel: PaymentModel;
  @Prop({
    default: false,
    required: true,
  })
  isBought: boolean;
  @Prop({
    default: false,
    required: true,
  })
  isPayment: boolean;
  @Prop({
    default: "",
    required: true,
  })
  activityName: string;

  @Prop({
    default: false,
    required: true,
  })
  skipEntryForm: boolean;

  @Prop({
    default: false,
    required: true,
  })
  isTurnOnDistrict: boolean;

  @Prop({
    default: false,
    required: true,
  })
  mustIdNo: boolean;

  paymentModelEnum = PaymentModel;
  childrenService = new ChildrenService();
  activityService = new ActivityService();
  list: Array<Child> = [];
  activeChildId: string = "";
  activeChild: Child = new Child();
  lang = LangEnum;
  isModelShow: boolean = false;
  // infoForms: Array<FormResponse> = [];
  // enrollInfoLength: number = 0;

  @Watch("isRefresh")
  onActivityDetailRefresh(isRefresh: boolean) {
    if (isRefresh) {
      this.getChildrenList(this.activityId);
    }
  }

  onReadNotice() {
    this.isModelShow = false;
    this.doReadAction();
  }

  onClickCloseIcon() {
    this.isModelShow = false;
  }

  mounted() {
    const isLogin = new LoginManagement().isLogin();
    if (isLogin) {
      this.getChildrenList(this.activityId);
    }
    // this.getForms(this.activityId);
    uni.$on("backToactive", () => {
      this.activeChild = {
        id: "",
        avatar: "",
        name: "",
        school: "",
        inActivityRange: false,
        inActivityAgeRange: false,
        isEntry: false,
        isBought: false,
      };
      this.getChildrenList(this.activityId);
    });
  }

  // 添加孩子
  onAddChild() {
    uni.navigateTo({
      url: "/pages/writeChildInfo/index",
    });
  }

  // 获取孩子列表
  getChildrenList(activityId: string) {
    this.childrenService.getActivityChildren(activityId).then((res) => {
      if (res.success && res.data) {
        const data = res.data;
        const list = data.map((child) => ({
          id: child.userId,
          avatar: child.avatar,
          name: child.realName,
          school: child.orgName,
          inActivityRange: !!child.inActivityRange,
          inActivityAgeRange: !!child.inActivityAgeRange,
          isEntry: !!child.isEntry,
          team: child.team,
          isBought: child.isBought,
        }));
        this.list = list;
        console.log(this.list);
      }
    });
  }

  toggleChild(child: Child) {
    console.log(child);
    if (!child.isEntry) {
      if (!child.inActivityRange) {
        uni.showToast({
          title: "很抱歉，您选择的孩子不在参与范围内！",
          duration: 2000,
          icon: "none",
        });
      }
      if (!child.inActivityAgeRange) {
        uni.showToast({
          title: "很抱歉，您选择的孩子不在活动年龄内！",
          duration: 2000,
          icon: "none",
        });
      }
    }

    if (
      (child.isEntry &&
        child.team &&
        this.isPayment &&
        this.paymentModel === PaymentModel.ADVANCE_PAYMENT &&
        child.isBought) ||
      !child.inActivityRange ||
      !child.inActivityAgeRange
    ) {
      return;
    }
    const mapActive = (item: Child) => ({
      ...item,
      active: item.id === child.id,
    });

    const childs = this.list.map(mapActive);

    this.list = childs;
    this.activeChildId = child.id;
    this.activeChild = child;

    if (this.isNeedPay() && this.activeChild.isEntry) {
      this.moveToPlaceAnOrderPage();
    }
  }

  onEnterClick() {
    if (this.activityId === "265651612790853") {
      this.isModelShow = true;
    } else {
      if (this.isTurnOnDistrict || this.mustIdNo) {
        this.jumpToUpdateEntryInfoPage();
      } else {
        this.doReadAction();
      }
    }
  }

  doReadAction() {
    const isEntry = !!this.activeChild.isEntry;
    if (
      this.activeChild.inActivityRange &&
      this.activeChild.inActivityAgeRange
    ) {
      if (isEntry) {
        this.onDetermineChooseAfter();
      }
      // if (this.enrollInfoLength >= 1) {
      if (!this.skipEntryForm) {
        this.moveToFillInfoPage();
      } else {
        this.onDetermineChooseAfter();
      }
      uni.$emit("closeT");
    }
  }

  isNeedPay() {
    return (
      !this.activeChild.isBought &&
      this.paymentModel === PaymentModel.ADVANCE_PAYMENT &&
      this.isPayment
    );
  }

  moveToNextPage() {
    if (this.isNeedPay()) {
      this.moveToPlaceAnOrderPage();
    } else {
      this.moveToGuidePage();
    }
  }

  moveToFillInfoPage() {
    uni.navigateTo({
      url: `/pages/fillInfo/ActivityEntryExt?isNeedPay=${this.isNeedPay()}&teamForceCreate=${
        this.teamForceCreate
      }&teamEnabled=${this.teamEnabled}&childId=${
        this.activeChildId
      }&activityId=${this.activityId}&isEntry=${!!this.activeChild.isEntry}`,
    });
  }

  moveToPlaceAnOrderPage() {
    uni.navigateTo({
      url: `${PageLinkEnum.PLACE_AN_ORDER}?activityId=${this.activityId}&childId=${this.activeChildId}`,
    });
  }

  onDetermineChooseAfter() {
    if (this.teamForceCreate && this.teamEnabled) {
      this.moveToCreateTeamPage();
    } else {
      this.signUpActivity();
    }
  }

  moveToCreateTeamPage() {
    uni.navigateTo({
      url: `/pages/create-team/CreateTeam?isNeedPay=${this.isNeedPay()}&childId=${
        this.activeChildId
      }&activityId=${this.activityId}`,
    });
  }

  signUpActivity() {
    const activityService = new ActivityService();
    const entryActivityRequest = new SubmitActivityFormRequest();
    entryActivityRequest.subUserId = this.activeChildId;
    entryActivityRequest.preview = "0";
    entryActivityRequest.entryWay = "4";
    if (ChannelManagement.getChannelId(ChannelKeyEnum.KOC) !== "") {
      entryActivityRequest.kocId = ChannelManagement.getChannelId(
        ChannelKeyEnum.KOC
      );
    }
    activityService
      .submitActivityForm(
        this.activityId,
        entryActivityRequest,
        this.activityName
      )
      .then((res) => {
        if (res.success && res.data) {
          this.moveToNextPage();
        } else {
          this.showSignUpErrorNotice(res.error);
        }
      });
  }

  showSignUpSuccessNotice() {
    uni.showToast({
      title: "报名成功",
      duration: ShowMsgEnum.SHOW_SUBMIT_DURATION_SUCCESS,
      icon: "none",
    });
  }

  showSignUpErrorNotice(errorMsg: string) {
    uni.showToast({
      title: errorMsg,
      duration: 2000,
      icon: "none",
    });
  }

  moveToGuidePage() {
    uni.navigateTo({
      url: `/pages/guide/index?activityId=${this.activityId}&childId=${this.activeChildId}`,
    });
  }

  private jumpToUpdateEntryInfoPage() {
    uni.navigateTo({
      url: `/pages/fillInfo/UpdateEntryInfo?isTurnOnDistrict=${
        this.isTurnOnDistrict
      }&isFieldsHidden=true&childId=${this.activeChildId}&inActivityRange=${
        this.activeChild.inActivityRange
      }&inActivityAgeRange=${this.activeChild.inActivityAgeRange}&activityId=${
        this.activityId
      }&skipEntryForm=${
        this.skipEntryForm
      }&isNeedPay=${this.isNeedPay()}&teamForceCreate=${
        this.teamForceCreate
      }&teamEnabled=${this.teamEnabled}&isEntry=${
        this.activeChild.isEntry
      }&activityName=${this.activityName}&mustIdNo=${this.mustIdNo}`,
    });
  }

  getForms(activityId: string) {
    this.activityService.getActivityForm(activityId).then((res) => {
      console.log(res, 888);

      if (res.success && res.data) {
        // let item: FormResponse = {
        //   id: "",
        //   name: "",
        //   required: BooleanEnum.NO,
        // };
        // for (let i = 0; i < res.data.length; i++) {
        //   item = {
        //     id: res.data[i].id,
        //     name: res.data[i].name,
        //     required: res.data[i].required,
        //   };
        //   this.infoForms.push(item);
        // }
        // this.enrollInfoLength = res.data.length;
      }
    });
  }

  isAble(child: Child) {
    return child.inActivityRange && child.inActivityAgeRange && !child.isEntry;
  }

  isShowUserIsEntry(user: Child) {
    if (this.paymentModel === PaymentModel.ADVANCE_PAYMENT) {
      return user.isEntry && user.isBought;
    } else {
      return user.isEntry;
    }
  }
}
</script>
<style lang="scss" scoped>
.list {
  /* box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16); */
  border-radius: 20rpx;
  max-height: 650rpx;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  margin-right: 20rpx;
}

.item {
  background: #fff;
  display: flex;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1px solid #e5e5e5;

  color: #888888;
}

.info {
  flex: 1;
}

.name {
  margin-bottom: 10rpx;
}

.school {
  font-size: 30rpx;
  padding-right: 10rpx;
}

.btn {
  font-size: 30rpx;
  color: #fff;
  background: #7563f0;
  padding: 10rpx;
  border-radius: 10rpx;
}

.radio-item {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #ccc;
}

.radio-item.active {
  background: #416fff;
}

.radio-item.joined {
  background: #8ac252;
}

.radio-item.disable {
  background: #ccc;
}

.action-btn-row {
  height: 100rpx;
}

.add-user-item-box {
  width: 120rpx;
  height: 120rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 20rpx;
}

.add-user-item {
  flex-shrink: 0;
  width: 100rpx;
  height: 100rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  border-radius: 50%;
}

.entry-ok {
  font-size: 24rpx;
  padding: 10rpx 16rpx;
  border-radius: 10rpx;
  background: rgb(0, 199, 10);
  color: #fff;
}

.un-paid {
  font-size: 24rpx;
  padding: 10rpx 16rpx;
  border-radius: 10rpx;
  background: rgb(255, 165, 0);
  color: #fff;
}

.model-box {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);

  .container {
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);

    .box {
      width: 80%;
      height: 50%;
      background-color: #fff;
      border-radius: 25rpx;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: relative;

      .close-icon {
        position: absolute;
        right: 30rpx;
        top: 30rpx;
      }

      .title {
        font-size: 45rpx;
        text-align: center;
        margin-bottom: 50rpx;
      }

      .protocol {
        width: 80%;
        height: 60%;
        margin: 0 auto;
        overflow-y: auto;
        opacity: 0.6;
      }

      .read-btn {
        margin-top: 50rpx;
        background: $ai121-theme-color;
        color: white;
        padding: 20rpx 50rpx 20rpx 50rpx;
        border-radius: 35rpx;
      }
    }
  }
}
</style>

