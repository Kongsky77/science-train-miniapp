<template>
  <div class="page">
    <div class="notice">
     <p>{{activityItem.name}}</p>
    </div>

    <view class="join-container">
      <view class="logo">
        <image class="img" :src="staticFile.TEAM_LOGO_IMAGE"/>
      </view>
      <view class="header">
        <view class="avatar">
          <van-image :src="teamInfo.logo"
                     round
                     style="margin-top: 10rpx"
                     width="100rpx"
                     height="100rpx"/>
        </view>
        <view class="team-info">
          <view style="padding-top: 5rpx;font-size: 35rpx">{{ teamInfo.name }}战队</view>
          <view style="margin-top: 10rpx;font-size: 28rpx">{{ teamInfo.leaderName }} <span class="leader-tag">队长</span></view>
        </view>
      </view>
      <view class="join-team">
        邀请您加入战队！
      </view>
      <view class="enter-btn" @click="onClickJoinBtn">
        确认加入
      </view>
      <view class="cancel-btn" @click="onClickCancelBtn">
        取消
      </view>

      <view class="tips">温馨提示：用户只能一次创建战队或者加入战队，一旦确定不得修改。</view>

      <choose-children v-if="isLoad"
                       :activity-id="activityId"
                       :show-choose-children="showChooseChildModel"
                       @on-enter-click="onEnterChooseChild"
                       @close-model="doCloseModel"/>
    </view>

    <image class="flower" :src="staticFile.JOIN_TEAM_FLOWER"></image>
  </div>
</template>

<script lang="ts">
import { Vue,Component } from 'vue-property-decorator'
import LoginManagement from '@/management/login/LoginManagement'
import ShowMsgEnum from '@/definition/lang/ShowMsgEnum'
import LangEnum from '@/definition/lang/LangEnum'
import TeamService from '@/service/TeamService'
import TeamResultResponse from '@/beans/team/res/TeamResultResponse'
import ChooseChildren from '@/components/ChooseChildren.vue'
import ActivityChild from '@/beans/common/ActivityChild'
import ActivityService from '@/service/ActivityService'
import SubmitActivityFormRequest from '@/beans/activity/req/SubmitActivityFormRequest'
import ChannelManagement from '@/management/channel/ChannelManagement'
import ChannelKeyEnum from '@/definition/common/ChannelKeyEnum'
import JoinTeamDTO from '@/beans/team/req/JoinTeamDTO'
import ErrorCodeEnum from '@/definition/lang/ErrorCodeEnum'
import StaticFileEnum from '@/definition/lang/StaticFileEnum'
import ActivityFullItem from '@/beans/activity/ActivityFullItem'

interface JoinTeamOption {
  activityId: string,
  teamId: string,
  scene: string
}

@Component({
  name: 'JoinTeam',
  components: {
    ChooseChildren
  }
})

export default class JoinTeam extends Vue {
  isLoad: boolean = false
  teamId: string = ''
  joinChildId: string = ''
  teamInfo: TeamResultResponse = new TeamResultResponse()
  activityId: string = ''
  staticFile = StaticFileEnum
  activityItem: ActivityFullItem = new ActivityFullItem()
  showChooseChildModel: boolean = false


  get isLogin (): boolean {
    return new LoginManagement().isLogin()
  }

  onLoad (option: JoinTeamOption) {
    this.teamId = option.teamId
    if (option.scene) {
      this.teamId = decodeURIComponent(option.scene)
    }
    this.fetchCurrentTeamInfo()
  }

  onPullDownRefresh () {
    let that = this
    setTimeout(function () {
      that.fetchCurrentTeamInfo()
      uni.stopPullDownRefresh()
    },1000)
  }


  onClickJoinBtn () {
    if (this.isLogin) {
      this.showChooseChildModel = true
    } else {
      this.moveToLoginPage()
    }
  }

  doCloseModel () {
    this.showChooseChildModel = false
  }

  onClickCancelBtn () {
    this.moveToActivityDetailPage()
  }

  onEnterChooseChild (activeChild: ActivityChild) {
    this.joinChildId = activeChild.userId
    this.doJoinActivity()
  }

  moveToLoginPage () {
    const currentPath = encodeURIComponent(JSON.stringify(`/pages/join-team/JoinTeam?teamId=${ this.teamId }`))
    uni.navigateTo({
      url: `/pages/login/index?pathKey=${ currentPath }`,
    })
  }

  moveToActivityDetailPage () {
    uni.navigateTo({
      url: `/pages/activityDetail/index?id=${ this.activityId }`
    })
  }

  moveToAddChildPage () {

  }

  moveToTeamCenterPage () {
    const url = `${ process.env.VUE_APP_CARMELA_APP_URL }/team-center-page?teamId=${ this.teamId }&childId=${ this.joinChildId }`
    uni.navigateTo({
      url: `/pages/webview/index?url=${ encodeURIComponent(url) }`
    })
  }

  showJoinFailedNotice (errCode?: string) {
    let title: string
    if (errCode === ErrorCodeEnum.NOT_JOIN_TEAM_SNGG) {
      title = '不在同一学段'
    } else if (errCode === ErrorCodeEnum.TEAM_USER_UPPER_LIMIT) {
      title = '战队人数已满'
    } else {
      title = LangEnum.ADD_TEAM_FAILED
    }
    uni.showToast({
      title: title,
      duration: ShowMsgEnum.SHOW_MESSAGE_DURATION,
      icon: 'none'
    })
  }

