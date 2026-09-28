<template>
  <view class="page">
    <view class="title">填写信息</view>
    <view class="text">请完善信息</view>

    <view v-for="form of forms" :key="form.id" class="form-row">
      <view class="notice">
        {{form.name}}
      </view>
      <view class="child-img" v-if="form.code === formImgCode">
        <view class="avatar-box">
          <!-- 使用 van-uploader 生成照片上传功能，上传之后照片能预览-->
          <view class="preview-box">
            <image class="preview-img" :src="previewImage"></image>
            <view class="upload-box">
              <van-uploader
                :accept="'media'"
                :capture="['album', 'camera']"
                :file-list="fileList"
                :max-size="5000 * 1024"
                @after-read="afterRead"
                class="avatar-item"
              />
            </view>
            <view class="preview-icon">
              <van-icon name="edit" />
            </view>
          </view>
        </view> 
        <view class="child-img-notice-box">
          <view class="child-img-notice">1、上传电子版照片为近期免冠2寸正面证件照（背景颜色无要求），脸部无遮挡。</view>
          <view class="child-img-notice">2、格式为jpeg/jpg/png，不超过5M，图像分辨率大于32*32像素，小于4096*4096像素。</view>
          <view class="child-img-notice">3、请保证上传清晰证件照，不能上传生活照、艺术照。</view>
        </view>
      </view>       
      <view class="filed" v-else>
        <view style="width: 100%">
          <van-field v-if="form.code === formCityCode || form.code === formAreaCode"
            v-model="form.code === formCityCode ? cityText : areaText"
            is-link
            readonly
            clickable
            :placeholder="`${form.placeholder !== '' ? form.placeholder : '请选择'}`"
            :required="!!form.required"
            @click-input="onCascaderFieldClick(form)"
            @click-icon="onCascaderFieldClick(form)"
          />
          <van-field v-else-if="form.code !== formAreaCode"
              v-model="form.value"
              :border="false"
              type="textarea"
              style=""
              autosize
              :placeholder="`${form.placeholder !== '' ? form.placeholder : '请输入'}`"
              input-align="left"
              :required="!!form.required"
              @change="onFormChange(form, '$event')"
          />
        </view>       
      </view>           
    </view>
    <div class="btn-box">
<!--      <view class="submit-btn" @click="skip"> 跳过 </view>-->
      <view class="submit-btn" @click="submit"> 确定</view>
    </div>
    <van-popup :show="showCascader" round position="bottom"
      close-on-click-overlay
      safe-area-inset-bottom
    >
      <van-cascader
        v-if="showCascader"
        v-model="cascaderValue"
        :options="zgxAreaCodeOpts"
        @close="onCascaderCancel"
        @finish="onCascaderFinish"
        :key="cascaderCountKey"
      />
    </van-popup>

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
import BlobService from '@/service/BlobService'
import UploadFileResponse from '@/beans/blob/res/UploadFileResponse'
import {ZGXAreaCodeOpts, CityAreaCode} from "@/definition/common/ZGXAreaCodeOpts";

class FormConfig extends FormResponse {
  value = ''
}

@Component({
  name: 'FillInfo',
  components: {},
})
export default class FillInfo extends Vue {
  activityService = new ActivityService()
  blobService = new BlobService();
  className = ''
  teacher = ''
  childId = ''
  activityId = ''
  teamName = ''
  isNeedPay: boolean = false
  teamEnabled: boolean = false
  teamForceCreate: boolean = false
  activityItem: ActivityFullItem = new ActivityFullItem()

  forms: Array<FormConfig> = []

  currentForm:FormConfig = null


  previewImage =''
  fileList = []

  formImgCode = 'studentImg'
  formCityCode = 'cityCode'
  formAreaCode = 'areaCode'
  fieldCityAreaValue = ''
  cascaderValue = ''
  showCascader = false
  zgxAreaCodeOpts = []
  cityText = ''
  areaText = ''
  cascaderCountKey = 0

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
      this.getForms()
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
    this.activityService.getActivityForm(this.activityId).then((res) => {
      if (res.success && res.data) {
        const forms = res.data.map((form) => ({
          ...form,
          value: '',
        }))
        this.forms = forms
      }
    })
  }

  onTeamChange (event: any) {
    this.teamName = event.detail
  }

  onFormChange (form: FormConfig,event: any) {
    form.value = event.detail
  }

  submit () {
    for (let index = 0; index < this.forms.length; index++) {
      if (this.forms[index].code === this.formImgCode) {
        this.forms[index].value = this.previewImage
        break
      }
    }

    const isValid = this.forms.every((item) => {
      return !item.required || (item.required && item.value)
    })

    if (!isValid) {
      uni.showToast({
        title: '请填写完整字段',
        duration: 5000,
        icon: 'none',
      })
      return
    }

    const forms = this.forms.filter(item => {
      return item.value !== ''
    })

    const submitActivityFormField: Array<SubmitActivityFormField> =
        forms.map((item) => ({
          filedId: item.id,
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
    uni.navigateTo({
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

  afterRead(event: any) {
    const { file } = event.detail;
    const suffix = file.url.split(".").pop();
    const blobDir = "ucenter/image";
    const blobName = `${this.childId}.${suffix}`;
    this.blobService
      .upLoadFile(file.url, blobDir, blobName)
      .then((res: UploadFileResponse) => {
        if (res.success && res.data) {
          const avatar = res.data;
          this.previewImage = avatar;
          // this.submitAvatar(avatar);
        }
      })
      .catch(() => {
        uni.showToast({
          title: "上传失败，请稍后重试",
          duration: 2000,
          icon: "none",
        });
      });
  } 
  
  onCascaderFinish(selected:any) {
    this.showCascader = false;
    this.currentForm.value = selected.detail.selectedOptions[0].value
    if (this.currentForm.code === this.formCityCode) {
      this.cityText = selected.detail.selectedOptions[0].text
    } else if (this.currentForm.code === this.formAreaCode) {
      this.areaText = selected.detail.selectedOptions[0].text
    } 
  }

  onCascaderFieldClick(form: FormConfig) {
    this.cascaderCountKey++
    if(form.code === this.formCityCode){
      this.zgxAreaCodeOpts = ZGXAreaCodeOpts.getCityOpts()
    } else if(form.code === this.formAreaCode){
      this.zgxAreaCodeOpts = ZGXAreaCodeOpts.getAreaOpts(this.currentForm.value)
    }
    this.currentForm = form
    this.showCascader = true
  }

  onCascaderCancel() {
    this.showCascader = false;
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
    font-size: 36rpx;
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
