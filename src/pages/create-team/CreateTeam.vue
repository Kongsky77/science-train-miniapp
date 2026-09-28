<template>
  <view class="page">
    <view class="title">创建战队</view>
    <view class="text">战队名称</view>
    <view class="form-row">
      <van-field
          :border="false"
          :focus="true"
          :value="teamName"
          placeholder="用于排行榜显示"
          class="van-cell-ai121"
          custom-style="van-cell-ai121"
          input-class="van-field-ai121"
          @change="onTeamNameChange"
      >
        <van-icon slot="right-icon" color="#01AF0E" name="checked"/>
      </van-field>
      <!-- <van-icon slot="right-icon" name="checked" color="#01AF0E"/> -->
    </view>
    <!-- <view class="text" style="margin-top: 20rpx">导师名称</view>
    <view class="form-row">
      <van-field
          :border="false"
          :value="tutor"
          placeholder="选填"
          class="van-cell-ai121"
          custom-style="van-cell-ai121"
          input-class="van-field-ai121"
          @change="onTutorNameChange"
      >
      </van-field> -->
      <!-- <van-icon slot="right-icon" name="checked" color="#01AF0E"/> -->
    <!-- </view> -->
    <view class="tips">
      <span
      >温馨提示：战队名称不得含有政治敏感、色情、暴力血腥、恐怖内容及国家法律法规禁止的其他违法内容；</span
      >
      <span class="tips-red">一旦提交将不可修改。</span>
    </view>
    <view class="submit-btn" @click="createTeam"> 创建战队</view>
    <!-- <view class="tips-bottom"
      >温馨提示：战队名称不得含有政治敏感
      、色情、暴力血腥、恐怖内容及国家法律法规禁止的其他违法内容</view
    > -->
  </view>
</template>
<script lang="ts">
import { Component,Vue } from 'vue-property-decorator'
import TeamService from '@/service/TeamService'
import CreateTeamRequest from '@/beans/team/req/CreateTeamRequest'
import ActivityService from '@/service/ActivityService'
import SubmitActivityFormRequest from '@/beans/activity/req/SubmitActivityFormRequest'
import ChildrenService from '@/service/ChildrenService'
import BooleanEnum from '@/enums/common/BooleanEnum'
import ChannelManagement from '@/management/channel/ChannelManagement'
import ChannelKeyEnum from '@/definition/common/ChannelKeyEnum'
import PageLinkEnum from '@/definition/lang/PageLinkEnum'
import ActivityFullItem from '@/beans/activity/ActivityFullItem'

@Component({
  name: 'CreateTeam',
  components: {},
})
export default class CreateTeam extends Vue {
  teamService = new TeamService()
  teamName = ''
  childId = ''
  tutor = ''
  activityId = ''
  fields = []
  activityItem: ActivityFullItem = new ActivityFullItem()
  isNeedPay: boolean = false

  onTeamNameChange (event: any) {
    this.teamName = event.detail
  }

  onTutorNameChange (event: any) {
    this.tutor = event.detail
  }

  fetchActivityInfo () {
    new ActivityService().getDetail(this.activityId).then(res => {
      this.activityItem = res.data
    })
  }

  onLoad (options: any) {
    this.childId = options.childId
    this.activityId = options.activityId
    this.isNeedPay = (options.isNeedPay === 'true')
    if (options.fields) {
      this.fields = JSON.parse(options.fields)
    }
    this.fetchActivityInfo()
  }

