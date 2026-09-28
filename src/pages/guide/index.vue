<style lang="scss" scoped>
@import "./index.less";
</style>
<template>
  <web-view :src="url"></web-view>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ActivityService from "@/service/ActivityService";
import ChildrenService from "@/service/ChildrenService";
import LoginManagement from "@/management/login/LoginManagement";

import PersonalActivityWorkResponse from "@/beans/activity/res/PersonalActivityWorkResponse";
import PersonalSubmitConfigResponse from "@/beans/activity/res/PersonalSubmitConfigResponse";
import { Utils } from "@/common/utils/Utils";
import ShowMsgEnum from "@/definition/lang/ShowMsgEnum";
import PeriodsItem from "@/beans/activity/PeriodsItem";
import LangEnum from "@/definition/lang/LangEnum";
import TokenManagement from "@/management/token/TokenManagement";

@Component({
  name: "Guide"
})
export default class Guide extends Vue {
  activityService = new ActivityService();
  childrenService = new ChildrenService();
  name = "";
  school = "";
  avatar = "";
  backgroundImage = "";
  guideKfImg = "";
  guidePromotionLink = "";
  guideTeachImg = "";
  guideStudyUrl = "";
  activityId = "";
  childId = "";
  pages = [];
  isLogin: boolean = false;
  hasChildId: boolean = true;
  lang = LangEnum;
  currentPeriodId: string = "";
  isUploadDetailsShow: boolean = false;
  personalSubmitConfigResponse: PersonalSubmitConfigResponse = new PersonalSubmitConfigResponse();

  url: string = "";

  onLoad(options: any) {
    const isLogin = new LoginManagement().isLogin();
    this.isLogin = isLogin;
    this.activityId = options.activityId;

    if (options.scene !== undefined) {
      const scene = decodeURIComponent(options.scene);
      const sceneData = scene.split(",");
      this.activityId = sceneData[0];
      this.childId = sceneData[1];
    }

    this.rebackToSelf();
    if (options.childId && !options.from) {
      this.childId = options.childId;
      this.hasChildId = true;
    } else {
      this.hasChildId = false;
    }
    this.getGuideInfo(this.activityId);
    if (this.isLogin) {
      this.getChildrenList(this.activityId);
    }
    this.getPersonalSubmitConfig(this.activityId);
    const pages = getCurrentPages();
    this.pages = pages.map(item => item.route);
    let activityAppId = process.env.VUE_APP_WECHAT_APPID
    this.url = ` ${
      process.env.VUE_APP_CARMELA_APP_URL
    }/activity-guidance-page?activityId=${this.activityId}&childId=${
      this.childId
    }&token=${TokenManagement.getInstance().getToken()}&v=${new Date().getTime()}&activityAppId=${activityAppId}`;
  }

  rebackToSelf() {
    const path = `/pages/guide/index?activityId=${this.activityId}`;
    if (!this.isLogin) {
      uni.navigateTo({
        url:
          "/pages/login/index?pathKey=" +
          encodeURIComponent(JSON.stringify(path))
      });
      return;
    }
  }

  // 下拉刷新
  onPullDownRefresh() {
    this.getGuideInfo(this.activityId);
    setTimeout(() => {
      if (this.isLogin) {
        this.getChildEntryInfo(this.activityId, this.childId);
      }
      uni.stopPullDownRefresh();
    }, 3000);
  }

  getChildrenList(activityId: string) {
    const that = this;
    this.childrenService.getActivityChildren(activityId).then(res => {
      if (res.success && res.data) {
        const data = res.data;
        const userSelectItems = data.filter(child => child.isEntry);
        if (userSelectItems.length) {
          if (!this.hasChildId) {
            this.childId = userSelectItems[0].userId;
          }
        } else {
          this.sceenBackToDetailPage();
        }
        this.getChildEntryInfo(this.activityId, this.childId);
      }
    });
  }

