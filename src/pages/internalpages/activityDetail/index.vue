<template>
  <view class="page" >
    <van-skeleton :loading="loading" avatar row="10" title>
      <view
          :style="{
          background: makeBackground(backgroundImage)
        }"
          class="banner-box"
      >
        <view class="banner-inner-box">
          <view class="tool-bar">
            <view
                v-if="rankEnable === RankEnableEnum.YES"
                class="tool-item"
                @click="goRankPage"
            >
              <image
                  class="tool-icon"
                  mode="widthFix"
                  src="@/static/icon/rank-icon.png"
              ></image>
            </view>
            <view class="tool-item">
              <image
                  v-show="isLiked === isFollowedEnum.NO"
                  class="tool-icon"
                  mode="widthFix"
                  src="@/static/icon/love-icon.png"
                  @click="likeActivity"
              ></image>
              <image
                  v-show="isLiked === isFollowedEnum.YES"
                  class="tool-icon"
                  mode="widthFix"
                  src="https://contentdevsa-blob.ai121.net/testcontainer/activity/image/d8ebf70d-dc3e-4fab-a6c8-a6ca571db1ef.png"
                  @click="unlikeActivity"
              ></image>
            </view>
            <!-- <view class="tool-item">
            <image
              class="tool-icon"
              mode="widthFix"
              src="@/static/icon/share-icon.png"
            ></image>
          </view> -->
          </view>
          <view v-if="userSelectItems.length" class="user-box">
            <UserSelect :childs="userSelectItems" @change="onChangeChild"/>
          </view>
          <view class="user-name">{{ currentChild.realName }}</view>
        </view>
      </view>
      <view class="intro-box">
        <view class="intro-box-text"> 你能获得</view>
        <IconRow
            :activityId="activityDetail.id"
            :childId="currentChild.userId"/>

        <!-- <IconRow :list="iconRowConfigs"/> -->
      </view>
      <view class="info-box">
        <view class="info-row">
          <view class="info-row-left">
            <view class="info-title">{{ title }}</view>
            <view class="info-address-row">
              <view class="info-address-icon"
              >
                <van-icon name="location-o"
                />
              </view>
              <view class="info-address">活动地址：{{ activityAddress }}</view>
            </view>
          </view>
          <view class="info-row-right">
            <view class="info-avatars">
              <AvatarRow :avatars="avatars"/>
            </view>
            <view v-if="totalMembers > 9999" class="info-people"
            >{{ totalMembersKW }}w人参加
            </view
            >
            <view v-else-if="totalMembers > 999" class="info-people"
            >{{ totalMembersKW }}k人参加
            </view
            >
            <view v-else class="info-people"> 999 + 人参加</view>
          </view>
        </view>
      </view>
      <view v-if="userSelectItems.length" class="box-progress">
        <!-- 活动进度条开头 -->
        <view class="title-row">
          <view class="title-left">活动进度</view>
          <view class="title-right">完成率{{ currentChild.process }}%</view>
        </view>
        <view class="progress-box">
          <view class="progress-out">
            <view
                :style="{
                width: `${currentChild.process}%`
              }"
                class="progress-bar"
            ></view>
          </view>
        </view>
        <!-- 活动进度条末尾 -->
      </view>
      <van-tabs style="margin-top: 20rpx" v-if="showCopies" color="#7563F0" @change="onChange">
        <van-tab
            v-for="(copy, copyIndex) of copies"
            :key="copy.title"
            :name="copy.title"
            :title="copy.title"
        >
          <view class="tab-content-box">
            <view class="rich-box">
              <!-- <rich-text :nodes="copy.content"></rich-text> -->
              <u-parse
                  v-if="copyIndex === active"
                  :content="copy.content"
                  @navigate="navigate"
              ></u-parse>
              <!-- <view>{{copy.content}}</view> -->
            </view>
          </view>
        </van-tab>
      </van-tabs>
      <view v-if="!userSelectItems.length" class="footer">
        <view class="join-btn" @click="joinActivity"> 立即参加</view>
      </view>
      <view v-if="userSelectItems.length" class="footer">
        <!-- <view class="title-row">
          <view class="title-left">活动进度</view>
          <view class="title-right">完成率{{ currentChild.process }}%</view>
        </view>
        <view class="progress-box">
          <view class="progress-out">
            <view
              class="progress-bar"
              :style="{
                width: `${currentChild.process}%`,
              }"
            ></view>
          </view>
        </view> -->
        <view class="btn-row">
          <view class="activity-address-btn" @click="joinActivity"
          >给另一个用户报
          </view
          >
          <view class="activity-address-btn" @click="goGuidePage"
          >查看活动引导
          </view
          >
        </view>
      </view>
      <van-toast id="van-toast"/>
      <van-action-sheet
          :close-on-click-overlay="true"
          :show="showActionSheet"
          title="确认报名的孩子"
          @close="closeActionSheet"
          @click-overlay="closeActionSheet"
      >
        <view class="action-box">
          <view class="children-box">
            <ChildrenList
                :activityId="activityId"
                :isRefresh="refreshState"
                :team-enabled="teamEnabled"
            />
          </view>
        </view>
      </van-action-sheet>
    </van-skeleton>

  </view>