  signUpTeam () {
    const activityService = new ActivityService()
    const entryActivityRequest = new SubmitActivityFormRequest()
    entryActivityRequest.subUserId = this.childId
    entryActivityRequest.preview = '0'
    entryActivityRequest.entryWay = '4'
    if (this.fields.length > 0) {
      entryActivityRequest.fields = this.fields
    }
    if (ChannelManagement.getChannelId(ChannelKeyEnum.KOC) !== '') {
      entryActivityRequest.kocId = ChannelManagement.getChannelId(ChannelKeyEnum.KOC)
    } else {
      entryActivityRequest.kocId = ''
    }
    activityService.submitActivityForm(this.activityId,entryActivityRequest,this.activityItem.name).then((res) => {
      if (res.success && res.data) {
        if (res.success) {
          this.createTeamService()
        }
      } else {
        uni.showToast({
          title: res.error,
          duration: 2000,
          icon: 'none',
        })
      }
    })
  }

  moveToNextPage () {
    if (this.isNeedPay) {
      this.moveToPlaceAnOrderPage()
    } else {
      this.moveToGuidePage()
    }
  }

  moveToPlaceAnOrderPage () {
    uni.navigateTo({
      url: `${ PageLinkEnum.PLACE_AN_ORDER }?activityId=${ this.activityId }&childId=${ this.childId }`
    })
  }

  moveToGuidePage () {
    uni.redirectTo({
      url: `/pages/guide/index?activityId=${ this.activityId }&childId=${ this.childId }`,
    })
  }

  createTeamService () {
    const createTeamRequest: CreateTeamRequest = {
      activityId: this.activityId,
      subUserId: this.childId,
      name: this.teamName,
      preview: '0',
      tutor: this.tutor
    }
    this.teamService.createTeam(createTeamRequest).then((res) => {
      if (res.success && res.data) {
        this.moveToNextPage()
      } else {
        uni.showToast({
          title: res.error,
          duration: 2000,
          icon: 'none',
        })
      }
    })
  }

  createTeam () {
    let that = this
    if (!this.teamName) {
      uni.showToast({
        title: '请填写战队名称',
        duration: 2000,
        icon: 'none',
      })

      return
    }

    let childrenService = new ChildrenService()
    childrenService.getActivityChildren(this.activityId).then(res => {
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].userId === that.childId) {
          if (res.data[i].isEntry === BooleanEnum.YES) {
            that.createTeamService()
          } else {
            that.signUpTeam()
          }
        }
      }
    })
    /*switch ( this.isEntry ) {
        case BooleanEnum.NO:
          this.signUpTeam()
          break
        case BooleanEnum.YES:
          this.createTeamService()
          break
        default:
          this.signUpTeam()
      }*/

  }
}
</script>
<style>
page {
  background: #fff;
}
</style>

<style lang="scss" scoped>
.page {
  padding: 40rpx 60rpx;
  height: 100%;
  box-sizing: border-box;
  background: url("https://contentdevsa-blob.ai121.net/testcontainer/activity/image/a5313504-927a-430a-95cb-76d6cec0b7ce.png") no-repeat center bottom/contain;
}

.title {
  color: #969393;
  font-size: 64rpx;
  margin-bottom: 200rpx;
}

.text {
  color: #969393;
  font-size: 28rpx;
  /* margin-bottom: 40rpx; */
}

.form-row {
  display: flex;
  padding: 20rpx;
  border-bottom: 1px solid #efefef;
  height: 80rpx;
  align-items: center;
}

.van-cell-ai121 /deep/ .van-cell {
  width: 150% !important;
  padding: 0;
}

.van-field-ai121 /deep/ .van-field__control {
  width: 150% !important;
}

.tips {
  margin-top: 15rpx;
  font-size: 28rpx;
  color: #b8b2ad;
}

.tips-red {
  color: #f2a563;
}

.submit-btn {
  margin-top: 60rpx;
  color: #fff;
  background: #7563f0;
  padding: 30rpx 20rpx;
  text-align: center;
  border-radius: 10rpx;
  font-size: 32rpx;
}

.tips-bottom {
  /* padding: 0rpx 60rpx; */
  padding-right: 40rpx;
  font-size: 28rpx;
  color: #b8b2ad;
  position: fixed;
  bottom: 50rpx;
}
</style>
