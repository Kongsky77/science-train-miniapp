<template>
  <view class="check-in-page">
    <scroll-view
      class="page-scroll"
      scroll-y
      :refresher-enabled="true"
      :refresher-triggered="refreshing"
      @refresherrefresh="refreshPage"
    >
      <view class="page-content">
        <view class="hero-card">
          <view class="hero-topline">
            <view>
              <view class="hero-kicker">科普列车 · 定位打卡</view>
              <view class="hero-title">{{ activityName }}</view>
            </view>
            <view
              v-if="currentChild.userId"
              class="participant-chip"
              @click="openParticipantSelector"
            >
              <text class="participant-chip-text">{{ currentChild.realName }}</text>
              <van-icon v-if="userSelectItems.length > 1" name="arrow-down" size="22rpx" />
            </view>
          </view>

          <view class="train-scene" aria-hidden="true">
            <view class="train">
              <view class="train-engine">
                <view class="engine-window"></view>
                <view class="engine-light"></view>
                <view class="chimney"></view>
                <view class="train-wheel wheel-one"></view>
                <view class="train-wheel wheel-two"></view>
              </view>
              <view v-for="index in 3" :key="index" class="train-car">
                <view class="car-window"></view>
                <view class="car-window"></view>
                <view class="train-wheel car-wheel-one"></view>
                <view class="train-wheel car-wheel-two"></view>
              </view>
            </view>
            <view class="rail-line"></view>
          </view>

          <view class="journey-row">
            <text>打卡进度</text>
            <text class="journey-count">{{ snapshot.completedCount }} / {{ snapshot.totalCount }}</text>
          </view>
          <view class="progress-track">
            <view class="progress-value" :style="{ width: progressPercent + '%' }"></view>
          </view>
        </view>

        <view class="score-card">
          <view class="score-item">
            <text class="score-label">答题积分</text>
            <text class="score-number">{{ formatScore(snapshot.answerScore) }}</text>
          </view>
          <view class="score-divider"></view>
          <view class="score-item">
            <text class="score-label">打卡积分</text>
            <text class="score-number">{{ formatScore(snapshot.checkInScore) }}</text>
          </view>
          <view class="score-divider"></view>
          <view class="score-item score-item--total">
            <text class="score-label">综合积分</text>
            <text class="score-number">{{ formatScore(snapshot.totalScore) }}</text>
          </view>
        </view>

        <view class="section-heading">
          <view>
            <view class="section-title">选择打卡地点</view>
            <view class="section-subtitle">可自由选择任意开放地点</view>
          </view>
          <view class="filter-row">
            <view
              v-for="filter in filters"
              :key="filter.value"
              class="filter-item"
              :class="{ 'filter-item--active': activeFilter === filter.value }"
              @click="activeFilter = filter.value"
            >{{ filter.label }}</view>
          </view>
        </view>

        <view v-if="pageError" class="page-error" @click="refreshPage">
          <view class="error-title">{{ pageError }}</view>
          <view class="error-action">点击重新加载</view>
        </view>
        <view v-else-if="loading" class="page-loading">正在驶入打卡站点…</view>
        <view v-else-if="!visiblePoints.length" class="empty-state">
          <view class="empty-train">▰━━</view>
          <view class="empty-title">暂无相关打卡地点</view>
        </view>
        <view v-else class="point-list">
          <CheckInPointCard
            v-for="(point, index) in visiblePoints"
            :key="point.id"
            :point="point"
            :index="index"
            :busy="busyPointId === point.id"
            @check-in="startCheckIn"
            @open-location="openPointLocation"
          />
        </view>
      </view>
    </scroll-view>

    <van-action-sheet
      :show="showParticipantSelector"
      :actions="participantActions"
      cancel-text="取消"
      close-on-click-action
      @select="selectParticipant"
      @close="showParticipantSelector = false"
      @cancel="showParticipantSelector = false"
    />

    <CheckInPhotoUploader
      :visible="showPhotoPanel"
      :activity-id="activityId"
      :child-id="currentChild.userId"
      :point-id="activeAttempt.pointId"
      :request-id="activeAttempt.requestId"
      :initial-photo-url="activeAttempt.photoUrl"
      :error-message="activeAttempt.errorMessage"
      :can-relocate="activeAttempt.errorCode === 'CHECK_IN_OUT_OF_RANGE' || activeAttempt.errorCode === 'CHECK_IN_LOCATION_INACCURATE'"
      :submitting="activeAttempt.stage === attemptStage.SUBMITTING"
      @selected="onPhotoSelected"
      @uploaded="onPhotoUploaded"
      @upload-error="onPhotoUploadError"
      @confirm="submitActiveAttempt"
      @relocate="relocateActiveAttempt"
      @cancel="closePhotoPanel"
    />
  </view>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ActivityService from '@/service/ActivityService'
