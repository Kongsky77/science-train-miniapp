<template>
  <view class="check-in-page">
    <view v-if="!completed" class="check-in-board">
      <view class="page-header">
        <view class="page-header-copy">
          <view class="page-eyebrow">科普场馆打卡</view>
          <view class="page-title">线下场馆打卡</view>
        </view>
        <image
          class="page-header-image"
          src="https://contentdevsa-blob.ai121.net/testcontainer/621684277780484154_621684965985304147.png"
          mode="aspectFit"
          aria-hidden="true"
        />
      </view>

      <view class="daily-limit-notice">
        <view class="daily-limit-label">每日打卡上限</view>
        <view class="daily-limit-copy">
          每名用户每日前2个场馆打卡可获得积分，超过2个仍计入有效打卡，但不再获得积分。
        </view>
      </view>

      <view v-if="pageError" class="page-error">
        <view>{{ pageError }}</view>
        <view class="action-button" @click="loadPoints">重新加载</view>
      </view>
      <view v-else-if="loadingPoints" class="page-error">正在读取服务端打卡点…</view>

      <template v-else>
        <view class="section">
          <view class="section-title">选择并校验场馆</view>
          <view class="venue-selector" @click="openVenueSelector">
            <view class="venue-selector-content">
              <view :class="['venue-selector-name', selectedVenue ? '' : 'is-placeholder']">
                {{ selectedVenue ? selectedVenue.name : "请选择打卡场馆" }}
              </view>
              <view v-if="selectedVenue" class="venue-selector-meta">
                {{ selectedVenue.address }} · 校验范围 {{ selectedVenue.radiusMeter }} 米
              </view>
              <view
                v-if="selectedVenue"
                :class="['venue-validation-status', locationStatusClass]"
              >
                {{ locationStatusText }}
              </view>
            </view>
            <view class="venue-selector-action">
              {{ locating ? "校验中…" : selectedVenue ? "更换 ›" : "选择 ›" }}
            </view>
          </view>
        </view>

        <view class="section photo-section">
          <view class="section-title">上传现场照片</view>
          <image v-if="photoPath" class="photo-preview" mode="aspectFill" :src="photoPath" />
          <view v-else class="photo-placeholder">{{ photoPlaceholderText }}</view>
          <view v-if="photoUrl" class="status-text">照片已上传，可以提交打卡。</view>
          <view class="button-row">
            <view
              :class="['action-button', canChoosePhoto ? '' : 'is-disabled']"
              @click="choosePhoto"
            >
              {{ photoActionText }}
            </view>
          </view>
        </view>

        <view v-if="alreadyCheckedIn" class="warning-text">
          服务端显示当前用户已完成该场馆打卡，请选择其他场馆。
        </view>
        <view
          :class="['submit-button', canSubmit ? '' : 'is-disabled']"
          @click="submitCheckIn"
        >
          {{ submitting ? "提交中..." : "提交打卡" }}
        </view>
      </template>
    </view>

    <view v-else class="result-board">
      <view class="result-mark">✓</view>
      <view class="result-title">打卡成功</view>
      <view class="result-line">用户：{{ activeParticipant && activeParticipant.name }}</view>
      <view class="result-line">场馆：{{ completedRecord && completedRecord.venueName }}</view>
      <view class="result-line">本次实际获得：{{ completedRecord && formatScore(completedRecord.awardedScore) }} 积分</view>
      <view class="result-line">当前总积分：{{ completedRecord && formatScore(completedRecord.totalPoints) }} 分</view>
      <view class="result-line">提交时间：{{ completedTime }}</view>
      <view class="prototype-tip result-tip">{{ ticketStatusText }}</view>

      <view class="submit-button lottery-result-action" @click="goToLottery">前往抽奖中心</view>
      <view class="submit-button secondary-result" @click="goToRank">查看积分和排行榜</view>
      <view class="submit-button secondary-result" @click="continueCheckIn">继续打卡</view>
      <view class="text-button" @click="goHome">返回首页</view>
    </view>

    <view v-if="venueSelectorVisible && !completed" class="venue-selector-mask" @click="closeVenueSelector">
      <view class="venue-selector-panel" @click.stop>
        <view class="venue-panel-header">
          <view>
            <view class="venue-panel-title">选择打卡场馆</view>
            <view class="venue-panel-count">共 {{ venues.length }} 个服务端打卡点</view>
          </view>
          <view
            class="venue-panel-close"
            role="button"
            aria-label="关闭场馆选择面板"
            @click="closeVenueSelector"
          >×</view>
        </view>

        <view class="venue-region-filter">
          <view
            v-for="region in regionOptions"
            :key="region"
            :class="['venue-region-filter-item', activeRegion === region ? 'is-active' : '']"
            @click="selectRegion(region)"
          >
            <text>{{ region }}</text>
            <text class="venue-region-filter-count">{{ regionCount(region) }}</text>
          </view>
        </view>

        <scroll-view scroll-y class="venue-panel-list">
          <view v-if="filteredVenues.length === 0" class="venue-panel-empty">
            该地区暂无可打卡场馆
          </view>
          <view
            v-for="venue in filteredVenues"
            :key="venue.id"
            :class="[
              'venue-panel-item',
              selectedVenue && selectedVenue.id === venue.id ? 'is-selected' : '',
              venue.status === statusEnum.AVAILABLE ? '' : 'is-unavailable'
            ]"
            @click="selectVenueFromPanel(venue)"
          >
            <view class="venue-panel-main">
              <view class="venue-panel-name">{{ venue.name }}</view>
              <view class="venue-panel-address">{{ venue.address }}</view>
            </view>
            <view :class="['venue-state', venue.status === statusEnum.COMPLETED ? 'is-completed' : '']">
              {{ venueStateText(venue) }}
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CheckInPoint from "@/beans/check-in/CheckInPoint";
import CheckInPointListResult from "@/beans/check-in/CheckInPointListResult";
import CheckInSubmitRequest from "@/beans/check-in/CheckInSubmitRequest";
import LocationResult from "@/beans/check-in/LocationResult";
import CheckInPointStatus from "@/definition/check-in/CheckInPointStatus";
import { SCIENCE_TRAIN_ACTIVITY_ID } from "@/definition/scienceTrain/ScienceTrainConfig";
import ScienceTrainParticipantManagement from "@/management/scienceTrain/ScienceTrainParticipantManagement";
import CheckInPhotoService from "@/service/CheckInPhotoService";
import CheckInService from "@/service/CheckInService";
import LocationService, { LocationError, LocationErrorCode } from "@/service/LocationService";
import ScienceTrainLotteryService from "@/service/ScienceTrainLotteryService";
import ScienceTrainParticipantService from "@/service/ScienceTrainParticipantService";
import { getCheckInErrorInfo } from "@/utils/check-in/CheckInErrorMapper";
import {
  countTodayCheckIns,
  DAILY_SCORED_CHECK_IN_LIMIT,
} from "@/utils/check-in/DailyCheckInLimit";
import { calculateDistanceMeter, isOutOfRange } from "@/utils/check-in/Distance";
import {
  CHECK_IN_REGION_OPTIONS,
  resolveCheckInRegion,
} from "@/utils/check-in/CheckInRegion";
import { getUUID } from "@/utils/Weapon";

