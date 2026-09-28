<template>
  <view class="page">
    <van-skeleton
      :loading="loading"
      avatar
      row="10"
      title
    >
      <view
        :style="{
          height: '700rpx',
          background: makeBackground(backgroundImage),
        }"
        class="banner-box"
      >
        <view class="banner-inner-box">
          <view class="tool-bar">
            <!-- <view class="tool-item"> -->
            <!-- <image
                v-show="isLiked === isFollowedEnum.NO"
                class="tool-icon"
                mode="widthFix"
                src="@/static/icon/love-icon.png"
                @click="likeActivity"
              ></image>
              <image
                v-show="isLiked === isFollowedEnum.YES"
                class="tool-icon"
                mode="widthFix"
                src="https://contentdevsa-blob.ai121.net/testcontainer/activity/image/d8ebf70d-dc3e-4fab-a6c8-a6ca571db1ef.png"
                @click="unlikeActivity"
              ></image> -->
            <!-- </view> -->
          </view>
          <view
            v-if="userSelectItems.length"
            class="user-box"
          >
            <UserSelect
              :childs="userSelectItems"
              ref="UserSelect"
              @change="onChangeChild"
            />
          </view>
          <view class="user-name">{{ currentChild.realName }}</view>
        </view>
      </view>
      <view class="intro-box">
        <!-- <view class="intro-box-text"> 你能获得</view> -->
        <IconRow
          :rank-enabled="rankEnable"
          :activityId="activityId"
          :childId="currentChild.userId"
          :childName="currentChild.realName"
          :is-fresh="refreshState"
          :isActivityEnd="isActivityEnd"
          :mustIdNo="activityDetail.mustIdNo"
        />
      </view>
      <view class="info-box">
        <view class="info-title">{{ title }}</view>
        <view class="info-row">
          <view class="info-row-left">
            <view class="info-address-row">
              <view
                v-if="userSelectItems.length && activityDetail.contentId !==''"
                class="box-progress"
              >
                <!-- 活动进度条开头 -->
                <view class="title-row">
                  <view class="title-left">活动进度:</view>
                  <view class="title-right">完成率{{ currentChild.process }}%</view>
                </view>
                <view class="progress-box">
                  <view class="progress-out">
                    <view
                      :style="{
                        width: `${currentChild.process}%`,
                      }"
                      class="progress-bar"
                    ></view>
                  </view>
                </view>
              </view>
            </view>
          </view>
          <view class="info-row-right">
            <view class="info-avatars">
              <AvatarRow
                :avatars="avatars"
                :width="40"
                :height="40"
              />
            </view>
            <view
              v-if="totalMembers > 9999"
              class="info-people"
            >{{ totalMembersKW }}w人参加
            </view>
            <view
              v-else-if="totalMembers > 999"
              class="info-people"
            >{{ totalMembersKW }}k人参加
            </view>
            <view
              v-else-if="totalMembers >= 100 && totalMembers <= 999"
              class="info-people"
            >
              {{ totalMembers }} 人参加
            </view>
            <view
              v-else-if="isActivityEnd"
              class="info-people"
            >
              活动已结束
            </view>
            <view
              v-else
              class="info-people"
            >
              <!-- <image class="hot-icon" src="../../static/icon/hot.svg" /> -->
              火热报名中
            </view>
          </view>
        </view>
      </view>

      <view style="padding-bottom: 130rpx">
        <van-tabs
          v-if="showCopies"
          color="#5181D9"
          @change="onChange"
        >
          <van-tab
            v-for="(copy, copyIndex) of copies"
            :key="copy.title"
            :name="copy.title"
            :title="copy.title"
          >
            <view class="tab-content-box">
              <view class="rich-box">
                <!-- <rich-text :nodes="copy.content"></rich-text> -->
                <u-parse
                  v-if="copyIndex === active"
                  :content="copy.content"
                  @navigate="navigate"
                ></u-parse>
                <!-- <view>{{copy.content}}</view> -->
              </view>
            </view>
          </van-tab>
        </van-tabs>
      </view>

      <!-- 评论 -->

      <CommentList
        @loadMore="onloadMoreClicked"
        :productionPublishedList="productionPublishedList"
      />

      <view
        v-if="!userSelectItems.length"
        class="footer"
      >
        <view
          class="join-btn"
          :style="{
            backgroundColor: isActivityEnd ? '#EDEDF2' : '#5181D9',
            pointerEvents: isActivityEnd ? 'none' : '',
          }"
          @click="onClickJoinBtn"
        >{{ isActivityEnd ? "活动结束" : "立即参加" }}
        </view>
      </view>
      <view
        v-if="userSelectItems.length"
        class="footer"
      >
        <!-- ai121家长端 -->
        <view class="btn-row">
          <view
            class="activity-address-btn"
            @click="onClickJoinBtn"
            :style="{
              backgroundColor: isActivityEnd ? '#EDEDF2' : '#5181D9',
              pointerEvents: isActivityEnd ? 'none' : '',
            }"
          >{{ isActivityEnd ? "活动结束" : "给另一个用户报" }}
          </view>
          <view
            class="activity-address-btn"
            @click="goGuidePage"
            :style="{
              backgroundColor: isActivityIsAIPartyHistoryHuman
                ? '#EDEDF2'
                : '#5181D9',
              pointerEvents: isActivityIsAIPartyHistoryHuman ? 'none' : '',
            }"
          >继续参与
          </view>
        </view>
      </view>
      <van-toast id="van-toast" />
      <van-action-sheet
        :close-on-click-overlay="true"
        :show="showActionSheet"
        title="选择用户"
        @close="closeActionSheet"
        @click-overlay="closeActionSheet"
      >
        <view class="action-box">
          <view class="children-box">
            <ChildrenList
              :activityId="activityId"
              :isRefresh="refreshState"
              :team-enabled="teamEnabled"
              :activity-name="activityDetail.name"
              :team-force-create="teamForceCreate"
              :payment-model="activityDetail.paymentModel"
              :is-bought="currentChild.isBought"
              :is-payment="activityDetail.isPayment"
              :is-turn-on-district="activityDetail.isTurnOnDistrict"
              :skipEntryForm="activityDetail.skipEntryForm"
              :mustIdNo="activityDetail.mustIdNo"
            />
          </view>
        </view>
      </van-action-sheet>
    </van-skeleton>
  </view>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import IconRow from "@/components/common/IconRow.vue";
