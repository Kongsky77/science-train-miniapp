<template>
  <view class="cert-box">
    <view class="title-box">
      <text>荣誉证书</text>
    </view>
    <view class="cert-card-list" v-if="notOfficialList.length > 0">
      <view
        class="cert-item"
        v-for="(item, index) of notOfficialList"
        :key="index"
      >
        <image
          class="cert-image"
          mode="aspectFit"
          :src="item.certCover"
        ></image>
        <view class="text-box">
          <view class="cert-text">{{ item.title }}</view>
          <view class="cert-text">{{ item.year }}.{{ item.month }}</view>
        </view>
      </view>
    </view>
    <van-empty v-else description="尚未获取" />

    <view class="title-box">
      <text>官方表彰</text>
    </view>
    <view class="cert-card-list" v-if="officialList.length > 0">
      <view
        class="cert-item"
        v-for="(item, index) of officialList"
        :key="index"
      >
        <image
          class="cert-image"
          mode="aspectFit"
          :src="item.certCover"
        ></image>
        <view class="text-box">
          <view class="cert-text">获得日期</view>
          <view class="cert-text">2020.09.09</view>
        </view>
      </view>
    </view>
    <van-empty v-else description="尚未获取" />
  </view>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ActivityService from "@/service/ActivityService";
import dayjs from "dayjs";
import EventCard from "@/beans/common/EventCard";

class OptionScene {
  childId: string = "";
}
class MyWorksRequest {
  // 页码，默认：1
  pageNo = 1;
  // 每页显示数量，最大值：100，默认：10
  pageSize = 100;

  certType: CertTypeEnum = CertTypeEnum.NOT_OFFICIAL;
}
enum CertTypeEnum {
  OFFICIAL = 2,
  NOT_OFFICIAL = 1, //荣誉证书
}

@Component({
  name: "Cert",
})
export default class Cert extends Vue {
  childrenId = "";
  activityService = new ActivityService();
  // 官方列表
  officialList: EventCard[] = [];
  // 荣誉证书
  notOfficialList: EventCard[] = [];

  onLoad(option: OptionScene) {
    this.childrenId = option.childId;
    // 官方
    this.getChildActivityList(CertTypeEnum.OFFICIAL);
    // 荣誉证书
    this.getChildActivityList(CertTypeEnum.NOT_OFFICIAL);
  }

  getChildActivityList(certType: CertTypeEnum = CertTypeEnum.NOT_OFFICIAL) {
    let listRequest = new MyWorksRequest();
    listRequest.certType = certType;
    this.activityService
      .getChildActivityList(this.childrenId, listRequest)
      .then((res) => {
        if (res.success && res.data) {
          const data = res.data;
          const records = data.records;
          const cards: EventCard[] = records.map((record) => ({
            id: record.activity.id,
            title: record.activity.name,
            text: record.activity.slogan,
            url: record.activity.imgCover,
            year: dayjs(Number(record.createTime)).format("YYYY"),
            month: dayjs(Number(record.createTime)).format("MM"),
            day: dayjs(Number(record.createTime)).format("DD"),
            // hasFinish: !!(record.process === "100"),
            hasFinish: !!(Number(record.process) >= 100),
            isCertActive: record.certId !== "", //这里进行了修改，改为了不为空就为true。目前不知道不为空是需要改为!==null还是!==“”
            isOfficialCertActive: record.officialCertId !== "",
            isBadgeActive: record.badgeId !== "", //这里进行了修改，改为了不为空就为true。目前不知道不为空是需要改为!==null还是!==“”
            isReportActive: !!record.userReportIsGen,
            certId: record.certId,
            certCover: record.certCover,
            badgeId: record.badgeId,
            productionIconShow: record.activity.productionIconShow,
            productionCommentUnread: record.productionCommentUnread,
            officialCertId: record.officialCertId,
            productId: record.productId,
          }));

          this[
            certType === CertTypeEnum.OFFICIAL
              ? "officialList"
              : "notOfficialList"
          ] = cards;
        }
      });
  }
}
</script>

<style scoped lang="scss">
.cert-box {
  padding: 0rpx 42rpx 32rpx;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow-y: auto;
  background: #f7fafc;
  .title-box {
    background: #142c4c;
    position: relative;
    margin-top: 50rpx;
    height: 2rpx;
    margin-bottom: 50rpx;
    width: 100%;
    text {
      display: inline-block;
      position: absolute;
      height: 50rpx;
      line-height: 50rpx;
      background: #142c4c;
      padding: 0 40rpx;
      border-radius: 10rpx;
      left: 50%;
      transform: translateX(-50%);
      top: -25rpx;
      font-size: 32rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
    }
  }
  .cert-card-list {
    display: flex;
    // padding: 16rpx auto 32rpx;
    flex-wrap: wrap;
    .cert-item {
      width: 50%;
      display: flex;
      height: 300rpx;
      padding: 0 20rpx;
      box-sizing: border-box;
      flex-direction: column;
      align-items: center;
      image {
        flex: 1;
        max-width: 100%;
      }
      .text-box {
        width: 100%;

        .cert-text {
          text-align: center;
          font-size: 24rpx;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #1e1e1e;
          line-height: 34rpx;
          margin: 8rpx 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 100%;
        }
      }
    }
  }
}
</style>