type CheckInRegion = "四川" | "重庆" | "贵州";
type CheckInRegionFilter = "全部" | CheckInRegion;

interface CheckInParticipant {
  id: string;
  name: string;
}

interface CompletedCheckInRecord {
  pointId: string;
  venueName: string;
  awardedScore: number;
  totalPoints: number;
  distanceMeter: number;
  checkedInAt: string | null;
  projectionRefreshPending: boolean;
}

@Component({ name: "KjgCheckInPage" })
export default class KjgCheckInPage extends Vue {
  private readonly participantService = new ScienceTrainParticipantService();
  private readonly checkInService = new CheckInService();
  private readonly photoService = new CheckInPhotoService();
  private readonly locationService = new LocationService();
  private readonly lotteryService = new ScienceTrainLotteryService();

  activeParticipant: CheckInParticipant | null = null;
  snapshot = new CheckInPointListResult();
  venues: CheckInPoint[] = [];
  regionOptions: CheckInRegionFilter[] =
    CHECK_IN_REGION_OPTIONS.slice() as CheckInRegionFilter[];
  activeRegion: CheckInRegionFilter = "全部";
  selectedVenue: CheckInPoint | null = null;
  location: LocationResult | null = null;
  photoPath = "";
  photoUrl = "";
  requestId = "";
  locating = false;
  uploadingPhoto = false;
  submitting = false;
  loadingPoints = false;
  locationVerified = false;
  locationInRange = false;
  distanceMeters = 0;
  completed = false;
  completedRecord: CompletedCheckInRecord | null = null;
  ticketStatusText = "正在同步探索券状态…";
  pageError = "";
  venueSelectorVisible = false;
  statusEnum = CheckInPointStatus;

  onLoad() {
    this.loadActiveParticipant();
  }

