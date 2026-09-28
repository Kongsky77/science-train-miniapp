<template>
  <view class="icon-row-box">
    <view class="icon-row-row">
      <view
        v-for="item of iconList"
        :key="item.id"
        class="icon-row-item"
        @click="onClick(item)"
      >
        <view class="icon-row-icon-box">
          <view
            v-if="item.id === iconEnum.CHECK_IN"
            class="check-in-entry-icon"
          >
            <view class="check-in-train-body">
              <view class="check-in-train-window"></view>
              <view class="check-in-train-window"></view>
            </view>
            <view class="check-in-train-wheel check-in-train-wheel--left"></view>
            <view class="check-in-train-wheel check-in-train-wheel--right"></view>
          </view>
          <image
            v-if="item.id === iconEnum.RANK"
            :src="item.icon"
            class="icon-row-icon1"
            mode="heightFix"
          ></image>
          <image
            v-if="item.id === iconEnum.CERT"
            :src="item.icon"
            class="icon-row-icon1"
            mode="heightFix"
          ></image>
          <image
            v-if="item.id === iconEnum.OFFICIAL_CERT"
            :src="item.icon"
            class="icon-row-icon1"
            mode="heightFix"
          ></image>
          <!-- <view class="product-icon" v-else-if="item.id === iconEnum.PRODUCT"> -->
          <image
            :src="item.icon"
            v-else-if="item.id === iconEnum.PRODUCT"
            class="icon-row-icon1"
            mode="heightFix"
          />
          <!-- <image
              v-if="item.productionCommentUnread"
              class="new-product-icon"
              :src="staticFileEnum.HAS_NEW_PRODUCT_ICON"
            >
            </image> -->
          <!-- </view> -->
          <image
            v-else-if="
              item.id === iconEnum.USER_REPORT ||
                item.id === iconEnum.AI_KNOWLEDGE
            "
            :src="item.icon"
            class="icon-row-icon2"
            mode="heightFix"
          ></image>
          <image
            v-else-if="item.id === iconEnum.BADGE"
            :src="item.icon"
            class="icon-row-icon"
            mode="heightFix"
          ></image>
          <image
            v-else-if="item.id === iconEnum.ENTRY_INFO"
            :src="item.icon"
            class="icon-row-icon"
            mode="heightFix"
          ></image>
        </view>
        <view
          :style="{ color: item.textColor }"
          class="icon-row-text"
        >{{ item.text }}
        </view>
      </view>
      <view
        v-if="isBadgeBox"
        class="fetch-badge-box"
      >
        <FetchBadge
          :activityId="activityId"
          :activityName="badgeActivityName"
          :currentUserName="childName"
          :list="badges"
          :award-position="badges[0].awardPosition"
          @ViewBadgeByMessage="viewBadgeByMessage"
          @closeFetchBadge="closeFetchBadge"
        />
      </view>
    </view>
  </view>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import IconRowItem from "@/beans/common/IconRowItem";
import ActivityService from "@/service/ActivityService";
import ChildActivityItem from "@/beans/activity/ChildActivityItem";
import {
  BadgeIsAwardEnum,
  CertIsAwardEnum,
  KnowledgeIsGetEnum,
  UserReportIsGenEnum,
} from "@/enums/activity/ActivityFullItemEnum";
import IconEnum from "@/definition/icon/IconEnum";
import IconTextEnum from "@/definition/icon/IconTextEnum";
import BadgeListItem from "@/beans/badge/BadgeListItem";
import dayjs from "dayjs";
import BadgeService from "@/service/BadgeService";
import FetchBadge from "@/components/common/FetchBadge.vue";
import ShowMsgEnum from "@/definition/lang/ShowMsgEnum";
import LangEnum from "@/definition/lang/LangEnum";
import LoginManagement from "@/management/login/LoginManagement";
import StaticFileEnum from "@/definition/lang/StaticFileEnum";
import PageLinkEnum from "@/definition/lang/PageLinkEnum";
import RateService from "@/service/RateService";
import ThemeTypeEnum from "@/enums/theme/ThemeTypeEnum";

@Component({
  name: "IconRow",
  components: {
    FetchBadge,
  },
})
export default class IconRow extends Vue {
  @Prop()
  childId: string;
  @Prop()
  activityId: string;
  @Prop()
  childName: string;
  @Prop({
    default: false,
  })
  rankEnabled: boolean;
  @Prop({
    default: false,
    type: Boolean,
  })
  isFresh: boolean;

