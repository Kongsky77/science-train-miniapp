<template>
  <view class="page">
    <view class="title">创建战队</view>
    <view class="text">战队名称</view>
    <view class="form-row">
      <van-field
        :border="false"
        :focus="true"
        :value="teamName"
        class="van-cell-ai121"
        placeholder="用于排行榜显示"
        custom-style="van-cell-ai121"
        input-class="van-field-ai121"
        @change="onTeamNameChange"
      >
        <van-icon slot="right-icon" color="#01AF0E" name="checked" />
      </van-field>
      <!-- <van-icon slot="right-icon" name="checked" color="#01AF0E"/> -->
    </view>
    <view class="tips">
      <span
        >温馨提示：战队名称不得含有政治敏感、色情、暴力血腥、恐怖内容及国家法律法规禁止的其他违法内容；</span
      >
      <span class="tips-red">一旦提交将不可修改。</span>
    </view>
    <view class="submit-btn" @click="createTeam"> 创建战队 </view>
    <!-- <view class="tips-bottom"
      >温馨提示：战队名称不得含有政治敏感
      、色情、暴力血腥、恐怖内容及国家法律法规禁止的其他违法内容</view
    > -->
  </view>
</template>
<script lang="ts">
import { Component , Vue } from 'vue-property-decorator'
import TeamService from '@/service/TeamService'
import CreateTeamRequest from '@/beans/team/req/CreateTeamRequest'
import ActivityService from '@/service/ActivityService'
import SubmitActivityFormRequest from '@/beans/activity/req/SubmitActivityFormRequest'
import ChildrenService from '@/service/ChildrenService'
import BooleanEnum from '@/enums/common/BooleanEnum'

@Component({
  name: "CreateTeam",
  components: {},
})
export default class CreateTeam extends Vue {
  teamService = new TeamService();
  teamName = "";
  childId = "";
  activityId = "";
  fields = []

  onTeamNameChange(event: any) {
    this.teamName = event.detail;
  }

  onLoad(options: any) {
    this.childId = options.childId;
    this.activityId = options.activityId;
    if (options.fields) {
      this.fields = JSON.parse(options.fields)
    }
  }

  signUpTeam () {
    const activityService = new ActivityService()
    const entryActivityRequest = new SubmitActivityFormRequest();
    entryActivityRequest.subUserId = this.childId;
    entryActivityRequest.preview = '1'
    entryActivityRequest.entryWay = "4"
    if (this.fields.length > 0) {
      entryActivityRequest.fields = this.fields
    }
    activityService.submitActivityForm(this.activityId, entryActivityRequest,'')
        .then((res) => {
          if (res.success && res.data) {
            if (res.success) {
              this.createTeamService()
            }
          } else {
      uni.showToast({
              title: res.error,
        duration: 2000,
        icon: "none",
      });
          }
        });
  }

  createTeamService () {
    const createTeamRequest: CreateTeamRequest = {
      activityId: this.activityId,
      subUserId: this.childId,
      name: this.teamName,
      preview: "1",
    }
    this.teamService.createTeam(createTeamRequest).then((res) => {
      if (res.success && res.data) {
        uni.showToast({
          title: "报名成功",
          duration: 2000,
          icon: "none",
        });

        uni.navigateTo({
          url: `/pages/guide/index?activityId=${this.activityId}&childId=${this.childId}`,
        });
      } else {
        uni.showToast({
          title: res.error,
          duration: 2000,
          icon: "none",
        });
      }
    })
  }

  createTeam() {
    let that = this
    if (!this.teamName) {
      uni.showToast({
        title: "请填写战队名称",
          duration: 2000,
          icon: "none",
        });

      return;
    }

    let childrenService = new ChildrenService()
    childrenService.getActivityChildren(this.activityId).then(res => {
      for ( let i = 0; i < res.data.length; i++ ) {
        if ( res.data[i].userId === that.childId ) {
          if ( res.data[i].isEntry === BooleanEnum.YES ) {
            that.createTeamService()
          }else {
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

<style scoped>
.page {
  background: url("https://contentdevsa-blob.ai121.net/testcontainer/activity/image/a5313504-927a-430a-95cb-76d6cec0b7ce.png") no-repeat center
    bottom/contain;
  box-sizing: border-box;
  height: 100%;
  padding: 40rpx 60rpx;
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
  align-items: center;
  border-bottom: 1px solid #efefef;
  display: flex;
  height: 80rpx;
  padding: 20rpx;
}

.van-cell-ai121 >>> .van-cell {
  padding: 0;
  width: 150% !important;
}

.van-field-ai121 >>> .van-field__control {
  width: 150% !important;
}

.tips {
  color: #b8b2ad;
  font-size: 28rpx;
  margin-top: 15rpx;
}

.tips-red {
  color: #f2a563;
}

.submit-btn {
  background: #7563f0;
  border-radius: 10rpx;
  color: #fff;
  font-size: 32rpx;
  margin-top: 60rpx;
  padding: 30rpx 20rpx;
  text-align: center;
}
.tips-bottom {
  /* padding: 0rpx 60rpx; */
  bottom: 50rpx;
  color: #b8b2ad;
  font-size: 28rpx;
  padding-right: 40rpx;
  position: fixed;
}
</style>