  async loadActiveParticipant() {
    const activeSubUserId = ScienceTrainParticipantManagement.getActiveSubUserId();
    if (!activeSubUserId) {
      this.showRegistrationRequired();
      return;
    }

    uni.showLoading({ title: "读取用户" });
    try {
      const response = await this.participantService.getRegisteredParticipants();
      if (!response.success || !Array.isArray(response.data)) {
        this.showParticipantLoadFailed(response.error || response.code || "用户接口返回失败");
        return;
      }
      const participant = response.data.find((item) => String(item.userId) === activeSubUserId);
      if (!participant) {
        ScienceTrainParticipantManagement.clearActiveSubUserId();
        this.showRegistrationRequired();
        return;
      }
      this.activeParticipant = {
        id: String(participant.userId),
        name: participant.realName || "未命名用户",
      };
      await this.loadPoints();
    } catch (error) {
      this.showParticipantLoadFailed("网络请求失败，请检查网络后重试");
    } finally {
      uni.hideLoading();
    }
  }

  async loadPoints() {
    if (!this.activeParticipant || this.loadingPoints) return;
    this.loadingPoints = true;
    this.pageError = "";
    try {
      const response = await this.checkInService.getPoints(
        SCIENCE_TRAIN_ACTIVITY_ID,
        this.activeParticipant.id,
        false
      );
      if (!response.success || !response.data) {
        const info = getCheckInErrorInfo(response.code, response.error);
        this.pageError = info.message;
        return;
      }
      if (!response.data.enabled) {
        this.pageError = "活动打卡暂未开放";
        this.snapshot = response.data;
        this.venues = response.data.points;
        return;
      }
      this.snapshot = response.data;
      this.venues = response.data.points;
      if (this.selectedVenue) {
        this.selectedVenue = this.venues.find((item) => item.id === this.selectedVenue!.id) || null;
      }
    } catch (error) {
      this.pageError = "打卡地点加载失败，请检查网络";
    } finally {
      this.loadingPoints = false;
    }
  }

  showParticipantLoadFailed(message: string) {
    uni.showModal({
      title: "用户读取失败",
      content: message,
      cancelText: "返回",
      confirmText: "重试",
      success: (result) => result.confirm ? this.loadActiveParticipant() : uni.navigateBack({ delta: 1 }),
    });
  }

  showRegistrationRequired() {
    uni.showModal({
      title: "请先完成报名",
      content: "打卡积分需要记录到已报名用户名下。",
      cancelText: "返回",
      confirmText: "去报名",
      success: (result) => {
        if (result.confirm) {
          uni.redirectTo({ url: "/pages/kjgActivityDetail/index?openRegistration=1" });
        } else {
          uni.navigateBack({ delta: 1 });
        }
      },
    });
  }

  get alreadyCheckedIn(): boolean {
    return !!this.selectedVenue && this.selectedVenue.status === CheckInPointStatus.COMPLETED;
  }

  get todayCompletedVenueCount(): number {
    return countTodayCheckIns(this.venues);
  }

  get hasReachedDailyScoreLimit(): boolean {
    return this.todayCompletedVenueCount >= DAILY_SCORED_CHECK_IN_LIMIT;
  }

  get filteredVenues(): CheckInPoint[] {
    if (this.activeRegion === "全部") return this.venues;
    return this.venues.filter(
      (venue) => resolveCheckInRegion(venue) === this.activeRegion
    );
  }

  regionCount(region: CheckInRegionFilter): number {
    if (region === "全部") return this.venues.length;
    return this.venues.filter(
      (venue) => resolveCheckInRegion(venue) === region
    ).length;
  }

  selectRegion(region: CheckInRegionFilter) {
    this.activeRegion = region;
  }

  get canSubmit(): boolean {
    return !!(
      this.activeParticipant &&
      this.selectedVenue &&
      this.selectedVenue.status === CheckInPointStatus.AVAILABLE &&
      this.location &&
      this.locationVerified &&
      this.locationInRange &&
      (!this.selectedVenue.photoRequired || this.photoUrl) &&
      !this.uploadingPhoto &&
      !this.submitting
    );
  }

  get locationStatusText(): string {
    if (!this.selectedVenue) return "请先选择场馆。";
    if (this.locating) return "正在校验当前位置…";
    if (!this.locationVerified) return "位置校验未完成，请重新选择场馆。";
    if (this.locationInRange) {
      return `位置校验通过，距离打卡点约 ${this.distanceMeters} 米。`;
    }
    return `当前位置距离打卡点约 ${this.distanceMeters} 米，不在允许范围内。`;
  }

  get locationStatusClass(): string {
    if (this.locating) return "is-pending";
    if (this.locationVerified && this.locationInRange) return "is-success";
    if (this.locationVerified) return "is-error";
    return "";
  }