import ChildrenService from '@/service/ChildrenService'
import CheckInService from '@/service/CheckInService'
import LocationService, { LocationError, LocationErrorCode } from '@/service/LocationService'
import ActivityChild from '@/beans/common/ActivityChild'
import CheckInPoint from '@/beans/check-in/CheckInPoint'
import CheckInPointListResult from '@/beans/check-in/CheckInPointListResult'
import CheckInSubmitRequest from '@/beans/check-in/CheckInSubmitRequest'
import CheckInSubmitResult from '@/beans/check-in/CheckInSubmitResult'
import CheckInAttempt, { CheckInAttemptStage } from '@/beans/check-in/CheckInAttempt'
import CheckInPointStatus from '@/definition/check-in/CheckInPointStatus'
import CheckInPointCard from '@/checkin-pages/components/CheckInPointCard.vue'
import CheckInPhotoUploader from '@/checkin-pages/components/CheckInPhotoUploader.vue'
import LoginManagement from '@/management/login/LoginManagement'
import { getUUID } from '@/utils/Weapon'
import {
  calculateAllowedDistanceMeter,
  calculateDistanceMeter,
  isOutOfRange
} from '@/utils/check-in/Distance'
import { getCheckInErrorInfo } from '@/utils/check-in/CheckInErrorMapper'

enum PointFilter {
  ALL = 'ALL',
  AVAILABLE = 'AVAILABLE',
  COMPLETED = 'COMPLETED'
}

@Component({
  name: 'CheckInPage',
  components: {
    CheckInPointCard,
    CheckInPhotoUploader
  }
})
export default class CheckInPage extends Vue {
  private readonly activityService = new ActivityService()
  private readonly childrenService = new ChildrenService()
  private readonly checkInService = new CheckInService()
  private readonly locationService = new LocationService()

  activityId = ''
  requestedChildId = ''
  activityName = '科普列车川渝黔行'
  userSelectItems: ActivityChild[] = []
  currentChild = new ActivityChild()
  snapshot = new CheckInPointListResult()
  points: CheckInPoint[] = []
  loading = true
  refreshing = false
  pageError = ''
  activeFilter: PointFilter = PointFilter.ALL
  showParticipantSelector = false
  showPhotoPanel = false
  activeAttempt = new CheckInAttempt()
  attempts: { [pointId: string]: CheckInAttempt } = {}
  attemptStage = CheckInAttemptStage
  filters = [
    { label: '全部', value: PointFilter.ALL },
    { label: '可打卡', value: PointFilter.AVAILABLE },
    { label: '已完成', value: PointFilter.COMPLETED }
  ]

  onLoad (options: any) {
    this.activityId = String(options.activityId || '')
    this.requestedChildId = String(options.childId || '')
    if (!this.activityId) {
      this.loading = false
      this.pageError = '缺少活动信息'
      return
    }
    if (!new LoginManagement().isLogin()) {
      this.goToLogin()
      return
    }
    this.initializePage()
  }

  get progressPercent (): number {
    if (!this.snapshot.totalCount) return 0
    return Math.min(100, Math.round(this.snapshot.completedCount / this.snapshot.totalCount * 100))
  }

  get visiblePoints (): CheckInPoint[] {
    const points = this.points.filter((point) => point.status !== CheckInPointStatus.DISABLED)
    if (this.activeFilter === PointFilter.AVAILABLE) {
      return points.filter((point) => point.status === CheckInPointStatus.AVAILABLE)
    }
    if (this.activeFilter === PointFilter.COMPLETED) {
      return points.filter((point) => point.status === CheckInPointStatus.COMPLETED)
    }
    return points
  }

