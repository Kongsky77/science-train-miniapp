<template>
  <view class="lottery-page">
    <view class="page-shell">
      <view class="page-header">
        <view class="page-header-copy">
          <view class="page-kicker">科普列车幸运站</view>
          <view class="page-title">抽奖中心</view>
        </view>
        <view class="page-header-side">
          <image
            class="page-header-image"
            src="/static/image/kjg-home/points.png"
            mode="aspectFit"
            aria-hidden="true"
          />
          <view
            class="records-action"
            role="button"
            :aria-label="recordsActionAriaLabel"
            @click="toggleRecords"
          >
            <text>{{ showRecords ? "返回抽奖" : "抽奖记录" }}</text>
            <view
              v-if="!showRecords && claimableRecordCount"
              class="records-claim-badge"
              aria-hidden="true"
            >{{ claimableRecordBadgeText }}</view>
          </view>
        </view>
      </view>

      <view v-if="!showRecords" class="draw-content">
        <view class="lottery-tabs">
          <view
            class="lottery-tab"
            :class="{ 'is-active': activeTicketType === 'EXPLORER' }"
            @click="selectTicket('EXPLORER')"
          >
            <view class="tab-title">科普探索券</view>
            <view v-if="explorerAvailableQuantity" class="tab-badge">
              {{ explorerAvailableQuantity }}
            </view>
          </view>
          <view
            class="lottery-tab"
            :class="{ 'is-active': activeTicketType === 'LEAP' }"
            @click="selectTicket('LEAP')"
          >
            <view class="tab-title">科普跃迁券</view>
            <view v-if="leapAvailableQuantity" class="tab-badge">
              {{ leapAvailableQuantity }}
            </view>
          </view>
        </view>

        <view v-if="lotteryStage === 'loading'" class="lottery-state-banner">
          正在读取抽奖券与奖池信息
        </view>
        <view
          v-else-if="lotteryStage === 'error'"
          class="lottery-state-banner is-error"
        >
          <view>{{ lotteryStateMessage }}</view>
          <view class="state-retry" @click="refreshLottery">重新加载</view>
        </view>

        <view v-else class="pool-meta">
          <view class="pool-meta-item">
            <view class="pool-meta-label">当前中奖率</view>
            <view class="pool-meta-value">{{ currentWinningProbability }}</view>
          </view>
          <view class="pool-meta-item">
            <view class="pool-meta-label">最高可得</view>
            <view class="pool-meta-value">{{ currentMaxCashText }}</view>
          </view>
        </view>

        <view
          class="ticket-machine"
          :class="{
            'is-processing': drawAnimationStage === 'processing',
            'is-ejecting': drawAnimationStage === 'ejecting',
            'has-result': showLatestResult,
            'is-winning':
              showLatestResult &&
              resultRecord &&
              resultRecord.drawStatus === 'WON'
          }"
        >
          <view class="machine-body">
            <view class="machine-heading">
              <view>
                <view class="machine-brand">科普列车幸运出票机</view>
                <view class="machine-route">川 · 渝 · 黔</view>
              </view>
              <view class="machine-status">
                <view class="machine-status-light"></view>
                <view>{{ machineStatusText }}</view>
              </view>
            </view>

            <view class="machine-display">
              <view class="machine-display-copy">
                <view class="display-ticket-type">{{ ticketCaption }}</view>
                <view class="display-draw-hint">
                  {{
                    isQuizRewardSyncing
                      ? "答题奖励到账后将自动更新"
                      : isLotteryBalanceLoading
                      ? "正在读取抽奖次数"
                      : isDrawing
                      ? machineStatusText
                      : "点击圆钮开始抽奖"
                  }}
                </view>
              </view>
              <view
                :class="[
                  'machine-draw-button',
                  canDraw ? '' : 'is-disabled',
                  isDrawing ? 'is-drawing' : '',
                  isLotteryBalanceLoading ? 'is-syncing' : ''
                ]"
                role="button"
                :aria-label="drawButtonAriaLabel"
                @click="startDraw"
              >
                <view
                  v-if="isLotteryBalanceLoading"
                  class="machine-draw-loading"
                  aria-hidden="true"
                ></view>
                <view v-else class="machine-draw-count">
                  {{ currentAvailableQuantity }}
                </view>
                <view class="machine-draw-label">
                  {{
                    isLotteryBalanceLoading
                      ? "同步中"
                      : isDrawing
                      ? "抽奖中"
                      : "次抽奖"
                  }}
                </view>
              </view>
            </view>

            <view class="machine-slot" aria-hidden="true">
              <view class="slot-roller is-left"></view>
              <view class="slot-track"></view>
              <view class="slot-roller is-right"></view>
            </view>
          </view>

          <view class="ticket-output" aria-live="polite">
            <view
              :class="[
                'result-ticket',
                canClaimResultTicket ? 'is-claimable' : ''
              ]"
              :aria-label="resultTicketAriaLabel"
              @click="handleTicketResultAction"
            >
              <image
                class="result-ticket-background"
                :src="ticketBackgroundUrl"
                mode="scaleToFill"
                aria-hidden="true"
              />
              <view
                v-if="isResultTicketClaiming"
                class="ticket-claim-stamp"
                aria-hidden="true"
              >领</view>
              <view class="ticket-caption">{{ ticketCaption }}</view>
              <view
                :class="[
                  'ticket-result-copy',
                  canClaimResultTicket || isResultTicketClaiming
                    ? 'has-claim-action'
                    : ''
                ]"
              >
                <view class="ticket-title">{{ ticketTitle }}</view>
                <view class="ticket-copy">{{ ticketCopy }}</view>
              </view>
              <view
                v-if="canClaimResultTicket || isResultTicketClaiming"
                :class="[
                  'ticket-claim-action',
                  isResultTicketClaiming ? 'is-opening' : ''
                ]"
              >
                <text class="ticket-claim-label">
                  {{
                    isResultTicketClaiming
                      ? "正在打开微信领取页…"
                      : "立即领取红包"
                  }}
                </text>
                <text v-if="!isResultTicketClaiming" class="ticket-claim-arrow"
                  >›</text
                >
              </view>
            </view>
          </view>

        </view>

        <view v-if="activeTicketType === 'EXPLORER'" class="conversion-panel">
          <view class="conversion-copy">
            <view class="conversion-title">探索券合成跃迁券</view>
            <view class="conversion-note">
              {{ conversionSourceQuantity }} 张探索券可合成 1
              张跃迁券，合成成功后将扣除对应探索券。
            </view>
          </view>
          <view
            :class="['conversion-action', canConvert ? '' : 'is-disabled']"
            @click="convertTickets"
          >
            {{ conversionActionText }}
          </view>
        </view>

      </view>

      <view v-else class="records-content">
        <view class="records-heading">
          <view class="records-title">抽奖记录</view>
          <view class="records-count">已加载 {{ drawRecords.length }} 条</view>
        </view>

        <view v-if="drawRecords.length" class="records-list">
          <view
            v-for="record in drawRecords"
            :key="record.id"
            class="record-item"
          >
            <view class="record-main">
              <view class="record-level">{{ record.prizeLevel }}</view>
              <view class="record-name">{{ record.prizeName }}</view>
              <view class="record-meta">
                {{ getRecordTypeText(record) }} ·
                {{ getRecordSourceText(record) }} ·
                {{ formatDrawTime(record.occurredAt) }}
              </view>
            </view>
            <view
              :class="[
                'record-status',
                isRecordClaimable(record) ? 'is-action' : '',
                claimingRecordId === record.id ? 'is-disabled' : ''
              ]"
              @click="handleRecordAction(record)"
            >
              {{
                claimingRecordId === record.id
                  ? "处理中"
                  : getRecordStatusText(record)
              }}
            </view>
          </view>
        </view>

        <view v-else class="records-empty">
          <view class="empty-mark">票</view>
          <view class="empty-title">暂无抽奖记录</view>
        </view>

        <view
          v-if="hasMoreRecords"
          :class="['records-load-more', recordsLoading ? 'is-disabled' : '']"
          @click="loadMoreRecords"
          >{{ recordsLoading ? "加载中" : "继续加载" }}</view
        >
      </view>

    </view>
  </view>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import {
  ScienceTrainLotteryDrawRecord,
  ScienceTrainLotterySummary,
  ScienceTrainLotteryTicketType
} from "@/beans/scienceTrain/ScienceTrainLottery";
import KjgMockAccount, { KjgLotteryType } from "@/common/utils/KjgMockAccount";
import { isMockMode } from "@/common/utils/MockMode";
import {
  canClaimScienceTrainCashRecord,
  canOpenScienceTrainMerchantTransfer,
  createScienceTrainLotteryRequestId,
  formatScienceTrainCashFen,
  formatScienceTrainProbability,
  getScienceTrainLotteryBalance,
  getScienceTrainRecordActionText,
  parseScienceTrainLotteryInteger,
  validateScienceTrainLotterySummary
} from "@/logic/scienceTrain/ScienceTrainLotteryLogic";
import ScienceTrainParticipantManagement from "@/management/scienceTrain/ScienceTrainParticipantManagement";
import ScienceTrainLotteryService from "@/service/ScienceTrainLotteryService";

