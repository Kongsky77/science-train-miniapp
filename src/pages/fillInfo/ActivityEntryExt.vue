<template>
  <view class="page">
    <view class="title">填写信息</view>
    <view class="text">请完善信息</view>

    <view v-for="form of forms" :key="form.filedId" class="form-row">
      <DynamicFormInput class="form-item"
        v-if="form.type === formTypeEnum.INPUT"
        :form='form'
        @change="onFormChange(form, '$event')"
      >
      </DynamicFormInput>
      <DynamicFormUpload class="form-item"
        v-if="form.type === formTypeEnum.UPLOAD"
        :form='form'
        :childId='childId'
        @change="onFormChange(form, '$event')"
      >
      </DynamicFormUpload>
      <DynamicFormCascader class="form-item"
        v-if="form.type === formTypeEnum.CASCADER"
        :form='form'
        @change="onFormChange(form, '$event')"
      >
      </DynamicFormCascader>

      <DynamicFormCheckbox class="form-item"
        v-if="form.type === formTypeEnum.CHECKBOX" :form='form'
        @change="onFormChange(form, '$event')">
      </DynamicFormCheckbox>

    </view>
    <div class="btn-box">
<!--      <view class="submit-btn" @click="skip"> 跳过 </view>-->
      <view class="submit-btn" @click="submit"> 确定</view>
    </div>
  </view>
</template>
<script lang="ts">
import { Component,Vue } from 'vue-property-decorator'
import ActivityService from '@/service/ActivityService'
import FormResponse from '@/beans/common/FormResponse'
import SubmitActivityFormField from '@/beans/activity/SubmitActivityFormField'
import SubmitActivityFormRequest from '@/beans/activity/req/SubmitActivityFormRequest'
import ShowMsgEnum from '@/definition/lang/ShowMsgEnum'
import ChannelManagement from '@/management/channel/ChannelManagement'
import ChannelKeyEnum from '@/definition/common/ChannelKeyEnum'
import PageLinkEnum from '@/definition/lang/PageLinkEnum'
import ActivityFullItem from '@/beans/activity/ActivityFullItem'
import FormTypeEnum from "@/enums/common/FormTypeEnum";
import FormTypeComponentNameMap from "@/definition/common/FormTypeComponentNameMap";
import DynamicFormInput from "./DynamicFormInput.vue";
import DynamicFormUpload from "./DynamicFormUpload.vue";
import DynamicFormCascader from "./DynamicFormCascader.vue";
import UserActivityEntryInfo from '@/beans/activity/res/UserActivityEntryInfo'
import DynamicFormCheckbox from './DynamicFormCheckbox.vue'

@Component({
  name: 'ActivityEntryExt',
  components: {
    DynamicFormInput,
    DynamicFormUpload,
    DynamicFormCascader,
    DynamicFormCheckbox
  },
})
export default class ActivityEntryExt extends Vue {
  activityService = new ActivityService()
  childId = ''
  activityId = ''
  isNeedPay: boolean = false
  teamEnabled: boolean = false
  teamForceCreate: boolean = false
  activityItem: ActivityFullItem = new ActivityFullItem()

  formTypeEnum = FormTypeEnum

  forms: Array<FormResponse> = []
  userActivityEntryInfo: UserActivityEntryInfo = new UserActivityEntryInfo()

  onLoad (options: any) {
    this.childId = options.childId
    this.activityId = options.activityId
    this.isNeedPay = (options.isNeedPay === 'true')
    this.teamEnabled =  (options.teamEnabled === 'true')
    this.teamForceCreate = (options.teamForceCreate === 'true')
    this.getForms()
    this.fetchActivityInfo()
  }

  fetchActivityInfo () {
    new ActivityService().getDetail(this.activityId).then(res => {
      this.activityItem = res.data
    })
  }

  // 下拉刷新
  onPullDownRefresh () {
    setTimeout(() => {
      this.getForms()
      uni.stopPullDownRefresh()
    },3000)
  }

  getForms () {
    ActivityService.fetchUserEntryInfo(this.activityId, this.childId, this.ongetUserActivityEntryInfoCallback)
  }

  ongetUserActivityEntryInfoCallback(success: boolean, userActivityEntryInfo: UserActivityEntryInfo){
    if (success) {
      this.userActivityEntryInfo = userActivityEntryInfo
      this.forms = userActivityEntryInfo.fields
    }
  }

