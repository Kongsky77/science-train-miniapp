<template>
  <main>
    <div style="overflow-x: hidden">
      <view class="swiper-box">
        <view class="item" v-for="item in swiperVO" :key="item.src" @click="onActivityItemClick(item.src)">
          <view class="img" :style="{

              width: `100%`,
              height: `300rpx`,
              background: `url(${item.img}) no-repeat 100% 100%`,
              backgroundPosition: 'center center',
              backgroundSize: 'cover'
              }"></view>
          <view class="title"><view class="text">{{ item.title }}</view></view>
        </view>
      </view>
      <column-icon :border="true"/>
      <!-- <activity-filter
          v-if="!isTfgf"
          :is-open-scroll="false"
          :paddingTop="20"
          @on-tag-click="onTagClick"
          @on-age-tag-click="onAgeTagClick"/> -->
      <activity-card v-if="activityList.length > 0" :activities-list="activityList" @on-activity-item-click="onActivityItemClick"/>
      <van-empty
          v-else
          class="custom-image"
          :image="staticFileEnum.NO_TAG_CONTENT_NOTICE_IMG"
          :description="langEnum.NO_TAG_CONTENT_NOTICE"
      />
    </div>
  </main>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import ActivitySwiper from '@/components/common/ActivitySwiper.vue'
import ColumnIcon from '@/components/common/ColumnIcon.vue'
import ActivityFilter from '@/components/common/ActivityFilter.vue'
import ColumnItemVO from '@/beans/activity/res/ColumnItemVO'
import TitleBar from '@/components/common/TitleBar.vue'
import SwiperChannelEnum from '@/enums/activity/SwiperChannelEnum'
import ColumnIdEnum from '@/definition/common/ColumnIdEnum'
import StaticFileEnum from '@/definition/lang/StaticFileEnum'
import LangEnum from '@/definition/lang/LangEnum'
import ActivityCard from '@/components/common/ActivityCard.vue'
import ActivityService from '@/service/ActivityService'
import FilterActivityDTO from '@/beans/activity/req/FilterActivityDTO'
import ActivityFullItem from '@/beans/activity/ActivityFullItem'
import { Utils } from '@/common/utils/Utils'
import ShowNoticeManagement from '@/management/common/ShowNoticeManagement'
import ActivityFullList from '@/beans/activity/res/ActivityFullList'
import SwiperVO from '@/beans/activity/res/SwiperVO'
import ThemeTypeEnum from '@/enums/theme/ThemeTypeEnum'

@Component({
  name: 'AllActivity',
  components: {
    ColumnIcon,
    ActivitySwiper,
    ActivityCard,
    ActivityFilter,
    TitleBar
  }
})

export default class AllActivity extends Vue {
  @Prop({
    default: []
  })
  columnList: Array<ColumnItemVO>

  columnIdEnum = ColumnIdEnum

  moreTitle = '更多'

  swiperChannelEnum = SwiperChannelEnum

  startAge: number = -1

  endAge: number = -1

  tagId: string = ''

  swiperVO: SwiperVO[] = []

  activityList: ActivityFullItem[] = []

  isEmpty: boolean = false

  staticFileEnum = StaticFileEnum

  langEnum = LangEnum

  page = 1

  maxPageNo = 1


  mounted() {
    this.fetchAllActivity()
    this.fetchAllActivitySwiperList()
    uni.$on(LangEnum.INDEX_REACH_BOTTOM_EVENT_NAME, () => {
      this.onReachAllActivityBottom()
    })
  }

  onReachAllActivityBottom() {
    if (this.page < this.maxPageNo) {
      this.page++
      this.fetchAllActivity()
    } else {
      ShowNoticeManagement.ShowErrorNotice(LangEnum.NO_MORE_DATA)
    }
  }

  get isTfgf () {
    let isTfgf: boolean
    if (process.env.VUE_APP_THEME_TYPE === ThemeTypeEnum.GF) {
      isTfgf = true
    }else {
      isTfgf = false
    }
    return isTfgf
  }


  fetchAllActivity() {
    const activityService = new ActivityService()
    const filterActivityDTO = new FilterActivityDTO()
    filterActivityDTO.isLoadEntryUserCount = 1
    filterActivityDTO.pageNo = this.page
    filterActivityDTO.ageStart = this.startAge
    filterActivityDTO.ageEnd = this.endAge
    filterActivityDTO.tagIds = this.tagId
    activityService.receiveActivityList(filterActivityDTO, this.fetchAllActivityCallback, true)
  }

  fetchAllActivityCallback(success: boolean, activityList: ActivityFullList) {
    if (success) {
      this.maxPageNo = activityList.pages
      if (activityList.pageNo === 1) {
        this.activityList = activityList.records
      } else {
        for (let i = 0; i < activityList.records.length; i++) {
          this.activityList.push(activityList.records[i])
        }
      }
      for (let i = 0; i < this.activityList.length; i++) {
        const item = this.activityList[i]
        this.getMembers(item.id)
      }
    }
  }

  onActivityItemClick(id: string) {
    uni.navigateTo({
      url: `/pages/activityDetail/index?id=${ id }`
    })
  }

  async fetchAllActivitySwiperList() {
    const activityService = new ActivityService()
    const { success: success, data: data } = await activityService.receiveAllActivitySwiper()
    if (success) this.swiperVO = data
  }

  getMembers(id: string) {
    const activityService = new ActivityService()
    activityService.getMembers(id).then(res => {
      if (res.success && res.data) {
        const data = res.data
        const totalMembers = data.total // 最多显示 999 个人数
        const avatars = data.records.map(item => item.avatar).slice(0, 3)
        this.activityList.map(item => {
          if (item.id === id) {
            item.avatar = avatars
            item.totalMember = totalMembers
          }
        })
      }
    })
  }

  onTagClick(id: string): void {
    this.page = 1
    this.tagId = id
    this.fetchAllActivity()
  }

  onAgeTagClick(startAge: number, endAge: number) {
    this.page = 1
    this.startAge = startAge
    this.endAge = endAge
    this.fetchAllActivity()
  }
}

</script>

<style lang="scss" scoped>
.content-box {
  margin-top: 50rpx;
}

.swiper-box {
  width: 90%;
  margin: 0 auto;
  display: flex;
  overflow-y: auto;
  border-radius: 10rpx;
  padding-bottom: 10rpx;

  .item {
    flex-shrink: 0;
    width: 38%;
    margin-right: 20rpx;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    border-radius: 10rpx;
    box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.16);
    .img {
      flex-shrink: 0;
      width: 300rpx;
      border-radius: 10rpx 10rpx 0 0;

    }

    .title {
      flex-shrink: 0;
      text-align: center;
      width: 100%;
      background: #FFFFFF;
      font-size: 20rpx;
      border-radius: 0rpx 0rpx 10rpx 10rpx;
      padding-bottom: 10rpx;
      .text {
        width: 95%;
        font-weight: 600;
        margin: 2rpx auto 0;
        text-align: center;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}

.swiper-box::-webkit-scrollbar {
  display: none;
}
</style>
