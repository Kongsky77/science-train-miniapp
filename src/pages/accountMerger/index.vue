<style>
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
  background: #ffffff;
  border-radius: 20rpx;
  width: 90%;
  /* box-shadow: 6rpx 6rpx 5rpx ; */
}

.avatar {
  width: 160rpx;
  height: 160rpx;
}

.close-box {
  padding: 40rpx 40rpx 10rpx;
  text-align: right;
}

.image-box {
  align-items: flex-start;
  display: flex;
  flex: 0.1;
  padding: 40rpx;
  justify-content: flex-start;
}

.account-merger-title {
  font-size: 40rpx;
  font-weight: bolder;
  padding: 20rpx;
  text-align: center;
}
.account-merger-text {
  font-size: 28rpx;
  line-height: 40rpx;
  opacity: 0.6;
  padding: 40rpx;
  text-align: left;
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

.user-info-text:nth-child(2) {
  margin-top: 10rpx;
}

.user-info-text:nth-child(3) {
  margin-top: 10rpx;
}
</style>

<template>
    <van-overlay :lock-scroll="true" :show="isShowUserInfo" :z-index="9999" @click="isShowUserInfo = false">
      <div class="wrapper" v-if="isCardShow" @click.stop>
        <view class="page">
          <view class="badge-box">
            <view class="badge-image-box">
              <view class="image-box">
               <image class="avatar" :src="userInfo.avatar"></image>
                <text style="margin-left: 20rpx;">
                  <text class="user-info-text" style="display: block">姓名： <text style="font-weight: bolder">{{userInfo.realName}}</text></text>
                  <text class="user-info-text" style="display: block">年级： {{userInfo.grade}} 年级</text>
                  <text class="user-info-text" style="display: block">学校： {{userInfo.orgName}}</text>
                </text>
              </view>
              <view class="account-merger-title">
                是否绑定孩子账号？
              </view>
              <view class="account-merger-text">
                该操作将通过你的微信号(手机号)绑定  <text style="font-weight: bolder">孩子信息</text>，以便后续通过 <text style="font-weight: bolder">小程序客户端</text>，查看/找回孩子的 <text style="font-weight: bolder">活动证书、徽章以及其他活动信息</text>。
              </view>
              <van-button type="primary" custom-style="border-radius: 0 0 0 20rpx;border:1px solid #D5D5D5;width: 50%;background-color: #ffffff;color: black" @click="jumpToIndexPage">取消</van-button>
              <van-button type="primary" custom-style="border-radius: 0 0 20rpx 0;border:1px solid #D5D5D5;width: 50%;background-color: #ffffff;color: black" @click="doMergerAccount">允许</van-button>
              <view>
              </view>
            </view>
          </view>
        </view>
      </div>
    </van-overlay>
</template>

<script lang="ts">
import { Component , Vue } from 'vue-property-decorator'
import MergerEnum from '@/definition/account-merger/MergerEnum'
import UserInfo from '@/definition/user/UserInfo'
import UserMergerInfo from '@/definition/account-merger/UserMergerInfo'
import LoginManagement from '@/management/login/LoginManagement'
import TabEnum from '@/enums/common/TabEnum'
import ShowMsgEnum from '@/definition/lang/ShowMsgEnum'
import AccountMergerManagement from '@/management/accountMerger/AccountMergerManagement'
import UserService from '@/service/UserService'
import ChildrenService from '@/service/ChildrenService'
import UserInfoResponse from '@/beans/common/UserInfoResponse'
import LangEnum from '@/definition/lang/LangEnum'
import UserMergerRequest from '@/beans/user/req/UserMergerRequest'
import BuriedPointRequest from '@/beans/user/req/BuriedPointRequest'
import BadgeService from '@/service/BadgeService'
import UserInfoManagement from '@/management/user/UserInfoManagement'
import { Utils } from '@/common/utils/Utils'

@Component({
  name: 'AccountMerger'
})

export default class AccountMerger extends Vue{
  errCount: number = 0
  isShowUserInfo: boolean = false
  userInfo: UserInfoResponse = new UserInfoResponse()
  type: MergerEnum = MergerEnum.NO_SUB_ACCOUNT
  userMergerInfo: UserMergerInfo = new UserMergerInfo()
  subUserId: string = ''
  isCardShow: boolean = false
  buriedPointId: string = ''


  onLoad (option: any) {
    const scene = decodeURIComponent(option.scene)
    const sceneData = scene.split(",")
    if (sceneData.length === 2) {
      this.subUserId = sceneData[1]
    }
    if(option.subUserId !== undefined || null) {
      this.subUserId = option.subUserId
    }
    if(!this.isLogin) {
      this.jumpToLoginPage()
    }else {
      this.receiveCurrentAccountInfo()
    }
  }

  get isLogin (): boolean {
    let loginManger = new LoginManagement()
    return loginManger.isLogin()
  }

  receiveCurrentAccountMergerInfo () {
    const userService = new UserService()
    if(this.subUserId !== '') userService.queryCurrentAccountMergeType(this.subUserId, this.receiveCurrentAccountMergerInfoCallback)
  }

  isMerge (code: string): boolean {
    return code === LangEnum.USER_ALREADY_MERGE
  }

  isSubUserNotFound (code: string): boolean {
    return code === LangEnum.NOT_FOUND_SUB_USER
  }

  receiveCurrentAccountMergerInfoCallback (success: boolean, code: string, userMergerInfo: UserMergerInfo) {
    let that = this
    if (success && !this.isMerge(code)) {
      this.userMergerInfo = userMergerInfo
      this.isCardShow = true
    }else {
      if(this.isMerge(code)) {
        const userInfoManagement = new UserInfoManagement()
        const parentUserId = userInfoManagement.getUserInfo().userId
        if (parentUserId !== this.userInfo.parentUserId) {
          uni.showModal({
            title: `提示`,
            content: `${this.userInfo.realName}的账号已经绑定了${this.userInfo.phoneNumber}的手机号，请用该手机号查询孩子信息`,
            showCancel: false,
            success() {
              that.jumpToIndexPage()
            }
          })
        }else {
          this.jumpToProfilePage()
        }
      }
      if(this.isSubUserNotFound(code)) {
        this.jumpToIndexPage()
      }
    }
  }

  receiveCurrentAccountInfo () {
    let childrenService = new ChildrenService()
    childrenService.getChildInfo(this.subUserId).then(res => {
      this.userInfo = res.data
      this.isShowUserInfo = true
      this.receiveCurrentAccountMergerInfo()
    })

  }

  receiveCurrentAccountInfoCallback (success: boolean, code: string, userInfo: UserInfoResponse) {
    if(success) {
      this.userInfo = userInfo
    }else {

    }
  }



  jumpToIndexPage () {
    uni.navigateTo({
      url: '/pages/tab/index'
    })
  }

  jumpToProfilePage () {
    uni.navigateTo({
      url: "/pages/editInfo/index?id="+ this.subUserId,
      // url: `/pages/tab/index?active=${TabEnum.PROFILE}&currrentId=${this.subUserId}`
    })
  }

  jumpToLoginPage () {
    const currentPath = encodeURIComponent(JSON.stringify(`/pages/accountMerger/index`))
    uni.navigateTo({
      url: `/pages/login/index?pathKey=${currentPath}&subUserId=${this.subUserId}`
    })
  }

  doMergerAccount () {
    const userService = new UserService()
    const userMergerRequest = new UserMergerRequest()
    userMergerRequest.subUserId = this.subUserId
    userService.accountMerge(userMergerRequest, this.mergerAccountCallback)
  }

  mergerAccountCallback (success: boolean, code: string) {
    if (!this.isSubmitExceedLimit && success) {
      this.doAccountMergerSuccess()
    }else {
      this.errCount++
      if (this.isSubmitExceedLimit) {
        this.showExceedLimitNotice()
      }else {
        this.showRetryNotice()
      }
    }
  }

  get isSubmitExceedLimit () {
    return this.errCount > 3
  }

  doAccountMergerSuccess () {
    let buriedPointRequest = new BuriedPointRequest()
    buriedPointRequest.uri = `/pages/accountMerger/index?userId=${this.subUserId}`
    buriedPointRequest.referer = process.env.VUE_APP_PROJECT_NAME
    this.buriedPoint(buriedPointRequest)
  }


  buriedPoint (buriedPointRequest: BuriedPointRequest) {
    let badgeService = new BadgeService()
    badgeService.buriedPoint(buriedPointRequest).then(res => {
      this.buriedPointId = res.data
      if (this.buriedPointId !== '') {
        this.afterBuriedPoint()
      }
    })
  }

  afterBuriedPoint () {
    new AccountMergerManagement().removeSubUserId()
    this.showAccountMergerSuccessNotice()
    this.jumpToProfilePage()
  }

  destroyed () {
    this.onLeavePage()
  }

  onLeavePage () {
    if(this.buriedPointId !== '') {
      let buriedPointRequest = new BuriedPointRequest()

      buriedPointRequest.reqId = this.buriedPointId
      this.buriedPoint(buriedPointRequest)
    }
  }

  showRetryNotice () {
    uni.showToast({
      title: "请重试",
      duration: ShowMsgEnum.SHOW_MESSAGE_DURATION,
      icon: "none"
    })
  }

  showExceedLimitNotice () {
    uni.showToast({
      title: "请稍后再试",
      duration: ShowMsgEnum.SHOW_MESSAGE_DURATION,
      icon: "none"
    })
  }

  showAccountMergerSuccessNotice () {
    uni.showToast({
      title: "合并成功",
      duration: ShowMsgEnum.SHOW_MESSAGE_DURATION,
      icon: "none"
    })
  }
}

</script>
