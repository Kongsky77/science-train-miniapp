<style lang="scss" scoped>
@import "ActivityCategoryList.scss";
</style>
<template>
  <view>
      <div v-if="activitiesVO.length > 0">
        <TitleBar
            class="title-bar"
            :title="titleName"
            :slogan="slogan"
            :right-title="columnId === columnIdEnum.POPULAR ? '': moreTitle"
            @click="onMoreBtnClick(titleName, moreBtnId)"
            v-if="item.id !== columnIdEnum.POPULAR && activitiesVO.length !== 0"
        />
        <main class="popular-card" :style="{borderBottom: isAdvertiseShow ? '': '1rpx solid #F3F2F2'}" v-if="columnId === columnIdEnum.POPULAR && currentShowCount === activityShowCount.NORMAL && bookmark !== bookmarkEnum.ALL_ACTIVITIES">
          <div class="popular-card-container" v-for="(activityFullItem, index) of activitiesVO" :key="index" @click="onActivityCardClick(activityFullItem.id)">
            <view  class="activity-img">
              <image mode=“widthFix” :src="activityFullItem.imgCover"/>
            </view>
            <view class="activity-text">
              <view class="activity-title">
                <view>{{activityFullItem.name}}</view>
                <view class="activity-column">{{activityFullItem.operateMode === swiperModeEnum.ONLINE ? '线上活动' : '线下活动'}}</view>
              </view>
              <view>{{activityFullItem.slogan}}</view>
            </view>
          </div>
          <view class="advertise-model" v-if="isAdvertiseShow">
            <image :src="advertiseImg" @click="moveToAdvertiseActivity"></image>
          </view>
        </main>
        <main class="official-cooperation-card" v-else-if="currentShowCount === activityShowCount.OFFICIAL_COOPERATION">
          <view class="activity-item" v-for="card of activitiesVO" :key="card.id" @click="onActivityCardClick(card.id)"
                :style="{
                backgroundImage: 'url(' + card.imgCover + ')',
                backgroundRepeat: 'no-repeat',
                backgroundSize:' 100% 100%'
                }">
            <view class="activity-item-text-box">
              <view class="activity-item-text">
                <p class="activity-item-text-title">{{card.name}}</p>
                <p class="activity-item-text-title-content">{{card.slogan}}</p>
              </view>
            </view>

          </view>
        </main>
        <main class="normal-card" :style="{borderBottom: border ? 'none': '1rpx solid #F3F2F2'}" v-else-if="columnId !== columnIdEnum.POPULAR && currentShowCount === activityShowCount.NORMAL">
          <div class="normal-card-item" v-for="(activityFullItem, index) of activitiesVO" :key="index" @click="onActivityCardClick(activityFullItem.id)">
            <image class="activity-img" :src="activityFullItem.imgCover"/>
            <view class="activity-text">{{activityFullItem.name}}</view>
          </div>
        </main>
        <main class="normal-card" :style="{borderBottom: border ? 'none': '1rpx solid #F3F2F2'}" v-else-if="columnId !== columnIdEnum.POPULAR && currentShowCount === activityShowCount.MAX">
          <div class="normal-card-item" v-for="(activityFullItem, index) of activitiesVO" :key="index" @click="onActivityCardClick(activityFullItem.id)">
            <image class="activity-img" :src="activityFullItem.imgCover"/>
            <view class="activity-text">{{activityFullItem.name}}</view>
          </div>
        </main>
      </div>
  </view>
</template>

<script lang="ts">
import { Component,Prop,Vue,Watch } from 'vue-property-decorator'
import ActivityFullItem from '@/beans/activity/ActivityFullItem'
import ColumnEnum from '@/definition/common/ColumnEnum'
import FilterActivityDTO from '@/beans/activity/req/FilterActivityDTO'
import BookmarkEnum from '@/definition/common/BookmarkEnum'
import ActivityShowCount from '@/definition/common/ActivityShowCount'
import ActivityService from '@/service/ActivityService'
import ColumnIdEnum from '@/definition/common/ColumnIdEnum'
import StaticFileEnum from '@/definition/lang/StaticFileEnum'
import LangEnum from '@/definition/lang/LangEnum'
import SwiperModeEnum from '@/definition/common/SwiperModeEnum'
import TitleBar from '@/components/common/TitleBar.vue'