import AvatarRow from "@/components/common/AvatarRow.vue";
import UserSelect from "@/components/common/UserSelect.vue";
import ActivityService from "@/service/ActivityService";
import ActivityFullItem from "@/beans/activity/ActivityFullItem";
import {
  EntryWayEnum,
  isFollowedEnum,
  RankEnableEnum,
} from "@/enums/activity/ActivityFullItemEnum";

import ChildrenList from "@/components/children/ChildrenList.vue";
import ChildrenService from "@/service/ChildrenService";
import ActivityChild from "@/beans/common/ActivityChild";
import LoginManagement from "@/management/login/LoginManagement";
import LikeService from "@/service/LikeService";
import { LikeType } from "@/enums/notice/NoticeItemEnum";

import uParse from "@/components/feng-parse/parse.vue";
import { Utils } from "@/common/utils/Utils";
import ChannelManagement from "@/management/channel/ChannelManagement";
import ChannelKeyEnum from "@/definition/common/ChannelKeyEnum";
import LangEnum from "@/definition/lang/LangEnum";
import ThemeTypeEnum from "@/enums/theme/ThemeTypeEnum";
import WeAnalysisEventManagement from "@/management/wx/WeAnalysisEventManagement";
import EventNameEnum from "@/definition/common/EventNameEnum";
import VisitActivityDetailDTO from "@/definition/common/event/VisitActivityDetailDTO";
import ClickSignBtnBTO from "@/definition/common/event/ClickSignBtnBTO";
import PageLinkEnum from "@/definition/lang/PageLinkEnum";
import CommentList from "@/components/comment-list/CommentList.vue";
import ProductionPublishedListDTO from "@/beans/activity/productionPublished/dto/ProductionPublishedListDTO";
import ProductionPublishedListVO from "@/beans/activity/productionPublished/vo/ProductionPublishedListVO";
import ProductionPublishedItemVO from "@/beans/activity/productionPublished/vo/ProductionPublishedItemVO";
import ShowNoticeManagement from "@/management/common/ShowNoticeManagement";
import ProductionPublishedTopEnum from "@/definition/production-published/ProductionPublishedTopEnum";
import WeChatService from "@/service/WeChatService";

interface ActivityDetailOptionScene {
  id: string;
  koc_id: string;
  from_user_id: string;
  scene: string;
  isBuryingPoint?: string;
}

