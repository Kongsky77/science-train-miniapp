<template>
  <main class="page">
    <activity-filter v-if="columnId==='2'" :is-open-scroll="true" :paddingTop="0" :columnId="columnId" @on-tag-click="onTagClick"
                     @on-age-tag-click="onAgeTagClick" :isShowAge="false"
                     :initActiveTagIds="tagId"/>
    <activity-filter v-if="columnId==='9'" :is-open-scroll="true" :paddingTop="0" :columnId="columnId" @on-tag-click="onTagClick"
                     @on-age-tag-click="onAgeTagClick" :isShowAge="false"
                     :initActiveTagIds="tagId"/>
    <activity-card v-if="activitiesVO.length > 0" :activities-list="activitiesVO" @on-activity-item-click="onActivityItemClick"/>
    <van-empty
        v-else
        class="custom-image"
        :image="staticFileEnum.NO_CONTENT_NOTICE_IMG"
        :description="langEnum.NO_CONTENT_NOTICE"
    />
  </main>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ActivityService from '@/service/ActivityService'
import FilterActivityDTO from '@/beans/activity/req/FilterActivityDTO'
import ActivityFullItem from '@/beans/activity/ActivityFullItem'
import { Utils } from '@/common/utils/Utils'
import ActivityFilter from '@/components/common/ActivityFilter.vue'
import AvatarRow from '@/components/common/AvatarRow.vue'
import StaticFileEnum from '@/definition/lang/StaticFileEnum'
import LangEnum from '@/definition/lang/LangEnum'
import VisitActivityColumnDTO from '@/definition/common/event/VisitActivityColumnDTO'
import WeAnalysisEventManagement from '@/management/wx/WeAnalysisEventManagement'
import EventNameEnum from '@/definition/common/EventNameEnum'
import ActivityCard from '@/components/common/ActivityCard.vue'
import ShowNoticeManagement from '@/management/common/ShowNoticeManagement'
import ActivityFullList from '@/beans/activity/res/ActivityFullList'

@Component({
  name: 'ActivityCategoryPage',
  components: {ActivityFilter,AvatarRow,ActivityCard}
})

export default class ActivityCategoryPage extends Vue {
  columnId: string = ''
  activitiesVO: ActivityFullItem[] = []
  keyWords: string = ''
  tagId: string = ''
  startAge: number = -1
  endAge: number = -1
  page: number = 1
  maxPageNo: number = 0
  staticFileEnum = StaticFileEnum
  langEnum = LangEnum
  title = ''

  onLoad (option) {
    this.columnId = option.id
    this.keyWords = option.keyWords
    if (option.tagIds) {
      this.tagId = option.tagIds
    }
    if (option.title !== '搜索结果') {
       WeAnalysisEventManagement.reportEvent(EventNameEnum.VISIT_ACTIVITY_COLUMN,new VisitActivityColumnDTO(option.title))
    }
    this.setNavBarTitle(option.title)
    this.title = option.title
  }

  onPullDownRefresh () {
    this.page = 1
    this.fetchActivityList()
    setTimeout(() => {
      uni.stopPullDownRefresh()
    },1000)
  }

  onAgeTagClick (startAge: number,endAge: number) {
    this.page = 1
    this.startAge = startAge
    this.endAge = endAge
    this.fetchActivityList()
  }

  setNavBarTitle (title: string) {
    let t = title

    uni.setNavigationBarTitle({
      title: t,
      success: this.fetchActivityList
    })
  }

  onReachBottom() {
    console.log('onReachBottom')
    if (this.page < this.maxPageNo) {
      this.page++
      this.fetchActivityList()
    } else {
      ShowNoticeManagement.ShowErrorNotice(LangEnum.NO_MORE_DATA)
    }
  }

  onTagClick (id: string): void {
    this.page = 1
    this.tagId = id
    this.fetchActivityList()
  }

  onActivityItemClick (id: string) {
    uni.navigateTo({
      url: `/pages/activityDetail/index?id=${ id }`
    })
  }

  fetchActivityList () {
    let activityService = new ActivityService()

    let activityFilterDTO = new FilterActivityDTO()
    if (this.columnId !== undefined) {
      activityFilterDTO.columnId = this.columnId
    }
    if (this.keyWords !== undefined) {
      activityFilterDTO.activityName = this.keyWords
    }
    activityFilterDTO.tagIds = this.tagId
    activityFilterDTO.ageStart = this.startAge
    activityFilterDTO.ageEnd = this.endAge
    activityFilterDTO.pageNo = this.page
    activityFilterDTO.pageSize = 10
    activityService.receiveActivityList(activityFilterDTO,this.fetchActivityListCallback,true)
    //TODO 对接接口
  }

  fetchActivityListCallback (success: boolean,activityList: ActivityFullList) {
    if (success) {
      this.maxPageNo = activityList.pages
      if (activityList.pageNo === 1) {
        this.activitiesVO = activityList.records
      } else {
        for (let i = 0; i < activityList.records.length; i++) {
          this.activitiesVO.push(activityList.records[i])
        }
      }

      for (let i = 0; i < this.activitiesVO.length; i++) {
        const item = this.activitiesVO[i]
        this.getMembers(item.id)
      }
    }
  }

  getMembers (id: string) {
    const activityService = new ActivityService()
    activityService.getMembers(id).then(res => {
      if (res.success && res.data) {
        const data = res.data
        const totalMembers = data.total // 最多显示 999 个人数
        const avatars = data.records.map(item => item.avatar).slice(0,3)
        this.activitiesVO.map(item => {
          if (item.id === id) {
            item.avatar = avatars
            item.totalMember = totalMembers
          }
        })
      }
    })
  }

  private static isActivityEnd (endTime: number) {
    let isActivityEnd = false
    const nowTime = new Date().getTime()
    if (nowTime > endTime) {
      isActivityEnd = true
    }
    return isActivityEnd
  }

  //分享功能
  onShareAppMessage(res) {
    let path = `pages/activity-category/ActivityCategoryPage?title=${this.title}&id=${this.columnId}&tagIds=${this.tagId}`;
    let title = this.title;

    return {
      title: title,
      path: path
    };
  }

  onShareTimeline() {
    let path = `pages/activity-category/ActivityCategoryPage?title=${this.title}&id=${this.columnId}&tagIds=${this.tagId}`;
    let title = this.title;

    return {
      title: title,
      path: path
    };
  }  
}

</script>

<style lang="scss" scoped>
.page {
  background: #fff;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-x: hidden;

  .activity-list {
    margin: 40rpx;

    .activity-list-item {
      display: flex;
      padding-bottom: 40rpx;

      .activity-image {
        width: 250rpx;
        height: 250rpx;
        border-radius: 25rpx;
        flex-shrink: 0;
      }

      .activity-text {
        width: 80%;
        display: flex;
        flex-direction: column;
        margin-left: 20rpx;
        line-height: 55rpx;

        .activity-name {
          font-size: 36rpx;
          width: 70%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;

        }

        .activity-slogan {
          font-size: 28rpx;
          width: 70%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          color: #939393;
        }

        .activity-time {
          font-size: 24rpx;
          color: #939393;
          white-space: nowrap;
        }

        .activity-member {
          display: flex;
          font-size: 24rpx;
          flex-direction: row;
          align-items: center;
        }
      }
    }
  }
}
</style>