interface LotteryDisplayRecord {
  id: string;
  ticketType: ScienceTrainLotteryTicketType;
  prizeLevel: string;
  prizeName: string;
  occurredAt: number;
  drawStatus: "WON" | "NOT_WON";
  fulfillmentStatus: string;
  realRecord?: ScienceTrainLotteryDrawRecord;
}

type DrawAnimationStage = "idle" | "processing" | "ejecting" | "revealed";

const QUIZ_REWARD_SYNC_DELAYS = [500, 1000, 1500, 2500];
const LOTTERY_ENTRY_LOADING_DURATION = 1000;

const NOWIN_TICKET_URL =
  "https://contentdevsa-blob.ai121.net/testcontainer/621684277780484154_622517413882884170.png";
const WIN_TICKET_URL =
  "https://contentdevsa-blob.ai121.net/testcontainer/621684277780484154_622516515292164167.png";

@Component({
  name: "KjgLotteryPage"
})
export default class KjgLotteryPage extends Vue {
  activeTicketType: ScienceTrainLotteryTicketType = "EXPLORER";
  explorerAvailableQuantity = 0;
  leapAvailableQuantity = 0;
  summary: ScienceTrainLotterySummary | null = null;
  drawRecords: LotteryDisplayRecord[] = [];
  revealedDraw: LotteryDisplayRecord | null = null;
  ejectingDraw: LotteryDisplayRecord | null = null;
  isDrawing = false;
  drawAnimationStage: DrawAnimationStage = "idle";
  isConverting = false;
  showRecords = false;
  activeParticipantId = "";
  lotteryStage = "loading";
  lotteryStateMessage = "抽奖服务加载失败，请稍后重试。";
  recordsLoading = false;
  hasMoreRecords = false;
  claimingRecordId = "";
  claimConfirmationRecordId = "";
  pendingDrawRequestId = "";
  pendingDrawTicketType: ScienceTrainLotteryTicketType | "" = "";
  pendingConversionRequestId = "";
  recordsRefreshTimer: any = null;
  drawRevealTimer: any = null;
  quizRewardSyncTimer: any = null;
  lotteryEntryLoadingTimer: any = null;
  quizRewardSyncAttempt = 0;
  shouldSyncQuizReward = false;
  isLotteryEntryLoading = true;
  recordsRefreshQueued = false;
  requestVersion = 0;
  private lotteryService = new ScienceTrainLotteryService();

  onLoad(options: { source?: string } = {}) {
    this.startLotteryEntryLoading();
    this.shouldSyncQuizReward = options.source === "quiz-completion";
    const mockParticipant = KjgMockAccount.getActiveParticipant();
    this.activeParticipantId = isMockMode()
      ? mockParticipant && KjgMockAccount.isRegistered(mockParticipant.id)
        ? mockParticipant.id
        : ""
      : ScienceTrainParticipantManagement.getActiveSubUserId();
    if (this.activeParticipantId) {
      return;
    }
    uni.showModal({
      title: "暂无抽奖资格",
      content: "请先登录、报名并完成六站答题或参与线下打卡。",
      showCancel: false,
      success: () => {
        uni.reLaunch({
          url: "/pages/tab/index"
        });
      }
    });
  }

  onShow() {
    if (!this.isDrawing) {
      this.revealedDraw = null;
      this.ejectingDraw = null;
      this.drawAnimationStage = "idle";
    }
    if (this.activeParticipantId) {
      this.$nextTick(() => {
        if (this.activeParticipantId) {
          this.refreshLottery();
        }
      });
    }
  }

  onUnload() {
    this.requestVersion += 1;
    this.recordsRefreshQueued = false;
    this.clearRecordsRefreshTimer();
    this.clearDrawRevealTimer();
    this.clearQuizRewardSyncTimer();
    this.clearLotteryEntryLoadingTimer();
  }

  get isRealLotteryMode(): boolean {
    return !isMockMode();
  }

  get currentAvailableQuantity(): number {
    return this.activeTicketType === "EXPLORER"
      ? this.explorerAvailableQuantity
      : this.leapAvailableQuantity;
  }

  get isQuizRewardSyncing(): boolean {
    return (
      this.isRealLotteryMode &&
      this.shouldSyncQuizReward &&
      this.lotteryStage !== "error"
    );
  }

  get isLotteryBalanceLoading(): boolean {
    return (
      this.isLotteryEntryLoading ||
      this.lotteryStage === "loading" ||
      this.isQuizRewardSyncing
    );
  }

  get drawButtonAriaLabel(): string {
    return this.isQuizRewardSyncing
      ? "正在同步答题获得的抽奖机会"
      : this.isLotteryBalanceLoading
      ? "正在同步抽奖次数"
      : `圆形抽奖按钮，按钮内显示剩余机会，当前 ${this.currentAvailableQuantity} 次`;
  }

  get canDraw(): boolean {
    const serverAllowsDraw =
      !this.isRealLotteryMode || !!(this.summary && this.summary.drawOpen);
    return (
      this.lotteryStage === "ready" &&
      serverAllowsDraw &&
      this.currentAvailableQuantity > 0 &&
      !this.isDrawing &&
      !this.isConverting &&
      !this.isLotteryBalanceLoading
    );
  }

  get showLatestResult(): boolean {
    return !!this.revealedDraw && !this.isDrawing;
  }

  get resultRecord(): LotteryDisplayRecord | null {
    return this.revealedDraw;
  }

  get canClaimResultTicket(): boolean {
    return !!(
      this.showLatestResult &&
      this.resultRecord &&
      this.isRecordClaimable(this.resultRecord) &&
      !this.claimingRecordId
    );
  }

  get isResultTicketClaiming(): boolean {
    if (!this.showLatestResult || !this.resultRecord || !this.claimingRecordId) {
      return false;
    }
    const recordId = this.resultRecord.realRecord
      ? String(this.resultRecord.realRecord.drawRecordId)
      : this.resultRecord.id;
    return recordId === this.claimingRecordId;
  }

  get claimableRecordCount(): number {
    return this.drawRecords.filter(record => this.isRecordClaimable(record)).length;
  }

  get claimableRecordBadgeText(): string {
    return this.claimableRecordCount > 99
      ? "99+"
      : String(this.claimableRecordCount);
  }

  get recordsActionAriaLabel(): string {
    if (this.showRecords) {
      return "返回抽奖";
    }
    return this.claimableRecordCount
      ? `抽奖记录，有 ${this.claimableRecordCount} 个待领取奖品`
      : "抽奖记录";
  }

  get resultTicketAriaLabel(): string {
    if (this.isResultTicketClaiming) {
      return "正在打开微信红包领取页面";
    }
    return this.canClaimResultTicket
      ? "中奖票根，点击领取现金红包"
      : "本次抽奖票根";
  }