  @Prop({
    default: false,
    type: Boolean,
  })
  mustIdNo: boolean;

  themeType: string = process.env.VUE_APP_THEME_TYPE;
  ICON_BOX_BGC: string = "#fea2a4";

  iconEnum = IconEnum;
  badgeActivityName: string = "";
  staticFileEnum = StaticFileEnum;
  childActivity: ChildActivityItem = new ChildActivityItem();
  badges: BadgeListItem[] = [];
  isBadgeBox: boolean = false;

  @Watch("isRefresh")
  onActivityDetailRefresh(isRefresh: boolean) {
    if (isRefresh) {
      this.receiveActivityDetails();
      this.receiveActivityChildDetails(this.childId);
    }
  }

  clickProduct() {}

  get iconList() {
    let iconList = [];
    // 证书
    if (this.childActivity.activity.certIsAward !== undefined) {
      if (this.childActivity.activity.certIsAward === CertIsAwardEnum.YES) {
        const certIcon = this.getCertIcon();
        iconList.push(certIcon);
      }
    }

    // 修改报名信息
    console.log("iconList ", this.childId);
    if (
      !this.isActivityEnd(this.childActivity.activity.endTime) &&
      this.childId !== "" &&
      this.childId !== undefined
    ) {
      const entryInfoIcon = this.getEntryInfoIcon();
      iconList.push(entryInfoIcon);
    }

    // 官方表彰
    if (this.childActivity.activity.officialCertIsAward !== undefined) {
      if (this.childActivity.activity.officialCertIsAward) {
        const officialCertIcon = this.getOfficialIcon();
        iconList.push(officialCertIcon);
      }
    }

    // 数据报告
    if (
      this.childActivity.activity.userReportIsGen === UserReportIsGenEnum.YES
    ) {
      const userReportIcon = this.getUserReportIcon();
      iconList.push(userReportIcon);
    }

    // 排行榜
    if (this.rankEnabled) {
      iconList.push(this.getRankIcon());
    }

    // 定位打卡
    if (this.childActivity.activity.checkInEnabled === 1) {
      iconList.push(this.getCheckInIcon());
    }

    // 作品
    if (this.childActivity.activity.productionIconShow) {
      iconList.push(this.getProductIcon());
    }

    // ai知识点
    if (this.childActivity.activity.knowledgeIsGet === KnowledgeIsGetEnum.YES) {
      const AiKnowledgeIcon = this.getAiKnowledge();
      iconList.push(AiKnowledgeIcon);
    }

    // 徽章
    if (this.childActivity.activity.badgeIsAward === BadgeIsAwardEnum.YES) {
      const badgeIcon = this.getBadgeIcon();
      iconList.push(badgeIcon);
    }

    return iconList;
  }

  mounted() {
    this.receiveActivityDetails();
  }

  closeFetchBadge(isBadge: boolean) {
    this.isBadgeBox = isBadge;
  }

  viewBadgeByMessage() {
    uni.navigateTo({
      url:
        "/pages/profile/BadgeList?childId=" +
        encodeURIComponent(this.childId) +
        "&childName=" +
        encodeURIComponent(this.childName),
    });
  }

  getCertIcon() {
    let certIcon = new IconRowItem();
    certIcon.id = IconEnum.CERT;
    certIcon.text = IconTextEnum.CERT;

    if (this.childActivity.certId !== "") {
      certIcon.certId = this.childActivity.certId;
      certIcon.icon = this.imgUrl + "/icon_cert_active.png";
    } else {
      certIcon.icon = this.imgUrl + "/icon_cert.png";
    }

    return certIcon;
  }

  getProductIcon() {
    let productIcon = new IconRowItem();
    productIcon.id = IconEnum.PRODUCT;
    productIcon.text = IconTextEnum.PRODUCT;
    productIcon.productId = this.childActivity.productId;
    productIcon.productionCommentUnread =
      this.childActivity.productionCommentUnread;

    if (this.childActivity.productId !== "") {
      productIcon.officialcertId = this.childActivity.officialCertId;
      productIcon.icon = this.imgUrl + "/icon_works_active.png";
    } else {
      productIcon.icon = this.imgUrl + "/icon_works.png";
    }

    return productIcon;
  }

