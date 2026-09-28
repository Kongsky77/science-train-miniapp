<template>
  <view class="page">
    <view class="badge-box">
      <view class="close-box">
        <van-icon custom-style="color: black" name="close" size="24px" @click="closeBadgeBox" />
      </view>
      <view class="badge-image-box">
        <view class="image-box">
          <image :src="badgeImage" class="badge-img" mode="widthFix"></image>
        </view>
        <view class="badge-title"> 恭喜你! </view>
        <view class="badge-text">
          你点亮了【 {{ activityName }} 】活动徽章
        </view>
        <button v-if="isShareBadgeBtnShow" class="share-btn" @click="goShareBadge">去分享</button>
        <view class="badge-line-up-time-text">
          徽章点亮时间：{{ badgeLightUpTime }}
        </view>
        <!-- <view class="badge-text"> 快去看看吧! </view> -->
      </view>

      <view v-if="!comeFromBadge">
        <view v-if="changeNav" class="view-my-badge" @click="onViewBadge">
          查看我的徽章
        </view>

        <view
          v-if="!changeNav"
          class="view-my-badge"
          @click="onViewBadgeByMessage"
        >
          查看我的徽章
        </view>
      </view>

      <view
        v-if="comeFromBadge"
        class="view-my-badge"
        @click="toActivityPage()"
      >
        查看活动详情
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import BadgeListItem from "@/beans/badge/BadgeListItem";
import BadgeItemResponse from "@/beans/badge/res/BadgeItemResponse";
import { Component, Vue, Prop } from "vue-property-decorator";
import { Utils } from '@/common/utils/Utils'

@Component({
  name: "FetchBadge",
  components: {}
})
export default class FetchBadge extends Vue {
  @Prop({ default: "" }) activityId: string
  @Prop() activityName
  @Prop({default: 0}) awardPosition: number
  @Prop() list!: BadgeListItem[]
  @Prop() changeNav = true
  @Prop() comeFromBadge
  @Prop() currentUserName

  badgeImage = this.list[0].image

  badgeLightUpTime: string = ''

  isShareBadgeBtnShow: boolean = false

  awardedTime: number = 0

  get badgeRankList (): BadgeListItem[] {
    let nowList = this.list
    return nowList.sort(Utils.sortByTimestamp('awardedTime',true))
  }

  mounted() {
    this.fetchBadgeDetail(this.activityId)
  }

  //   获取对应活动徽章
  fetchBadgeDetail(activityId: string) {
    let badgeId = ''
    for (let i = 0; i < this.list.length; i++) {
      let item = this.list[i]
      if (item.activityId === activityId) {
        badgeId = item.id
        this.badgeImage = item.image
        this.badgeLightUpTime = item.date
        break
      }
    }
    this.badgeRankList.forEach((item, index) => {
      if (item.id === badgeId) {
        this.isShareBadgeBtnShow = true
      }
    })
  }

  //  关闭弹窗
  closeBadgeBox() {
    this.$emit("closeFetchBadge", false);
  }

  goShareBadge () {
    const webUrl = encodeURIComponent(`${process.env.VUE_APP_CARMELA_APP_URL}/badge-share?iconUrl=${this.badgeImage}&shareBadgeTitle=${this.activityName}&currentUserName=${this.currentUserName}&topLastTime=${this.badgeLightUpTime}&badgeCount=${this.awardPosition}`)
    uni.navigateTo({
      url: `/pages/shareBadge/index?url=${webUrl}`
    })
  }

  // 查看我的徽章
  onViewBadge() {
    this.$emit("ViewBadge");
    this.$emit("closeFetchBadge", false);
  }

  onViewBadgeByMessage() {
    this.$emit("ViewBadgeByMessage");
    this.$emit("closeFetchBadge", false);
  }

  toActivityPage() {
    const id = this.activityId;
    uni.navigateTo({
      url: `/pages/activityDetail/index?id=${id}`
    });
  }
}
</script>

<style lang="scss" scoped>
.page {
  align-items: center;
  background: rgba(175, 175, 175, 0.3);
  display: flex;
  height: 100%;
  justify-content: center;
  left: 0;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 100;
}
.badge-box {
  background: #fff;
  border-radius: 20rpx;
  width: 80%;
  /* box-shadow: 6rpx 6rpx 5rpx ; */
}
.close-box {
  padding: 40rpx 40rpx 10rpx;
  text-align: right;
}

.image-box {
  align-items: center;
  display: flex;
  justify-content: center;
}

.badge-img {
  width: 400rpx;
}

.badge-title {
  color: #9a9a9a;
  font-size: 36rpx;
  padding: 20rpx;
  text-align: center;
}
.badge-text {
  color: #9a9a9a;
  font-size: 28rpx;
  line-height: 48rpx;
  padding: 10rpx 20rpx;
  text-align: center;
}

.share-btn {
  background: $ai121-theme-color;
  border-radius: 50rpx;
  color: #FFFFFF;
  display:block;
  font-size: 35rpx;
  letter-spacing: 10rpx;
  margin: 30rpx auto 0;
  padding-left: 50rpx;
  font-weight: bolder;
  text-align: center;
  width: 50%;
}

.view-my-badge {
  background: $ai121-theme-color;
  border-radius: 0 0 20rpx 20rpx;
  color: #fff;
  font-size: 32rpx;
  margin-top: 20rpx;
  padding: 20rpx;
  text-align: center;
}


.badge-line-up-time-text {
  font-size: 24rpx;
  opacity: 0.6;
  margin-top: 40rpx;
  text-align: center;
}
</style>
