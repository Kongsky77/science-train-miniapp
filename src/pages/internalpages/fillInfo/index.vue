<template>
  <view class="page">
    <view class="title">填写信息</view>
    <view class="text">请完善一些信息，方便我们了解您</view>

    <view v-for="form of forms" :key="form.id" class="form-row">
      <view class="notice">
        {{form.placeholder !== '' ? form.placeholder : `${form.name}`}}
      </view>
      <view class="filed">
        <view style="width: 100%">
          <van-field
              v-model="form.value"
              :border="false"
              type="textarea"
              autosize
              placeholder="请输入"
              :custom-style="'padding:' + 20 + 'rpx ' + 20 + 'rpx ' + 20 + 'rpx ' + 0 + 'rpx '"
              placeholder-style="placeholderStyle"
              :required="!!form.required"
              @change="onFormChange(form, '$event')"
          />
        </view>
      </view>
    </view>
    <!-- <view class="form-row">
      <van-icon name="fire-o" />
      <van-field
        :value="teamName"
        placeholder="请输入战队名称"
        :border="false"
        @change="onTeamChange"
      />
    </view>
    <view class="tip">一旦提交不可更改</view> -->
    <div class="btn-box">
<!--      <view class="submit-btn" @click="skip"> 跳过 </view>-->
      <view class="submit-btn" @click="submit"> 确定</view>
    </div>
  </view>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ActivityService from "@/service/ActivityService";
import FormResponse from "@/beans/common/FormResponse";
import SubmitActivityFormField from "@/beans/activity/SubmitActivityFormField";
import SubmitActivityFormRequest from "@/beans/activity/req/SubmitActivityFormRequest";
import ShowMsgEnum from '@/definition/lang/ShowMsgEnum'
import ActivityFullItem from '@/beans/activity/ActivityFullItem'

class FormConfig extends FormResponse {
  value = "";
}

@Component({
  name: "FillInfo",
  components: {},
})
export default class FillInfo extends Vue {
  activityService = new ActivityService();
  className = "";
  teacher = "";
  childId = "";
  activityId = "";
  teamName = "";
  teamEnabled = ''

  activityItem: ActivityFullItem = new ActivityFullItem()
  forms: Array<FormConfig> = [];

  onLoad(options: any) {
    this.childId = options.childId;
    this.activityId = options.activityId;
    this.teamEnabled =  options.teamEnabled
    this.fetchActivityInfo()
  }

  fetchActivityInfo () {
    new ActivityService().getDetail(this.activityId).then(res => {
      this.activityItem = res.data
      this.getForms()
    })
  }

  // 下拉刷新
  onPullDownRefresh() {
    setTimeout(() => {
      this.getForms();
      uni.stopPullDownRefresh();
    }, 3000);
  }

  getForms() {
    this.activityService.getActivityForm(this.activityId).then((res) => {
      if (res.success && res.data) {
        const forms = res.data.map((form) => ({
          ...form,
          value: "",
        }));
        this.forms = forms
      }
    });
  }

  onTeamChange(event: any) {
    this.teamName = event.detail;
  }

  onFormChange(form: FormConfig, event: any) {
    form.value = event.detail;
  }

  submit() {
    const isValid = this.forms.every((item) => {
      return !item.required || (item.required && item.value);
    });

    if (!isValid) {
      uni.showToast({
        title: "请填写完整字段",
        duration: 2000,
        icon: "none",
      });
      return
    }

    const forms = this.forms.filter(item => {
      return item.value !== ''
    })

    const submitActivityFormField: Array<SubmitActivityFormField> =
      forms.map((item) => ({
        filedId: item.id,
        value: item.value,
      }));

    if (this.teamEnabled === 'true') {
      this.goCreateTeam(submitActivityFormField)
    }else {
      this.signUpTeam(submitActivityFormField)
    }
  }

  skip () {
    const submitActivityFormField: Array<SubmitActivityFormField> = []
    if (this.teamEnabled === 'true') {
      this.goCreateTeam(submitActivityFormField)
    }else {
      this.signUpTeam(submitActivityFormField)
    }
  }

  signUpTeam (submitActivityFormField: Array<SubmitActivityFormField>) {
    const activityService = new ActivityService()
    const entryActivityRequest = new SubmitActivityFormRequest()
    entryActivityRequest.subUserId = this.childId
    entryActivityRequest.preview = '1'
    entryActivityRequest.entryWay = '4'
    entryActivityRequest.fields = submitActivityFormField
    activityService.submitActivityForm(this.activityId,entryActivityRequest,'').then((res) => {
      if (res.success && res.data) {
        this.showSignUpSuccessNotice()
        this.moveToGuidePage()
      } else {
        this.showSignUpErrorNotice(res.error)
      }
    })
  }

  showSignUpSuccessNotice () {
    uni.showToast({
      title: '报名成功',
      duration: ShowMsgEnum.SHOW_SUBMIT_DURATION_SUCCESS,
      icon: 'none',
    })
  }

  moveToGuidePage () {
    uni.navigateTo({
      url: `/pages/guide/index?activityId=${ this.activityId }&childId=${ this.childId }`
    })
  }

  showSignUpErrorNotice (errorMsg: string) {
    uni.showToast({
      title: errorMsg,
      duration: 2000,
      icon: 'none',
    })
  }

  goCreateTeam(submitActivityFormField: Array<SubmitActivityFormField>) {
    const submitActivityFormFields = JSON.stringify(submitActivityFormField)
    const childId = this.childId;
    const activityId = this.activityId;
    uni.redirectTo({
      url: `/pages/internalpages/team/index?childId=${childId}&activityId=${activityId}&fields=${submitActivityFormFields}`,
    });
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
  background: url("https://contentdevsa-blob.ai121.net/testcontainer/activity/image/a5313504-927a-430a-95cb-76d6cec0b7ce.png") no-repeat center
    bottom/contain;
  box-sizing: border-box;
  height: 100%;
  padding: 40rpx 60rpx;
}

.title {
  color: #969393;
  font-size: 64rpx;
  margin-bottom: 20rpx;
}

.text {
  color: #969393;
  font-size: 28rpx;
  margin-bottom: 40rpx;
}

.form-row {
  display: flex;
  flex-direction: column;
  .notice {
    padding: 30rpx 30rpx 0rpx  0;
  }
  .filed {
    display: flex;
    flex-direction: row;
    align-items: center;
    border-bottom: 1px solid #efefef;
  }
}

.btn-box {
  display: flex;
  flex-direction: row;
}

.submit-btn {
  width: 80%;
  background: #7563f0;
  border-radius: 10rpx;
  color: #fff;
  font-size: 32rpx;
  margin-top: 80rpx;
  padding: 30rpx 20rpx;
  text-align: center;
}

.submit-btn:last-child {
  margin-left: 50rpx;
}

.tip {
  color: #f2a563;
  font-size: 30rpx;
  margin: 20rpx;
}
</style>