</template>
<script lang="ts">
import { Component,Vue } from 'vue-property-decorator'
import IconRow from '@/components/common/IconRow.vue'
import AvatarRow from '@/components/common/AvatarRow.vue'
import IconRowItem from '@/beans/common/IconRowItem'
import UserSelect from '@/components/common/UserSelect.vue'
import ActivityService from '@/service/ActivityService'
import ActivityFullItem from '@/beans/activity/ActivityFullItem'
import {
  BadgeIsAwardEnum,
  CertIsAwardEnum,
  KnowledgeIsGetEnum,
  UserReportIsGenEnum,
  RankEnableEnum,
  isFollowedEnum,
  OperateModeEnum,EntryWayEnum
} from '@/enums/activity/ActivityFullItemEnum'

import ChildrenList from '@/pages/internalpages/children/ChildrenList.vue'
import ChildrenService from '@/service/ChildrenService'
import ActivityChild from '@/beans/common/ActivityChild'
import LoginManagement from '@/management/login/LoginManagement'
import LikeService from '@/service/LikeService'
import { LikeType } from '@/enums/notice/NoticeItemEnum'
import UserService from '@/service/UserService'
import store from '@/store/index'

import uParse from '@/components/feng-parse/parse.vue'
import { url } from 'inspector'
import SwiperModeEnum from '@/definition/common/SwiperModeEnum'
import LangEnum from '@/definition/lang/LangEnum'
import StaticFileEnum from '@/definition/lang/StaticFileEnum'

@Component({
  name: 'ActivityDetail',
  components: {
    IconRow,
    AvatarRow,
    UserSelect,
    ChildrenList,
    uParse
  }
})
export default class ActivityDetail extends Vue {
  trigger = false //这是为判定活动详情是否有发生变化，若无变化则为false，有变化则为true
  loading = true
  likeService = new LikeService()
  RankEnableEnum = RankEnableEnum
  isFollowedEnum = isFollowedEnum
  lang = LangEnum
  activityService = new ActivityService()
  userService = new UserService()
  activityId = ''
  staticFile = StaticFileEnum
  childrenService = new ChildrenService()

  backgroundImage = ''
  shareBackgroundImage = ''
  title = ''
  activityAddress = ''
  copies = [
    {
      title: '',
      content: ''
    }
  ]
  totalMembers = 0
  totalMembersKW = 0
  avatars = []
  rankEnable = RankEnableEnum.NO
  isLiked = isFollowedEnum.NO
  showCopies = false
  isJoined = false
  active = 0
  // 是否登录
  isLogin = false
  // 孩子选择列表数据
  userSelectItems: Array<ActivityChild> = []
  // 当前孩子数据
  currentChild = new ActivityChild()

  // 底部报名弹出层
  showActionSheet = false
  // 活动详情
  activityDetail = new ActivityFullItem()
  //刷新状态
  refreshState = false

  userPhone = store.state.user.phoneNumber
  currentChild1 = new ActivityChild()
  phoneNum = ''
  isRead = false
  clickCount: number = 0
  isModelShow: boolean = false
  teamEnabled: boolean = false

