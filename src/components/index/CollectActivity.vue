<template>
  <main class="collect-activity-container">
    <activity-filter :is-open-scroll="false"
                     :paddingTop="20"
                     :is-show-tag="false"
                     color="#f7f7f7"
                     @on-tag-click="onTagClick"
                     @on-age-tag-click="onAgeTagClick"/>
    <activity-card :activities-list="activitiesVO" @on-activity-item-click="onActivityItemClick"/>
  </main>
</template>

<script lang="ts">
import { Component,Vue } from 'vue-property-decorator'
import ActivityFullItem from '@/beans/activity/ActivityFullItem'
import ActivityService from '@/service/ActivityService'
import FilterActivityDTO from '@/beans/activity/req/FilterActivityDTO'
import { EntryWayEnum, isFollowedEnum } from '@/enums/activity/ActivityFullItemEnum'
import LikeService from '@/service/LikeService'
import { LikeType } from '@/enums/notice/NoticeItemEnum'
import CollectNeedEnum from '@/definition/collect/CollectNeedEnum'
import LoginManagement from '@/management/login/LoginManagement'
import StaticFileEnum from '@/definition/lang/StaticFileEnum'
import LangEnum from '@/definition/lang/LangEnum'
import ShowNoticeManagement from '@/management/common/ShowNoticeManagement'
import ActivityCard from '@/components/common/ActivityCard.vue'
import ActivityFilter from '@/components/common/ActivityFilter.vue'
import ActivityFullList from '@/beans/activity/res/ActivityFullList'
import { Utils } from '@/common/utils/Utils'

@Component({
  name: 'CollectActivity',
  components: {
    ActivityCard,
    ActivityFilter
  }
})

export default class CollectActivity extends Vue {
  activitiesVO: ActivityFullItem[] = []
  page: number = 1
  maxPageNo: number = 0
  startAge: number = -1
  endAge: number = -1
  tagId: string = ''
  isFollowedEnum = isFollowedEnum
  collectNeedEnum = CollectNeedEnum
  staticFileEnum = StaticFileEnum
  langEnum = LangEnum

  mounted () {
    this.fetchActivityList()
    uni.$on(LangEnum.INDEX_REACH_BOTTOM_EVENT_NAME,() => {
      this.onReachIndexBottom()
    })
  }

  onReachIndexBottom () {
    if (this.page < this.maxPageNo) {
      this.page++
      this.fetchActivityList()
    } else {
      ShowNoticeManagement.ShowErrorNotice(LangEnum.NO_MORE_DATA)
    }
  }

  moveToDetailActivity (id: string) {
    uni.navigateTo({
      url: `/pages/activityDetail/index?id=${id}`
    })
  }

  moveToLogin () {
    uni.navigateTo({
      url: '/pages/login/index'
    })
  }

  get isLogin () : boolean {
    const loginManagement = new LoginManagement()
    return loginManagement.isLogin()
  }

  onClickCard (need: CollectNeedEnum, id: string) {
    this.moveToDetailActivity(id)
  }

  onTagClick (id: string): void {
    this.page = 1
    this.tagId = id
    this.fetchActivityList()
  }

  async fetchActivityList (): Promise<void> {
    let activityService = new ActivityService()

    let activityFilterDTO = new FilterActivityDTO()
    activityFilterDTO.pageNo = this.page
    activityFilterDTO.ageEnd = this.endAge
    activityFilterDTO.ageStart = this.startAge
    activityFilterDTO.tagIds = this.tagId
    activityFilterDTO.free = 1
    activityFilterDTO.pageSize = 10
    await activityService.receiveActivityList(activityFilterDTO, this.fetchActivityListCallback,true)
    //TODO 对接接口
  }


  fetchActivityListCallback (success: boolean, activityList: ActivityFullList) {
    if (success) {
      this.maxPageNo = activityList.pages
      const noPaymentActivityList = activityList.records
      if (activityList.pageNo === 1) {
        this.activitiesVO = noPaymentActivityList
      } else {
        for (let i = 0; i < noPaymentActivityList.length; i++) {
          this.activitiesVO.push(noPaymentActivityList[i])
        }
      }
      for (let i = 0; i < this.activitiesVO.length; i++) {
        const item = this.activitiesVO[i]
        this.getMembers(item.id)
      }
    }
  }

  getMembers(id: string) {
    const activityService = new ActivityService()
    activityService.getMembers(id).then(res => {
      if (res.success && res.data) {
        const data = res.data
        const totalMembers = data.total // 最多显示 999 个人数
        const avatars = data.records.map(item => item.avatar).slice(0, 3)
        this.activitiesVO.map(item => {
          if (item.id === id) {
            item.avatar = avatars
            item.totalMember = totalMembers
          }
        })
      }
    })
  }

  onAgeTagClick(startAge: number, endAge: number) {
    this.page = 1
    this.startAge = startAge
    this.endAge = endAge
    this.fetchActivityList()
  }

  onActivityItemClick (id: string) {
    uni.navigateTo({
      url: `/pages/activityDetail/index?id=${ id }`
    })
  }
}

</script>

<style lang="scss" scoped>
.collect-activity-container {
  width: 100%;
}
</style>