@Component({
  name: "ActivityDetail",
  components: {
    IconRow,
    AvatarRow,
    UserSelect,
    ChildrenList,
    uParse,
    CommentList,
  },
})
export default class ActivityDetail extends Vue {
  trigger = false; //这是为判定活动详情是否有发生变化，若无变化则为false，有变化则为true
  loading = true;
  likeService = new LikeService();
  RankEnableEnum = RankEnableEnum;
  isFollowedEnum = isFollowedEnum;
  activityService = new ActivityService();
  childrenService = new ChildrenService();
  activityId = "";
  backgroundImage = "";
  shareBackgroundImage = "";
  title = "";
  lang = LangEnum;
  activityAddress = "";
  copies = [
    {
      title: "",
      content: "",
    },
  ];
  totalMembers = 0;
  clickCount: number = 0;
  totalMembersKW: string | number = 0;
  avatars = [];
  rankEnable = RankEnableEnum.NO;
  isLiked = isFollowedEnum.NO;
  showCopies = false;
  isJoined = false;
  active = 0;
  // 是否登录
  isLogin = false;
  // 孩子选择列表数据
  userSelectItems: Array<ActivityChild> = [];
  // 当前孩子数据
  currentChild = new ActivityChild();

  teamForceCreate: boolean = false;

  // 底部报名弹出层
  showActionSheet = false;

  contentMarginTop: number = 0;
  // 活动详情
  activityDetail = new ActivityFullItem();

  teamEnabled: boolean = false;
  //刷新状态
  refreshState = false;
  isRead: boolean = false;
  isModelShow: boolean = false;

  currentChild1 = new ActivityChild();

  isBuryingPoint: boolean = true;

  themeType: string = process.env.VUE_APP_THEME_TYPE;
  themeTypeEnum = ThemeTypeEnum;

  productionPublishedCurrentPage: number = 1;
  productionPublishedTotalPage: number = 0;
  productionPublishedList: Array<ProductionPublishedItemVO> = [];

  tmplIds = [
    "1hkN6dfrKiv3ukTnrxhYU1kg8j5uwWczp_MTgfJaM1M",
    "_AdG_xyIyWm61cFz_vrDEK3U3HZwJljeGUbi6CkmrgU",
  ];

  onLoad(options: ActivityDetailOptionScene) {
    if (options.koc_id) {
      ChannelManagement.saveChannelId(ChannelKeyEnum.KOC, options.koc_id);
    }

    if (options.from_user_id) {
      ChannelManagement.saveChannelId(
        ChannelKeyEnum.FROM_USER_ID,
        options.from_user_id
      );
    }

    if (options.isBuryingPoint) {
      this.isBuryingPoint = false;
    }

    this.activityId = options.id;

    if (options.scene !== undefined) {
      const scene = decodeURIComponent(options.scene);
      const sceneData = scene.split(",");
      if (sceneData.length === 1) {
        this.activityId = sceneData[0];
      }
      if (sceneData.length > 1) {
        this.activityId = sceneData[0];
        if (sceneData[1]) {
          ChannelManagement.saveChannelId(ChannelKeyEnum.KOC, sceneData[1]);
        }
        if (sceneData[2]) {
          ChannelManagement.saveChannelId(
            ChannelKeyEnum.FROM_USER_ID,
            sceneData[2]
          );
        }
      }
    }

    this.statusNavHeight();

    this.initPage();

    this.fetchProductionPublishedList();

    uni.showShareMenu({
      menus: ["shareAppMessage", "shareTimeline"],
    });
  }

  // onMoreActivityBtnClick() {
  //   uni.redirectTo({
  //     url: `${PageLinkEnum.TAB_INDEX}`,
  //   });
  // }

  statusNavHeight() {
    const that = this;
    uni.getSystemInfo({
      success: function (e) {
        // #ifdef MP-WEIXIN
        let custom = wx.getMenuButtonBoundingClientRect();
        Vue.prototype.customBar =
          custom.bottom + custom.top - e.statusBarHeight;
        // #endif
        const statusHeight = e.statusBarHeight * 2;
        let navHeight: number;
        if (e.platform === "android") {
          navHeight = 100;
        } else {
          navHeight = 90;
        }
        // that.navHeight = Vue.prototype.customBar * 2;
        that.contentMarginTop = statusHeight + navHeight;

        // plus.navigator.hasNotchInScreen();
      },
    });
  }