  get participantActions (): any[] {
    return this.userSelectItems.map((child) => ({
      name: child.realName,
      subname: child.orgName,
      userId: child.userId,
      color: child.userId === this.currentChild.userId ? '#e42b2b' : '#323233'
    }))
  }

  get busyPointId (): string {
    const busyStages = [CheckInAttemptStage.LOCATING, CheckInAttemptStage.SUBMITTING]
    return busyStages.indexOf(this.activeAttempt.stage) >= 0 ? this.activeAttempt.pointId : ''
  }

  async initializePage () {
    this.loading = true
    this.pageError = ''
    this.loadActivityName()
    await this.loadChildren()
    if (this.currentChild.userId) {
      await this.loadPoints(false)
    }
    this.loading = false
  }

  async loadActivityName () {
    try {
      const response = await this.activityService.getDetail(this.activityId, false)
      if (response.success && response.data && response.data.name) {
        this.activityName = response.data.name
      }
    } catch (error) {
      // 活动名称失败不阻断打卡主流程。
    }
  }

  async loadChildren () {
    try {
      const response = await this.childrenService.getActivityChildren(this.activityId)
      if (!response.success || !response.data) {
        this.pageError = response.error || '用户加载失败'
        return
      }
      this.userSelectItems = response.data.filter((child) => Boolean(child.isEntry))
      this.currentChild = this.userSelectItems.find((child) => child.userId === this.requestedChildId) ||
        this.userSelectItems[0] || new ActivityChild()
      if (!this.currentChild.userId) {
        this.pageError = '暂无已报名用户，请先完成报名'
      }
    } catch (error) {
      this.pageError = '用户加载失败，请检查网络'
    }
  }

  async loadPoints (showLoading = true) {
    if (!this.currentChild.userId) return
    if (showLoading) this.loading = true
    try {
      const response = await this.checkInService.getPoints(
        this.activityId,
        this.currentChild.userId,
        false
      )
      if (!response.success || !response.data) {
        const errorInfo = getCheckInErrorInfo(response.code, response.error)
        this.pageError = errorInfo.message
        return
      }
      this.snapshot = response.data
      this.points = response.data.points
      this.pageError = ''
    } catch (error) {
      this.pageError = '打卡地点加载失败，请检查网络'
    } finally {
      if (showLoading) this.loading = false
    }
  }

  async refreshPage () {
    if (this.refreshing) return
    this.refreshing = true
    this.pageError = ''
    if (!this.currentChild.userId) await this.loadChildren()
    await this.loadPoints(false)
    this.refreshing = false
  }

  openParticipantSelector () {
    if (this.userSelectItems.length <= 1) return
    if (this.busyPointId || this.showPhotoPanel) {
      uni.showToast({ title: '请先完成当前打卡操作', icon: 'none' })
      return
    }
    this.showParticipantSelector = true
  }

  async selectParticipant (event: any) {
    const action = event && event.detail ? event.detail : event
    const child = this.userSelectItems.find((item) => item.userId === String(action.userId || ''))
    this.showParticipantSelector = false
    if (!child || child.userId === this.currentChild.userId) return

    this.currentChild = child
    this.requestedChildId = child.userId
    this.attempts = {}
    this.activeAttempt = new CheckInAttempt()
    this.snapshot = new CheckInPointListResult()
    this.points = []
    await this.loadPoints()
  }

  async startCheckIn (point: CheckInPoint) {
    if (this.busyPointId || point.status !== CheckInPointStatus.AVAILABLE) return
    const previousAttempt = this.attempts[point.id]
    this.activeAttempt = previousAttempt || new CheckInAttempt(point.id, getUUID())
    this.attempts[point.id] = this.activeAttempt

    if (previousAttempt && previousAttempt.location) {
      if (previousAttempt.errorCode === 'CHECK_IN_OUT_OF_RANGE' ||
        previousAttempt.errorCode === 'CHECK_IN_LOCATION_INACCURATE') {
        await this.locateActiveAttempt(point)
      } else if (point.photoRequired) {
        this.showPhotoPanel = true
      } else {
        await this.submitActiveAttempt()
      }
      return
    }
    await this.locateActiveAttempt(point)
  }

