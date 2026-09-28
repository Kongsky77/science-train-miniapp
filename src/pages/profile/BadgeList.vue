<template>
  <!-- 徽章 -->
  <view class="badge-box">
    <view class="badge-list" v-if="badgesList.length">
      <view
        class="badge-item"
        v-for="item of badgesList"
        :key="item.id"
        @click="clickBadge(item)"
      >
        <image
          class="badge-image"
          mode="aspectFit"
          :src="item.image"
        ></image>
        <view class="text-box">
          <view class="badge-text">{{ item.name }}</view>
          <view class="badge-text">{{ item.date }}</view>
        </view>
      </view>
    </view>
    <van-empty v-else description="尚未获取" />

    <FetchBadge
        v-if="isShowBadgeShare"
        :activityId="activeBadge.activityId"
        :activityName="activeBadge.name"
        :currentUserName="childName"
        :award-position="activeBadge.awardPosition"
        :list="[activeBadge]"
        @ViewBadgeByMessage="viewBadgeByMessage"
        @closeFetchBadge="closeFetchBadge"
      />

  </view>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import BadgeListItem from "@/beans/badge/BadgeListItem";
import BadgeService from "@/service/BadgeService";
import dayjs from "dayjs";
import FetchBadge from '@/components/common/FetchBadge.vue';

@Component({
  name: "BadgeList",
  components: {FetchBadge},
})
export default class BadgeList extends Vue {
  badgeService = new BadgeService();
  badgesList: BadgeListItem[] = [];
  activeBadge: BadgeListItem = {
    id :'',
    activityId : '',
    name : '',
    awardedTime : 0,
    date :'',
    image: '',
    awardPosition: 0,
  };
  isShowBadgeShare: boolean = false;
  childName = '';
  childId = '';

  clickBadge(item: BadgeListItem) {
    if (item.date.indexOf("尚未获取") === -1) {
      this.activeBadge = item;
      this.isShowBadgeShare = true;
    }
  }
  closeFetchBadge(){
    this.isShowBadgeShare = false;
  }

  viewBadgeByMessage() {
    this.closeFetchBadge();
  }

  onLoad(options) {
    const { childId, childName } = options;
    this.childName = childName;
    this.childId = childId;
    this.getBadgeList(childId);
  }

  getBadgeList(childId: string) {
    this.badgeService.getBadgeList(childId).then((res) => {
      if (res.success && res.data) {
        const data = res.data;

        const badges = data
          .filter((badge) => !!badge.awarded)
          .map((badge) => ({
            id: badge.id,
            activityId: badge.activityId,
            name: badge.title,
            date: dayjs(Number(badge.awardedTime)).format("YYYY.MM"),
            awardedTime: badge.awardedTime,
            image: badge.imgLit,
            awardPosition: badge.awardPosition,
          }));
        this.badgesList = badges;
      }
    });
  }
}
</script>
<style scoped lang="scss">
.badge-box {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow-y: auto;
  background: #f5f8fc;

  .badge-list {
    display: flex;
    flex-wrap: wrap;
  }

  .badge-item {
    width: 33.33%;
    height: 300rpx;
    margin-bottom: 32rpx;
    padding: 20rpx;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .badge-image {
    flex: 1;
    width: 100%;
    /* height: 180rpx; */
  }

  .text-box {
    width: 100%;
    height: 100rpx;
    margin-top: 10rpx;
    display: flex;
    flex-direction: column;
  }

  .badge-text {
    font-size: 24rpx;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #1e1e1e;
    line-height: 34rpx;
    width: 100%;
    text-align: center;
    margin: 8rpx 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>

