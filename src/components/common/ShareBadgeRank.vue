<template>
  <view class="page" @click="savePoster">
    <view class="badge-box">
      <view class="close-box" @click="closeBadgeBox">
        <image mode="widthFix"  src="https://contentdevsa-blob.ai121.net/testcontainer/activity/image/ef2f64c7-773a-472e-a7af-c379ccba3f00.svg" style="width: 30rpx;height: 30rpx"></image>
      </view>
      <view class="badge-image-box">
        <view class="image-box">
          <image :src="iconUrl" class="badge-img" mode="widthFix"></image>
        </view>
        <view class="badge-title"> {{ shareBadgeTitle }} </view>
        <view class="badge-text">
          根据[{{ currentUserShowName }}]所获得的活动徽章数量及等级， <br/>
          目前[{{ currentUserShowName }}]的活动成就排名为: {{ shareBadgeTitle }} 。<br/>
          {{ lang.BADGE_RANK_RULE }}
        </view>
        <view>
          <button class="share-btn" @click="goShareBadgeRank">去分享</button>
          <span class="on-list-container">第{{ topCount }}次获得该名誉</span>
          <span class="last-on-list-time">最近一次获得该名誉时间：{{ currentTopLastTime }}</span>
        </view>
      </view>

    </view>
  </view>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import LangEnum from '@/definition/lang/LangEnum'
import { Utils } from '@/common/utils/Utils'

@Component({
  name : 'ShareBadgeRank',
  components : {}
})
export default class ShareBadgeRank extends Vue {
  @Prop()
  shareBadgeTitle: string

  @Prop()
  iconUrl: string

  @Prop()
  topCount: number

  @Prop()
  topLastTime: number

  @Prop()
  currentUserName: string

  lang = LangEnum

  get currentTopLastTime () {
    return Utils.localTimeYMD(this.topLastTime)
  }

  get currentUserShowName (): string {
    // if (this.currentUserName.length > 3) {
    //   return this.currentUserName.slice(0,2) + '同学'
    // }else {
    //   return this.currentUserName.slice(0,1) + '同学'
    // }
    return this.currentUserName
  }

  mounted () {
  }

  //  关闭弹窗
  closeBadgeBox () {
    this.$emit('closeShareBadge', false)
  }

  goShareBadgeRank () {
    const iconPath = Utils.svgToPng(this.iconUrl)
    const webUrl = encodeURIComponent(`${process.env.VUE_APP_CARMELA_APP_URL}/badge-rank-share?iconUrl=${iconPath}&shareBadgeTitle=${this.shareBadgeTitle}&topCount=${this.topCount}&topLastTime=${this.topLastTime}&currentUserName=${this.currentUserName}`)
    uni.navigateTo({
      url: `/pages/shareBadgeRank/index?url=${webUrl}`
    })

  }

  savePoster () {

  }
}
</script>

<style scoped>
.page {
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
  left: 0;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 999;
}

.badge-box {
  background: #303234;
  border-radius: 20rpx;
  width: 95%;
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
  color: #FFDC6C;
  font-size: 60rpx;
  font-weight: bolder;
  padding: 20rpx;
  text-align: center;
}
.badge-text {
  color: #FFDC6C;
  font-size: 28rpx;
  line-height: 40rpx;
  opacity: 0.6;
  padding: 10rpx 20rpx;
  text-align: center;
}

.share-btn {
  background: #FFDC6C;
  border-radius: 50rpx;
  color: #0f1117;
  display:block;
  font-size: 35rpx;
  letter-spacing: 10rpx;
  margin: 60rpx auto 0;
  padding-left: 50rpx;
  text-align: center;
  width: 50%;
}

.on-list-container {
  background: #3F3B26;
  border: 1px solid #685E3D;
  border-radius: 50rpx;
  color: #FEE17E;
  display: block;
  font-size: 30rpx;
  margin: 50rpx auto 0;
  opacity: 0.8;
  padding: 5rpx;
  text-align: center;
  width: 50%;
}

.last-on-list-time {
  color: #FEE17E;
  display: block;
  font-size: 30rpx;
  margin: 20rpx 40rpx 40rpx 40rpx;
  opacity: 0.6;
  text-align: center;
}
</style>