  async locateActiveAttempt (providedPoint?: CheckInPoint) {
    const point = providedPoint || this.findPoint(this.activeAttempt.pointId)
    if (!point) return
    this.activeAttempt.stage = CheckInAttemptStage.LOCATING
    this.activeAttempt.errorCode = ''
    this.activeAttempt.errorMessage = ''
    uni.showLoading({ title: '正在定位', mask: true })
    let locationLoadingVisible = true

    try {
      const location = await this.locationService.getCurrentLocation()
      uni.hideLoading()
      locationLoadingVisible = false
      this.activeAttempt.location = location
      const measuredDistance = calculateDistanceMeter(location, point)
      if (isOutOfRange(location, point, point.radiusMeter)) {
        this.rejectOutOfRange(
          measuredDistance,
          point.radiusMeter,
          location.accuracyMeter
        )
        return
      }

      this.activeAttempt.stage = point.photoRequired
        ? CheckInAttemptStage.PHOTO
        : CheckInAttemptStage.IDLE
      if (point.photoRequired) {
        this.showPhotoPanel = true
      } else {
        await this.submitActiveAttempt()
      }
    } catch (error) {
      this.activeAttempt.stage = CheckInAttemptStage.FAILED
      if (locationLoadingVisible) {
        uni.hideLoading()
        locationLoadingVisible = false
      }
      await this.handleLocationError(error)
    } finally {
      if (locationLoadingVisible) uni.hideLoading()
    }
  }

  async relocateActiveAttempt () {
    this.showPhotoPanel = false
    await this.locateActiveAttempt()
  }

  async submitActiveAttempt () {
    const point = this.findPoint(this.activeAttempt.pointId)
    const location = this.activeAttempt.location
    if (!point || !location || this.activeAttempt.stage === CheckInAttemptStage.SUBMITTING) return
    if (point.photoRequired && !this.activeAttempt.photoUrl) {
      this.activeAttempt.errorMessage = '请先上传打卡照片'
      this.showPhotoPanel = true
      return
    }

    const request = new CheckInSubmitRequest()
    request.latitude = location.latitude
    request.longitude = location.longitude
    request.accuracyMeter = location.accuracyMeter
    request.photoUrl = this.activeAttempt.photoUrl
    request.requestId = this.activeAttempt.requestId
    this.activeAttempt.stage = CheckInAttemptStage.SUBMITTING
    this.activeAttempt.errorCode = ''
    this.activeAttempt.errorMessage = ''

    try {
      const response = await this.checkInService.submit(
        this.activityId,
        this.currentChild.userId,
        point.id,
        request
      )
      if (!response.success || !response.data) {
        await this.handleSubmitError(response.code, response.error)
        return
      }
      this.applySubmitResult(point, response.data)
    } catch (error) {
      this.activeAttempt.stage = CheckInAttemptStage.FAILED
      this.activeAttempt.errorMessage = '网络异常，提交结果可能已生效，请使用原请求重试'
      if (point.photoRequired) {
        this.showPhotoPanel = true
      } else {
        this.confirmNetworkRetry()
      }
    }
  }

  applySubmitResult (point: CheckInPoint, result: CheckInSubmitResult) {
    const wasCompleted = point.status === CheckInPointStatus.COMPLETED
    point.status = CheckInPointStatus.COMPLETED
    point.checkedInAt = result.checkedInAt
    point.photoUrl = this.activeAttempt.photoUrl
    this.snapshot.answerScore = result.answerScore
    this.snapshot.checkInScore = result.checkInScore
    this.snapshot.totalScore = result.totalScore
    if (!wasCompleted) this.snapshot.completedCount += 1
    this.activeAttempt.stage = CheckInAttemptStage.SUCCESS
    this.showPhotoPanel = false
    uni.$emit('activity-check-in-success', {
      activityId: this.activityId,
      childId: this.currentChild.userId
    })

    const pendingText = result.projectionRefreshPending
      ? '，排行榜积分正在同步'
      : ''
    uni.showModal({
      title: '打卡成功',
      content: `获得 ${this.formatScore(result.awardedScore)} 积分${pendingText}`,
      cancelText: '继续打卡',
      confirmText: '查看榜单',
      success: (modalResult) => {
        if (modalResult.confirm) {
          uni.navigateTo({ url: `/pages/rank/index?activityId=${this.activityId}` })
        }
      }
    })
  }

