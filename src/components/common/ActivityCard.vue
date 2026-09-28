<template>
  <main class="activity-list" v-if="activitiesList.length > 0">
    <main
      class="container"
      v-for="activityItem in activitiesList"
      :key="activityItem.id"
      @click="onActivityItemClick(activityItem.id)"
    >
      <div
        class="img"
        :style="{
          background: `url(${activityItem.imgCover}) no-repeat 100% 100%`,
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
        }"
      />
      <div class="content">
        <h1 class="name">{{ activityItem.name }}</h1>
        <pre class="slogan" v-if="activityItem.slogan">{{
          activityItem.slogan
        }}</pre>
        <div class="last-row">
          <span class="time"
            >{{ getFormatTime(activityItem.startTime) }}-{{
              getFormatTime(activityItem.endTime)
            }}</span
          >
          <h2 class="member" style="margin-left: 20rpx">
            <avatar-row
              :width="60"
              :height="60"
              :avatars="activityItem.avatar"
              style="margin-right: 10rpx"
            />
            <view class="total-member">
              <image
                class="hot-icon"
                v-if="
                  getCurrentUserNumber(
                    activityItem.totalMember,
                    activityItem.endTime
                  ) === '火热报名中'
                "
                src="../../static/icon/hot.svg"
              />
              {{
                getCurrentUserNumber(
                  activityItem.totalMember,
                  activityItem.endTime
                )
              }}
            </view>
          </h2>
        </div>
      </div>
    </main>
  </main>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import ActivityService from "@/service/ActivityService";
import FilterActivityDTO from "@/beans/activity/req/FilterActivityDTO";
import ActivityFullItem from "@/beans/activity/ActivityFullItem";
import { Utils } from "@/common/utils/Utils";
import AvatarRow from "@/components/common/AvatarRow.vue";
import dayjs from "dayjs";

@Component({
  name: "ActivityCard",
  components: {
    AvatarRow,
  },
})
export default class ActivityCard extends Vue {
  @Prop()
  activitiesList: ActivityFullItem[];

  getCurrentUserNumber(total: number, endTime: number) {
    let text;
    if (total > 9999) {
      text = this.getUserNumber(total) + "w人参加";
    } else if (total > 999) {
      text = this.getUserNumber(total) + "k人参加";
    } else if (total >= 100 && total <= 999) {
      text = total + "人参加";
    } else if (this.isActivityEnd(endTime)) {
      text = "活动已结束";
    } else {
      text = "火热报名中";
    }
    return text;
  }

  getUserNumber(members: number) {
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

  isActivityEnd(endTime: number): boolean {
    let isActivityEnd = false;
    const nowTime = new Date().getTime();
    if (nowTime > endTime) {
      isActivityEnd = true;
    }
    return isActivityEnd;
  }
  getFormatTime(time) {
    return dayjs(time).format("YYYY.MM.DD");
  }

  onActivityItemClick(id: string) {
    this.emitOnActivityItemClick(id);
  }

  @Emit("on-activity-item-click")
  emitOnActivityItemClick(id: string) {
    return id;
  }
}
</script>

<style lang="scss">
.activity-know-tag {
  margin-right: 10rpx;
  padding: 0 5rpx 0 5rpx !important;
}
</style>

<style lang="scss" scoped>
.container {
  width: 95%;
  border-radius: 40rpx;
  margin: 0 auto 40rpx;
  box-shadow: 0px 3px 20px rgba(0, 0, 0, 0.16);

  .img {
    width: 100%;
    border-radius: 40rpx 40rpx 0 0;
    height: 400rpx;
    background: #f7f7f7;
  }

  .content {
    width: 95%;
    margin: 0 auto;
    padding-bottom: 16rpx;
    .name {
      width: 100%;
      font-size: 40rpx;
      font-weight: 600;
      line-height: 56rpx;
      font-size: 40rpx;
      font-family: PingFang SC-Bold, PingFang SC;
      color: #000000;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-top: 8rpx;
    }
    .slogan {
      width: 100%;
      // margin-left: 20rpx;
      font-size: 28rpx;
      opacity: 0.7;
      overflow: hidden;
      white-space: pre-wrap;
      text-overflow: ellipsis;
      margin-top: 8rpx;
      line-height: 40rpx;
      word-break: break-all;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2; /* 这里是超出几行省略 */
    }
    .last-row {
      justify-content: space-between;
      display: flex;
      align-items: center;
      margin-top: 8rpx;

      .time {
        font-size: 18rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(39, 39, 39, 0.5);
      }

      .member {
        margin-left: 10rpx;
        display: flex;
        align-items: center;
        justify-content: flex-end;

        .total-member {
          display: flex;
          align-items: center;
          font-size: 22rpx;
        }
      }
    }
  }
}

.hot-icon {
  width: 30rpx;
  height: 30rpx;
  margin-right: 5rpx;
}
</style>