  get ticketCaption(): string {
    return this.activeTicketType === "EXPLORER" ? "科普探索券" : "科普跃迁券";
  }

  get ticketBackgroundUrl(): string {
    const record =
      this.drawAnimationStage === "ejecting"
        ? this.ejectingDraw
        : this.resultRecord;
    return record && record.drawStatus === "WON"
      ? WIN_TICKET_URL
      : NOWIN_TICKET_URL;
  }

  get ticketTitle(): string {
    if (this.isDrawing) {
      return this.drawAnimationStage === "ejecting"
        ? "票根正在打印"
        : "正在核验抽奖券";
    }
    if (this.showLatestResult && this.resultRecord) {
      return this.resultRecord.prizeLevel;
    }
    if (this.lotteryStage === "loading") {
      return "正在读取抽奖券";
    }
    if (this.lotteryStage === "error") {
      return "抽奖服务暂不可用";
    }
    return this.currentAvailableQuantity > 0
      ? this.activeTicketType === "EXPLORER"
        ? "探索券已到账"
        : "跃迁券已到账"
      : this.activeTicketType === "EXPLORER"
      ? "暂无探索券"
      : "暂无跃迁券";
  }

  get ticketCopy(): string {
    if (this.isDrawing) {
      return this.drawAnimationStage === "ejecting" ? "请留意出票口" : "请稍候";
    }
    if (this.showLatestResult && this.resultRecord) {
      return this.resultRecord.prizeName;
    }
    if (this.currentAvailableQuantity > 0) {
      return "每次抽奖消耗 1 张券";
    }
    return this.activeTicketType === "EXPLORER"
      ? "每日答题达标或当天首次有效场馆打卡可获得"
      : "使用 3 张探索券合成 1 张跃迁券";
  }

  get machineStatusText(): string {
    if (this.drawAnimationStage === "processing") {
      return "正在核验";
    }
    if (this.drawAnimationStage === "ejecting") {
      return "正在出票";
    }
    if (this.drawAnimationStage === "revealed" && this.showLatestResult) {
      return "出票完成";
    }
    if (this.isLotteryBalanceLoading) {
      return "机会同步中";
    }
    if (this.lotteryStage === "loading") {
      return "信息同步中";
    }
    if (this.lotteryStage === "error") {
      return "暂不可用";
    }
    return this.canDraw ? "设备就绪" : "等待抽奖券";
  }

  get currentWinningProbability(): string {
    const balance = getScienceTrainLotteryBalance(
      this.summary,
      this.activeTicketType
    );
    return balance
      ? formatScienceTrainProbability(balance.winningProbabilityBasisPoints)
      : "--";
  }

  get currentMaxCashText(): string {
    const balance = getScienceTrainLotteryBalance(
      this.summary,
      this.activeTicketType
    );
    return balance
      ? `¥${formatScienceTrainCashFen(balance.maxCashAmountFen)}`
      : "--";
  }

  get conversionSourceQuantity(): number {
    const rule = this.summary && this.summary.conversionRule;
    return rule ? parseScienceTrainLotteryInteger(rule.sourceQuantity) || 3 : 3;
  }

  get canConvert(): boolean {
    const rule = this.summary && this.summary.conversionRule;
    return !!(
      this.isRealLotteryMode &&
      this.lotteryStage === "ready" &&
      this.summary &&
      this.summary.conversionOpen &&
      rule &&
      rule.conversionAvailable &&
      !this.isDrawing &&
      !this.isConverting
    );
  }

  get conversionActionText(): string {
    if (!this.isRealLotteryMode) {
      return "正式模式可合成";
    }
    if (this.isConverting) {
      return "合成中";
    }
    if (this.summary && !this.summary.conversionOpen) {
      return "暂未开放";
    }
    const missing = Math.max(
      0,
      this.conversionSourceQuantity - this.explorerAvailableQuantity
    );
    return missing > 0 ? `还差 ${missing} 张` : "立即合成";
  }

  refreshLottery() {
    if (!this.activeParticipantId) {
      return;
    }
    if (!this.isRealLotteryMode) {
      this.refreshMockLottery();
      return;
    }
    const requestVersion = ++this.requestVersion;
    this.lotteryStage = "loading";
    this.lotteryStateMessage = "抽奖服务加载失败，请稍后重试。";
    this.lotteryService
      .getSummary(this.activeParticipantId)
      .then(response => {
        if (requestVersion !== this.requestVersion) {
          return;
        }
        if (!response.success || !response.data) {
          this.lotteryStage = "error";
          this.lotteryStateMessage = this.getLotteryErrorMessage(
            response.code,
            response.error
          );
          return;
        }
        const validation = validateScienceTrainLotterySummary(response.data);
        if (!validation.valid) {
          this.lotteryStage = "error";
          this.lotteryStateMessage = "抽奖配置返回不完整，请稍后重试。";
          console.warn("[KJG] 抽奖摘要校验失败", validation.reason);
          return;
        }
        this.applySummary(response.data);
        this.lotteryStage = "ready";
        this.scheduleQuizRewardSync(response.data, requestVersion);
      })
      .catch(error => {
        if (requestVersion !== this.requestVersion) {
          return;
        }
        console.error("[KJG] 抽奖摘要加载失败", error);
        this.lotteryStage = "error";
        this.lotteryStateMessage = "网络连接失败，请检查网络后重新加载。";
      });
    this.loadFormalRecords(true);
  }

  scheduleQuizRewardSync(
    summary: ScienceTrainLotterySummary,
    requestVersion: number
  ) {
    if (!this.shouldSyncQuizReward) {
      return;
    }
    if (summary.onlineTicketGrantedToday === true) {
      this.shouldSyncQuizReward = false;
      this.clearQuizRewardSyncTimer();
      return;
    }
    if (
      summary.onlineTicketGrantedToday !== false ||
      this.quizRewardSyncAttempt >= QUIZ_REWARD_SYNC_DELAYS.length
    ) {
      this.shouldSyncQuizReward = false;
      return;
    }
    const delay = QUIZ_REWARD_SYNC_DELAYS[this.quizRewardSyncAttempt];
    this.quizRewardSyncAttempt += 1;
    this.clearQuizRewardSyncTimer();
    this.quizRewardSyncTimer = setTimeout(() => {
      this.quizRewardSyncTimer = null;
      if (
        requestVersion !== this.requestVersion ||
        !this.shouldSyncQuizReward
      ) {
        return;
      }
      this.lotteryService
        .getSummary(this.activeParticipantId)
        .then(response => {
          if (
            requestVersion !== this.requestVersion ||
            !this.shouldSyncQuizReward
          ) {
            return;
          }
          if (!response.success || !response.data) {
            this.scheduleQuizRewardSync(summary, requestVersion);
            return;
          }
          const validation = validateScienceTrainLotterySummary(response.data);
          if (!validation.valid) {
            this.scheduleQuizRewardSync(summary, requestVersion);
            return;
          }
          this.applySummary(response.data);
          this.lotteryStage = "ready";
          this.scheduleQuizRewardSync(response.data, requestVersion);
        })
        .catch(error => {
          console.warn("[KJG] 答题抽奖券余额同步重试失败", error);
          if (
            requestVersion === this.requestVersion &&
            this.shouldSyncQuizReward
          ) {
            this.scheduleQuizRewardSync(summary, requestVersion);
          }
        });
    }, delay);
  }

  clearQuizRewardSyncTimer() {
    if (!this.quizRewardSyncTimer) {
      return;
    }
    clearTimeout(this.quizRewardSyncTimer);
    this.quizRewardSyncTimer = null;
  }

  startLotteryEntryLoading() {
    this.clearLotteryEntryLoadingTimer();
    this.isLotteryEntryLoading = true;
    this.lotteryEntryLoadingTimer = setTimeout(() => {
      this.lotteryEntryLoadingTimer = null;
      this.isLotteryEntryLoading = false;
    }, LOTTERY_ENTRY_LOADING_DURATION);
  }