  mounted () {

    uni.$on('backToactive',() => {
      // this.showActionSheet = false;
      // console.log("这里证明函数调用成功", this.showActionSheet);
      this.initPage()
    })
  }

  onClickCloseIcon () {
    this.isModelShow = false
  }



  // 富文本渲染
  navigate (src) {
    const url = encodeURIComponent(src)
    uni.navigateTo({
      url: `/pages/webview/index?url=${ url }`
    })
  }

  onClickEnter () {
    this.isModelShow = true
  }

  // 下拉刷新
  onPullDownRefresh () {
    this.refreshState = true
    this.initPage()
    setTimeout(function () {
      uni.stopPullDownRefresh()
    },1000)
  }

  closeActionSheet () {
    this.showActionSheet = false
  }

  onChange (event: any) {
    this.active = event.detail.index
  }

  onLoad (options: any) {
    this.activityId = options.id
    if (options.scene) {
      const scene = decodeURIComponent(options.scene)
      this.activityId = scene.split('=')[0]
      console.log(this.activityId)
      this.userPhone = uni.getStorageSync('userInfo').phoneNumber
      const phone = scene.split('=')[1]
      this.phoneNum = phone
      // console.log("这里测试状态管理是否有用", this.phoneNum);
      // if (this.phoneNum === phone) {
      //   console.log("这里证明用户电话和传过来的一样");
      // }
    }
    if (this.activityId === '265651612790853') {
      this.isModelShow = true
    }
    this.initPage()
    uni.showShareMenu({
      menus: [ 'shareAppMessage','shareTimeline' ]
    })
  }

  //分享功能
  onShareAppMessage (res) {
    return {
      title: this.title,
      path: `/pages/activityDetail/index?id=${ this.activityId }`,
      imageUrl: this.shareBackgroundImage
    }
  }

  onShareTimeline () {
    return {
      title: 'Ai121活动平台' + '-' + this.title,
      path: `/pages/activityDetail/index?id=${ this.activityId }`,
      imageUrl: this.shareBackgroundImage
    }
  }

  initPage () {
    const id = this.activityId
    this.getBasicInfo(id)
    this.getCopyList(id)
    this.getMembers(id)
    const isLogin = new LoginManagement().isLogin()
    this.isLogin = isLogin
    if (isLogin) {
      this.getChildrenList(id)
    }
  }

  // 得到基本信息
  getBasicInfo (id: string) {
    this.activityService.getDetail(id).then(res => {
      if (res.success && res.data) {
        const data = res.data
        this.shareBackgroundImage = data.imgCover
        this.backgroundImage = data.imgCover
        this.title = data.name
        this.teamEnabled = data.teamEnabled
        console.log(this.teamEnabled)
        this.activityAddress =
            data.operateMode === SwiperModeEnum.ONLINE
                ? data.guideStudyUrl
                : data.operateLocation
        this.rankEnable = data.rankEnable
        this.isLiked = data.isFollowed
        this.loading = false
        this.activityDetail = res.data
      }
    })
  }

  // 获取副本列表
  getCopyList (id: string) {
    this.activityService.getDetailCopy(id).then(res => {
      if (res.success && res.data) {
        const copies = res.data.map(copy => ({
          ...copy,
          content: addRichClass(appendStyle(copy.content))
        }))
        this.copies = copies
        this.showCopies = true
      }
    })
  }

  getMembers (id: string) {
    this.activityService.getMembers(id).then(res => {
      if (res.success && res.data) {
        const data = res.data
        const totalMembers = data.total // 最多显示 999 个人数
        const avatars = data.records.map(item => item.avatar).slice(0,3)
        this.totalMembers = totalMembers
        this.totalMembersKW = this.setMembers(totalMembers) //这里对人数进行了判断
        this.avatars = avatars
      }
    })
  }

  //对人数进行一个简单的处理
  setMembers (members: number) {
    if (members > 9999) {
      let num = members / 10000
      return Number(num.toFixed(1))
    } else if (members > 999) {
      let num = members / 1000
      return Number(num.toFixed(1))
    } else {
      return members
    }
  }