  // onClickCloseIcon() {
  //   this.isModelShow = false;
  // }

  mounted() {
    uni.$on("backToactive", () => {
      // this.showActionSheet = false;
      // console.log("这里证明函数调用成功", this.showActionSheet);
      this.initPage();
    });
  }

  // 富文本渲染
  navigate(src) {
    const url = encodeURIComponent(src);
    uni.navigateTo({
      url: `/pages/webview/index?url=${url}`,
    });
  }

  get isActivityIsAIPartyHistoryHuman(): boolean {
    return this.activityId === "182814111633477";
  }

  get isActivityEnd() {
    let isActivityEnd = false;
    const nowTime = new Date().getTime();
    if (nowTime > this.activityDetail.endTime) {
      isActivityEnd = true;
    }
    return isActivityEnd;
  }

  //向父组件发送数据

  // 下拉刷新
  onPullDownRefresh() {
    this.refreshState = true;
    this.initPage();
    setTimeout(function () {
      uni.stopPullDownRefresh();
    }, 1000);
  }

  fetchProductionPublishedList() {
    let productionPublishedListDTO: ProductionPublishedListDTO =
      new ProductionPublishedListDTO();
    productionPublishedListDTO.onTop = ProductionPublishedTopEnum.TOPPING;
    productionPublishedListDTO.activityId = this.activityId;
    productionPublishedListDTO.pageNo = this.productionPublishedCurrentPage;
    ActivityService.fetchProductionPublishedList(
      productionPublishedListDTO,
      this.fetchProductionPublishedListCallback
    );
  }

  fetchProductionPublishedListCallback(
    success: boolean,
    productionPublishedListVO: ProductionPublishedListVO
  ) {
    if (success) {
      console.log(
        "fetchProductionPublishedListCallback:",
        productionPublishedListVO
      );
      this.productionPublishedCurrentPage =
        productionPublishedListVO.currentPage;
      this.productionPublishedTotalPage = productionPublishedListVO.pages;
      this.productionPublishedList = Utils.getReachBottomPagingList(
        this.productionPublishedCurrentPage,
        this.productionPublishedTotalPage,
        this.productionPublishedList,
        productionPublishedListVO.records
      );
    }
  }

  onloadMoreClicked() {
    uni.navigateTo({
      url: `/pages/comment-list/CommentList?activityId=${this.activityId}`,
    });
  }

  closeActionSheet() {
    this.showActionSheet = false;
  }

  onChange(event: any) {
    this.active = event.detail.index;
  }

  //分享功能
  onShareAppMessage(res) {
    let path = `/pages/activityDetail/index?id=${this.activityId}`;
    let title = this.title;
    if (this.currentChild.userId !== "") {
      path += "&from_user_id=" + this.currentChild.userId;
      title = this.currentChild.realName + "邀请你参加：" + this.title;
    }

    return {
      title: title,
      path: path,
      imageUrl: this.shareBackgroundImage,
    };
  }

  onShareTimeline() {
    let path = `/pages/activityDetail/index?id=${this.activityId}`;
    let title = this.title;
    if (this.currentChild.userId !== "") {
      path += "&from_user_id=" + this.currentChild.userId;
      title = this.currentChild.realName + "邀请你参加：" + this.title;
    }

    return {
      title: title,
      path: path,
      imageUrl: this.shareBackgroundImage,
    };
  }

  initPage() {
    const id = this.activityId;
    this.getBasicInfo(id);
    this.getCopyList(id);
    this.getMembers(id);
    const isLogin = new LoginManagement().isLogin();
    this.isLogin = isLogin;
    if (isLogin) {
      this.getChildrenList(id);
    }
  }

  beforeDestroy() {
    uni.$emit("on-leave-detail");
  }

  // 得到基本信息
  getBasicInfo(id: string) {
    this.activityService.getDetail(id).then((res) => {
      if (res.success && res.data) {
        const data = res.data;
        this.teamForceCreate = data.teamForceCreate;
        this.shareBackgroundImage = data.imgCover;
        this.backgroundImage = data.imgCover;
        this.teamEnabled = data.teamEnabled;
        this.title = data.name;
        this.activityAddress = data.operateLocation;
        this.rankEnable = data.rankEnable;
        this.isLiked = data.isFollowed;
        this.loading = false;
        this.activityDetail = res.data;
        const eventDTO = new VisitActivityDetailDTO(this.activityDetail.name);
        if (this.isBuryingPoint) {
          WeAnalysisEventManagement.reportEvent(
            EventNameEnum.VISIT_ACTIVITY_INFO_PAGE,
            eventDTO
          );
        }
      }
    });
  }