  clearLotteryEntryLoadingTimer() {
    if (!this.lotteryEntryLoadingTimer) {
      return;
    }
    clearTimeout(this.lotteryEntryLoadingTimer);
    this.lotteryEntryLoadingTimer = null;
  }

  refreshMockLottery() {
    const explorerSummary = KjgMockAccount.getLotterySummaryForParticipant(
      this.activeParticipantId,
      "pass"
    );
    const leapSummary = KjgMockAccount.getLotterySummaryForParticipant(
      this.activeParticipantId,
      "redPacket"
    );
    this.explorerAvailableQuantity = explorerSummary.availableChances;
    this.leapAvailableQuantity = leapSummary.availableChances;
    this.drawRecords = KjgMockAccount.getLotterySummaryForParticipant(
      this.activeParticipantId
    ).drawRecords.map(record => ({
      id: record.id,
      ticketType:
        KjgMockAccount.getDrawRecordLotteryType(record) === "redPacket"
          ? "LEAP"
          : "EXPLORER",
      prizeLevel: record.prizeLevel,
      prizeName: record.prizeName,
      occurredAt: record.drawnAt,
      drawStatus: "WON",
      fulfillmentStatus: "MOCK"
    }));
    this.lotteryStage = "ready";
    this.hasMoreRecords = false;
  }

  applySummary(summary: ScienceTrainLotterySummary) {
    this.summary = summary;
    const explorer = getScienceTrainLotteryBalance(summary, "EXPLORER");
    const leap = getScienceTrainLotteryBalance(summary, "LEAP");
    this.explorerAvailableQuantity = explorer
      ? parseScienceTrainLotteryInteger(explorer.availableQuantity)
      : 0;
    this.leapAvailableQuantity = leap
      ? parseScienceTrainLotteryInteger(leap.availableQuantity)
      : 0;
  }

  selectTicket(type: ScienceTrainLotteryTicketType) {
    if (this.isDrawing) {
      return;
    }
    this.activeTicketType = type;
    this.revealedDraw = null;
    this.ejectingDraw = null;
    this.drawAnimationStage = "idle";
  }

  toggleRecords() {
    if (this.isDrawing) {
      return;
    }
    this.showRecords = !this.showRecords;
    if (this.showRecords) {
      if (this.isRealLotteryMode) {
        this.loadFormalRecords(true);
      } else {
        this.refreshMockLottery();
      }
    } else {
      this.clearRecordsRefreshTimer();
    }
  }

  startDraw() {
    if (!this.canDraw) {
      return;
    }
    if (!this.isRealLotteryMode) {
      this.startMockDraw();
      return;
    }
    const requestId =
      this.pendingDrawRequestId &&
      this.pendingDrawTicketType === this.activeTicketType
        ? this.pendingDrawRequestId
        : createScienceTrainLotteryRequestId();
    this.pendingDrawRequestId = requestId;
    this.pendingDrawTicketType = this.activeTicketType;
    this.revealedDraw = null;
    this.isDrawing = true;
    this.drawAnimationStage = "processing";
    this.lotteryService
      .draw(this.activeParticipantId, this.activeTicketType, requestId)
      .then(response => {
        if (!response.success || !response.data || !response.data.drawRecord) {
          this.pendingDrawRequestId = "";
          this.pendingDrawTicketType = "";
          this.isDrawing = false;
          this.drawAnimationStage = "idle";
          this.showLotteryError(response.code, response.error);
          this.refreshLottery();
          return;
        }
        this.pendingDrawRequestId = "";
        this.pendingDrawTicketType = "";
        const displayRecord = this.toDisplayRecord(response.data.drawRecord);
        this.setCurrentAvailableQuantity(response.data.availableQuantity);
        this.prependDisplayRecord(displayRecord);
        this.ejectDrawResult(displayRecord, () => {
          this.refreshSummaryAfterMutation();
        });
      })
      .catch(error => {
        console.error("[KJG] 发起抽奖失败", error);
        this.isDrawing = false;
        this.drawAnimationStage = "idle";
        uni.showToast({
          title: "网络异常，再次点击将安全重试本次抽奖",
          icon: "none",
          duration: 3000
        });
      });
  }

  startMockDraw() {
    const mockType: KjgLotteryType =
      this.activeTicketType === "LEAP" ? "redPacket" : "pass";
    const record = KjgMockAccount.drawLotteryForParticipant(
      this.activeParticipantId,
      mockType
    );
    if (!record) {
      this.refreshLottery();
      uni.showToast({
        title: "暂无可用机会",
        icon: "none"
      });
      return;
    }
    const displayRecord: LotteryDisplayRecord = {
      id: record.id,
      ticketType: this.activeTicketType,
      prizeLevel: record.prizeLevel,
      prizeName: record.prizeName,
      occurredAt: record.drawnAt,
      drawStatus: "WON",
      fulfillmentStatus: "MOCK"
    };
    this.revealedDraw = null;
    this.isDrawing = true;
    this.drawAnimationStage = "processing";
    this.ejectDrawResult(displayRecord, () => {
      this.refreshLottery();
    });
  }

  ejectDrawResult(
    displayRecord: LotteryDisplayRecord,
    afterReveal?: () => void
  ) {
    this.clearDrawRevealTimer();
    this.ejectingDraw = displayRecord;
    this.drawAnimationStage = "ejecting";
    this.drawRevealTimer = setTimeout(() => {
      this.drawRevealTimer = null;
      this.isDrawing = false;
      this.revealedDraw = displayRecord;
      this.ejectingDraw = null;
      this.drawAnimationStage = "revealed";
      if (afterReveal) {
        afterReveal();
      }
    }, 920);
  }

  clearDrawRevealTimer() {
    if (this.drawRevealTimer) {
      clearTimeout(this.drawRevealTimer);
      this.drawRevealTimer = null;
    }
  }

  convertTickets() {
    if (!this.canConvert) {
      return;
    }
    const requestId =
      this.pendingConversionRequestId || createScienceTrainLotteryRequestId();
    this.pendingConversionRequestId = requestId;
    this.isConverting = true;
    this.lotteryService
      .convertTickets(this.activeParticipantId, requestId)
      .then(response => {
        if (!response.success || !response.data) {
          this.pendingConversionRequestId = "";
          this.showLotteryError(response.code, response.error);
          this.refreshSummaryAfterMutation();
          return;
        }
        this.pendingConversionRequestId = "";
        this.explorerAvailableQuantity = parseScienceTrainLotteryInteger(
          response.data.ticketBalances.EXPLORER
        );
        this.leapAvailableQuantity = parseScienceTrainLotteryInteger(
          response.data.ticketBalances.LEAP
        );
        uni.showToast({ title: "已合成 1 张跃迁券", icon: "success" });
        this.refreshSummaryAfterMutation();
      })
      .catch(error => {
        console.error("[KJG] 合成跃迁券失败", error);
        uni.showToast({
          title: "网络异常，再次点击将安全重试本次合成",
          icon: "none",
          duration: 3000
        });
      })
      .then(() => {
        this.isConverting = false;
      });
  }

  loadFormalRecords(reset: boolean) {
    if (!this.isRealLotteryMode || !this.activeParticipantId) {
      return;
    }
    if (this.recordsLoading) {
      if (reset) {
        this.recordsRefreshQueued = true;
      }
      return;
    }
    this.recordsLoading = true;
    const offset = reset ? 0 : this.drawRecords.length;
    this.lotteryService
      .getRecords(this.activeParticipantId, 20, offset)
      .then(response => {
        if (!response.success || !Array.isArray(response.data)) {
          if (this.showRecords) {
            uni.showToast({
              title: this.getLotteryErrorMessage(response.code, response.error),
              icon: "none"
            });
          }
          return;
        }
        const incoming = response.data.map(record =>
          this.toDisplayRecord(record)
        );
        this.drawRecords = reset
          ? incoming
          : this.mergeDisplayRecords(this.drawRecords, incoming);
        this.hasMoreRecords = incoming.length === 20;
        this.scheduleRecordsRefresh();
      })
      .catch(error => {
        console.error("[KJG] 抽奖记录加载失败", error);
        if (this.showRecords) {
          uni.showToast({ title: "抽奖记录加载失败", icon: "none" });
        }
      })
      .then(() => {
        const shouldRefreshAgain = this.recordsRefreshQueued;
        this.recordsRefreshQueued = false;
        this.recordsLoading = false;
        if (shouldRefreshAgain) {
          this.loadFormalRecords(true);
        }
      });
  }

