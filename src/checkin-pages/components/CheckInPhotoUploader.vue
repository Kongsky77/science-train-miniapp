<template>
  <view v-if="visible" class="photo-layer">
    <view class="photo-mask" @click="cancel"></view>
    <view class="photo-panel">
      <view class="panel-handle"></view>
      <view class="panel-title">上传现场照片</view>
      <view class="panel-subtitle">照片仅作为本次活动打卡凭证</view>

      <view class="uploader-box">
        <van-uploader
          accept="image"
          :capture="['album', 'camera']"
          :file-list="fileList"
          :max-count="1"
          :max-size="5 * 1024 * 1024"
          @after-read="afterRead"
          @delete="deletePhoto"
          @oversize="onOversize"
        />
      </view>

      <view v-if="errorMessage" class="photo-error">{{ errorMessage }}</view>
      <view v-if="canRelocate" class="relocate-link" @click="relocate">
        <van-icon name="location-o" size="28rpx" />
        <text class="relocate-link-text">重新定位</text>
      </view>

      <view class="panel-actions">
        <van-button class="action-button" round block :disabled="uploading || submitting" @click="cancel">
          取消
        </van-button>
        <van-button
          class="action-button"
          round
          block
          color="#e42b2b"
          :loading="uploading || submitting"
          :disabled="!photoUrl || uploading || submitting"
          @click="confirm"
        >{{ submitting ? "提交中" : uploading ? "上传中" : "确认打卡" }}</van-button>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import CheckInPhotoService from '@/service/CheckInPhotoService'

@Component({ name: 'CheckInPhotoUploader' })
export default class CheckInPhotoUploader extends Vue {
  @Prop({ default: false }) visible!: boolean
  @Prop({ required: true }) activityId!: string
  @Prop({ required: true }) childId!: string
  @Prop({ required: true }) pointId!: string
  @Prop({ required: true }) requestId!: string
  @Prop({ default: '' }) initialPhotoUrl!: string
  @Prop({ default: '' }) errorMessage!: string
  @Prop({ default: false }) canRelocate!: boolean
  @Prop({ default: false }) submitting!: boolean

  private readonly photoService = new CheckInPhotoService()
  fileList: any[] = []
  photoUrl = ''
  uploading = false

  @Watch('requestId')
  onRequestIdChange () {
    this.photoUrl = this.initialPhotoUrl || ''
    this.fileList = this.photoUrl ? [{ url: this.photoUrl, status: 'done' }] : []
  }

  @Watch('initialPhotoUrl')
  onInitialPhotoChange (value: string) {
    const nextPhotoUrl = value || ''
    if (nextPhotoUrl === this.photoUrl) return
    this.photoUrl = nextPhotoUrl
    this.fileList = nextPhotoUrl ? [{ url: nextPhotoUrl, status: 'done' }] : []
  }

  async afterRead (event: any) {
    const file = event && event.detail ? event.detail.file : null
    const selectedFile = Array.isArray(file) ? file[0] : file
    const filePath = selectedFile && (selectedFile.url || selectedFile.path)
    if (!filePath) {
      this.$emit('upload-error', '无法读取所选照片，请重新选择')
      return
    }

    this.uploading = true
    this.photoUrl = ''
    this.fileList = [{ ...selectedFile, url: filePath, status: 'uploading', message: '上传中' }]
    this.$emit('selected', filePath)
    try {
      const url = await this.photoService.upload(
        filePath,
        this.activityId,
        this.childId,
        this.pointId,
        this.requestId
      )
      this.photoUrl = url
      this.fileList = [{ ...selectedFile, url: filePath, status: 'done' }]
      this.$emit('uploaded', url)
    } catch (error) {
      this.fileList = [{ ...selectedFile, url: filePath, status: 'failed', message: '上传失败' }]
      this.$emit('upload-error', '照片上传失败，请删除后重试')
    } finally {
      this.uploading = false
    }
  }

  deletePhoto () {
    if (this.uploading || this.submitting) return
    this.photoUrl = ''
    this.fileList = []
    this.$emit('uploaded', '')
  }

  onOversize () {
    uni.showToast({ title: '照片不能超过 5MB', icon: 'none' })
  }

  confirm () {
    if (!this.photoUrl || this.uploading || this.submitting) return
    this.$emit('confirm')
  }

  relocate () {
    if (this.uploading || this.submitting) return
    this.$emit('relocate')
  }

  cancel () {
    if (this.uploading || this.submitting) return
    this.$emit('cancel')
  }
}
</script>

<style scoped lang="scss">
.photo-layer {
  position: fixed;
  z-index: 1000;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

.photo-mask {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(10, 14, 20, 0.5);
}

.photo-panel {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 18rpx 38rpx calc(34rpx + env(safe-area-inset-bottom));
  border-radius: 34rpx 34rpx 0 0;
  background: #fff;
}

.panel-handle {
  width: 76rpx;
  height: 8rpx;
  margin: 0 auto 26rpx;
  border-radius: 999rpx;
  background: #dfe2e7;
}

.panel-title {
  color: #24272d;
  font-size: 34rpx;
  font-weight: 600;
  text-align: center;
}

.panel-subtitle {
  margin-top: 10rpx;
  color: #90959e;
  font-size: 23rpx;
  text-align: center;
}

.uploader-box {
  display: flex;
  justify-content: center;
  margin: 38rpx 0 28rpx;
}

.photo-error {
  margin-bottom: 20rpx;
  color: #c43b32;
  font-size: 24rpx;
  text-align: center;
}

.relocate-link {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 22rpx;
  color: #8b5d35;
  font-size: 24rpx;
}

.relocate-link-text {
  margin-left: 6rpx;
}

.panel-actions {
  display: flex;
}

.action-button {
  flex: 1;
}

.action-button + .action-button {
  margin-left: 20rpx;
}
</style>