  showJoinSuccessNotice () {
    uni.showToast({
      title: LangEnum.ADD_TEAM_SUCCESS,
      duration: ShowMsgEnum.SHOW_MESSAGE_DURATION
    })
  }

  fetchCurrentTeamInfo () {
    TeamService.reviveTeamInfo(this.teamId,this.fetchCurrentTeamInfoCallback)
  }

  fetchCurrentTeamInfoCallback (success: boolean,teamResult: TeamResultResponse) {
    if (success) {
      this.activityId = teamResult.activityId
      this.teamInfo = teamResult
      this.fetchActivityInfo()
    }
  }

  fetchActivityInfo () {
    new ActivityService().getDetail(this.teamInfo.activityId).then(res => {
      this.activityItem = res.data
      this.isLoad = true
    })
  }

  doJoinActivity () {
    const activityService = new ActivityService()
    const entryActivityRequest = new SubmitActivityFormRequest()
    entryActivityRequest.subUserId = this.joinChildId
    entryActivityRequest.preview = '0'
    entryActivityRequest.entryWay = '4'
    if (ChannelManagement.getChannelId(ChannelKeyEnum.KOC) !== '') {
      entryActivityRequest.kocId = ChannelManagement.getChannelId(ChannelKeyEnum.KOC)
    } else {
      entryActivityRequest.kocId = ''
    }
    activityService.submitActivityForm(this.activityId,entryActivityRequest,this.activityItem.name).then((res) => {
      this.doJoinActivityCallback(res.success,res.code)
    })
  }

  doJoinActivityCallback (success: boolean,errorCode: string) {
    if (success) {
      this.doJoinTeam()
    } else {
      if (errorCode === ErrorCodeEnum.ALREADY_ENTRY_ACTIVITY) {
        this.doJoinTeam()
      } else {
        this.showJoinFailedNotice()
      }
    }
  }

  doJoinTeam () {
    const joinTeam = new JoinTeamDTO(this.joinChildId,this.teamId)
    TeamService.doJoinTeam(joinTeam,this.doJoinTeamCallback)
  }

  doJoinTeamCallback (success: boolean,errorCode: string) {
    if (success) {
      this.doCloseModel()
      this.showJoinSuccessNotice()
      this.moveToTeamCenterPage()
    } else {
      this.showJoinFailedNotice(errorCode)
    }
  }
}

</script>

<style lang="scss" scoped>
.page {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  background: url("https://contentdevsa-blob.ai121.net/testcontainer/activity/image/1e087d69-129e-4329-acf2-8e6070bbd604.svg") no-repeat center center/cover;
  overflow: hidden;

  .notice {
    width: 100%;
    position: absolute;
    top: 0;
    text-align: center;
    color: #FFFFFF;
    background: rgba(0, 0, 0, 0.3);
    font-size: 22rpx;
    padding-bottom: 30rpx;
    padding-top: 30rpx;
  }

  .tips {
    flex-shrink: 0;
    width: 65%;
    position: relative;
    z-index: 2;
    color: #DB6362;
    text-align: center;
    font-size: 20rpx;
    margin: 40rpx auto 0;
  }

  .join-container {
    flex-shrink: 0;
    width: 76%;
    height: 70%;
    padding: 40rpx 0 0 0;
    margin: 0 auto 0rpx;
    background: url("https://contentdevsa-blob.ai121.net/testcontainer/activity/image/ab3177d3-d9d6-4c80-b568-c44f4dba8720.svg") no-repeat;
    background-size: 100% 100%;
    position: relative;
    bottom: -10%;
    color: #5D5D5D;
    border-radius: 10rpx;

    .logo {
      width: 80%;
      margin: 0 auto 0;
      display: flex;
      justify-content: center;
      align-items: center;

      .img {
        width: 70%;
        height: 50rpx;
      }
    }

    .header {
      width: 96%;
      height: 10%;
      margin-top: 10%;
      display: flex;
      justify-content: center;
      align-items: center;
      .avatar {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .team-info {
        flex-shrink: 0;
        margin-left: 40rpx;
        display: flex;
        opacity: 0.8;
        flex-direction: column;
        justify-content: space-between;

        .leader-tag {
          background: #FFA200;
          color: #ffffff;
          font-size: 24rpx;
          margin-left: 20rpx;
          padding: 0rpx 10rpx 0rpx 10rpx;
          border-radius: 10rpx;
        }

        & > view:first-child {
          width: 60%;
          font-size: 30rpx;
          font-weight: 600;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }

    .join-team {
      color: #DB6362;
      font-size: 46rpx;
      width: 108%;
      padding-top: 40rpx;
      padding-bottom: 40rpx;
      margin: 20rpx auto;
      font-weight: 800;
      text-align: center;
    }

    .cancel-btn {
      width: 40%;
      margin: 0 auto;
      z-index: 2;
      position: relative;
      text-align: center;
      color: #ffffff;
      background: #008B80;
      padding: 15rpx 40rpx 15rpx 40rpx;
      border-radius: 10rpx;
    }

    .enter-btn {
      width: 40%;
      margin: 0 auto 40rpx;
      text-align: center;
      z-index: 2;
      position: relative;
      background: rgba(245, 137, 37, 1);
      color: white;
      padding: 15rpx 40rpx 15rpx 40rpx;
      border-radius: 10rpx;
    }
  }

  .flower {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