  async handleSubmitError (code: string, fallbackMessage: string) {
    const point = this.findPoint(this.activeAttempt.pointId)
    const errorInfo = getCheckInErrorInfo(code, fallbackMessage)
    this.activeAttempt.stage = CheckInAttemptStage.FAILED
    this.activeAttempt.errorCode = code
    this.activeAttempt.errorMessage = errorInfo.message

    if (errorInfo.replacePhoto) {
      this.activeAttempt.photoUrl = ''
      this.showPhotoPanel = Boolean(point && point.photoRequired)
    } else if (errorInfo.retryLocation) {
      if (point && point.photoRequired) {
        this.showPhotoPanel = true
      } else {
        this.confirmRelocate(errorInfo.message)
      }
    } else {
      uni.showToast({ title: errorInfo.message, icon: 'none', duration: 2600 })
    }

    if (errorInfo.refreshPoints) await this.loadPoints(false)
  }

  async handleLocationError (error: any) {
    const locationError = error instanceof LocationError
      ? error
      : new LocationError(LocationErrorCode.UNKNOWN, '定位失败，请稍后重试')
    this.activeAttempt.errorMessage = locationError.message
    if (locationError.code !== LocationErrorCode.PERMISSION_DENIED) {
      uni.showToast({ title: locationError.message, icon: 'none', duration: 2600 })
      return
    }

    const goToSetting = await this.showConfirm(
      '需要位置权限',
      '定位仅在您主动打卡时使用，请在设置中允许位置信息。',
      '去设置',
      '取消'
    )
    if (!goToSetting) return
    try {
      await this.locationService.openSetting()
      await this.locateActiveAttempt()
    } catch (settingError) {
      uni.showToast({ title: '未能打开设置，请稍后重试', icon: 'none' })
    }
  }

  rejectOutOfRange (
    measuredDistance: number,
    radiusMeter: number,
    accuracyMeter: number | null
  ) {
    const measured = Math.round(measuredDistance)
    const accuracy = accuracyMeter === null ? 0 : Math.round(accuracyMeter)
    const allowed = Math.round(calculateAllowedDistanceMeter(radiusMeter, accuracyMeter))
    this.activeAttempt.stage = CheckInAttemptStage.FAILED
    this.activeAttempt.errorCode = 'CHECK_IN_OUT_OF_RANGE'
    this.activeAttempt.errorMessage =
      `当前位置距打卡点约 ${measured} 米，超过允许范围 ${allowed} 米` +
      `（打卡半径 ${radiusMeter} 米 + 定位精度 ${accuracy} 米）`

    if (this.activeAttempt.photoUrl) {
      this.showPhotoPanel = true
      return
    }
    uni.showModal({
      title: '不在打卡范围',
      content: `${this.activeAttempt.errorMessage}，请靠近打卡点后重新定位。`,
      showCancel: false,
      confirmText: '知道了'
    })
  }

  confirmRelocate (message: string) {
    uni.showModal({
      title: '需要重新定位',
      content: message,
      cancelText: '稍后再试',
      confirmText: '重新定位',
      success: (result) => {
        if (result.confirm) this.relocateActiveAttempt()
      }
    })
  }

  confirmNetworkRetry () {
    uni.showModal({
      title: '提交结果待确认',
      content: this.activeAttempt.errorMessage,
      cancelText: '稍后刷新',
      confirmText: '原请求重试',
      success: (result) => {
        if (result.confirm) this.submitActiveAttempt()
      }
    })
  }

  showConfirm (
    title: string,
    content: string,
    confirmText: string,
    cancelText: string
  ): Promise<boolean> {
    return new Promise((resolve) => {
      uni.showModal({
        title,
        content,
        confirmText,
        cancelText,
        success: (result) => resolve(Boolean(result.confirm)),
        fail: () => resolve(false)
      })
    })
  }

