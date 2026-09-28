<template>
  <div>

    <main class="recommend-activity-container">
      <!-- 轮播图模块 -->
      <activity-swiper :height="600" :channel="swiperChannelEnum.RECOMMEND_ACTIVITY"/>
      <div class="content-box" v-if="!isRead">
        <TitleBar class="title-bar" title="最新通知" />
        <!-- <div class="notice-box" v-for="card of noticeCards" :key="card.id">
          <NoticeCard :card="card" @click="onClickNoticeCard" />
        </div> -->
        <div v-if="!isLogin" class="notice-box">
          <NoticeCard
              :isLogin="isLogin"
              :noticeCardsLength="noticeCards.length"
              @click="onNoticeMessage"
          />
        </div>
        <div v-if="isLogin && noticeCards.length < 1" class="notice-box" >
          <NoticeCard
              :isLogin="isLogin"
              :noticeActivitySrc="noticeActivitySrc"
              :noticeCardsLength="noticeCards.length"
              @click="onNoticeAtivity"
          />
        </div>
        <div v-if="isLogin && noticeCards.length" class="notice-box">
          <div v-for="card of noticeCards" :key="card.id">
            <NoticeCard
                :card="card"
                :isLogin="isLogin"
                :noticeCardsLength="noticeCards.length"
                @click="onClickNoticeCard"
            />
          </div>
          <!-- <NoticeCard :isLogin="isLogin" :card="noticeCards[0]" @click="onClickNoticeCard"/> -->
        </div>

        <view v-if="isBadgeBox" class="fetch-badge-box">
          <FetchBadge
              :activityId="isBadgeActivityId"
              :activityName="isBadgeActivityName"
              :currentUserName="realName"
              :list="badges"
              @ViewBadgeByMessage="ViewBadgeByMessage"
              @closeFetchBadge="closeFetchBadge"
          />
        </view>
      </div>

      <activity-card v-if="activityList.length > 0" :activities-list="activityList" @on-activity-item-click="onActivityItemClick"/>
      <van-empty
          v-else
          class="custom-image"
          :image="staticFileEnum.NO_TAG_CONTENT_NOTICE_IMG"
          :description="langEnum.NO_CONTENT_NOTICE"
      />

    </main>
  </div>
</template>

<script lang="ts">
import { Component,Prop,Vue } from 'vue-property-decorator'
import TitleBar from '@/components/common/TitleBar.vue'
import NoticeCard from '@/components/common/NoticeCard.vue'
import ActivityService from '@/service/ActivityService'
import NoticeService from '@/service/NoticeService'
import { mapMessageCard } from '@/utils/Notice'
import NoticeCardItem from '@/beans/notice/NoticeCardItem'
import ActivityJoinedCard from '@/beans/activity/ActivityJoinedCard'
import { TargetType } from '@/enums/notice/NoticeItemEnum'
import LoginManagement from '@/management/login/LoginManagement'
import BadgeService from '@/service/BadgeService'
import BadgeListItem from '@/beans/badge/BadgeListItem'
import dayjs from 'dayjs'
import FetchBadge from '@/components/common/FetchBadge.vue'
import TabEnum from '@/enums/common/TabEnum'
import ChildrenService from '@/service/ChildrenService'
import ActivitySearch from '@/components/common/ActivitySearch.vue'
import ActivitySwiper from '@/components/common/ActivitySwiper.vue'
import BookmarkEnum from '@/definition/common/BookmarkEnum'
import ColumnEnum from '@/definition/common/ColumnEnum'
import ColumnItemVO from '@/beans/activity/res/ColumnItemVO'
import ColumnIdEnum from '@/definition/common/ColumnIdEnum'
import SwiperChannelEnum from '@/enums/activity/SwiperChannelEnum'
import NoticeCardManagement from '@/management/notice-card/NoticeCardManagement'
import PopupVO from '@/beans/activity/res/PopupVO'
import PositionEnum from '@/definition/common/PositionEnum'
import FilterActivityDTO from '@/beans/activity/req/FilterActivityDTO'
import ActivityFullList from '@/beans/activity/res/ActivityFullList'
import { Utils } from '@/common/utils/Utils'
import ActivityFullItem from '@/beans/activity/ActivityFullItem'
import LangEnum from '@/definition/lang/LangEnum'
import StaticFileEnum from '@/definition/lang/StaticFileEnum'
import ShowNoticeManagement from '@/management/common/ShowNoticeManagement'
import ActivityCard from '@/components/common/ActivityCard.vue'

