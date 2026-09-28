<template>
  <view class="finish-card">
    <div
      :style="{
        background: makeBackground(card.url)
      }"
      class="card-box"
      @click="toActivityDetail"
    >
      <div class="card-inner-box">
        <!-- 下拉弹框 -->
        <!-- <div class="card-icon-box" @click="toggleCardInfoVisible">
          <image
            src="@/static/icon/xiala.png"
            class="drop-icon"
            v-if="!cardInfoVisible"
          ></image>
          <image
            src="@/static/icon/shang.png"
            class="drop-icon"
            v-if="cardInfoVisible"
          ></image>
        </div> -->
        <div class="card-content">
          <div class="card-tip-row">
            <div
              :class="[card.hasFinish ? 'card_tip_green' : 'card_tip_oringe']"
            >
              {{ card.hasFinish ? "已完成" : "未完成" }}
              <!-- <image
                class="card-tip-icon"
                mode="widthFix"
                src="@/static/icon/shouchang_Selected@3x.png"
              ></image> -->
            </div>
          </div>
          <div class="card-footer">
            <div class="card-footer-left">
              <div class="card-title">{{ card.title }}</div>
              <div class="card-text">{{ card.text }}</div>
            </div>
            <div class="card-footer-right">
              <!-- <image
                v-for="(avatar, index) of card.avatars"
                :key="index"
                class="card-footer-avator"
                mode="widthFix"
                :src="avatar"
              ></image> -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <view class="card-info">
      <view class="card-info-row">
        <!-- :class="{ hide: !cardInfoVisible }" -->
        <view
          v-if="activityDetail.certIsAward === 1"
          class="card-info-item"
          @click="clickCert(card)"
        >
          <view
            :class="{
              active: card.isCertActive
            }"
            class="card-info-icon-box"
          >
            <image
              class="card-info-icon"
              mode="widthFix"
              src="@/static/icon/zhengshu-icon.png"
            ></image>
          </view>
          <view class="card-info-text">证书</view>
        </view>
        <view
          v-if="activityDetail.userReportIsGen === 1"
          class="card-info-item"
          @click="clickReport(card)"
        >
          <view
            :class="{
              active: card.isReportActive
            }"
            class="card-info-icon-box"
          >
            <image
              class="card-info-icon"
              mode="widthFix"
              src="https://contentdevsa-blob.ai121.net/testcontainer/activity/image/84f19204-45e5-48f2-a87d-a150363161c2.png"
            ></image>
          </view>
          <view class="card-info-text">数据报告</view>
        </view>
        <view
          v-if="activityDetail.badgeIsAward === 1"
          class="card-info-item"
          @click="clickBadge(card)"
        >
          <view
            :class="{
              active: card.isBadgeActive
            }"
            class="card-info-icon-box"
          >
            <image
              class="card-info-icon"
              mode="widthFix"
              src="https://contentdevsa-blob.ai121.net/testcontainer/activity/image/29a8c415-9e35-4a02-a355-dc9b8f8cf5cf.png"
            ></image>
          </view>
          <view class="card-info-text">徽章</view>
        </view>
        <view
            v-if="card.productionIconShow"
            class="card-info-item"
            @click="clickProduct(card.productId, card.id)"
        >
          <view
              :class="{
              active: card.productId !== ''
            }"
              class="card-info-icon-box"
          >
            <image
                v-show="card.productionCommentUnread"
              class="new-product-icon"
              :src="staticFileEnum.HAS_NEW_PRODUCT_ICON">

            </image>
            <image
                class="card-info-icon"
                mode="widthFix"
                :src="staticFileEnum.MY_PRODUCT_ICON"
            ></image>
          </view>
          <view class="card-info-text">我的作品</view>
        </view>
        <!-- 官方表彰 -->
        <view
          v-if="activityDetail.officialCertIsAward"
          class="card-info-item"
          @click="clickOfficalCert(card)"
        >
          <view
            :class="{
              active: card.isOfficialCertActive
            }"
            class="card-info-icon-box"
          >
            <image
              class="card-info-icon"
              mode="widthFix"
              src="https://contentdevsa-blob.ai121.net/testcontainer/static/activity/img/ma_icon_official_cert.png"
            ></image>
          </view>
          <view class="card-info-text">官方表彰</view>
        </view>
        <!-- <view
          class="card-info-item"
          @click="clickKnowledge()"
          v-if="activityDetail.knowledgeIsGet === 1"
        >
          <view
            class="card-info-icon-box"
            :class="{
              active: activityDetail.knowledgeIsGet,
            }"
          >
            <image
              class="card-info-icon"
              mode="widthFix"
              src="@/static/icon/huizhang-icon.png"
            ></image>
          </view>
          <view class="card-info-text">AI知识点</view>
        </view> -->
      </view>
    </view>
  </view>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import EventCard from "@/beans/common/EventCard";