  get canChoosePhoto(): boolean {
    return !!(
      this.selectedVenue &&
      this.selectedVenue.photoRequired &&
      this.locationVerified &&
      this.locationInRange &&
      !this.uploadingPhoto &&
      !this.submitting
    );
  }

  get photoPlaceholderText(): string {
    if (!this.selectedVenue) {
      return "选择场馆并通过位置校验后即可拍照（最大 5MB）";
    }
    if (!this.selectedVenue.photoRequired) return "该场馆无需上传现场照片";
    if (this.locating) return "正在校验位置，通过后即可拍照";
    if (!this.locationVerified || !this.locationInRange) {
      return "位置校验通过后即可拍照（最大 5MB）";
    }
    return "尚未选择照片（最大 5MB）";
  }

  get photoActionText(): string {
    if (this.uploadingPhoto) return "上传中...";
    if (this.photoPath) return "重新拍摄或选择";
    if (!this.selectedVenue) return "请先选择场馆";
    if (!this.selectedVenue.photoRequired) return "无需上传照片";
    if (this.locating) return "正在校验位置…";
    if (!this.locationVerified || !this.locationInRange) {
      return "通过位置校验后拍照";
    }
    return "拍照或从相册选择";
  }

  get completedTime(): string {
    if (!this.completedRecord || !this.completedRecord.checkedInAt) return "";
    const date = new Date(Number(this.completedRecord.checkedInAt));
    if (!Number.isFinite(date.getTime())) return this.completedRecord.checkedInAt;
    const pad = (value: number) => String(value).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  openVenueSelector() {
    if (!this.submitting && !this.uploadingPhoto && !this.locating) {
      this.venueSelectorVisible = true;
    }
  }

  closeVenueSelector() {
    this.venueSelectorVisible = false;
  }

  async selectVenueFromPanel(venue: CheckInPoint) {
    if (venue.status !== CheckInPointStatus.AVAILABLE) {
      uni.showToast({ title: this.venueStateText(venue), icon: "none" });
      return;
    }
    const isNewSelection = !this.selectedVenue || this.selectedVenue.id !== venue.id;
    if (isNewSelection && this.hasReachedDailyScoreLimit) {
      const shouldContinue = await this.confirmContinueWithoutScore();
      if (!shouldContinue) return;
    }
    if (isNewSelection) {
      this.selectedVenue = venue;
      this.resetEvidence(true);
    }
    this.closeVenueSelector();
    await this.verifyLocation();
  }

  confirmContinueWithoutScore(): Promise<boolean> {
    return new Promise((resolve) => {
      uni.showModal({
        title: "今日打卡积分已达上限",
        content: `每天前${DAILY_SCORED_CHECK_IN_LIMIT}个场馆打卡可获得积分。本次仍可继续打卡，但不会获得积分。`,
        cancelText: "暂不打卡",
        confirmText: "继续打卡",
        success: (result) => resolve(!!result.confirm),
        fail: () => resolve(false),
      });
    });
  }

  venueStateText(venue: CheckInPoint): string {
    const labels = {
      [CheckInPointStatus.NOT_STARTED]: "未开始",
      [CheckInPointStatus.AVAILABLE]: "可打卡",
      [CheckInPointStatus.COMPLETED]: "已完成",
      [CheckInPointStatus.ENDED]: "已结束",
      [CheckInPointStatus.DISABLED]: "已停用",
    };
    return labels[venue.status] || "不可打卡";
  }

  resetEvidence(newAttempt = false) {
    this.photoPath = "";
    this.photoUrl = "";
    this.location = null;
    this.locationVerified = false;
    this.locationInRange = false;
    this.distanceMeters = 0;
    if (newAttempt) this.requestId = getUUID();
  }

  async verifyLocation() {
    if (!this.selectedVenue || this.locating || this.submitting) {
      if (!this.selectedVenue) uni.showToast({ title: "请先选择场馆", icon: "none" });
      return;
    }
    this.locating = true;
    try {
      const location = await this.locationService.getCurrentLocation();
      this.location = location;
      this.distanceMeters = Math.round(calculateDistanceMeter(location, this.selectedVenue));
      this.locationVerified = true;
      this.locationInRange = !isOutOfRange(location, this.selectedVenue, this.selectedVenue.radiusMeter);
      if (!this.locationInRange) {
        uni.showModal({
          title: "不在打卡范围",
          content: `当前距离约 ${this.distanceMeters} 米，请靠近场馆后重新选择该场馆校验。`,
          showCancel: false,
        });
      }
    } catch (error) {
      this.location = null;
      this.locationVerified = false;
      this.locationInRange = false;
      await this.handleLocationError(error);
    } finally {
      this.locating = false;
    }
  }

  async handleLocationError(error: any) {
    const locationError = error instanceof LocationError
      ? error
      : new LocationError(LocationErrorCode.UNKNOWN, "定位失败，请稍后重试");
    if (locationError.code !== LocationErrorCode.PERMISSION_DENIED) {
      uni.showToast({ title: locationError.message, icon: "none", duration: 2600 });
      return;
    }
    uni.showModal({
      title: "需要位置权限",
      content: "定位仅在您主动打卡时使用，请在设置中允许位置信息。",
      cancelText: "取消",
      confirmText: "去设置",
      success: async (result) => {
        if (!result.confirm) return;
        try {
          await this.locationService.openSetting();
        } catch (settingError) {
          uni.showToast({ title: "未能打开设置，请稍后重试", icon: "none" });
        }
      },
    });
  }

  choosePhoto() {
    if (!this.selectedVenue) {
      uni.showToast({ title: "请先选择场馆", icon: "none" });
      return;
    }
    if (!this.selectedVenue.photoRequired) {
      uni.showToast({ title: "该场馆无需上传照片", icon: "none" });
      return;
    }
    if (!this.locationVerified || !this.locationInRange) {
      uni.showToast({ title: "请先完成定位校验", icon: "none" });
      return;
    }
    if (this.uploadingPhoto || this.submitting) return;
    uni.chooseImage({
      count: 1,
      sizeType: ["compressed"],
      sourceType: ["camera", "album"],
      success: async (result: any) => {
        const filePath = result.tempFilePaths && result.tempFilePaths[0] || "";
        const size = result.tempFiles && result.tempFiles[0] && Number(result.tempFiles[0].size);
        if (!filePath) return;
        if (Number.isFinite(size) && size > 5 * 1024 * 1024) {
          uni.showToast({ title: "照片不能超过 5MB", icon: "none" });
          return;
        }
        this.photoPath = filePath;
        this.photoUrl = "";
        this.uploadingPhoto = true;
        uni.showLoading({ title: "上传照片", mask: true });
        try {
          this.photoUrl = await this.photoService.upload(
            filePath,
            SCIENCE_TRAIN_ACTIVITY_ID,
            this.activeParticipant!.id,
            this.selectedVenue!.id,
            this.requestId
          );
          uni.showToast({ title: "照片上传成功", icon: "success" });
        } catch (error) {
          uni.showToast({ title: "照片上传失败，请重试", icon: "none" });
        } finally {
          this.uploadingPhoto = false;
          uni.hideLoading();
        }
      },
    });
  }

  async submitCheckIn() {
    if (!this.canSubmit || !this.activeParticipant || !this.selectedVenue || !this.location) {
      const message = this.alreadyCheckedIn ? "该场馆已打卡" : "请先完成定位和照片上传";
      uni.showToast({ title: message, icon: "none" });
      return;
    }
    const point = this.selectedVenue;
    const request = new CheckInSubmitRequest();
    request.latitude = this.location.latitude;
    request.longitude = this.location.longitude;
    request.accuracyMeter = this.location.accuracyMeter;
    request.photoUrl = this.photoUrl;
    request.requestId = this.requestId;
    this.submitting = true;
    uni.showLoading({ title: "提交中", mask: true });
    try {
      const response = await this.checkInService.submit(
        SCIENCE_TRAIN_ACTIVITY_ID,
        this.activeParticipant.id,
        point.id,
        request
      );
      if (!response.success || !response.data) {
        await this.handleSubmitError(response.code, response.error);
        return;
      }
      const result = response.data;
      this.completedRecord = {
        pointId: result.pointId,
        venueName: point.name,
        awardedScore: result.awardedScore,
        totalPoints: result.activityPoints.totalPoints,
        distanceMeter: result.distanceMeter,
        checkedInAt: result.checkedInAt,
        projectionRefreshPending: result.activityPoints.projectionRefreshPending || result.projectionRefreshPending,
      };
      this.snapshot.activityPoints = result.activityPoints;
      this.completed = true;
      this.ticketStatusText = "正在同步探索券状态…";
      uni.$emit("activity-check-in-success", {
        activityId: SCIENCE_TRAIN_ACTIVITY_ID,
        childId: this.activeParticipant.id,
      });
      this.refreshAfterSuccess();
    } catch (error) {
      this.confirmNetworkRetry();
    } finally {
      this.submitting = false;
      uni.hideLoading();
    }
  }

  async handleSubmitError(code: string, fallbackMessage: string) {
    const info = getCheckInErrorInfo(code, fallbackMessage);
    if (info.replacePhoto) {
      this.photoPath = "";
      this.photoUrl = "";
    }
    if (info.retryLocation) {
      this.location = null;
      this.locationVerified = false;
      this.locationInRange = false;
    }
    if (code === "CHECK_IN_ALREADY_COMPLETED" || info.refreshPoints) await this.loadPoints();
    uni.showToast({ title: info.message, icon: "none", duration: 2600 });
  }

  confirmNetworkRetry() {
    uni.showModal({
      title: "提交结果待确认",
      content: "网络异常，结果可能已经生效。可使用原请求编号重试，服务端会保证幂等。",
      cancelText: "稍后刷新",
      confirmText: "原请求重试",
      success: (result) => {
        if (result.confirm) this.submitCheckIn();
        else this.loadPoints();
      },
    });
  }

  async refreshAfterSuccess() {
    await Promise.all([this.loadPoints(), this.refreshLotteryStatus()]);
  }

  async refreshLotteryStatus() {
    if (!this.activeParticipant) return;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      if (attempt > 0) await this.delay(attempt * 1000);
      try {
        const response = await this.lotteryService.getSummary(this.activeParticipant.id);
        if (response.success && response.data && response.data.offlineTicketGrantedToday) {
          const explorer = (response.data.ticketBalances || []).find((item) => item.ticketType === "EXPLORER");
          const quantity = explorer ? explorer.availableQuantity : "";
          this.ticketStatusText = quantity === "" ? "今日探索券状态已同步。" : `探索券已同步，当前可用 ${quantity} 张。`;
          return;
        }
      } catch (error) {
        // 打卡已成功，抽奖摘要短暂不可用时只做有限重试。
      }
    }
    this.ticketStatusText = "打卡已成功，探索券可能仍在同步，可前往抽奖中心刷新查看。";
  }