  getRankIcon() {
    let certIcon = new IconRowItem();
    certIcon.id = IconEnum.RANK;
    certIcon.text = IconTextEnum.RANK;

    if (this.rankEnabled) {
      certIcon.officialcertId = this.childActivity.officialCertId;
      certIcon.icon = this.imgUrl + "/icon_rank_active.png";
    } else {
      certIcon.icon = this.imgUrl + "/icon_rank.png";
    }

    return certIcon;
  }

  getCheckInIcon() {
    const checkInIcon = new IconRowItem();
    checkInIcon.id = IconEnum.CHECK_IN;
    checkInIcon.text = IconTextEnum.CHECK_IN;
    return checkInIcon;
  }
  get imgUrl() {
    return `${process.env.VUE_APP_BLOB_IMAGE_URL_NEW}/competition-detail`;
  }

  getOfficialIcon() {
    let certIcon = new IconRowItem();
    certIcon.id = IconEnum.OFFICIAL_CERT;
    certIcon.text = IconTextEnum.OFFICIAL_CERT;

    if (this.childActivity.officialCertId !== "") {
      certIcon.officialcertId = this.childActivity.officialCertId;
      certIcon.icon = this.imgUrl + "/icon_official_active.png";
    } else {
      certIcon.icon = this.imgUrl + "/icon_official.png";
    }

    return certIcon;
  }

  getEntryInfoIcon() {
    let entryInfoIcon = new IconRowItem();
    entryInfoIcon.id = IconEnum.ENTRY_INFO;
    entryInfoIcon.icon = this.imgUrl + "/icon_entry_active.png";
    entryInfoIcon.text = IconTextEnum.ENTRY_INFO;

    return entryInfoIcon;
  }

  getUserReportIcon() {
    let userReportIcon = new IconRowItem();
    userReportIcon.id = IconEnum.USER_REPORT;
    userReportIcon.text = IconTextEnum.USER_REPORT;
    userReportIcon.userReportIsGen = this.childActivity.userReportIsGen;

    if (this.childActivity.userReportIsGen === UserReportIsGenEnum.YES) {
      userReportIcon.icon = this.imgUrl + "/icon_report_active.png";
    } else {
      userReportIcon.icon = this.imgUrl + "/icon_report.png";
    }
    return userReportIcon;
  }

  getAiKnowledge() {
    let aiKnowledge = new IconRowItem();
    aiKnowledge.id = IconEnum.AI_KNOWLEDGE;
    aiKnowledge.text = IconTextEnum.AI_KNOWLEDGE;
    aiKnowledge.process = this.childActivity.process;

    if (this.childActivity.process === 100) {
      aiKnowledge.icon = this.imgUrl + "/icon_knows_active.png";
    } else {
      aiKnowledge.icon = this.imgUrl + "/icon_knows.png";
    }

    return aiKnowledge;
  }

  getBadgeIcon() {
    let badgeIcon = new IconRowItem();
    badgeIcon.id = IconEnum.BADGE;
    // badgeIcon.icon = StaticFileEnum.BADGE_ICON;
    badgeIcon.text = IconTextEnum.BADGE;
    if (this.childActivity.badgeId !== "") {
      badgeIcon.badgeId = this.childActivity.badgeId;
      badgeIcon.icon = this.imgUrl + "/icon_huizhang_active.png";
    } else {
      badgeIcon.icon = this.imgUrl + "/icon_huizhang.png";
    }
    return badgeIcon;
  }

  @Watch("childId")
  onCurrentChildChange(childId: string) {
    this.receiveActivityChildDetails(childId);
  }

  onClick(item: IconRowItem) {
    const isLogin = new LoginManagement().isLogin();
    if (isLogin) {
      switch (item.id) {
        case IconEnum.BADGE:
          this.receiveBadges(item.badgeId);
          break;
        case IconEnum.OFFICIAL_CERT:
          this.jumpToOfficialCertPage(item.officialcertId);
          break;
        case IconEnum.CERT:
          this.jumpToCertPage(item.certId);
          break;
        case IconEnum.USER_REPORT:
          this.jumpToReportPage(item.userReportIsGen);
          break;
        case IconEnum.AI_KNOWLEDGE:
          this.onKnowledgeIconClick(item.process);
          break;
        case IconEnum.PRODUCT:
          this.onProductIconClick(item.productId);
          break;
        case IconEnum.RANK:
          this.jumpToRankPage();
          break;
        case IconEnum.CHECK_IN:
          this.jumpToCheckInPage();
          break;
        case IconEnum.ENTRY_INFO:
          this.jumpToUpdateEntryInfoPage();
          break;
        default:
          break;
      }
    } else {
      this.jumpToLoginPage();
    }
  }