@Component({
  name: 'ActivityCategoryList',
  components: {
    TitleBar
  }
})

export default class ActivityCategoryList extends Vue {
  @Prop()
  bookmark: BookmarkEnum
  @Prop()
  columnId: ColumnIdEnum
  @Prop({
    default: -1
  })
  startAge: number
  @Prop({
    default: false
  })
  isAdvertiseShow: boolean
  @Prop({
    default: ''
  })
  titleName: string
  @Prop({
    default: ''
  })
  slogan: string
  @Prop({
    default: ''
  })
  moreTitle: string
  @Prop({
    default: ''
  })
  advertiseImg: string
  @Prop({
    default: ''
  })
  advertiseActivityId: string
  @Prop({
    default: -1
  })
  endAge: number
  @Prop({
    default: ''
  })
  tagId: string
  @Prop({
    default: true
  })
  border: boolean
  @Prop({
    default: ''
  })
  moreBtnId: string
  activitiesVO: ActivityFullItem[] = []
  activityShowCount = ActivityShowCount
  columnEnum = ColumnEnum
  bookmarkEnum = BookmarkEnum
  columnIdEnum = ColumnIdEnum
  staticImageEnum = StaticFileEnum
  langEnum = LangEnum
  swiperModeEnum = SwiperModeEnum

  @Watch('tagId')
  onTagClick(tagId: string) {
      this.fetchActivityList()
  }

  @Watch('startAge')
  onStartAgeChange(startAge: number) {
    this.fetchActivityList()
  }

  mounted () {
    this.fetchActivityList()
  }

  moveToAdvertiseActivity () {
    uni.navigateTo({
      url: `/pages/activityDetail/index?id=${this.advertiseActivityId}`
    })
  }

  onMoreBtnClick (name: string, id: string): void {
    uni.navigateTo({
      url: `/pages/activity-category/ActivityCategoryPage?title=${name}&id=${id}`
    })
  }

  get hasActivity (): boolean{
    return this.activitiesVO.length === 0
  }

  async fetchActivityList (): Promise<void> {
      let activityService = new ActivityService()

      let activityFilterDTO = new FilterActivityDTO()
      activityFilterDTO.columnId = this.columnId
      activityFilterDTO.tagIds = this.tagId

        activityFilterDTO.ageStart = this.startAge
        activityFilterDTO.ageEnd = this.endAge
      activityFilterDTO.pageSize = this.currentShowCount

      await activityService.receiveActivityList(activityFilterDTO, this.fetchActivityListCallback)
      //TODO 对接接口
  }

  fetchActivityListCallback (success: boolean, activityList: Array<ActivityFullItem>) {
    if (success) this.activitiesVO = activityList
    if (this.activitiesVO.length === 0) {
      this.$emit('on-list-empty', this.columnId)
    }
  }

  onActivityCardClick (id: string): void {
    this.goToActivityCategoryPage(id)
  }

  goToActivityCategoryPage (id: string): void {
    //TODO 跳转活动列表+栏目页面
    uni.navigateTo({
      url: `/pages/activityDetail/index?id=${id}`
    })
  }

  get currentShowCount (): ActivityShowCount {
    if (this.columnId === ColumnIdEnum.OFFICIAL_COOPERATION &&
        (this.bookmark === BookmarkEnum.ALL_ACTIVITIES || this.bookmark === BookmarkEnum.RECOMMEND_ACTIVITIES)
    ) {
      return ActivityShowCount.OFFICIAL_COOPERATION
    }
    if (this.bookmark === BookmarkEnum.ALL_ACTIVITIES) {
        return ActivityShowCount.MAX
    }else if (this.bookmark === BookmarkEnum.RECOMMEND_ACTIVITIES) {
        return ActivityShowCount.NORMAL
    }else {
      return ActivityShowCount.NONE
    }
  }
}

</script>