  // 获取副本列表
  getCopyList(id: string) {
    this.activityService.getDetailCopy(id).then((res) => {
      if (res.success && res.data) {
        const copies = res.data.map((copy) => ({
          ...copy,
          content: addRichClass(appendStyle(copy.content)),
        }));
        // copies.splice(1,1)
        // this.copies = [copies.pop()];
        this.copies = copies;
        // this.copies = copies.reverse();
        // console.log('富文本内容')
        // console.log(copies)
        this.showCopies = true;
      }
    });
  }

  // data.total
  getMembers(id: string) {
    this.activityService.getMembers(id).then((res) => {
      if (res.success && res.data) {
        const data = res.data;
        const totalMembers = data.total; // 最多显示 999 个人数
        const avatars = data.records.map((item) => item.avatar).slice(0, 3);
        this.totalMembers = totalMembers;
        this.totalMembersKW = this.setMembers(totalMembers); //这里对人数进行了判断
        this.avatars = avatars;
      }
    });
  }

  //对人数进行一个简单的处理
  setMembers(members: number): string | number {
    if (members > 9999) {
      let num = members / 10000;
      return Utils.noRoundingNumberOfOrders(String(num), 1);
    } else if (members > 999) {
      let num = members / 1000;
      return Utils.noRoundingNumberOfOrders(String(num), 1);
    } else {
      return members;
    }
  }

  makeBackground(url: string) {
    return `url("${url}") no-repeat center center/cover;`;
  }

  onClickJoinBtn() {
    this.clickCount += 1;
    WeAnalysisEventManagement.reportEvent(
      EventNameEnum.CLICK_SIGN_UP,
      new ClickSignBtnBTO(this.activityDetail.name)
    );
    // 订阅
    if (this.activityDetail.openSubscription) {
      wx.requestSubscribeMessage({
        tmplIds: this.tmplIds,
        success: () => {},
        fail: (res: any) => {
          console.log("requestSubscribeMessage errMsg: ", res.errMsg);
        },
      });
    }

    if (this.isLogin) {
      this.joinActivity();
    } else {
      this.onUnLogin();
    }
  }

  getSubscriptionConfig() {
    WeChatService.getSubscriptionConfig(this.getSubscriptionConfigCallback);
  }

  getSubscriptionConfigCallback(success: boolean, templateIds: Array<String>) {
    if (success && templateIds.length > 0) {
      console.log("templateIds: ", templateIds);
      wx.requestSubscribeMessage({
        tmplIds: templateIds,
        success: () => {},
        fail: (res: any) => {
          console.log("requestSubscribeMessage errMsg: ", res.errMsg);
        },
      });
    }
  }

  onUnLogin() {
    this.moveToLoginPage();
  }

  moveToLoginPage() {
    const path = `/pages/activityDetail/index?id=${this.activityId}`;
    uni.navigateTo({
      url:
        "/pages/login/index?pathKey=" +
        encodeURIComponent(JSON.stringify(path)),
    });
  }

  joinActivity() {
    switch (this.activityDetail.entryWay) {
      case EntryWayEnum.URL:
        this.onEntryWayBeUrl();
        break;
      case EntryWayEnum.DEFAULT:
        this.onEntryWayBeDefault();
        break;
      default:
        this.onEntryWayBeDefault();
        break;
    }
  }

  getEntryAppId() {
    if (this.activityDetail.entryUrl !== "") {
      const entryUrl = this.activityDetail.entryUrl;
      const appId = entryUrl.split("/")[2];
      return appId;
    } else {
      return "";
    }
  }

  getPath() {
    if (this.activityDetail.entryUrl !== "") {
      // 取this.activityDetail.entryUrl中第三个'/'后面所有的字符串作为path
      const entryUrl = this.activityDetail.entryUrl;
      const path = entryUrl.substring(this.findCharIndex(entryUrl, "/", 3) + 1);

      return path;
    } else {
      return "";
    }
  }

  findCharIndex(str: string, char: string, num: number): number {
    var index = str.indexOf(char);
    for (var i = 0; i < num - 1; i++) {
      index = str.indexOf(char, index + 1);
    }
    return index;
  }