  loadMoreRecords() {
    if (this.hasMoreRecords && !this.recordsLoading) {
      this.loadFormalRecords(false);
    }
  }

  toDisplayRecord(record: ScienceTrainLotteryDrawRecord): LotteryDisplayRecord {
    const won = record.drawStatus === "WON";
    return {
      id: String(record.drawRecordId),
      ticketType: record.ticketType,
      prizeLevel: won ? "现金红包" : "本次未中奖",
      prizeName: won
        ? record.prizeName || "现金红包"
        : "感谢参与，探索仍在继续",
      occurredAt: parseScienceTrainLotteryInteger(record.occurredAt),
      drawStatus: record.drawStatus,
      fulfillmentStatus: record.fulfillmentStatus,
      realRecord: record
    };
  }

  prependDisplayRecord(record: LotteryDisplayRecord) {
    this.drawRecords = this.mergeDisplayRecords([record], this.drawRecords);
  }

  mergeDisplayRecords(
    current: LotteryDisplayRecord[],
    incoming: LotteryDisplayRecord[]
  ): LotteryDisplayRecord[] {
    const seen: { [key: string]: boolean } = {};
    return current.concat(incoming).filter(record => {
      if (seen[record.id]) {
        return false;
      }
      seen[record.id] = true;
      return true;
    });
  }

  setCurrentAvailableQuantity(value: string | number) {
    const quantity = parseScienceTrainLotteryInteger(value);
    if (this.activeTicketType === "EXPLORER") {
      this.explorerAvailableQuantity = quantity;
    } else {
      this.leapAvailableQuantity = quantity;
    }
  }

  refreshSummaryAfterMutation() {
    this.lotteryService.getSummary(this.activeParticipantId).then(response => {
      if (response.success && response.data) {
        const validation = validateScienceTrainLotterySummary(response.data);
        if (validation.valid) {
          this.applySummary(response.data);
          this.lotteryStage = "ready";
        }
      }
    });
  }

  formatDrawTime(timestamp: number): string {
    const date = new Date(timestamp);
    const pad = (value: number) => (value < 10 ? `0${value}` : String(value));
    return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(
      date.getDate()
    )} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  getRecordTypeText(record: LotteryDisplayRecord): string {
    return record.ticketType === "LEAP" ? "科普跃迁券" : "科普探索券";
  }

  getRecordSourceText(record: LotteryDisplayRecord): string {
    return record.drawStatus === "WON" ? "现金红包" : "未中奖";
  }

  getRecordStatusText(record: LotteryDisplayRecord): string {
    return record.realRecord
      ? getScienceTrainRecordActionText(record.realRecord)
      : "Mock 记录";
  }

  isRecordClaimable(record: LotteryDisplayRecord): boolean {
    return !!(
      record.realRecord && canClaimScienceTrainCashRecord(record.realRecord)
    );
  }

  handleRecordAction(record: LotteryDisplayRecord) {
    if (
      record.realRecord &&
      this.isRecordClaimable(record) &&
      !this.claimingRecordId
    ) {
      this.confirmCashRecordClaim(record.realRecord);
    }
  }

  handleTicketResultAction() {
    const record = this.resultRecord;
    if (!record || !this.canClaimResultTicket || !record.realRecord) {
      return;
    }
    this.confirmCashRecordClaim(record.realRecord);
  }

  confirmCashRecordClaim(record: ScienceTrainLotteryDrawRecord) {
    if (
      !canClaimScienceTrainCashRecord(record) ||
      this.claimingRecordId ||
      this.claimConfirmationRecordId
    ) {
      return;
    }
    const recordId = String(record.drawRecordId);
    this.claimConfirmationRecordId = recordId;
    uni.showModal({
      title: "确认领取红包",
      content: `确认领取“${record.prizeName || "现金红包"}”吗？确认后将打开微信红包领取页面。`,
      confirmText: "确认领取",
      cancelText: "稍后再领",
      success: result => {
        if (result.confirm) {
          this.claimCashRecord(record);
        }
      },
      complete: () => {
        if (this.claimConfirmationRecordId === recordId) {
          this.claimConfirmationRecordId = "";
        }
      }
    });
  }

  claimCashRecord(record: ScienceTrainLotteryDrawRecord) {
    if (!canClaimScienceTrainCashRecord(record) || this.claimingRecordId) {
      return;
    }
    const wxApi: any = typeof wx !== "undefined" ? wx : null;
    if (!wxApi || !wxApi.canIUse || !wxApi.canIUse("requestMerchantTransfer")) {
      uni.showModal({
        title: "暂时无法领取红包",
        content:
          "当前微信版本或小程序基础库不支持红包确认，请升级微信后在抽奖记录中继续领取。",
        showCancel: false
      });
      return;
    }
    const recordId = String(record.drawRecordId);
    const finishAttempt = (refreshRecords = true) => {
      if (this.claimingRecordId === recordId) {
        this.claimingRecordId = "";
      }
      this.revealedDraw = null;
      this.ejectingDraw = null;
      this.drawAnimationStage = "idle";
      if (refreshRecords) {
        this.loadFormalRecords(true);
      }
    };
    this.claimingRecordId = recordId;
    this.lotteryService
      .getMerchantTransfer(this.activeParticipantId, record.drawRecordId)
      .then(response => {
        if (!response.success || !response.data) {
          this.showLotteryError(response.code, response.error);
          finishAttempt();
          return;
        }
        const data = response.data;
        if (canOpenScienceTrainMerchantTransfer(data)) {
          try {
            wxApi.requestMerchantTransfer({
              appId: data.appId,
              mchId: data.mchId,
              package: data.packageInfo,
              success: () => finishAttempt(),
              fail: () => finishAttempt()
            });
          } catch (error) {
            console.error("[KJG] 无法调起红包确认页面");
            uni.showToast({
              title: "暂时无法打开确认页面，请稍后重试",
              icon: "none"
            });
            finishAttempt();
          }
          return;
        }
        uni.showToast({ title: "红包正在处理中", icon: "none" });
        finishAttempt();
      })
      .catch(error => {
        console.error("[KJG] 红包确认参数获取失败");
        uni.showToast({ title: "领取请求失败，请在记录中重试", icon: "none" });
        finishAttempt();
      });
  }

  scheduleRecordsRefresh() {
    this.clearRecordsRefreshTimer();
    if (
      !this.showRecords ||
      !this.drawRecords.some(
        record => record.fulfillmentStatus === "PROCESSING"
      )
    ) {
      return;
    }
    this.recordsRefreshTimer = setTimeout(() => {
      this.recordsRefreshTimer = null;
      if (this.showRecords) {
        this.loadFormalRecords(true);
      }
    }, 5000);
  }

  clearRecordsRefreshTimer() {
    if (this.recordsRefreshTimer) {
      clearTimeout(this.recordsRefreshTimer);
      this.recordsRefreshTimer = null;
    }
  }

  showLotteryError(code: string, message: string) {
    const content = this.getLotteryErrorMessage(code, message);
    if (code === "UNAUTHENTICATED") {
      uni.showModal({
        title: "登录状态已失效",
        content,
        showCancel: false,
        success: () => uni.reLaunch({ url: "/pages/login/index" })
      });
      return;
    }
    uni.showToast({ title: content, icon: "none", duration: 3000 });
  }