  onPhotoSelected (filePath: string) {
    this.activeAttempt.localPhotoPath = filePath
    this.activeAttempt.errorMessage = ''
  }

  onPhotoUploaded (photoUrl: string) {
    this.activeAttempt.photoUrl = photoUrl
    this.activeAttempt.errorMessage = ''
    this.activeAttempt.stage = CheckInAttemptStage.PHOTO
  }

  onPhotoUploadError (message: string) {
    this.activeAttempt.errorMessage = message
    this.activeAttempt.stage = CheckInAttemptStage.FAILED
  }

  closePhotoPanel () {
    if (this.activeAttempt.stage === CheckInAttemptStage.SUBMITTING) return
    this.showPhotoPanel = false
    this.activeAttempt.stage = CheckInAttemptStage.FAILED
  }

  openPointLocation (point: CheckInPoint) {
    uni.openLocation({
      latitude: point.latitude,
      longitude: point.longitude,
      name: point.name,
      address: point.address,
      scale: 16
    })
  }

  findPoint (pointId: string): CheckInPoint | undefined {
    return this.points.find((point) => point.id === pointId)
  }

  formatScore (score: number): string {
    if (!Number.isFinite(score)) return '0'
    return Number(score.toFixed(4)).toString()
  }

  goToLogin () {
    const target = `/checkin-pages/location/CheckInPage?activityId=${this.activityId}&childId=${this.requestedChildId}`
    const pathKey = encodeURIComponent(JSON.stringify(target))
    uni.redirectTo({
      url: `/pages/login/index?pathKey=${pathKey}`
    })
  }
}
</script>

<style scoped lang="scss">
.check-in-page,
.page-scroll {
  height: 100%;
}

.check-in-page {
  color: #272a30;
  background: #f3f5f8;
}

.page-content {
  padding: 24rpx 24rpx calc(48rpx + env(safe-area-inset-bottom));
}

.hero-card {
  position: relative;
  padding: 34rpx 32rpx 30rpx;
  border-radius: 34rpx;
  color: #fff;
  background: linear-gradient(145deg, #8e141e, #c7202c 58%, #df3a36);
  box-shadow: 0 18rpx 42rpx rgba(139, 20, 30, 0.24);
  overflow: hidden;
}

.hero-card::after {
  content: '';
  position: absolute;
  width: 360rpx;
  height: 360rpx;
  right: -150rpx;
  top: -190rpx;
  border: 60rpx solid rgba(255, 255, 255, 0.06);
  border-radius: 50%;
}

.hero-topline {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.hero-kicker {
  color: #f6d78f;
  font-size: 22rpx;
  letter-spacing: 3rpx;
}

.hero-title {
  max-width: 450rpx;
  margin-top: 12rpx;
  font-size: 38rpx;
  line-height: 1.35;
  font-weight: 700;
}

.participant-chip {
  position: relative;
  z-index: 3;
  display: flex;
  align-items: center;
  padding: 10rpx 16rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.26);
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.12);
  font-size: 22rpx;
}

.participant-chip-text {
  margin-right: 6rpx;
}

.train-scene {
  position: relative;
  z-index: 2;
  height: 178rpx;
  margin-top: 22rpx;
}

.train {
  position: absolute;
  left: 2rpx;
  right: 2rpx;
  bottom: 38rpx;
  display: flex;
  align-items: flex-end;
}

.train-engine,
.train-car {
  position: relative;
  height: 80rpx;
  border: 4rpx solid #f5d486;
  border-radius: 14rpx 14rpx 8rpx 8rpx;
  background: #fff9ec;
  box-shadow: inset 0 -16rpx 0 #d29b3e;
}

.train-engine {
  width: 132rpx;
  margin-right: 14rpx;
  border-radius: 38rpx 18rpx 8rpx 8rpx;
}

.train-engine::before {
  content: '';
  position: absolute;
  width: 34rpx;
  height: 34rpx;
  right: -20rpx;
  bottom: 0;
  border-radius: 0 22rpx 4rpx 0;
  background: #f1c36a;
}