  onProductIconClick(productId: string) {
    if (productId !== "") {
      this.moveToMyProductPage(productId);
    } else {
      this.showNoProductNotice();
    }
  }

  moveToMyProductPage(productId: string) {
    uni.navigateTo({
      url: `${PageLinkEnum.MY_PRODUCT}?childrenId=${this.childId}&productId=${productId}&activityId=${this.activityId}`,
      success: this.doRead,
    });
  }

  doRead() {
    const rateService = new RateService();
    rateService.readPersonalProduction(
      this.activityId,
      this.childId,
      this.readPersonalProductionCallback
    );
  }

  readPersonalProductionCallback(success: boolean) {
    if (success) {
    }
  }

  jumpToRankPage() {
    const activityId = this.activityId;
    uni.navigateTo({
      url: `/pages/rank/index?activityId=${activityId}`,
    });
  }

  jumpToCheckInPage() {
    if (!this.childId) {
      uni.showToast({
        title: "请先报名并选择用户",
        icon: "none",
      });
      return;
    }
    uni.navigateTo({
      url: `${PageLinkEnum.LOCATION_CHECK_IN}?activityId=${this.activityId}&childId=${this.childId}`,
    });
  }

  jumpToUpdateEntryInfoPage() {
    this.isActivityEnd(this.childActivity.activity.endTime);
    console.log(
      "jumpToUpdateEntryInfoPage",
      this.isActivityEnd(this.childActivity.activity.endTime)
    );

    const activityId = this.activityId;
    uni.navigateTo({
      url: `/pages/fillInfo/UpdateEntryInfo?activityId=${activityId}&childId=${
        this.childId
      }&isActivityEnd=${this.isActivityEnd(
        this.childActivity.activity.endTime
      )}&mustIdNo=${this.mustIdNo}`,
    });
  }

  jumpToLoginPage() {
    const currentPath = encodeURIComponent(
      JSON.stringify(`/pages/activityDetail/index`)
    );
    uni.navigateTo({
      url: `/pages/login/index?pathKey=${currentPath}&activtyId=${this.activityId}`,
    });
  }

  onKnowledgeIconClick(process: number) {
    // if (process === 100) {
    //   this.showHasKnowledgeNotice();
    // } else {
    //   this.showNoKnowledgeNotice();
    // }
  }

  showHasKnowledgeNotice() {
    uni.showToast({
      icon: "none",
      title: LangEnum.HAS_KNOWLEDGE_NOTICE,
      duration: ShowMsgEnum.SHOW_MESSAGE_DURATION,
    });
  }

  showNoKnowledgeNotice() {
    uni.showToast({
      icon: "none",
      title: LangEnum.NO_KNOWLEDGE_NOTICE,
      duration: ShowMsgEnum.SHOW_MESSAGE_DURATION,
    });
  }

  showNoProductNotice() {
    uni.showToast({
      icon: "none",
      title: LangEnum.NO_PRODUCTION_NOTICE,
      duration: ShowMsgEnum.SHOW_MESSAGE_DURATION,
    });
  }

  jumpToCertPage(certId: string) {
    if (certId !== "") {
      uni.navigateTo({
        url: `/pages/cert/index?id=${certId}`,
      });
    } else {
      this.showNoCertNotice();
    }
  }

  jumpToOfficialCertPage(officialCertId: string) {
    if (officialCertId !== "") {
      uni.navigateTo({
        url: `/pages/officialCert/index?id=${officialCertId}`,
      });
    } else {
      this.showNoOfficialCertNotice();
    }
  }

  jumpToReportPage(userReportIsGen: number) {
    if (userReportIsGen === 1) {
      uni.navigateTo({
        url: `/pages/dataReport/index?activityId=${this.activityId}`,
      });
    } else {
      this.showNoReportNotice();
    }
  }

