<template>
  <div class="swiper-box" :style="{height: height + 'rpx' }">
    <swiper
        :autoplay="true"
        :duration="500"
        :indicator-dots="true"
        :interval="3000"
        circular
        :style="{ height: height + 'rpx' }"
        class="swiper"
        indicator-active-color="#ffffff"
    >
      <swiper-item v-for="(swiperItem, index) of swiperVO" :key="index" class="swiper-item-box">
      <activity-swiper-item :height="height" :swiperItem="swiperItem" @on-click-swiper-card="onClickSwiperCard"/>
      </swiper-item>
    </swiper>
  </div>
</template>

<script lang="ts">
import { Vue,Component,Prop } from 'vue-property-decorator'
import ActivitySwiperItem from '@/components/common/ActivitySwiperItem.vue'
import SwiperVO from '@/beans/activity/res/SwiperVO'
import ActivityJoinedCard from '@/beans/activity/ActivityJoinedCard'
import ActivityService from '@/service/ActivityService'
import { mapActivityListCard,mapSwiperActivityList } from '@/utils/Activity'
import HorizontalCardType from '@/beans/common/HorizontalCardType'
import SwiperChannelEnum from '@/enums/activity/SwiperChannelEnum'
@Component({
  name: 'ActivitySwiper',
  components: {
   ActivitySwiperItem
  }
})

export default class ActivitySwiper extends Vue {
  @Prop()
  height: number
  @Prop()
  channel: SwiperChannelEnum
  swiperVO: SwiperVO[] = []

  mounted () {
    this.receiveSwiperList()
  }

  receiveSwiperList () {
    switch (this.channel) {
      case SwiperChannelEnum.ALL_ACTIVITY:
        this.fetchAllActivitySwiperList()
        break
      case SwiperChannelEnum.RECOMMEND_ACTIVITY:
        this.fetchRecommendActivitySwiperList()
        break
      default:
        break
    }
  }

  async fetchRecommendActivitySwiperList () {
    const activityService = new ActivityService()
    const {success: success,data: data} = await activityService.receiveRecommendActivitySwiper()
    if(success) this.swiperVO = data
  }

  async fetchAllActivitySwiperList () {
    const activityService = new ActivityService()
    const {success: success,data: data} = await activityService.receiveAllActivitySwiper()
    if (success) this.swiperVO  = data
  }

  onClickSwiperCard (card: SwiperVO) {
    const id = card.src
    uni.navigateTo({
      url: `/pages/activityDetail/index?id=${id}`
    })
  }

}

</script>

<style lang="scss" scoped>
.swiper-item-box {
  box-sizing: border-box;
}
</style>
