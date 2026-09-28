<template>
  <view class="work-box">
    <!-- <div class="search-box">
      <input
        placeholder-style="color: rgba(78, 131, 230, 0.5)"
        placeholder="请输入活动名称"
      />
      <image :src="imgUrl + '/search-icon.png'" mode="widthFix" role="img" />
    </div> -->
    <view class="work-card-list" v-if="cards.length > 0">
      <view
        class="work-item"
        v-for="item of cards"
        :key="item.id"
        @click="onWorkClick(item.id, item.productId)"
      >
        <image class="work-image" mode="widthFix" :src="item.url"></image>
        <view class="work-text">{{ item.title }}</view>
        <view class="work-text">{{ item.year }}.{{ item.month }}</view>
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

  hasSubmitProduction: number = 0;
}

@Component({
  name: "Works",
})
export default class Works extends Vue {
  childrenId = "";
  activityService = new ActivityService();
  cards: EventCard[] = [];
  listRequest = new MyWorksRequest();

  onLoad(option: OptionScene) {
    this.childrenId = option.childId;
    this.listRequest = {
      ...this.listRequest,
      hasSubmitProduction: 1,
    };
    this.getChildActivityList();
  }

  get imgUrl() {
    return `${process.env.VUE_APP_BLOB_IMAGE_URL_NEW}/competition-list`;
  }

  // 获取列表
  getChildActivityList() {
    this.activityService
      .getChildActivityList(this.childrenId, this.listRequest)
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
            badgeId: record.badgeId,
            productionIconShow: record.activity.productionIconShow,
            productionCommentUnread: record.productionCommentUnread,
            officialCertId: record.officialCertId,
            productId: record.productId,
            certCover: record.certCover,
          }));

          this.cards = cards;
        }
      });
  }

  // 点击作品
  onWorkClick(activityId: string, productId: string ) {
    uni.navigateTo({
      url: `/pages/my-works/MyWorks?activityId=${activityId}&childrenId=${this.childrenId}&productId=${productId}`,
    });
  }
}
</script>

<style scoped lang="scss">
.work-box {
  padding: 32rpx 42rpx ;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow-y: auto;
  background: #f7fafc;
  .search-box {
    width: 95%;
    margin: 0 auto 16rpx;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 68rpx;
    line-height: 68rpx;
    background: #ffffff;
    border-radius: 16rpx;
    border: 2rpx solid #4e83e6;

    input {
      flex: 1;
      margin: 0 20rpx;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(78, 131, 230, 1);
      line-height: 52rpx;
    }

    image {
      width: 40rpx;
      margin-right: 20rpx;
    }
  }
  .work-card-list {
    display: flex;
    flex-wrap: wrap;
    .work-item {
      width: 50%;
      display: flex;
      height: 300rpx;
      margin-bottom: 32rpx;
      padding: 0 20rpx;
      box-sizing: border-box;
      flex-direction: column;
      align-items: center;
      image {
        flex: 1;
        max-width: 100%;
        margin-bottom: 8rpx;
      }
      .work-text {
        text-align: center;
        font-size: 24rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #1e1e1e;
        line-height: 34rpx;
        height: 34rpx;
        // margin: 8rpx 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 100%;
        padding: 0 10rpx;
        box-sizing: border-box;
      }
    }
  }
}
</style>