  delay(milliseconds: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }

  continueCheckIn() {
    this.completed = false;
    this.completedRecord = null;
    this.selectedVenue = null;
    this.ticketStatusText = "正在同步探索券状态…";
    this.resetEvidence(false);
    this.loadPoints();
  }

  formatScore(score: number): string {
    if (!Number.isFinite(score)) return "0";
    return Number(score.toFixed(4)).toString();
  }

  formatDistance(distance: number): string {
    return Number.isFinite(distance) ? Number(distance.toFixed(2)).toString() : "0";
  }

  goToRank() {
    uni.redirectTo({
      url:
        "/pages/rank/index?mode=scienceTrain&activityId=" +
        encodeURIComponent(SCIENCE_TRAIN_ACTIVITY_ID),
    });
  }

  goToLottery() {
    uni.navigateTo({ url: "/pages/kjgLottery/index" });
  }

  goHome() {
    uni.reLaunch({ url: "/pages/tab/index" });
  }
}
</script>

<style scoped lang="scss">
$blue: #165ddb;
$navy: #103873;
$teal: #078c83;
$paper: #fffdfa;
$mist: #edf5f7;
$line: #b9dce8;
$ink: #17233c;
$muted: #667085;

.check-in-page {
  box-sizing: border-box;
  min-height: 100vh;
  padding: 0 24rpx calc(36rpx + env(safe-area-inset-bottom));
  background: linear-gradient(180deg, #eef8fb 0, #fff 160rpx, #fffde9 100%);
  color: $ink;
  font-family: "PingFang SC", "Microsoft YaHei", Arial, sans-serif;
}

.check-in-board,
.result-board {
  box-sizing: border-box;
  min-height: calc(100vh - env(safe-area-inset-bottom) - 36rpx);
  padding: 30rpx 28rpx 42rpx;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, $paper 62%, #fffde9 100%);
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 126rpx;
  padding: 4rpx 2rpx 22rpx;
  border-bottom: 2rpx dashed #64bfff;
}

.page-header-copy {
  flex: 1;
  min-width: 0;
}

.page-eyebrow {
  color: #FAC12A;
  font-size: 21rpx;
  font-weight: 700;
  letter-spacing: 2rpx;
}

.page-title {
  margin-top: 10rpx;
  color: $navy;
  font-size: 42rpx;
  font-weight: 800;
  line-height: 1.25;
}

.page-header-image {
  flex: none;
  width: 178rpx;
  height: 112rpx;
  margin-left: 18rpx;
}

.daily-limit-notice {
  display: flex;
  align-items: center;
  margin: 22rpx 2rpx 0;
  padding: 18rpx 20rpx;
  border: 2rpx solid rgba(250, 193, 42, 0.5);
  border-radius: 16rpx;
  background: rgba(250, 193, 42, 0.1);
}

.daily-limit-label {
  flex: none;
  padding: 5rpx 12rpx;
  border-radius: 16rpx;
  background: #FAC12A;
  color: $navy;
  font-size: 21rpx;
  font-weight: 700;
  line-height: 1.35;
}

.daily-limit-copy {
  margin-left: 14rpx;
  color: $navy;
  font-size: 24rpx;
  line-height: 1.55;
}

.page-error {
  margin-top: 26rpx;
  padding: 26rpx;
  border: 2rpx dashed $line;
  border-radius: 18rpx;
  background: #f8fcfd;
  color: $muted;
  font-size: 25rpx;
  line-height: 1.6;
  text-align: center;
}

.page-error .action-button {
  margin-top: 20rpx;
}

.prototype-tip,
.status-text,
.result-line {
  color: $muted;
  font-size: 25rpx;
  line-height: 1.6;
}

.prototype-tip {
  margin-top: 12rpx;
}

.section {
  position: relative;
  margin-top: 0;
  padding: 28rpx 4rpx;
  border-bottom: 2rpx dashed rgba(100, 191, 255, 0.78);
  background: transparent;
}

.section-title {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
  color: $navy;
  font-size: 29rpx;
  font-weight: 700;
}

.button-row {
  display: flex;
  margin-top: 18rpx;
}

.action-button,
.submit-button {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 84rpx;
  padding: 18rpx 24rpx;
  border: 2rpx solid $blue;
  border-radius: 42rpx;
  font-size: 27rpx;
  font-weight: 700;
  text-align: center;
}

.action-button {
  flex: 1;
  min-width: 0;
  background: rgba(255, 253, 250, 0.84);
  color: $blue;
}

.action-button.is-disabled {
  border-color: $line;
  background: $mist;
  color: $muted;
}

.action-button:active,
.venue-selector:active {
  background: $mist;
}

.submit-button {
  margin-top: 28rpx;
  background: linear-gradient(135deg, #1685e8 0%, $blue 100%);
  box-shadow: 0 10rpx 24rpx rgba(22, 93, 219, 0.16);
  color: $paper;
}

.venue-selector {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 110rpx;
  padding: 20rpx;
  border: 2rpx solid rgba(185, 220, 232, 0.9);
  border-radius: 18rpx;
  background: rgba(255, 255, 255, 0.82);
  box-shadow: 0 6rpx 18rpx rgba(31, 70, 112, 0.05);
}

.venue-selector-content,
.venue-panel-main {
  flex: 1;
  min-width: 0;
}

.venue-selector-name {
  color: $ink;
  font-size: 28rpx;
  font-weight: 700;
  line-height: 1.4;
}

.venue-selector-name.is-placeholder {
  color: $muted;
  font-weight: 600;
}

.venue-selector-meta {
  margin-top: 7rpx;
  overflow: hidden;
  color: $muted;
  font-size: 21rpx;
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.venue-validation-status {
  margin-top: 8rpx;
  color: $muted;
  font-size: 21rpx;
  line-height: 1.45;
}

.venue-validation-status.is-pending {
  color: $blue;
}

.venue-validation-status.is-success {
  color: #FAC12A;
  font-weight: 600;
}

.venue-validation-status.is-error {
  color: #a33f35;
}

.venue-selector-action {
  flex: none;
  margin-left: 18rpx;
  color: $blue;
  font-size: 23rpx;
  font-weight: 700;
}

.compact-venue-guide {
  margin-top: 16rpx;
  padding: 18rpx;
  border-radius: 16rpx;
  background: linear-gradient(135deg, rgba(22, 93, 219, 0.045), rgba(7, 140, 131, 0.07));
}

.check-in-task {
  padding-left: 16rpx;
  border-left: 5rpx solid $teal;
}

.introduction-label {
  color: $navy;
  font-size: 24rpx;
  font-weight: 700;
}

.introduction-text {
  margin-top: 7rpx;
  color: $muted;
  font-size: 23rpx;
  line-height: 1.65;
}

.photo-preview,
.photo-placeholder {
  box-sizing: border-box;
  width: 100%;
  height: 300rpx;
  margin-bottom: 16rpx;
  border: 2rpx solid $line;
  border-radius: 18rpx;
  background: $paper;
}

.photo-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  border-style: dashed;
  color: $muted;
  font-size: 25rpx;
}

.photo-placeholder.is-success {
  background: $mist;
  color: #FAC12A;
  font-weight: 600;
}

.warning-text {
  margin-top: 24rpx;
  padding: 18rpx 20rpx;
  border: 2rpx solid rgba(212, 93, 80, 0.32);
  border-radius: 16rpx;
  background: rgba(212, 93, 80, 0.07);
  color: #a33f35;
  font-size: 24rpx;
  line-height: 1.55;
}

.submit-button.is-disabled {
  border-color: $line;
  background: $mist;
  box-shadow: none;
  color: $muted;
}

.result-board {
  padding-top: 58rpx;
  text-align: center;
}

.result-mark {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 112rpx;
  height: 112rpx;
  margin: 0 auto 26rpx;
  border-radius: 50%;
  background: rgba(7, 140, 131, 0.11);
  color: #FAC12A;
  font-size: 68rpx;
  font-weight: 700;
}

.result-title {
  color: $navy;
  font-size: 42rpx;
  font-weight: 800;
}

.result-line {
  margin-top: 14rpx;
}

.result-line:nth-of-type(3) {
  margin-top: 30rpx;
}

.result-tip {
  margin: 28rpx 0 0;
  padding: 18rpx;
  border-top: 2rpx dashed #64bfff;
  border-bottom: 2rpx dashed #64bfff;
  background: rgba(255, 255, 255, 0.42);
}

.lottery-result-action {
  margin-top: 34rpx;
}

.secondary-result {
  margin-top: 16rpx;
  background: rgba(255, 253, 250, 0.86);
  box-shadow: none;
  color: $blue;
}

.text-button {
  margin-top: 28rpx;
  color: $muted;
  font-size: 26rpx;
  text-decoration: underline;
}

.venue-selector-mask {
  position: fixed;
  z-index: 50;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: flex-end;
  background: rgba(16, 30, 55, 0.48);
}

.venue-selector-panel {
  box-sizing: border-box;
  width: 100%;
  max-height: 82vh;
  padding: 26rpx 24rpx calc(24rpx + env(safe-area-inset-bottom));
  border-radius: 30rpx 30rpx 0 0;
  background: $paper;
  box-shadow: 0 -12rpx 40rpx rgba(16, 56, 115, 0.14);
}

.venue-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4rpx 4rpx 12rpx;
}

.venue-panel-title {
  color: $navy;
  font-size: 34rpx;
  font-weight: 800;
}

.venue-panel-count {
  margin-top: 6rpx;
  color: $muted;
  font-size: 22rpx;
}

.venue-panel-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 62rpx;
  height: 62rpx;
  border: 2rpx solid $line;
  border-radius: 50%;
  color: $navy;
  font-family: Arial, sans-serif;
  font-size: 38rpx;
  line-height: 1;
}