  onEntryWayBeUrl() {
    if (this.activityDetail.entryUrl !== "") {
      let appId = this.getEntryAppId();
      let path = this.getPath();
      uni.navigateToMiniProgram({
        appId: appId,
        path: path,
      });
    } else {
      uni.showToast({
        title: "暂未开放",
      });
    }
  }

  onEntryWayBeDefault() {
    const nowTime = new Date().getTime();
    if (nowTime > this.activityDetail.endTime) {
      uni.showToast({
        title: "很抱歉，该活动已结束！",
        duration: 2000,
        icon: "none",
      });
    } else {
      if (nowTime < this.activityDetail.entryStartTime) {
        uni.showToast({
          title: "您好，报名时间还未开始！请耐心等候",
          duration: 2000,
          icon: "none",
        });
      } else if (nowTime > this.activityDetail.entryEndTime) {
        uni.showToast({
          title: "很抱歉，该活动已截止报名！",
          duration: 2000,
          icon: "none",
        });
      } else {
        if (this.activityDetail.isPublised) {
          this.showActionSheet = true;
        } else {
          uni.showToast({
            title: "很抱歉，该活动已下架！",
            duration: 2000,
            icon: "none",
          });
        }
      }
    }
  }

  // 获取孩子列表
  getChildrenList(activityId: string) {
    const that = this;
    this.childrenService.getActivityChildren(activityId).then((res) => {
      if (res.success && res.data) {
        const data = res.data;
        const userSelectItems = data.filter((child) => child.isEntry);
        // for (let i = 0; i < userSelectItems.length; i++) {
        //   if (userSelectItems[i].isEntry === 1 && userSelectItems[i].team) {
        //     that.userSelectItems.push(userSelectItems[i]);
        //   }
        // }
        that.userSelectItems = userSelectItems;
        that.currentChild = this.userSelectItems[0];
        if (that.refreshState === false) {
          that.currentChild1 = that.currentChild;
        } else {
          that.currentChild = this.userSelectItems[0];
          this?.$refs?.UserSelect["switchUser"](that.currentChild, 0);
          that.refreshState = false;
        }
      }
    });
  }

  onChangeChild(child: ActivityChild) {
    this.currentChild = child;
    this.currentChild1 = this.currentChild;
  }

  goGuidePage() {
    const currentChild = this.currentChild;
    const activityId = this.activityId;
    const childId = currentChild.userId;
    uni.navigateTo({
      url: `/pages/guide/index?activityId=${activityId}&childId=${childId}`,
    });
    /* if (currentChild.team) {
       uni.navigateTo({
         url: `/pages/guide/index?activityId=${activityId}&childId=${childId}`
       });
     }
     else {
       if (this.activityDetail.isPublised) {
         uni.navigateTo({
           url: `/pages/team/index?activityId=${activityId}&childId=${childId}`
         });
       } else {
         uni.showToast({
           title: "很抱歉，活动已下架，无法创建战队！",
           duration: 2000,
           icon: "none"
         });
       }
   }*/
  }

  goRankPage() {
    if (!this.isLogin) {
      uni.navigateTo({
        url: "/pages/login/index",
      });
      return;
    }
    const activityId = this.activityId;
    uni.navigateTo({
      url: `/pages/rank/index?activityId=${activityId}`,
    });
  }

  likeActivity() {
    if (!this.isLogin) {
      uni.navigateTo({
        url: "/pages/login/index",
      });
      return;
    }
    const id = this.activityId;
    this.likeService.like(id, LikeType.ACTIVITY).then((res) => {
      if (res.success) {
        this.initPage();
        // this.trigger = true;
        // this.$emit("getTrigger", this.trigger); //这里是为了判定收藏后，trigger发生了变化
      }
    });
  }

  unlikeActivity() {
    if (!this.isLogin) {
      uni.navigateTo({
        url: "/pages/login/index",
      });
      return;
    }
    const id = this.activityId;
    this.likeService.unlike(id, LikeType.ACTIVITY).then((res) => {
      if (res.success) {
        this.initPage();
        // this.trigger = true;
        // this.$emit("getTrigger", this.trigger);
      }
    });
  }
}

const addRichClass = (content: string) => {
  return content;
};

const appendStyle = (content: string) => {
  return content;
};