  getLotteryErrorMessage(code: string, message: string): string {
    if (code === "ACTIVITY_DRAW_NOT_OPEN") {
      return "抽奖当前未开放，请稍后再试。";
    }
    if (code === "ACTIVITY_DRAW_NOT_READY") {
      return "抽奖暂时不可用，请稍后重试。";
    }
    if (code === "ACTIVITY_DRAW_NO_ENTITLEMENT") {
      return "当前没有可用抽奖券。";
    }
    if (code === "ACTIVITY_DRAW_TICKET_INSUFFICIENT") {
      return "探索券不足 3 张，暂时无法合成。";
    }
    if (code === "ACTIVITY_DRAW_CONVERSION_NOT_OPEN") {
      return "当前暂未开放抽奖券合成。";
    }
    if (code === "ACTIVITY_DRAW_IDEMPOTENCY_CONFLICT") {
      return "请求状态冲突，请刷新页面后重新操作。";
    }
    if (code === "ACTIVITY_DRAW_FULFILLMENT_INVALID") {
      return "红包状态已更新，请刷新抽奖记录后重试。";
    }
    if (code === "ACTIVITY_POINTS_PARTICIPANT_BLOCKED") {
      return "当前用户已被限制参与。";
    }
    if (code === "CHECK_IN_SUB_USER_FORBIDDEN") {
      return "当前账号无权操作该用户，请重新选择。";
    }
    if (code === "ACTIVITY_DRAW_INVENTORY_EXHAUSTED") {
      return "奖池暂不可用，请稍后再试。";
    }
    return message || "抽奖请求失败，请稍后重试。";
  }

}
</script>

<style lang="scss" scoped>
$kjg-paper: #f7f3ea;
$kjg-paper-light: #fffdfa;
$kjg-paper-deep: #edf7f7;
$kjg-line: #b9dce8;
$kjg-ink: #17233c;
$kjg-ink-soft: #53697c;
$kjg-cinnabar: #1b63d9;
$kjg-cinnabar-deep: #123d73;
$kjg-jade: #168f88;

.lottery-page {
  box-sizing: border-box;
  min-height: 100vh;
  padding: 0 20rpx calc(40rpx + env(safe-area-inset-bottom));
  background: linear-gradient(180deg, #eef8fb 0%, #ffffff 164rpx, #fffde9 100%);
  color: $kjg-ink;
  font-family: "PingFang SC", "Microsoft YaHei", Arial, sans-serif;
}

.page-shell {
  box-sizing: border-box;
  width: 100%;
  min-height: calc(100vh - 40rpx - env(safe-area-inset-bottom));
  max-width: 720rpx;
  margin: 0 auto;
  padding: 30rpx 24rpx 44rpx;
  border-radius: 0 0 34rpx 34rpx;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.98) 0%,
    $kjg-paper-light 58%,
    #fffde9 100%
  );
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24rpx;
  min-height: 116rpx;
  padding-bottom: 22rpx;
  border-bottom: 2rpx dashed #64bfff;
}

.page-header-copy {
  flex: 1;
  min-width: 0;
}

.page-kicker {
  color: #FAC12A;
  font-size: 21rpx;
  font-weight: 700;
  letter-spacing: 4rpx;
}

.page-title {
  margin-top: 10rpx;
  font-size: 42rpx;
  font-weight: 700;
  letter-spacing: 2rpx;
  color: $kjg-cinnabar-deep;
}

.page-header-side {
  display: flex;
  flex: 0 0 270rpx;
  align-items: center;
  justify-content: flex-end;
  gap: 12rpx;
  min-height: 66rpx;
}

.page-header-image {
  flex: 0 0 86rpx;
  width: 86rpx;
  height: 66rpx;
}

.records-action {
  position: relative;
  display: flex;
  flex: 0 0 154rpx;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-width: 132rpx;
  min-height: 56rpx;
  padding: 0 18rpx;
  border: 2rpx solid $kjg-cinnabar;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.86);
  color: $kjg-cinnabar;
  font-size: 22rpx;
  font-weight: 600;
}

.records-claim-badge {
  position: absolute;
  top: -16rpx;
  right: -12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-width: 34rpx;
  height: 34rpx;
  padding: 0 8rpx;
  border: 2rpx solid $kjg-paper-light;
  border-radius: 18rpx;
  background: #FAC12A;
  color: $kjg-ink;
  font-size: 18rpx;
  font-weight: 800;
  line-height: 1;
  box-shadow: 0 4rpx 10rpx rgba(16, 56, 115, 0.2);
}

.lottery-tabs {
  display: flex;
  gap: 8rpx;
  margin-top: 20rpx;
  padding: 8rpx;
  border: 2rpx solid $kjg-line;
  border-radius: 20rpx;
  background: rgba(255, 253, 249, 0.84);
}

.lottery-tab {
  position: relative;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-height: 68rpx;
  border: 2rpx solid transparent;
  border-radius: 14rpx;
  background: transparent;
  color: $kjg-ink-soft;
}

.lottery-tab.is-active {
  border-color: $kjg-cinnabar;
  background: $kjg-cinnabar;
  color: $kjg-paper-light;
  box-shadow: 0 6rpx 16rpx rgba(27, 99, 217, 0.18);
}

.tab-title {
  font-size: 25rpx;
  font-weight: 700;
}

.tab-status {
  margin-left: 10rpx;
  font-size: 20rpx;
  opacity: 0.82;
}

.tab-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 34rpx;
  height: 36rpx;
  margin-left: 10rpx;
  padding: 0 6rpx;
  border-radius: 18rpx;
  border: 2rpx solid currentColor;
  background: $kjg-paper-light;
  color: $kjg-cinnabar;
  font-size: 20rpx;
  font-weight: 700;
}

.lottery-state-banner,
.pool-meta {
  box-sizing: border-box;
  margin-top: 16rpx;
  border-top: 2rpx dashed $kjg-line;
  border-bottom: 2rpx dashed $kjg-line;
  background: rgba(255, 255, 255, 0.3);
}

.lottery-state-banner {
  padding: 20rpx 24rpx;
  color: $kjg-ink-soft;
  font-size: 22rpx;
  line-height: 1.6;
  text-align: center;
}

.lottery-state-banner.is-error {
  border-color: #e6bf77;
  background: rgba(255, 248, 233, 0.72);
  color: #99651f;
}

.state-retry {
  display: inline-block;
  margin-top: 10rpx;
  font-weight: 700;
  text-decoration: underline;
}

.pool-meta {
  display: flex;
}

.pool-meta-item {
  flex: 1;
  padding: 15rpx 20rpx;
  text-align: center;
}

.pool-meta-item + .pool-meta-item {
  border-left: 2rpx dashed $kjg-line;
}

.pool-meta-label {
  color: $kjg-ink-soft;
  font-size: 21rpx;
  font-weight: 600;
}

.pool-meta-value {
  margin-top: 5rpx;
  color: #FAC12A;
  font-size: 28rpx;
  font-weight: 700;
}

.ticket-machine {
  position: relative;
  box-sizing: border-box;
  margin-top: 20rpx;
}

.machine-body {
  position: relative;
  z-index: 3;
  box-sizing: border-box;
  padding: 26rpx 28rpx 0;
  overflow: hidden;
  border: 2rpx solid $kjg-line;
  border-radius: 28rpx 28rpx 18rpx 18rpx;
  background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.82),
      transparent 42%
    ),
    linear-gradient(180deg, #f9fdfb 0%, #e4eee2 100%);
  box-shadow: inset 0 2rpx 0 rgba(255, 255, 255, 0.92),
    0 12rpx 26rpx rgba(18, 71, 103, 0.08);
}

.machine-body::before,
.machine-body::after {
  position: absolute;
  top: 22rpx;
  width: 10rpx;
  height: 10rpx;
  border: 2rpx solid #91b8c7;
  border-radius: 50%;
  background: #d5e8ed;
  content: "";
}