.engine-window,
.car-window {
  position: absolute;
  top: 14rpx;
  width: 30rpx;
  height: 24rpx;
  border-radius: 6rpx;
  background: #7cbed4;
  box-shadow: inset 0 0 0 3rpx rgba(255, 255, 255, 0.4);
}

.engine-window {
  left: 36rpx;
}

.engine-light {
  position: absolute;
  right: 10rpx;
  top: 24rpx;
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
  background: #ffe496;
  box-shadow: 0 0 12rpx #ffe496;
}

.chimney {
  position: absolute;
  width: 28rpx;
  height: 36rpx;
  left: 14rpx;
  top: -30rpx;
  border-radius: 6rpx 6rpx 0 0;
  background: #3b414b;
}

.train-car {
  flex: 1;
  margin-right: 12rpx;
}

.train-car:last-child {
  margin-right: 0;
}

.train-car .car-window:first-child {
  left: 18%;
}

.train-car .car-window:nth-child(2) {
  right: 18%;
}

.train-wheel {
  position: absolute;
  bottom: -21rpx;
  width: 24rpx;
  height: 24rpx;
  border: 6rpx solid #303640;
  border-radius: 50%;
  background: #e0e3e7;
}

.wheel-one,
.car-wheel-one {
  left: 20rpx;
}

.wheel-two,
.car-wheel-two {
  right: 18rpx;
}

.rail-line {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 15rpx;
  height: 6rpx;
  background: repeating-linear-gradient(90deg, #f0d499 0, #f0d499 28rpx, transparent 28rpx, transparent 40rpx);
}

.journey-row {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  margin-top: 8rpx;
  color: rgba(255, 255, 255, 0.78);
  font-size: 22rpx;
}

.journey-count {
  color: #fff;
  font-weight: 600;
}

.progress-track {
  position: relative;
  z-index: 2;
  height: 8rpx;
  margin-top: 12rpx;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.18);
  overflow: hidden;
}

.progress-value {
  height: 100%;
  border-radius: 999rpx;
  background: linear-gradient(90deg, #f0c260, #fff0b8);
  transition: width 0.3s ease;
}

.score-card {
  display: flex;
  align-items: center;
  margin-top: 22rpx;
  padding: 28rpx 14rpx;
  border-radius: 26rpx;
  background: #fff;
  box-shadow: 0 10rpx 30rpx rgba(44, 51, 69, 0.07);
}

.score-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.score-label {
  color: #949aa3;
  font-size: 22rpx;
}

.score-number {
  margin-top: 8rpx;
  color: #3b3f46;
  font-size: 34rpx;
  font-weight: 600;
}

.score-item--total .score-number {
  color: #c7202c;
}

.score-divider {
  width: 1rpx;
  height: 50rpx;
  background: #eceef1;
}

.section-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin: 40rpx 4rpx 22rpx;
}

.section-title {
  color: #262a30;
  font-size: 32rpx;
  font-weight: 600;
}

.section-subtitle {
  margin-top: 8rpx;
  color: #9a9fa7;
  font-size: 21rpx;
}

.filter-row {
  display: flex;
  padding: 5rpx;
  border-radius: 999rpx;
  background: #e9ecf0;
}

.filter-item {
  padding: 8rpx 15rpx;
  border-radius: 999rpx;
  color: #747a83;
  font-size: 20rpx;
}

.filter-item--active {
  color: #a71d26;
  background: #fff;
  box-shadow: 0 3rpx 10rpx rgba(50, 56, 70, 0.1);
}

.page-loading,
.empty-state,
.page-error {
  margin-top: 20rpx;
  padding: 80rpx 30rpx;
  border-radius: 24rpx;
  text-align: center;
  background: #fff;
}

.page-loading,
.empty-title {
  color: #969ca5;
  font-size: 25rpx;
}

.empty-train {
  margin-bottom: 18rpx;
  color: #c9a767;
  font-size: 48rpx;
}

.error-title {
  color: #b73038;
  font-size: 27rpx;
}

.error-action {
  margin-top: 12rpx;
  color: #9b7a4f;
  font-size: 22rpx;
}
</style>