  makeBackground (url: string) {
    return `url("${ url }") no-repeat center center/cover;`
  }

  joinActivity () {
    const path = `/internalpages/activityDetail/index?id=${ this.activityId }`
    if (!this.isLogin) {
      uni.navigateTo({
        url:
            '/pages/login/index?pathKey=' +
            encodeURIComponent(JSON.stringify(path))
      })
      return
    }
    if (this.phoneNum !== this.userPhone) {
      uni.showToast({
        title: '很抱歉，您不是受邀用户，暂时无法报名参加该活动！',
        duration: 2000,
        icon: 'none'
      })
    } else {
      if (this.activityDetail.isPublised) {
        uni.showToast({
          title: '很抱歉，已关闭此报名通道，请前往正式版报名参加该活动！',
          duration: 2000,
          icon: 'none'
        })
      } else {
        switch (this.activityDetail.entryWay) {
          case EntryWayEnum.URL:
            this.onEntryWayBeUrl()
            break
          case EntryWayEnum.DEFAULT:
            this.onEntryWayBeDefault()
            break
          default:
            this.onEntryWayBeDefault()
            break
        }
      }
    }
  }

  onEntryWayBeUrl () {
    if (this.activityDetail.entryUrl !== '') {

      uni.navigateToMiniProgram({
        appId: process.env.VUE_APP_SHOP_MINIAPP_APPID,
        path: this.activityDetail.entryUrl
      })
    } else {
      uni.showToast({
        title: '暂未开放'
      })
    }
  }

  onEntryWayBeDefault () {
    this.showActionSheet = true
  }

  // 获取孩子列表
  getChildrenList (activityId: string) {
    const that = this
    this.childrenService.getActivityChildren(activityId).then(res => {
      if (res.success && res.data) {
        const data = res.data
        const userSelectItems = data.filter(
            child => child.isEntry
        )
        // for (let i = 0; i < userSelectItems.length; i++) {
        //   if (userSelectItems[i].isEntry === 1 && userSelectItems[i].team) {
        //     that.userSelectItems.push(userSelectItems[i]);
        //   }
        // }
        that.userSelectItems = userSelectItems
        that.currentChild = this.userSelectItems[0]
        if (that.refreshState === false) {
          that.currentChild1 = that.currentChild
        } else {
          that.currentChild = that.currentChild1
          that.refreshState = false
        }
      }
    })
  }

  onChangeChild (child: ActivityChild) {
    this.currentChild = child
    this.currentChild1 = this.currentChild
  }

  goGuidePage () {
    const currentChild = this.currentChild
    const activityId = this.activityId
    const childId = currentChild.userId
    if (currentChild.team) {
      uni.navigateTo({
        url: `/pages/guide/index?activityId=${ activityId }&childId=${ childId }`
      })
    } else {
      uni.navigateTo({
        url: `/pages/internalpages/team/index?activityId=${ activityId }&childId=${ childId }`
      })
    }
  }

  goRankPage () {
    if (!this.isLogin) {
      uni.navigateTo({
        url: '/pages/login/index'
      })
      return
    }
    const activityId = this.activityId
    uni.navigateTo({
      url: `/pages/rank/index?activityId=${ activityId }`
    })
  }

  likeActivity () {
    if (!this.isLogin) {
      uni.navigateTo({
        url: '/pages/login/index'
      })
      return
    }
    const id = this.activityId
    this.likeService.like(id,LikeType.ACTIVITY).then(res => {
      if (res.success) {
        this.initPage()
        // this.trigger = true;
        // this.$emit("getTrigger", this.trigger); //这里是为了判定收藏后，trigger发生了变化
      }
    })
  }

  unlikeActivity () {
    if (!this.isLogin) {
      uni.navigateTo({
        url: '/pages/login/index'
      })
      return
    }
    const id = this.activityId
    this.likeService.unlike(id,LikeType.ACTIVITY).then(res => {
      if (res.success) {
        this.initPage()
        // this.trigger = true;
        // this.$emit("getTrigger", this.trigger);
      }
    })
  }
}

const addRichClass = (content: string) => {
  return content
  const reg = new RegExp('<([a-z\\d]+)','g')
  return content.replace(reg,'<$1 class="rich-$1"')
}