@Component({
  name: 'RecommendActivity',
  components: {
    ActivityCard,
    ActivitySwiper,
    ActivitySearch,
    TitleBar,
    NoticeCard,
    FetchBadge
  }
})

export default class RecommendActivity extends Vue {
  swiperChannelEnum = SwiperChannelEnum
  columnIdEnum = ColumnIdEnum
  activityService: ActivityService = new ActivityService()
  noticeService: NoticeService = new NoticeService()
  badgeService = new BadgeService()
  newCards: ActivityJoinedCard[] = []
  noticeCards: NoticeCardItem[] = []
  isLogin: boolean = false
  noticeActivitySrc = ''
  isRead: boolean = false
  bookmark = BookmarkEnum.RECOMMEND_ACTIVITIES
  normalColumn = ColumnEnum.THINKING_TRAINING
  moreTitle: string = '更多'
  page: number = 1
  maxPageNo: number = 0
  isAdvertiseShow: boolean = false
  advertiseImg: string = ''
  advertiseActivityId: string = ''
  isBadgeBox = false //这是为了控制是否打开弹窗
  isBadgeActivityId = ''
  isBadgeActivityName = ''
  activityList: ActivityFullItem[] = []
  badges: BadgeListItem[] = []
  currentId = ''
  realName = ''
  langEnum = LangEnum
  staticFileEnum = StaticFileEnum

  mounted () {
    this.fetchAdvertiseInfo()
    const isLogin = new LoginManagement().isLogin()
    // const indexSwiper = new IndexManagement().indexSwiper();
    // const newSwiper = new IndexManagement().newSwiper();
    // console.log(
    //   "这里是为了测试获取的data是否可以通过！的方式得到",
    //   !!indexSwiper,
    //   !!newSwiper
    // );

    this.isLogin = isLogin
    if( isLogin ) {
      this.getNoticeList()
    }
    // if (!!indexSwiper == false || !!newSwiper == false) {
    // } else {
    //   this.newCards = indexSwiper;
    //   this.activityCards = newSwiper;
    // }

    uni.$on('indexPullRefresh',() => {
      if( isLogin ) {
        this.getNoticeList()
      }
    })

    uni.$on(LangEnum.INDEX_REACH_BOTTOM_EVENT_NAME, () => {
      this.onReachRecommendActivityBottom()
    })

    this.fetchAllActivity()

    // this.clearStorage();
  }

  onReachRecommendActivityBottom () {
    if (this.page < this.maxPageNo) {
      this.page++
      this.fetchAllActivity()
    } else {
      ShowNoticeManagement.ShowErrorNotice(LangEnum.NO_MORE_DATA)
    }
  }

  onActivityItemClick(id: string) {
    uni.navigateTo({
      url: `/pages/activityDetail/index?id=${ id }`
    })
  }

