<template>
  <view class="dynamic-form">
      <view class="notice">
        <span v-if="form.required" style="color: red; margin: 0 10rpx 0 0;">*</span>
        {{form.name}}
      </view>
      <view class="child-img filed">
        <view class="avatar-box">
          <!-- 使用 van-uploader 生成照片上传功能，上传之后照片能预览-->
          <view class="preview-box">
            <image class="preview-img" :src="previewImage" :key="keyCount"></image>
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
  </view>
</template>
<script lang="ts">
import { Component,Vue,Prop } from 'vue-property-decorator'
import FormResponse from '@/beans/common/FormResponse'
import BlobService from '@/service/BlobService'
import UploadFileResponse from '@/beans/blob/res/UploadFileResponse'
import FormTypeComponentNameMap from '@/definition/common/FormTypeComponentNameMap'
import FormTypeEnum from '@/enums/common/FormTypeEnum'

@Component({
  name: FormTypeComponentNameMap.get(FormTypeEnum.UPLOAD),
  components: {},
})
export default class DynamicFormUpload extends Vue {
  @Prop() form!: FormResponse

  @Prop() childId!: string

  blobService = new BlobService();

  previewImage =''
  fileList = []

  keyCount = 0

  mounted() {
    if (this.form.value !== '') {
      this.previewImage = this.form.value
    }
  }

  afterRead(event: any) {
    this.keyCount++
    const { file } = event.detail;
    const suffix = file.url.split(".").pop();
    const blobDir = "ucenter/image";
    const blobName = `${this.childId}-${this.keyCount}.${suffix}`;
    this.blobService
      .upLoadFile(file.url, blobDir, blobName)
      .then((res: UploadFileResponse) => {
        if (res.success && res.data) {
          const avatar = res.data;
          this.previewImage = avatar;
          
          // this.submitAvatar(avatar);
          this.$emit('change',avatar)
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
}
</script>

<style lang="scss" scoped>
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
