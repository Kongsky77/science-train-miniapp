<style lang="scss" scoped>
@import './RankInfo.scss';
</style>
<template>
  <view class="rank-info">
    <view class="rank-info-title">个人排名</view>
    <view class="rank-info-row">
      <view class="rank-info-item">
        <view class="team-box">
          <view class="team-item">
            <image
              class="team-avatar"
              mode="aspectFill"
              :src="
                rankInfo.avatar || 'https://contentdevsa-blob.ai121.net/testcontainer/activity/image/531017a0-5226-4d74-8064-b10ee504cab7.svg'
              "
            ></image>
          </view>
          <view class="team-item">
            <!-- <view class="team-name">{{ rankInfo.teamName }}</view> -->
            <!-- <view class="team-school">{{ rankInfo.schoolName }}</view> -->
            <view class="challenge-btn-box" v-if="rankInfo.showBth">
              <view class="challenge-btn">
                <wx-open-launch-weapp
                  id="challenge-btn"
                  username="gh_b32233dbf5e5"
                  :path="`pages/index/index?id=${rankInfo.projectId}`"
                >
                  <script type="text/wxtag-template">
                    <view style="font-size:14px; color: #fff">打榜</view>
                  </script>
                </wx-open-launch-weapp>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="rank-info-item">
        <view class="team-row">
          <view class="team-name">{{
            rankInfo.teamName || '暂无战队数据'
          }}</view>
          <view class="team-rank" @click.stop="toggleTipMask"
            >{{ rankInfo.rank || '' }}
            <span class="no-data" v-if="!rankInfo.rank">暂无数据</span>
            <span class="tip">?</span>
          </view>
        </view>
        <view class="team-row">
          <view class="team-school">{{ rankInfo.schoolName }}</view>
          <view class="team-rank-text">{{ rankTypeText }}得分排名</view>
        </view>
        <view class="tip-row">
          <view class="team-rank-text">{{ getTipTexk }}</view>
          <view class="team-rank-text">{{ cycleEndTime }}</view>
        </view>
      </view>
    </view>
    <view class="tip-mask" v-if="showTipMask" @click.stop="toggleTipMask">
      <view
        class="tip-box"
        :style="{
          right: `${maskPostion.right}px`,
          top: `${maskPostion.top}px`,
        }"
      >
        每次您提交的模型，系统都会进行打分，系统将自动选取最高评分的模型进行打榜排名。<span
          class="tip-highlight"
          >活动期间您可以多次提交模型，刷新您的模型比分哦~</span
        >
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import RankTypeEnum from '@/definition/rank/RankTypeEnum'

@Component({
  name: 'RankInfo',
})
export default class RankInfo extends Vue {
  @Prop() rankInfo?: any
  showTipMask = false
  maskPostion = {
    right: 0,
    top: 0,
  }

  get rankTypeText() {
    return this.rankInfo.type === RankTypeEnum.MODEL ? '模型' : '热度'
  }

  get getTipTexk() {
    const dateString = '2021-4-19 10:00:00'.replace(/-/g, '/')
    const notStart = new Date(dateString).getTime() > Date.now()
    // if (notStart) {
    //   return '第一轮放榜时间4月19日上午10点'
    // } else {
    return '每间隔4小时更新一次榜单'
    // }
  }

  get cycleEndTime() {
    return '活动已结束'
    const timeMap = {
      '1619193600000': '4月23日',
      '1619712000000': '4月29日',
      '1620316800000': '5月6日',
      '1620921600000': '5月13日',
    }
    const titleMap = {
      '1619193600000': '厨余垃圾',
      '1619712000000': '可回收物',
      '1620316800000': '有害垃圾',
      '1620921600000': '其他垃圾',
    }

    let endTime = this.pluckValueByTime(timeMap)
    const endTitle = this.pluckValueByTime(titleMap)

    return `“${endTitle}”分类活动排名截止时间：${endTime}24点整`
  }

  pluckValueByTime(map) {
    let endTime = Object.keys(map).reduce((endTime, key) => {
      if (endTime) {
        return endTime
      }
      const now = Date.now()
      if (now < Number(key)) {
        return map[key]
      }
    }, '')

    return endTime
  }

  toggleTipMask() {
    const tip = document.querySelector('.tip').getBoundingClientRect()
    this.maskPostion = {
      top: tip.top - 5,
      right: window.innerWidth - tip.right + tip.width,
    }

    this.showTipMask = !this.showTipMask

    if (this.showTipMask) {
      document.documentElement.style.overflowY = 'hidden'
    } else {
      document.documentElement.style.overflowY = 'auto'
    }
  }

  mounted() {
    document.documentElement.style.overflowY = 'auto'
  }

  beforeDestroy() {
    document.documentElement.style.overflowY = 'auto'
  }
}
</script>