  receiveBadges(badgeId: string) {
    this.badges = [];
    if (badgeId !== "") {
      let badgeService = new BadgeService();
      badgeService.getBadge(badgeId).then((res) => {
        if (res.success && res.data) {
          const data = res.data;
          this.badgeActivityName = data.title;
          const badge = {
            id: data.id,
            activityId: data.activityId,
            name: data.title,
            date: dayjs(data.awardedTime).format("YYYY-MM-DD"),
            awardedTime: data.awardedTime,
            image: data.imgLit,
            awardPosition: data.awardPosition,
          };
          this.badges.push(badge);
          console.log(this.badges);
          this.isBadgeBox = true;
        }
      });
    } else {
      this.showNoBadgeNotice();
    }
  }

  showNoBadgeNotice() {
    uni.showToast({
      icon: "none",
      title: LangEnum.NO_BADGE_NOTICE,
      duration: ShowMsgEnum.SHOW_MESSAGE_DURATION,
    });
  }

  showNoReportNotice() {
    uni.showToast({
      icon: "none",
      title: LangEnum.NO_REPORT_NOTICE,
      duration: ShowMsgEnum.SHOW_MESSAGE_DURATION,
    });
  }

  showNoCertNotice() {
    uni.showToast({
      icon: "none",
      title: LangEnum.NO_CERT_NOTICE,
      duration: ShowMsgEnum.SHOW_MESSAGE_DURATION,
    });
  }

  showNoOfficialCertNotice() {
    uni.showToast({
      icon: "none",
      title: LangEnum.NO_OFFICIAL_CERT_NOTICE,
      duration: ShowMsgEnum.SHOW_MESSAGE_DURATION,
    });
  }

  async receiveActivityDetails() {
    let activityService = new ActivityService();
    const { data: data } = await activityService.getDetail(this.activityId);
    if (data) this.childActivity.activity = data;
  }

  async receiveActivityChildDetails(childId: string) {
    if (!childId) return;
    let activityService = new ActivityService();
    const { data: data } = await activityService.getChildActivityDetail(
      this.activityId,
      childId
    );
    if (data) this.childActivity = data;
  }

  private isActivityEnd(endTime: number) {
    let isActivityEnd = false;
    const nowTime = new Date().getTime();
    if (nowTime > endTime) {
      isActivityEnd = true;
    }
    return isActivityEnd;
  }
}
</script>
<style scoped>
/* .icon-row-row {
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  height: 200rpx;
  justify-content: flex-start;
  transition: height 0.3s;
} */
.icon-row-row {
  overflow: hidden;
}

.icon-row-row.hide {
  height: 0;
}

.icon-row-item {
  float: left;
  align-items: center;
  /* flex: 1; */
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 20rpx;
  padding: 20rpx 0;
  width: 25%;
}

.icon-row-icon-box {
  align-items: center;
  border-radius: 20rpx;
  box-shadow: 0px 3px 6px rgba(165, 165, 165, 0.28);
  display: flex;
  height: 100rpx;
  justify-content: center;
  width: 100rpx;
  position: relative;
}

.icon-row-text {
  font-size: 24rpx;
  margin-top: 20rpx;
  text-align: center;
}

.icon-row-icon {
  height: 100%;
}
.icon-row-icon1 {
  height: 100%;
}
.icon-row-icon2 {
  height: 100%;
}

.check-in-entry-icon {
  position: relative;
  width: 76rpx;
  height: 58rpx;
}

.check-in-train-body {
  position: absolute;
  left: 2rpx;
  right: 2rpx;
  top: 4rpx;
  height: 42rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 18rpx 18rpx 8rpx 8rpx;
  background: linear-gradient(145deg, #d82731, #9d1720);
  box-shadow: inset 0 -9rpx 0 #efc569;
}

.check-in-train-window {
  width: 16rpx;
  height: 13rpx;
  margin: 0 3rpx;
  border-radius: 3rpx;
  background: #d8f1f7;
}

.check-in-train-wheel {
  position: absolute;
  bottom: 0;
  width: 13rpx;
  height: 13rpx;
  border: 3rpx solid #41454c;
  border-radius: 50%;
  background: #dfe2e6;
}

.check-in-train-wheel--left {
  left: 13rpx;
}

.check-in-train-wheel--right {
  right: 13rpx;
}

.new-product-icon {
  height: 30rpx;
  width: 30rpx;
  position: absolute;
  right: -10rpx;
  top: -10rpx;
}
</style>
