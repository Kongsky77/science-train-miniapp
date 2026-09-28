<template>
  <view
    class="page"
    :style="{
      background: makeBackground(backgroundImage)
    }"
  >
    <view class="title">{{ title }}</view>
    <view class="btn-box">
      <view class="btn" @click="goFillInfo">参加活动</view>
    </view>
  </view>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ActivityService from "@/service/ActivityService";

@Component({
  name: "Enter",
  components: {}
})
export default class Enter extends Vue {
  activityService = new ActivityService();
  childId = "";
  activityId = "";
  isEntry = "";
  title = "";
  backgroundImage = "";

  onLoad(options: any) {
    this.childId = options.childId;
    this.activityId = options.activityId;
    this.isEntry = options.isEntry;

    this.getBasicInfo(this.activityId);
  }

  goFillInfo() {
    const childId = this.childId;
    const activityId = this.activityId;
    if (this.isEntry === "false") {
      uni.redirectTo({
        url: `/pages/fillInfo/ActivityEntryExt?childId=${childId}&activityId=${activityId}`
      });
    } else {
      uni.redirectTo({
        url: `/pages/team/index?childId=${childId}&activityId=${activityId}`
      });
    }
  }

  getBasicInfo(activityId: string) {
    this.activityService.getDetail(activityId).then(res => {
      if (res.success && res.data) {
        const data = res.data;
        this.backgroundImage = data.imgCover;
        this.title = data.name;
        console.log("活动基础信息");
      }
    });
  }

  makeBackground(url: string) {
    return `url("${url}") no-repeat center center/cover;`;
  }
}
</script>
<style scoped>
.page {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 40rpx;
  box-sizing: border-box;
  /* background: url("@/static/picture/enter.png") no-repeat center bottom/cover; */
}

.title {
  color: #6d564d;
  font-size: 32rpx;
}

.btn {
  background: #7563f0;
  color: #fff;
  border-radius: 10rpx;
  font-size: 32rpx;
  text-align: center;
  padding: 20rpx 40rpx;

  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
}

.btn-box {
  display: flex;
  justify-content: center;
  padding: 40rpx;
}
</style>