.venue-region-filter {
  display: flex;
  margin-top: 14rpx;
  padding: 6rpx;
  border: 2rpx solid rgba(185, 220, 232, 0.76);
  border-radius: 40rpx;
  background: rgba(255, 253, 250, 0.9);
}

.venue-region-filter-item {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  min-width: 0;
  min-height: 62rpx;
  border-radius: 32rpx;
  color: $muted;
  font-size: 23rpx;
  font-weight: 700;
}

.venue-region-filter-item.is-active {
  background: $blue;
  color: $paper;
}

.venue-region-filter-count {
  margin-left: 6rpx;
  font-size: 18rpx;
  opacity: 0.74;
}

.venue-panel-list {
  height: 720rpx;
  max-height: 52vh;
  margin-top: 16rpx;
  border-top: 2rpx dashed rgba(22, 93, 219, 0.28);
}

.venue-panel-empty {
  padding: 72rpx 20rpx;
  color: $muted;
  font-size: 24rpx;
  text-align: center;
}

.venue-panel-item {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 116rpx;
  padding: 22rpx 8rpx;
  border-bottom: 2rpx dashed rgba(22, 93, 219, 0.28);
  background: transparent;
}

.venue-panel-item.is-selected {
  background: rgba(22, 93, 219, 0.045);
  box-shadow: inset 4rpx 0 0 $blue;
}

.venue-panel-item.is-unavailable {
  color: $muted;
  opacity: 0.72;
}

.venue-panel-name {
  color: $ink;
  font-size: 27rpx;
  font-weight: 700;
  line-height: 1.4;
}

.venue-panel-address {
  margin-top: 7rpx;
  overflow: hidden;
  color: $muted;
  font-size: 21rpx;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.venue-state {
  flex: none;
  margin-left: 16rpx;
  padding: 8rpx 13rpx;
  border: 2rpx solid rgba(22, 93, 219, 0.42);
  border-radius: 24rpx;
  color: $navy;
  font-size: 20rpx;
  font-weight: 700;
}

.venue-state.is-completed {
  border-color: $teal;
  background: $teal;
  color: $paper;
}

.venue-state.is-unavailable {
  border-color: rgba(102, 112, 133, 0.34);
  color: $muted;
}
</style>