import ActivityService from "@/service/ActivityService";
import ActivityFullItem from "@/beans/activity/ActivityFullItem";
import FetchBadge from "@/components/common/FetchBadge.vue";
import ShowMsgEnum from "@/definition/lang/ShowMsgEnum";
import LangEnum from "@/definition/lang/LangEnum";
import StaticFileEnum from '@/definition/lang/StaticFileEnum'
import PageLinkEnum from '@/definition/lang/PageLinkEnum'
import RateService from '@/service/RateService'
import BuriedPointRequest from '@/beans/user/req/BuriedPointRequest'
import BadgeService from '@/service/BadgeService'

// class CardItem {
//   icon: string = ''
//   title: string = ''
//   text: string = ''
//   avatars: Array<String> = []
// }

@Component({
  name: "FinishedCard",
  components: {}
})
export default class FinishedCard extends Vue {
  @Prop({
    default: {}
  })
  card!: EventCard

  @Prop({
    default: ''
  })
  userId: string

  activityService = new ActivityService();
  // 活动详情
  activityDetail = new ActivityFullItem();
  cardInfoVisible = true

  staticFileEnum = StaticFileEnum

  buriedPointId: string = ''

  productId = ''

  mounted() {
    this.getBasicInfo(this.card.id);
  }

  onClick() {
    this.$emit("click");
  }

  clickProduct (productId: string, id: string) {
    this.productId = productId
    if (productId !== '') {
      this.moveToMyProductPage()
    }else {
      this.showNoProductMsg()
    }
  }

  showNoProductMsg () {
    uni.showToast({
      icon: "none",
      title: LangEnum.NO_PRODUCTION_NOTICE,
      duration: ShowMsgEnum.SHOW_MESSAGE_DURATION
    })
  }

  doRead () {
    const rateService = new RateService()
    rateService.readPersonalProduction(this.activityDetail.id,this.userId, this.readPersonalProductionCallback)
  }

  moveToMyProductPage () {
    uni.navigateTo({
      url: `${PageLinkEnum.MY_PRODUCT}?buriedPointId=${this.buriedPointId}&childrenId=${this.userId}&productId=${this.productId}&activityId=${this.activityDetail.id}`,
      success: this.doRead
    })
  }



  readPersonalProductionCallback (success: boolean) {
    if (success) {
      this.card.productionCommentUnread = false
    }
  }

  makeBackground(url: string) {
    return `url("${url}") no-repeat center center/cover;`;
  }

  // 跳转活动详情页
  toActivityDetail() {
    const id = this.activityDetail.id;
    uni.navigateTo({
      url: `/pages/activityDetail/index?id=${id}`
    });
  }

  toggleCardInfoVisible() {
    // this.cardInfoVisible = !this.cardInfoVisible;
    // this.getBasicInfo(this.card.id);
  }

  // 得到基本信息
  getBasicInfo(id: string) {
    this.activityService.getDetail(id).then(res => {
      if (res.success && res.data) {
        this.activityDetail = res.data;
      }
    });
  }

  clickCert(card: EventCard) {
    if (card.isCertActive) {
      const certId = card.certId;
      uni.navigateTo({
        url: `/pages/cert/index?id=${certId}`
      });
    } else {
      uni.showToast({
        icon: "none",
        title: LangEnum.NO_CERT_NOTICE,
        duration: ShowMsgEnum.SHOW_MESSAGE_DURATION
      });
    }
  }

  // 点击了官方表彰
  clickOfficalCert(card: EventCard) {
    if (card.isOfficialCertActive) {
      const officialCertId = card.officialCertId;
      uni.navigateTo({
        url: `/pages/officialCert/index?id=${officialCertId}`
      });
    } else {
      uni.showToast({
        icon: "none",
        title: LangEnum.NO_OFFICIAL_CERT_NOTICE,
        duration: ShowMsgEnum.SHOW_MESSAGE_DURATION
      });
    }
  }
  // uni.navigateTo({
  //   url: `/pages/webview/index?url=${urls}`
  // });
  clickReport(card: EventCard) {
    if (card.isReportActive) {
      uni.navigateTo({
        url: `/pages/dataReport/index?activityId=${this.card.id}&childId=${this.userId}`
      });
    } else {
      uni.showToast({
        icon: "none",
        title: LangEnum.NO_REPORT_NOTICE,
        duration: 2000
      });
    }

    return;

    // const url = encodeURIComponent(
    //   process.env.VUE_APP_REPORT_WEB_URL as string
    // );
    // uni.navigateTo({
    //   url: `/pages/webview/index?url=${url}`
    // });
  }