// const filterValidTags = (str: string) => {
//   const startIndex = str.indexOf('')
// }
</script>
<style lang="scss" scoped>
/deep/ .van-tabs__wrap {
  margin: 0 auto;
}
.page {
  background: #fff;
  padding-bottom: 6vh;
}
.banner-box {
  height: 700rpx;
}

.more-activity-btn {
  position: absolute;
  top: 6%;
  left: 2%;
  background-color: $ai121-theme-color;
  color: #f7f7f7;
  padding: 20rpx;
  border-radius: 20rpx;
}

.intro-box {
  // background: $activity-detail-intro-box-bgc;
  background: #5181d9;
  border-radius: 60rpx;
  padding: 40rpx 20rpx;
  color: #fff;
  box-shadow: 0px 6rpx 12rpx rgba(0, 0, 0, 0.16);
  margin-top: -60rpx;
}

.intro-box-text {
  text-align: center;
  font-size: 30rpx;
}

.info-box {
  padding: 60rpx 20rpx;
  font-size: 30rpx;
  border-bottom: 1px solid #efefef;
}

.info-row {
  display: flex;
  align-items: flex-end;
  // padding: 0 20rpx 0;
  justify-content: flex-end;
  // margin-bottom: 24rpx;
}

.info-row-left {
  flex: 1;
}

.info-row-right {
  flex-shrink: 0;
  // flex: 1;
  display: flex;
  justify-content: flex-end;
}

.info-address-row {
  display: flex;
  align-items: center;
}

.info-address {
  font-size: 26rpx;
  margin-left: 10rpx;
}

.info-title {
  margin-bottom: 40rpx;
  font-size: 44rpx;
}

.info-people {
  display: flex;
  align-items: flex-end;
}

.info-avatars {
  margin-right: 0rpx;
  margin-bottom: -20rpx;
}

.box-progress {
  font-size: 30rpx;
  width: 80%;
  margin-right: 10rpx;
  display: flex;
  flex-direction: column;
}

.tab-content-box {
  min-height: 500rpx;
  padding: 20rpx;
  font-size: 30rpx;
}

.join-btn {
  color: #fff;
  background: #5181d9;
  padding: 30rpx 20rpx;
  text-align: center;
  border-radius: 20rpx;
}

.title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 30rpx;
  // padding: 40rpx 0;
  margin-bottom: 16rpx;
}

.footer {
  width: 90%;
  padding: 40rpx;
  position: fixed;
  bottom: 0%;
  z-index: 1;
}

.progress-box {
  // margin-bottom: 30rpx;
}

.progress-out {
  background: #ededed;
  height: 26rpx;
  width: 100%;
  border-radius: 20rpx;
  overflow: hidden;
  box-sizing: border-box;
}

.progress-bar {
  background: linear-gradient(270deg, #fdd910 0%, #fd7b0b 100%);
  width: 50%;
  height: 26rpx;
  border-radius: 20rpx;
}

.btn-row {
  display: flex;
  justify-content: space-between;
}

.activity-address-btn {
  color: #fff;
  background: #5181d9;
  padding: 30rpx 20rpx;
  text-align: center;
  border-radius: 20rpx;
  font-size: 32rpx;
  flex: 1;
}

.activity-address-btn:first-child {
  margin-right: 20rpx;
}

.rich-box {
  padding: 20rpx;
  // width: 100%;
  box-sizing: border-box;
  min-height: 500rpx;
}

.user-box {
  padding: 0 0 0 0;
  display: flex;
  justify-content: center;
  margin-top: 70rpx;
}

.user-name {
  text-align: center;
  font-size: 44rpx;
  font-weight: bold;
  /* margin-bottom: 20rpx; */
  color: #fff;
}

.tool-bar {
  display: flex;
  padding: 20rpx;
  align-items: center;
  justify-content: flex-end;
}

.tool-item {
  width: 80rpx;
  height: 80rpx;
  border-radius: 10rpx;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 30rpx;
  background: #fff;
}

.tool-icon {
  width: 40rpx;
  height: 40rpx;
}

.hot-icon {
  width: 50rpx;
  height: 50rpx;
  margin-right: 10rpx;
}

.banner-inner-box {
  background: rgba(0, 0, 0, 0.4);
  height: 100%;
}

// .children-box {
//   // max-height: 650rpx;
// }

// .action-box {
//   // height: 600rpx;
// }
.rich-img {
  max-width: 100%;
  display: block;
}

.rich-p {
  line-height: 2;
  margin: 20rpx 0;
}
</style>