  fetchAllActivity() {
    const activityService = new ActivityService()
    const filterActivityDTO = new FilterActivityDTO()
    filterActivityDTO.isLoadEntryUserCount = 1
    filterActivityDTO.pageNo = this.page
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

  fetchAdvertiseInfo () {
    const activityService = new ActivityService()
    activityService.receiveAdInfo(PositionEnum.INDEX_RECOMMEND,this.receiveAdvertiseInfoCallback)
  }

  receiveAdvertiseInfoCallback (popupVO: PopupVO[], success: boolean) {
    if (!success) {
      this.isAdvertiseShow = false
    }else {
      if (popupVO.length === 0) {
        this.isAdvertiseShow = false
      }else {
        this.isAdvertiseShow = true
        const item = popupVO[0]
        this.advertiseActivityId = item.targetVal
        this.advertiseImg = item.mainImage
      }
     /* this.currentPopupActivityId = popupVO.targetVal
      this.currentPopupActivityImg = popupVO.image
      this.closeImage = popupVO.closeImage*/
    }
  }



  onClickNotice () {
    if (this.noticeCards.length !== 0) {
      NoticeCardManagement.getInstance().saveReadHistory(this.noticeCards[0])
    }
  }

  //30分钟后清除缓存
  // clearStorage() {
  //   setTimeout(() => {
  //     const remove = new IndexTabManagement();
  //     remove.clearStorage();
  //   }, 300000);
  //   // const remove = new IndexTabManagement();
  //   // remove.clearStorage();
  // }

  onMoreBtnClick (name: string,id: string) {
    uni.navigateTo({
      url: `/pages/activity-category/ActivityCategoryPage?title=${name}&id=${id}`
    })
  }

  // 获取通知信息
  getNoticeList () {
    this.noticeService.getNoticeList().then(res => {
      if( res.success && res.data ) {
        const list = res.data
        // console.log("通知数据");
        // console.log("这里测试返回的消息列表有哪些", res.data);

        const noticeCards = mapMessageCard(list.records).slice(0,1)
        this.doNotice(noticeCards[0])
        const localNoticeCards = NoticeCardManagement.getInstance().getReadHistory()
        if (localNoticeCards) {
          if (noticeCards[0].id !== localNoticeCards.id) {
            this.isRead = false
          }else {
            this.isRead = true
          }
        }else {
          this.isRead = false
        }
        this.noticeCards = noticeCards
      }
    })
  }

  doNotice (list: NoticeCardItem) {
    // 这里list变成underfine的
    if (list !== undefined) {
      this.activityService.getDetail(list.targetActivityId).then(res => {
        if( res.success && res.data ) {
          if( list.targetType === TargetType.BADGE ) {
            list.text =
                '您的孩子在《' + res.data.name + '》活动中获得了一枚新徽章！'
          } else if( list.targetType === TargetType.CERT ) {
            list.text =
                '您的孩子在《' + res.data.name + '》活动中获得了一份证书！'
          }
        }
      })
    }
  }

  onClickSwiperCard (card: ActivityJoinedCard) {
    const id = card.id
    uni.navigateTo({
      url: `/pages/activityDetail/index?id=${ id }`
    })
    // const index = new ActivityTabManagement();
    // index.clearStorage();
  }

  onClickActivityCard (card: ActivityJoinedCard) {
    const id = card.id
    uni.navigateTo({
      url: `/pages/activityDetail/index?id=${ id }`
    })
    // const index = new ActivityTabManagement();
    // index.clearStorage();
  }

  onClickNoticeCard (card: NoticeCardItem) {
    this.onClickNotice()
    const targetUserId = card.targetUserId
    const targetType = card.targetType
    const id = card.target

    if( targetType === TargetType.ACTIVITY ) {
      uni.navigateTo({
        url: `/pages/activityDetail/index?id=${ id }`
      })
    }

    if( targetType === TargetType.CERT ) {
      uni.navigateTo({
        url: `/pages/cert/index?id=${ id }`
      })
    }

    if( targetType === TargetType.BADGE ) {
      // this.getBadge(id);
      this.getBadge(id)
    }

    if (targetType === TargetType.SUB_USER_MESSAGE) {
      uni.navigateTo({
        url: `/pages/messageDetail/MessageDetail?id=${targetUserId}`
      })
    }
  }

  closeFetchBadge (isBadge: boolean) {
    this.isBadgeBox = isBadge
  }

  ViewBadgeByMessage () {
    uni.navigateTo({
      url: "/pages/profile/BadgeList?childId=" + encodeURIComponent(this.currentId) +
        "&childName=" + encodeURIComponent(this.realName)
    })
    this.currentId = ''
  }

  getBadge (badgeId: string) {
    this.badgeService.getBadge(badgeId).then(res => {
      if( res.success && res.data ) {
        const data = res.data
        this.isBadgeBox = true
        this.isBadgeActivityId = data.activityId
        this.currentId = data.userId
        this.getChildrenInfo(data.userId)
        this.isBadgeActivityName = data.title
        const badge = {
          id: data.id,
          activityId: data.activityId,
          name: data.title,
          date: dayjs(Number(data.awardedTime)).format('YYYY-MM-DD'),
          awardedTime: data.awardedTime,
          image: data.imgLit,
          awardPosition: data.awardPosition
        }
        this.badges.push(badge)
      }
    })
  }

  getChildrenInfo (childrenId: string) {
    let childrenService = new ChildrenService()
    childrenService.getChildInfo(childrenId).then(res => {
      this.realName = res.data.realName
    })

  }

  onNoticeMessage () {
    this.onClickNotice()
    const path = '/pages/tab/index'
    if( !this.isLogin ) {
      uni.navigateTo({
        // url: `/pages/login/index?pathKey=${path}`,
        url:
            '/pages/login/index?pathKey=' +
            encodeURIComponent(JSON.stringify(path)) +
            '&active=0'
      })
    }
  }

  onNoticeAtivity (id: string) {
    this.onClickNotice()
    uni.navigateTo({
      url: `/pages/activityDetail/index?id=${ id }`
    })
  }
}

</script>

<style lang="scss" scoped>
.recommend-activity-container {
  margin-top: 20rpx;
  overflow-x: hidden;
}

.content-box {
  margin-top: 50rpx;
}
</style>