const appendStyle = (content: string) => {
  return content
  const style = `
<style>
img {
  max-width: 100%;
}
p {
  line-height: 2;
}
ul {
  list-style: none;
}
.rich-ul {
  list-style: none;
}
</style>
  `

  return '<div>' + content + style + '</div>'
}

// const filterValidTags = (str: string) => {
//   const startIndex = str.indexOf('')
// }
</script>
<style>
.page {
  background: #fff;
}
</style>
<style lang="scss" scoped>
.banner-box {
  height: 700rpx;
}

.intro-box {
  background: #7563f0;
  border-radius: 60rpx;
  padding: 40rpx 20rpx;
  color: #fff;
  box-shadow: 0px 6rpx 12rpx rgba(0, 0, 0, 0.16);
  margin-top: -60rpx;
}

.intro-box-text {
  text-align: center;
  font-size: 30rpx;
}

.info-box {
  padding: 60rpx 20rpx;
  font-size: 30rpx;
  border-bottom: 1px solid #efefef;
}

.info-row {
  display: flex;
  align-items: flex-end;
}

.info-row-left {
  flex: 1;
}

.info-row-right {
  flex-shrink: 0;
  // flex: 1;
  display: flex;
  justify-content: flex-end;
}

.info-address-row {
  display: flex;
  align-items: center;
}

.info-address {
  margin-left: 10rpx;
}

.info-title {
  margin-bottom: 40rpx;
  font-size: 44rpx;
}

.info-people {
  display: flex;
  align-items: flex-end;
}

.info-avatars {
  margin-right: 20rpx;
  margin-bottom: -20rpx;
}

.box-progress {
  padding: 0 20rpx 45rpx;
  border-bottom: 1px solid #efefef;
  font-size: 30rpx;
  display: flex;
  flex-direction: column;
}

.tab-content-box {
  min-height: 500rpx;
  padding: 20rpx;
  font-size: 30rpx;
}

.join-btn {
  color: #fff;
  background: #7563f0;
  padding: 30rpx 20rpx;
  text-align: center;
  border-radius: 20rpx;
}

.title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 30rpx;
  padding: 40rpx 0;
}

.footer {
  padding: 40rpx;
}

.progress-box {
  margin-bottom: 30rpx;
}

.progress-out {
  background: #ededed;
  height: 40rpx;
  width: 100%;
  border-radius: 20rpx;
  overflow: hidden;
  box-sizing: border-box;
}

.progress-bar {
  background: linear-gradient(270deg, #fdd910 0%, #fd7b0b 100%);
  width: 50%;
  height: 40rpx;
  border-radius: 20rpx;
}

.btn-row {
  display: flex;
  justify-content: space-between;
}

.activity-address-btn {
  color: #fff;
  background: #7563f0;
  padding: 30rpx 20rpx;
  text-align: center;
  border-radius: 20rpx;
  font-size: 32rpx;
  flex: 1;
}

.activity-address-btn:first-child {
  margin-right: 20rpx;
}

.rich-box {
  padding: 20rpx;
  // width: 100%;
  box-sizing: border-box;
  min-height: 500rpx;
}

.user-box {
  padding: 40rpx 0 0 0;
  display: flex;
  justify-content: center;
  margin-top: 70rpx;
}

.user-name {
  text-align: center;
  font-size: 44rpx;
  font-weight: bold;
  /* margin-bottom: 20rpx; */
  color: #fff;
}

.tool-bar {
  display: flex;
  padding: 20rpx;
  align-items: center;
  justify-content: flex-end;
}

.tool-item {
  width: 80rpx;
  height: 80rpx;
  border-radius: 10rpx;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 30rpx;
  background: #fff;
}

.tool-icon {
  width: 40rpx;
  height: 40rpx;
}

.banner-inner-box {
  background: rgba(0, 0, 0, 0.4);
  height: 100%;
}

// .children-box {
//   // max-height: 650rpx;
// }

// .action-box {
//   // height: 600rpx;
// }
.rich-img {
  max-width: 100%;
  display: block;
}

.rich-p {
  line-height: 2;
  margin: 20rpx 0;
}
</style>