  clickBadge(card: EventCard) {
    if (card.isBadgeActive) {
      this.$emit("onBadgeChange", this.activityDetail.id, card.title, card.badgeId);
      this.$emit("closeFetchBadge", true);
    } else {
      uni.showToast({
        icon: "none",
        title: LangEnum.NO_BADGE_NOTICE,
        duration: 2000
      });
    }
  }

  clickKnowledge() {
    uni.showToast({
      icon: "none",
      title: "具体详情，请查看数据报告",
      duration: 2000
    });
  }
}
</script>
<style scoped>
.finish-card {
  border-radius: 30rpx;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.card-box {
  border-radius: 30rpx;
  box-shadow: 0 4px 24px 0 rgb(0, 0, 0, 0, 0.08);
  height: 300rpx;
  overflow: hidden;
  width: 100%;
}

.card-inner-box {
  background: linear-gradient(360deg, #222222c7 0%, rgba(84, 84, 84, 0.1) 100%);
  box-sizing: border-box;
  box-sizing: border-box;
  color: #fff;
  height: 100%;
  padding: 20rpx;
  position: relative;
  width: 100%;
}

.card-icon-box {
  /* width: 100%; */
  box-sizing: border-box;
  padding: 30rpx;
  position: absolute;
  right: 0;
  text-align: right;
  top: 0;
}

.drop-icon {
  height: 32rpx;
  width: 32rpx;
}

.card-content {
  bottom: 0;
  box-sizing: border-box;
  font-size: 30rpx;
  left: 0;
  padding: 20px;
  position: absolute;
  width: 100%;
}

.card-tip-row {
  display: flex;
  justify-content: flex-start;
}

.card_tip_green {
  background: #8ac252;
  border-radius: 10px;
  display: flex;
  font-size: 24rpx;
  margin-bottom: 10rpx;
  padding: 10rpx 20rpx;
}

.card_tip_oringe {
  background: orange;
  border-radius: 10px;
  display: flex;
  font-size: 24rpx;
  margin-bottom: 10rpx;
  padding: 10rpx 20rpx;
}

.card-tip-icon {
  height: 30rpx;
  margin-left: 10rpx;
  width: 30rpx;
}

.card-footer-avator {
  border-radius: 50%;
  height: 80rpx;
  margin-left: -50rpx;
  width: 80rpx;
}

.card-footer-avator:first-child {
  margin-left: 20rpx;
}

.card-footer {
  align-items: flex-end;
  display: flex;
  justify-content: space-between;
}

.card-footer-left {
  flex: 1;
  flex-shrink: 1;
  overflow: hidden;
}

.card-footer-right {
  display: flex;
  flex-shrink: 0;
}

.card-title {
  font-size: 40rpx;
  margin-bottom: 10rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-text {
  margin-bottom: 10rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-info-row {
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  /* height: 200rpx; */
  height: 100%;
  justify-content: flex-start;
  transition: height 0.3s;
}

/* .card-info-row.hide {
  height: 0;
} */

.card-info-item {
  /* flex: 1; */
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 20rpx;
  padding: 20rpx 0;
  width: 33.3%;
}

.card-info-icon-box {
  align-items: center;
  background: #adadad;
  border-radius: 20rpx;
  box-shadow: 0px 3px 6px rgba(165, 165, 165, 0.28);
  display: flex;
  height: 100rpx;
  position: relative;
  justify-content: center;
  width: 100rpx;
}

.card-info-icon-box.active {
  background: #f2a563;
}

.card-info-icon-box .new-product-icon {
  height: 30rpx;
  width: 30rpx;
  position: absolute;
  right: -10rpx;
  top: -10rpx;
}

.card-info-text {
  font-size: 24rpx;
  margin-top: 10rpx;
  text-align: center;
}

.card-info-icon {
  height: 40rpx;
  width: 40rpx;
}
</style>