.machine-body::before {
  left: 18rpx;
}

.machine-body::after {
  right: 18rpx;
}

.machine-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20rpx;
}

.machine-brand {
  color: $kjg-cinnabar-deep;
  font-size: 27rpx;
  font-weight: 700;
  letter-spacing: 1rpx;
}

.machine-route {
  margin-top: 7rpx;
  color: $kjg-ink-soft;
  font-size: 20rpx;
  font-weight: 600;
  letter-spacing: 2rpx;
}

.machine-status {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 9rpx;
  min-height: 42rpx;
  padding: 0 14rpx;
  border: 2rpx solid #b9d8e1;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.74);
  color: #496d83;
  font-size: 20rpx;
  font-weight: 700;
}

.machine-status-light {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: $kjg-jade;
  box-shadow: 0 0 0 5rpx rgba(22, 143, 136, 0.12);
}

.machine-display {
  position: relative;
  box-sizing: border-box;
  min-height: 126rpx;
  margin-top: 24rpx;
  padding: 25rpx 144rpx 25rpx 28rpx;
  overflow: hidden;
  border: 2rpx solid #214c70;
  border-radius: 16rpx;
  background: linear-gradient(
      90deg,
      rgba(100, 229, 222, 0.035) 1rpx,
      transparent 1rpx
    ),
    linear-gradient(rgba(100, 229, 222, 0.035) 1rpx, transparent 1rpx),
    linear-gradient(145deg, #0d2946 0%, #123f64 100%);
  background-size: 18rpx 18rpx, 18rpx 18rpx, auto;
  box-shadow: inset 0 0 24rpx rgba(0, 9, 24, 0.32);
}

.display-ticket-type {
  color: #eafcff;
  font-size: 28rpx;
  font-weight: 700;
  letter-spacing: 2rpx;
}

.display-draw-hint {
  margin-top: 12rpx;
  color: rgba(234, 252, 255, 0.64);
  font-size: 19rpx;
  font-weight: 600;
}

.machine-draw-button {
  position: absolute;
  top: 50%;
  right: 24rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 102rpx;
  height: 102rpx;
  overflow: hidden;
  border: 4rpx solid #62b7ef;
  border-radius: 50%;
  background: linear-gradient(145deg, #fffef7 0%, #eaf7ff 100%);
  color: $kjg-cinnabar;
  box-shadow: inset 0 0 0 7rpx rgba(255, 255, 255, 0.88),
    0 0 0 7rpx rgba(255, 190, 44, 0.2),
    0 9rpx 22rpx rgba(0, 13, 30, 0.28);
  transform: translateY(-50%);
}

.machine-draw-button::before {
  position: absolute;
  top: 9rpx;
  right: 9rpx;
  bottom: 9rpx;
  left: 9rpx;
  border: 2rpx dashed rgba(27, 99, 217, 0.36);
  border-radius: 50%;
  content: "";
}

.machine-draw-button:active {
  transform: translateY(-50%) scale(0.94);
}

.machine-draw-button.is-disabled {
  border-color: #9fbac9;
  background: linear-gradient(145deg, #f5f7f5 0%, #e3ebed 100%);
  box-shadow: inset 0 0 0 7rpx rgba(255, 255, 255, 0.66),
    0 0 0 7rpx rgba(188, 210, 220, 0.12);
  color: #6d8390;
  opacity: 0.82;
}

.machine-draw-button.is-disabled::before {
  border-color: rgba(109, 131, 144, 0.3);
}

.machine-draw-button.is-syncing {
  border-color: #62b7ef;
  background: linear-gradient(145deg, #fffef7 0%, #eaf7ff 100%);
  box-shadow: inset 0 0 0 7rpx rgba(255, 255, 255, 0.88),
    0 0 0 7rpx rgba(98, 183, 239, 0.16),
    0 9rpx 22rpx rgba(0, 13, 30, 0.22);
  opacity: 1;
}

.machine-draw-button.is-syncing::before {
  border-color: rgba(27, 99, 217, 0.3);
}

.machine-draw-button.is-drawing {
  animation: draw-button-pulse 0.58s ease-in-out infinite alternate;
}

.machine-draw-count {
  position: relative;
  z-index: 1;
  color: #f2ad1d;
  font-size: 36rpx;
  font-weight: 700;
  line-height: 1;
  text-shadow: 0 2rpx 0 rgba(255, 255, 255, 0.9);
}

.machine-draw-loading {
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  width: 32rpx;
  height: 32rpx;
  border: 4rpx solid rgba(22, 93, 219, 0.18);
  border-top-color: #1685e8;
  border-right-color: #62b7ef;
  border-radius: 50%;
  animation: quiz-reward-loading-spin 0.8s linear infinite;
}

.machine-draw-label {
  position: relative;
  z-index: 1;
  margin-top: 5rpx;
  color: $kjg-cinnabar;
  font-size: 16rpx;
  font-weight: 700;
  letter-spacing: 1rpx;
}

.machine-draw-button.is-disabled .machine-draw-count,
.machine-draw-button.is-disabled .machine-draw-label {
  color: #6d8390;
}

.machine-draw-button.is-syncing .machine-draw-label {
  margin-top: 6rpx;
  color: #2b648e;
}

.is-processing .machine-status-light,
.is-ejecting .machine-status-light {
  background: #e7aa3d;
  box-shadow: 0 0 0 5rpx rgba(231, 170, 61, 0.15);
  animation: status-pulse 0.6s ease-in-out infinite alternate;
}

.machine-slot {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10rpx;
  box-sizing: border-box;
  width: calc(100% - 42rpx);
  height: 48rpx;
  margin: 24rpx auto -2rpx;
  padding: 0 12rpx;
  border: 2rpx solid #7699aa;
  border-bottom: 0;
  border-radius: 16rpx 16rpx 0 0;
  background: linear-gradient(180deg, #b9d2db 0%, #7c9ead 100%);
  box-shadow: inset 0 6rpx 10rpx rgba(255, 255, 255, 0.32);
}

.slot-track {
  flex: 1;
  height: 13rpx;
  border-radius: 8rpx;
  background: #142b3d;
  box-shadow: inset 0 4rpx 8rpx rgba(0, 0, 0, 0.48),
    0 1rpx 0 rgba(255, 255, 255, 0.55);
}

.slot-roller {
  width: 18rpx;
  height: 18rpx;
  border: 4rpx dotted #416779;
  border-radius: 50%;
  background: #dbe9ed;
}

.is-processing .slot-roller,
.is-ejecting .slot-roller {
  animation: roller-spin 0.45s linear infinite;
}

.ticket-output {
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  width: calc(100% - 86rpx);
  height: 12rpx;
  margin: -3rpx auto 0;
  overflow: hidden;
}

.is-ejecting .ticket-output,
.has-result .ticket-output {
  height: 334rpx;
}

.result-ticket {
  position: relative;
  box-sizing: border-box;
  min-height: 314rpx;
  overflow: hidden;
  opacity: 0;
  visibility: hidden;
}

.is-ejecting .result-ticket {
  visibility: visible;
  animation: ticket-eject 0.3s ease-out both;
}

.has-result .result-ticket {
  opacity: 1;
  visibility: visible;
}

.result-ticket-background {
  position: absolute;
  z-index: 0;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.ticket-caption {
  position: absolute;
  z-index: 2;
  top: 38rpx;
  left: 18%;
  color: $kjg-ink-soft;
  font-size: 21rpx;
  font-weight: 700;
  letter-spacing: 1rpx;
  text-align: left;
}

.ticket-result-copy {
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  flex-direction: column;
  min-height: 314rpx;
  margin-left: 43%;
  padding: 38rpx 34rpx 34rpx 18rpx;
}

.ticket-result-copy.has-claim-action {
  padding-bottom: 104rpx;
}

.ticket-title {
  color: $kjg-cinnabar-deep;
  font-size: 31rpx;
  font-weight: 700;
}

.ticket-copy {
  margin-top: 10rpx;
  color: $kjg-ink-soft;
  font-size: 22rpx;
  font-weight: 500;
  line-height: 1.5;
}

.ticket-claim-action {
  position: absolute;
  z-index: 3;
  right: 28rpx;
  bottom: 26rpx;
  left: 43%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-height: 60rpx;
  padding: 8rpx 20rpx;
  border: 2rpx solid rgba(16, 56, 115, 0.12);
  border-radius: 30rpx;
  background: #FAC12A;
  color: $kjg-ink;
  font-size: 25rpx;
  font-weight: 800;
  line-height: 1.2;
  box-shadow: 0 6rpx 14rpx rgba(16, 56, 115, 0.2);
}

.ticket-claim-action.is-opening {
  overflow: hidden;
  padding-right: 12rpx;
  padding-left: 12rpx;
  border-color: rgba(224, 154, 24, 0.42);
  background: rgba(255, 249, 221, 0.96);
  color: $kjg-ink;
  box-shadow: inset 0 0 0 2rpx rgba(250, 193, 42, 0.2),
    0 5rpx 12rpx rgba(16, 56, 115, 0.12);
}

.ticket-claim-action.is-opening::after {
  position: absolute;
  z-index: 0;
  top: -30%;
  bottom: -30%;
  left: -42%;
  width: 34%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.78) 50%,
    transparent 100%
  );
  transform: skewX(-18deg);
  animation: ticket-claim-scan 0.9s ease-in-out infinite;
  content: "";
}

.ticket-claim-stamp {
  position: absolute;
  z-index: 5;
  top: 78rpx;
  right: 50rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 120rpx;
  height: 120rpx;
  border: 6rpx solid rgba(205, 87, 35, 0.9);
  border-radius: 50%;
  color: rgba(183, 65, 25, 0.94);
  background: rgba(255, 247, 218, 0.2);
  font-family: serif;
  font-size: 58rpx;
  font-weight: 900;
  line-height: 1;
  box-shadow: inset 0 0 0 5rpx rgba(205, 87, 35, 0.2),
    0 5rpx 12rpx rgba(100, 42, 17, 0.12);
  pointer-events: none;
  transform: rotate(-11deg);
  animation: ticket-claim-stamp 0.52s cubic-bezier(0.2, 0.78, 0.24, 1.2)
    both;
}

.ticket-claim-stamp::after {
  position: absolute;
  top: 10rpx;
  right: 10rpx;
  bottom: 10rpx;
  left: 10rpx;
  border: 2rpx dashed rgba(205, 87, 35, 0.7);
  border-radius: 50%;
  content: "";
}

.ticket-claim-label {
  position: relative;
  z-index: 1;
  white-space: nowrap;
}

.ticket-claim-action.is-opening .ticket-claim-label {
  font-size: 20rpx;
  font-weight: 700;
}

.ticket-claim-arrow {
  margin-left: 10rpx;
  font-family: Arial, sans-serif;
  font-size: 34rpx;
  line-height: 1;
}

.is-winning .ticket-title {
  color: #FAC12A;
}

.conversion-panel {
  display: flex;
  align-items: center;
  gap: 22rpx;
  box-sizing: border-box;
  margin-top: 18rpx;
  padding: 22rpx 8rpx;
  border-top: 2rpx dashed #78c7de;
  border-bottom: 2rpx dashed #78c7de;
  background: rgba(234, 248, 244, 0.42);
}

.conversion-copy {
  flex: 1;
  min-width: 0;
}

.conversion-title {
  color: #FAC12A;
  font-size: 25rpx;
  font-weight: 700;
}

.conversion-note {
  margin-top: 8rpx;
  color: $kjg-ink-soft;
  font-size: 21rpx;
  font-weight: 500;
  line-height: 1.55;
}

.conversion-action {
  display: flex;
  flex: 0 0 144rpx;
  align-items: center;
  justify-content: center;
  min-height: 66rpx;
  border: 2rpx solid $kjg-jade;
  border-radius: 14rpx;
  background: $kjg-jade;
  color: $kjg-paper-light;
  font-size: 21rpx;
  font-weight: 700;
}

.conversion-action.is-disabled {
  border-color: $kjg-line;
  background: #eef4f4;
  color: $kjg-ink-soft;
}

.records-content {
  margin-top: 24rpx;
}

.records-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 18rpx;
  border-bottom: 2rpx dashed #64bfff;
}

.records-title {
  color: $kjg-cinnabar-deep;
  font-size: 32rpx;
  font-weight: 700;
}

.records-count {
  color: $kjg-ink-soft;
  font-size: 22rpx;
}

.records-list {
  margin-top: 22rpx;
}

.record-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24rpx;
  padding: 22rpx 8rpx;
  border-bottom: 2rpx dashed $kjg-line;
  background: rgba(255, 255, 255, 0.26);
}

.record-item + .record-item {
  margin-top: 0;
}

.record-main {
  min-width: 0;
}

.record-level {
  color: $kjg-cinnabar-deep;
  font-size: 27rpx;
  font-weight: 700;
}

.record-name {
  margin-top: 6rpx;
  overflow: hidden;
  color: $kjg-ink-soft;
  font-size: 22rpx;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.record-meta {
  margin-top: 10rpx;
  color: $kjg-ink-soft;
  font-size: 20rpx;
  font-weight: 500;
}

.record-status {
  flex: 0 0 auto;
  padding: 7rpx 10rpx;
  border: 2rpx solid #bedde4;
  border-radius: 999rpx;
  color: #345876;
  font-size: 20rpx;
  font-weight: 600;
}

.record-status.is-action {
  border-color: $kjg-jade;
  background: $kjg-jade;
  color: $kjg-paper-light;
}

.record-status.is-disabled,
.records-load-more.is-disabled {
  opacity: 0.58;
}

.records-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 480rpx;
  border: 2rpx dashed #bddce3;
  border-radius: 18rpx;
  background: rgba(255, 255, 255, 0.36);
}

.empty-mark {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 128rpx;
  height: 128rpx;
  border: 3rpx solid #7abfba;
  border-radius: 50%;
  background: #edf9f6;
  color: #FAC12A;
  font-size: 48rpx;
  font-weight: 700;
}

.empty-title {
  margin-top: 24rpx;
  color: $kjg-ink-soft;
  font-size: 26rpx;
  font-weight: 700;
}

.records-load-more {
  width: 100%;
  margin-top: 26rpx;
}

.records-load-more {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-height: 70rpx;
  border: 2rpx dashed #a9d2dc;
  border-radius: 16rpx;
  background: rgba(255, 253, 249, 0.55);
  color: $kjg-cinnabar;
  font-size: 22rpx;
  font-weight: 700;
}

@keyframes status-pulse {
  from {
    opacity: 0.55;
    transform: scale(0.86);
  }
  to {
    opacity: 1;
    transform: scale(1.08);
  }
}

@keyframes draw-button-pulse {
  from {
    box-shadow: inset 0 0 0 7rpx rgba(255, 255, 255, 0.88),
      0 0 0 5rpx rgba(255, 190, 44, 0.14),
      0 8rpx 18rpx rgba(0, 13, 30, 0.24);
  }
  to {
    box-shadow: inset 0 0 0 7rpx rgba(255, 255, 255, 0.88),
      0 0 0 11rpx rgba(255, 190, 44, 0.26),
      0 11rpx 26rpx rgba(0, 13, 30, 0.34);
  }
}

@keyframes roller-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes quiz-reward-loading-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes ticket-eject {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes ticket-claim-stamp {
  0% {
    opacity: 0;
    transform: translateY(-42rpx) scale(1.55) rotate(-18deg);
  }
  68% {
    opacity: 1;
    transform: translateY(5rpx) scale(0.9) rotate(-8deg);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1) rotate(-11deg);
  }
}

@keyframes ticket-claim-scan {
  0% {
    left: -42%;
  }
  100% {
    left: 112%;
  }
}
</style>