  sceenBackToDetailPage() {
    uni.reLaunch({
      url: `/pages/activityDetail/index?id=${this.activityId}`
    });
  }

  getGuideInfo(activityId: string) {
    this.activityService.getGuideInfo(activityId).then(res => {
      if (res.success && res.data) {
        const data = res.data;
        this.backgroundImage = data.guideBgImg;
        this.guideKfImg = data.guideKfImg;
        this.guidePromotionLink = data.guidePromotionLink;
        this.guideTeachImg = data.guideTeachImg;
        this.guideStudyUrl = data.guideStudyUrl;
        console.log("getGuideInfo", this.backgroundImage);
      }
    });
  }

  getChildEntryInfo(activityId: string, childId: string) {
    this.childrenService.getChildEntryInfo(activityId, childId).then(res => {
      if (res.success && res.data) {
        const data = res.data;
        this.name = data.realName;
        this.school = data.orgName;
        this.avatar = data.avatar;
      }
    });
  }

  previewImage() {
    wx.previewImage({
      urls: [this.guideKfImg],
      success: () => {},
      fail: () => {}
    });
  }

  makeBackground(url: string) {
    return `url("${url}") no-repeat top center/101%;`;
  }

  copyText() {
    uni.setClipboardData({
      data: this.guideStudyUrl,
      success: function() {
        uni.showToast({
          title: "复制成功",
          duration: ShowMsgEnum.SHOW_MESSAGE_DURATION
        });
      }
    });
  }

  backToActivityDetail() {
    uni.$emit("backToactive");
    let count = 0;
    if (this.pages.length <= 1) {
      this.sceenBackToDetailPage();
    } else {
      for (let i = this.pages.length - 1; i >= 0; i--) {
        if (this.pages[i] === "pages/activityDetail/index") {
          uni.$emit("backToactive");
          uni.navigateBack({
            delta: count
          });
        } else if (
          this.pages[i] === "pages/internalpages/activityDetail/index"
        ) {
          uni.navigateBack({
            delta: count
          });
        }
        count++;
      }
    }

    // uni.$emit("backToActivity");
    // uni.redirectTo({
    //   url: `/pages/activityDetail/index?id=${this.activityId}`,
    // });
    // uni.navigateBack({
    //   delta: 1,
    // });
  }

  learnMoreMessge() {
    uni.navigateTo({
      url: `/pages/webview/index?url=${this.guidePromotionLink}`
    });
    // location.href = this.guidePromotionLink;
  }

  isPeriodNotStart(startTime: number): boolean {
    return !Utils.compareWithNowTimeStamp(startTime);
  }

  isPeriodTimeOut(endTime: number): boolean {
    return Utils.compareWithNowTimeStamp(endTime);
  }

  getPersonalSubmitConfig(activityId: string) {
    let activityService = new ActivityService();
    activityService.getPersonalSubmitConfig(
      activityId,
      this.getPersonalSubmitConfigCallback
    );
  }

  getPersonalSubmitConfigCallback(
    data: PersonalSubmitConfigResponse,
    success: boolean
  ) {
    if (success) {
      this.personalSubmitConfigResponse = data;
      if (data.currentPeriod) {
        this.onCurrentPeriodExistence(data.currentPeriod, data.enabled);
      }
    }
  }

  onCurrentPeriodExistence(currentPeriod: PeriodsItem, enabled: boolean) {
    if (
      this.isPeriodNotStart(currentPeriod.startTime) === false ||
      this.isPeriodTimeOut(currentPeriod.endTime) === false ||
      enabled === false
    ) {
      this.showPublicTimeMsg();
    } else {
      this.currentPeriodId = currentPeriod.id;
      this.isUploadDetailsShow = true;
    }
  }

  showPublicTimeMsg() {
    uni.showToast({
      title: "请注意流程时间",
      duration: ShowMsgEnum.SHOW_MESSAGE_DURATION,
      icon: "none"
    });
  }
}
</script>