  isValidForms(forms: Array<FormResponse>): boolean{
    // 循环遍历表单this.forms，如果有必填项没有填写，就提示用户；如果都填写了，就返回true，否则返回false；如果表单项中有type为FormTypeEnum.INPUT的，并且validPattern不为空字符串，就需要校验表单项的值是否符合正则表达式
    let result = true
    console.log('forms', forms)
    for (let i = 0; i < forms.length; i++) {
      const form = forms[i]
      if (form.required && form.value === '') {
        uni.showToast({
          title: form.name + '不能为空',
          icon: 'none',
        })
        result = false
        break
      }
      if (form.required && form.type === FormTypeEnum.INPUT && form.validPattern !== '') {
        const reg = new RegExp(form.validPattern)
        if (!reg.test(form.value)) {
          uni.showToast({
            title: '请输入正确的' + form.name,
            icon: 'none',
          })
          result = false
          break
        }
      }
    }
    return result
  }

  submit () {
    if (this.isValidForms(this.forms) === false) {
      return
    }
    // const forms = this.forms.filter(item => {
    //   return item.value !== ''
    // })

    const submitActivityFormField: Array<SubmitActivityFormField> =
        this.forms.map((item) => ({
          filedId: item.filedId,
          value: item.value,
        }))
    // this.goCreateTeam(submitActivityFormField)
    if (this.teamEnabled && this.teamForceCreate) {
      this.goCreateTeam(submitActivityFormField)
    }else {
      this.signUpTeam(submitActivityFormField)
    }
  }

  goCreateTeam (submitActivityFormField: Array<SubmitActivityFormField>) {
    const submitActivityFormFields = JSON.stringify(submitActivityFormField)
    const childId = this.childId
    const activityId = this.activityId
    uni.redirectTo({
      url: `/pages/create-team/CreateTeam?isNeedPay=${this.isNeedPay}&childId=${ childId }&activityId=${ activityId }&fields=${ submitActivityFormFields }`,
    })
  }

  skip () {
    const submitActivityFormField: Array<SubmitActivityFormField> = []
    this.signUpTeam(submitActivityFormField)
  }

  signUpTeam (submitActivityFormField: Array<SubmitActivityFormField>) {
    const activityService = new ActivityService()
    const entryActivityRequest = new SubmitActivityFormRequest()
    entryActivityRequest.subUserId = this.childId
    entryActivityRequest.preview = '0'
    entryActivityRequest.entryWay = '4'
    entryActivityRequest.fields = submitActivityFormField
    if (ChannelManagement.getChannelId(ChannelKeyEnum.KOC) !== '') {
      entryActivityRequest.kocId = ChannelManagement.getChannelId(ChannelKeyEnum.KOC)
    }else {
      entryActivityRequest.kocId = ''
    }
    activityService.submitActivityForm(this.activityId,entryActivityRequest,this.activityItem.name).then((res) => {
      if (res.success && res.data) {
        this.moveToNextPage()
      } else {
        this.showSignUpErrorNotice(res.error)
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
      url: `${ PageLinkEnum.PLACE_AN_ORDER }?activityId=${ this.activityId }&childId=${this.childId}`
    })
  }

  moveToGuidePage () {
    uni.redirectTo({
      url: `/pages/guide/index?activityId=${ this.activityId }&childId=${ this.childId }`
    })
  }

  showSignUpSuccessNotice () {
    uni.showToast({
      title: '报名成功',
      duration: ShowMsgEnum.SHOW_SUBMIT_DURATION_SUCCESS,
      icon: 'none',
    })
  }

  showSignUpErrorNotice (errorMsg: string) {
    uni.showToast({
      title: errorMsg,
      duration: 2000,
      icon: 'none',
    })
  }

  onFormChange (form: FormResponse, event: any) {
    form.value = event
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
  box-sizing: border-box;
  min-height: 100%;
  background: url("https://contentdevsa-blob.ai121.net/testcontainer/activity/image/a5313504-927a-430a-95cb-76d6cec0b7ce.png") no-repeat center
    bottom/contain;
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
    padding: 30rpx 0 0  0;
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

.avatar-box {
  width: 200rpx;
  height: 200rpx;
  // border-radius: 50%;
  background: #89888e;
  // margin-top: 20rpx;
  // margin-right: 20rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 40rpx;
  color: #fff;
}

// preview-box充满父容器并居中
.preview-box {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: relative;
}

.preview-img {
  width: 100%;
  height: 100%;
  // border-radius: 50%;
  object-fit: cover;
  position: absolute;
}

.upload-box {
  opacity: 0;
}

.preview-icon {
  position: absolute;
  bottom: 16rpx;
  right: 10rpx;
}

// avatar-item充满父容器并居中
.avatar-item {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

// child-img生成样式，avatar-box、notice-box左右排列
.child-img {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 20rpx;
}

// 生成.notice-box位于avatar-box的右侧，高度与avatar-box相同。.notice-box的子容器notice，字体大小为15rpx，颜色为灰色，文字能换行
.child-img-notice-box {
  margin-left: 20rpx;
  height: 100%;
  .child-img-notice {
    font-size: 20rpx;
    color: #8b0303;
    white-space: pre-wrap;
    padding: 10rpx;
  }
}
</style>
