<template>
  <div class="badge-message" :style="{ height: windowHeight + 'rpx' }">
    <div class="badge-rule-describe">
      <div class="badge-rule-describe-title">成就排名规则</div>
      <div class="badge-rule-describe-content">
        <span>【徽章】</span>是用户完成活动后所得到的凭证之一，<span
          >【成就排行】</span
        >
        是根据活动徽章获得的个数及等级来判定。成就排行由高到底共分为：省级排名、市级排名、区/县级排名、校级排名四个等级。
      </div>
      <div class="badge-rule-describe-content">举例说明：</div>
      <div class="badge-rule-describe-content">
        假如是市级排名，那么将不会出现在区/县级排行里面；也不会出现在校级排名。
        系统会在规定的时间进行排行榜刷新。
      </div>
      <div class="badge-rule-describe-note">* 最终解释权归本平台所有</div>
    </div>
    <div class="badge-rank">
      <div class="badge-rank-background">
        <div class="background-one"></div>
        <div class="background-two"></div>
      </div>
      <div class="current-ranking">
        <div
          class="current-ranking-title"
          v-if="badgeRankTitleInfo == defaultBadgeRankTitleInfo"
        >
          暂无数据
        </div>
        <div class="current-ranking-title" v-else>当前排名</div>
        <img class="current-ranking-icon" :src="currentIcon" alt="" />
      </div>
      <scroll-view
        class="badge-rank-list"
        :scroll-y="true"
        :style="{ height: windowHeight - 150 - 20 + 'rpx' }"
      >
        <div
          class="rank-item"
          v-for="iconItem of iconList"
          :key="iconItem.title"
        >
          <img class="badge-image" :src="iconItem.iconUrl" alt="" />
          <!-- <div class="badge-image"></div> -->
          <div class="badge-ranking">{{ iconItem.title }}</div>
        </div>
      </scroll-view>
    </div>
  </div>
</template>

<script lang='ts'>
import { Vue, Component } from "vue-property-decorator";
import BadgeIconAndTitleMap from "@/definition/badge/BadgeIconAndTitleMap";

@Component({
  components: {}
})
export default class shareBadge extends Vue {
  url: string = "";
  windowHeight: number = 0;
  iconList = [];
  currentIcon: string = "";
  badgeRankTitleInfo = "";
  defaultBadgeRankTitleInfo = "暂无数据";

  onLoad(options) {
    this.currentIcon = options.imageSrc;
    this.badgeRankTitleInfo = options.title;
    this.getWindowHeight();
    BadgeIconAndTitleMap.forEach((iconUrl, title) => {
      let obj = { title, iconUrl };
      obj.title = title;
      obj.iconUrl = iconUrl;
      this.iconList.push(obj);
    });
    console.log("this.iconList", this.iconList);
  }

  getWindowHeight() {
    const _this = this;
    uni.getSystemInfo({
      success: function(res) {
        _this.windowHeight = res.windowHeight * (750 / res.windowWidth);
      }
    });
  }

  onShow() {}

  beforeDestroy() {}
}
</script>

<style scoped >
.badge-message {
  word-spacing: 2rpx;
  display: flex;
  background: url("https://contentdevsa-blob.ai121.net/testcontainer/static/activity/img/ma_rank_cat.svg")
    no-repeat left bottom;
}
.badge-rule-describe {
  flex: 1;
}
.badge-rank {
  position: relative;
  flex: 1;
  /* background: url("https://contentdevsa-blob.ai121.net/testcontainer/static/activity/img/ma_rank_intro_bg.svg")
    no-repeat 0 25rpx; */
}
.badge-rank-background {
  position: absolute;
  margin-top: 25rpx;
  margin-left: 30rpx;
  height: calc(100% - 25rpx);
  border-radius: 4rpx 4rpx 0 4rpx;
  width: calc(100% - 30rpx);
  background-color: rgba(98, 112, 193, 1);
}
.background-one {
  position: absolute;
  width: 100%;
  height: calc(100% - 10rpx);
  left: -15rpx;
  top: 10rpx;
  border-radius: 4rpx;
  background-color: rgba(98, 112, 193, 0.6);
}
.background-two {
  position: absolute;
  width: 100%;
  height: calc(100% - 20rpx);
  left: -30rpx;
  top: 20rpx;
  border-radius: 4rpx;
  background-color: rgba(98, 112, 193, 0.4);
}
.badge-rule-describe-title {
  padding-left: 25rpx;
  margin-top: 20rpx;
  margin-bottom: 40rpx;
  font-size: 40rpx;
  font-weight: 800;
  color: rgb(247, 195, 73);
}
.badge-rule-describe-content {
  padding-left: 25rpx;
  padding-right: 25rpx;
  font-size: 30rpx;
  line-height: 45rpx;
}
.badge-rule-describe span {
  font-weight: 700;
  color: rgb(247, 195, 73);
}
.badge-rule-describe-note {
  font-size: 25rpx;
  padding-left: 25rpx;
  margin-top: 10rpx;
}
.current-ranking {
  margin-left: 15%;
  margin-right: 5%;
  position: relative;
  margin-top: 20rpx;
  height: 140rpx;
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.3);
}
.current-ranking-title {
  position: absolute;
  line-height: 140rpx;
  width: 50%;
  /* left: 10%; */
  font-size: 36rpx;
  color: white;
  font-weight: 900;
}
.current-ranking-icon {
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
  width: 30%;
  height: 100%;
  right: 5%;
}
.badge-rank-list {
  position: relative;

  /* background-color: blue; */
}
/* .badge-rank-list::after {
  position: absolute;
  bottom: 0rpx;
  content: "";
  width: 100%;
  height: 100%;
  background-color: white;
  z-index: 100;

  background: linear-gradient(
    to top,
    rgba(255, 255, 255, 0.6) 0%,
    rgba(255, 255, 255, 0.2) 75%,
    rgba(255, 255, 255, 0) 98%
  );
} */
.rank-item {
  margin-top: 30rpx;
  height: 100rpx;
  position: relative;
  color: white;
  font-weight: 900;
  font-size: 31rpx;
}
.badge-image {
  position: absolute;
  width: 24%;
  height: 100rpx;
  margin-left: 15%;
}
.badge-ranking {
  position: absolute;
  line-height: 100rpx;
  width: 50%;
  right: 0%;
  height: 100rpx;
}
</style>
