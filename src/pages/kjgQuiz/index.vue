<template>
  <view class="quiz-page">
    <view v-if="isRealMode" class="quiz-board">
      <view class="quiz-header">
        <view class="quiz-heading-copy">
          <view class="quiz-kicker">科普站点答题</view>
          <view class="page-title">六站闯关答题</view>
        </view>
        <view class="quiz-header-visual">
          <view v-if="realStage === 'ready'" class="progress-count">
            {{ currentStationPosition }}/6
          </view>
          <image
            class="quiz-header-image"
            src="https://contentdevsa-blob.ai121.net/testcontainer/621684277780484154_621684965985314177.png"
            mode="aspectFit"
            aria-hidden="true"
          />
        </view>
      </view>

      <view
        v-if="realStage === 'loading'"
        class="quiz-loading"
        aria-label="正在准备今日答题"
      >
        <view class="loading-route" aria-hidden="true">
          <image
            class="completion-train loading-train"
            src="https://contentdevsa-blob.ai121.net/testcontainer/621684277780484154_621690610667524144.png"
            mode="aspectFit"
          />
          <view class="loading-track"></view>
          <view class="loading-stations">
            <view
              v-for="(_station, stationIndex) in 6"
              :key="stationIndex"
              class="loading-station"
              :style="{ animationDelay: stationIndex * 0.16 + 's' }"
            ></view>
          </view>
        </view>
        <view class="loading-title">正在准备今日答题</view>
        <view class="loading-copy">同步题目与作答进度…</view>
      </view>

      <view v-else-if="realStage === 'completed'" class="real-round-content">
        <view class="state-title">{{ completionTitle }}</view>
        <view class="state-copy">
          已作答 {{ answeredCountText }} 题，答对 {{ correctCountText }} 题。
        </view>
        <view class="completion-points">
          <view class="completion-points-item">
            <view class="completion-points-value">{{ completionOnlinePoints }}</view>
            <view class="completion-points-label">线上答题积分</view>
          </view>
          <view class="completion-points-item">
            <view class="completion-points-value">{{ completionCompletedDays }}</view>
            <view class="completion-points-label">累计完成天数</view>
          </view>
        </view>
        <view v-if="completionPointsMessage" class="completion-points-note">
          {{ completionPointsMessage }}
          <text
            v-if="completionPointsCanRetry"
            class="completion-points-retry"
            @click="retryCompletionPoints"
          >{{ completionRetryText }}</text>
        </view>
        <view class="completion-progress" aria-label="六站答题进度">
          <view class="completion-progress-rail">
            <image
              v-if="completionTrainLeftPercent > 0"
              class="completion-train completion-train-image"
              :style="{ left: completionTrainLeftPercent + '%' }"
              src="https://contentdevsa-blob.ai121.net/testcontainer/621684277780484154_621690610667524144.png"
              mode="aspectFit"
              aria-hidden="true"
            />
            <view class="completion-progress-track">
              <view
                v-for="station in realStations"
                :key="station.itemId"
                :class="[
                  'completion-progress-segment',
                  'status-' + station.status.toLowerCase(),
                ]"
              >
                {{ station.stationNo }}
              </view>
            </view>
          </view>
          <view class="completion-progress-legend">
            <view class="completion-legend-item">
              <text class="completion-legend-dot is-correct"></text>
              <text>答对</text>
            </view>
            <view class="completion-legend-item">
              <text class="completion-legend-dot is-wrong"></text>
              <text>答错</text>
            </view>
            <view class="completion-legend-item">
              <text class="completion-legend-dot is-skipped"></text>
              <text>跳过</text>
            </view>
          </view>
        </view>
        <view
          v-if="canEnterLotteryFromCompletion"
          :class="['lottery-button', lotteryNavigationPending ? 'is-disabled' : '']"
          @click="goToLottery"
        >
          {{ lotteryNavigationPending ? "正在前往…" : "前往抽奖中心" }}
        </view>
        <view
          :class="[
            'home-button',
            canEnterLotteryFromCompletion ? 'has-lottery-action' : '',
            homeNavigationPending ? 'is-disabled' : '',
          ]"
          @click="goBackHome"
        >
          {{ homeNavigationPending ? "正在返回…" : "回到首页" }}
        </view>
      </view>

      <view v-else-if="realStage === 'ready' && openStation" class="real-round-content">
        <view class="progress-track">
          <view class="progress-value" :style="{ width: realProgressPercent + '%' }"></view>
        </view>

        <view class="station-overview compact">
          <view
            v-for="station in realStations"
            :key="station.itemId"
            :class="[
              'station-dot',
              'status-' + station.status.toLowerCase(),
              canSelectRealStation(station) ? 'is-clickable' : '',
              isViewingRealStation(station) ? 'is-viewing' : '',
            ]"
            :role="canSelectRealStation(station) ? 'button' : undefined"
            :aria-label="getRealStationAriaLabel(station)"
            @click="selectRealStation(station)"
          >
            {{ station.stationNo }}
          </view>
        </view>

        <view class="station-tag">
          {{ displayRealStation.stationName }} · {{ displayRealStation.stationNo }}
        </view>
        <rich-text class="question-text" :nodes="displayRealQuestionStem"></rich-text>

        <view v-if="displayRealQuestionOptions.length" class="option-list">
          <view
            v-for="option in displayRealQuestionOptions"
            :key="option.key"
            :class="[
              'option-item',
              'real-option',
              isRealOptionSelected(option.key) ? 'is-selected' : '',
              getRealOptionResultClass(option.key),
              isRealAnswerLocked ? 'is-locked' : '',
            ]"
            @click="selectRealOption(option.key)"
          >
            <view class="option-index">{{ option.key }}</view>
            <rich-text class="option-text" :nodes="option.text"></rich-text>
          </view>
        </view>
        <view v-else class="question-type-note">
          当前题型：{{ displayRealQuestionType }}。服务器未返回可直接提交的选择项，暂时无法作答。
        </view>

        <view
          v-if="displayRealAnswerFeedback"
          :class="[
            'answer-feedback',
            displayRealAnswerCorrect !== null
              ? displayRealAnswerCorrect
                ? 'answer-result-correct'
                : 'answer-result-wrong'
              : '',
          ]"
        >
          <view :class="displayRealAnswerCorrect !== null ? 'answer-result-label' : ''">
            {{ displayRealAnswerFeedback }}
          </view>
          <view
            v-if="displayRealCorrectAnswer"
            class="answer-standard-row"
          >
            <text class="answer-detail-label">正确答案</text>
            <text class="answer-standard-value">
              {{ displayRealCorrectAnswer }}
            </text>
          </view>
          <view
            v-if="displayRealAnswerAnalysis"
            class="answer-analysis-block"
          >
            <view class="answer-detail-label">答案解析</view>
            <rich-text
              class="answer-analysis-text"
              :nodes="displayRealAnswerAnalysis"
            ></rich-text>
          </view>
        </view>
        <view
          :class="['next-button', canUseRealPrimaryAction ? '' : 'is-disabled']"
          @click="handleRealPrimaryAction"
        >
          {{ realPrimaryButtonText }}
        </view>
      </view>

      <view v-else class="real-state-card">
        <view class="state-title">{{ realStateTitle }}</view>
        <view class="state-copy">{{ realStateMessage }}</view>
        <view v-if="realCanRetry" class="state-action" @click="retryRealRound">
          {{ realRetryActionText }}
        </view>
        <view v-if="realCanRetry" class="state-recovery-note">
          仅恢复当天唯一轮次，不会增加答题机会。
        </view>
      </view>
    </view>

    <view v-else class="quiz-board">
      <view class="quiz-header">
        <view class="quiz-heading-copy">
          <view class="quiz-kicker">科普站点答题</view>
          <view class="page-title">六站闯关答题</view>
        </view>
        <view class="quiz-header-visual">
          <view class="progress-count">{{ currentIndex + 1 }}/{{ questions.length }}</view>
          <image
            class="quiz-header-image"
            src="https://contentdevsa-blob.ai121.net/testcontainer/621684277780484154_621684965985314177.png"
            mode="aspectFit"
            aria-hidden="true"
          />
        </view>
      </view>

      <view class="progress-track">
        <view class="progress-value" :style="{ width: progressPercent + '%' }"></view>
      </view>

      <view class="station-tag">{{ currentQuestion.station }}</view>
      <view class="question-text">{{ currentQuestion.question }}</view>

      <view class="option-list">
        <view
          v-for="(option, optionIndex) in currentQuestion.options"
          :key="option.text"
          class="option-item"
          :class="{
            'is-selected': selectedIndex === optionIndex,
            'is-correct': selectedIndex !== -1 && option.isCorrect,
            'is-wrong': selectedIndex === optionIndex && !option.isCorrect,
          }"
          @click="selectOption(optionIndex)"
        >
          <view class="option-index">{{ optionLabels[optionIndex] }}</view>
          <view class="option-text">{{ option.text }}</view>
        </view>
      </view>

      <view v-if="selectedIndex !== -1" class="answer-feedback">
        {{ isCurrentAnswerCorrect ? "回答正确，下一站已解锁。" : "回答错误，正确答案已标出。" }}
      </view>

      <view
        :class="['next-button', selectedIndex === -1 ? 'is-disabled' : '']"
        @click="nextQuestion"
      >
        {{ isLastQuestion ? "完成闯关" : "前往下一站" }}
      </view>
    </view>

    <view
      v-if="quizCautionVisible"
      class="quiz-caution-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="答题提示"
      @touchmove.stop.prevent
    >
      <view class="quiz-caution-dialog">
        <view class="quiz-caution-dialog-title">答题提示</view>
        <view class="quiz-caution-dialog-copy">题目有难度，请谨慎作答</view>
        <checkbox-group
          class="quiz-caution-choice"
          @change="handleQuizCautionChoiceChange"
        >
          <label class="quiz-caution-choice-label">
            <checkbox
              value="never-show"
              :checked="quizCautionDoNotShowAgain"
              color="#1685e8"
            />
            <text>下次不再显示此弹窗</text>
          </label>
        </checkbox-group>
        <view class="quiz-caution-confirm" role="button" @click="confirmQuizCaution">
          我知道了
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ScienceTrainDailyRound, {
  ScienceTrainDailyAnswerRequest,
  ScienceTrainDailyQuestion,
  ScienceTrainDailyStation,
} from "@/beans/scienceTrain/ScienceTrainDailyRound";
import {
  ScienceTrainPointsSummary,
  ScienceTrainQuizProgress,
} from "@/beans/scienceTrain/ScienceTrainPoints";
import KjgMockAccount from "@/common/utils/KjgMockAccount";
import { isMockMode } from "@/common/utils/MockMode";
import {
  buildScienceTrainAnswerRequest,
  canEnterScienceTrainLotteryAfterRound,
  createScienceTrainRequestId,
  getScienceTrainCompletionTrainPosition,
  getScienceTrainCompletionTitle,
  getScienceTrainOpenStation,
  isScienceTrainRoundBusyError,
  mapScienceTrainQuestionOptions,
  parseScienceTrainAnswerKeys,
  resolveScienceTrainRoundError,
  ScienceTrainQuestionOption,
  shouldRefreshScienceTrainRoundAfterAnswerError,
  toggleScienceTrainAnswerKey,
  validateScienceTrainCompletedRoundRefresh,
  validateScienceTrainDailyRound,
} from "@/logic/scienceTrain/ScienceTrainDailyRoundLogic";
import {
  getBackDeltaToRoute,
  isCurrentPageRoute,
} from "@/logic/navigation/PageStackNavigationLogic";
import {
  formatScienceTrainPointValue,
  parseScienceTrainCount,
} from "@/logic/scienceTrain/ScienceTrainPointsLogic";
import ScienceTrainParticipantManagement from "@/management/scienceTrain/ScienceTrainParticipantManagement";
import ScienceTrainPointsService from "@/service/ScienceTrainPointsService";
import ScienceTrainQuizService from "@/service/ScienceTrainQuizService";

interface QuizOption {
  text: string;
  isCorrect: boolean;
}

interface QuizQuestion {
  station: string;
  question: string;
  options: QuizOption[];
}

interface PendingRealAnswer {
  itemId: string;
  request: ScienceTrainDailyAnswerRequest;
}

interface RealAnswerFeedback {
  correct: boolean;
  correctAnswer: string;
  analysis: string;
  nextRound: ScienceTrainDailyRound;
}

interface RealStationReview {
  station: ScienceTrainDailyStation;
  selectedAnswerKeys: string[];
  correct: boolean;
  correctAnswer: string;
  analysis: string;
}

const QUIZ_CAUTION_DISMISSED_STORAGE_KEY =
  "KJG_QUIZ_CAUTION_DISMISSED_V1";

@Component({
  name: "KjgQuizPage",
})
export default class KjgQuizPage extends Vue {
  optionLabels = ["A", "B", "C", "D"];
  currentIndex = 0;
  selectedIndex = -1;
  score = 0;
  activeParticipantId = "";
  isRealMode = !isMockMode();
  realStage = "idle";
  realStateTitle = "今日答题暂不可用";
  realStateMessage = "请稍后再试。";
  realCanRetry = false;
  realErrorCode = "";
  realRound: ScienceTrainDailyRound | null = null;
  selectedRealAnswerKeys: string[] = [];
  pendingRealAnswer: PendingRealAnswer | null = null;
  isRealAnswerSubmitting = false;
  canRetryRealAnswer = false;
  answerFeedback = "";
  realAnswerFeedback: RealAnswerFeedback | null = null;
  realStationReviews: { [itemId: string]: RealStationReview } = {};
  reviewStationItemId = "";
  realRetryMode = "start";
  homeNavigationPending = false;
  lotteryNavigationPending = false;
  completionOnlinePoints = "--";
  completionCompletedDays = "--";
  completionPointsMessage = "积分读取中…";
  completionPointsCanRetry = false;
  completionRoundConfirmed = false;
  completionRoundConfirming = false;
  busyRetryTimer: any = null;
  completionPointsTimer: any = null;
  roundRequestVersion = 0;
  completionPointsRequestVersion = 0;
  quizCautionVisible = false;
  quizCautionDoNotShowAgain = false;
  quizCautionEvaluatedForThisVisit = false;
  private quizService = new ScienceTrainQuizService();
  private pointsService = new ScienceTrainPointsService();

  questions: QuizQuestion[] = isMockMode() ? [
    {
      station: "重庆站 · 01",
      question: "声音不能在哪一种环境中传播？",
      options: [
        { text: "真空", isCorrect: true },
        { text: "空气", isCorrect: false },
        { text: "水", isCorrect: false },
        { text: "钢铁", isCorrect: false },
      ],
    },
    {
      station: "四川站 · 02",
      question: "大熊猫日常最主要的食物是什么？",
      options: [
        { text: "竹子", isCorrect: true },
        { text: "松果", isCorrect: false },
        { text: "水稻", isCorrect: false },
        { text: "甘蔗", isCorrect: false },
      ],
    },
    {
      station: "贵州站 · 03",
      question: "被称为“中国天眼”的 FAST 位于哪个省？",
      options: [
        { text: "四川省", isCorrect: false },
        { text: "贵州省", isCorrect: true },
        { text: "云南省", isCorrect: false },
        { text: "重庆市", isCorrect: false },
      ],
    },
    {
      station: "重庆站 · 04",
      question: "标准大气压下，水沸腾后继续加热，其温度通常会怎样变化？",
      options: [
        { text: "持续快速升高", isCorrect: false },
        { text: "基本保持不变", isCorrect: true },
        { text: "立即降到零度", isCorrect: false },
        { text: "先降低再升高", isCorrect: false },
      ],
    },
    {
      station: "四川站 · 05",
      question: "室内遇到地震时，以下哪种做法更安全？",
      options: [
        { text: "立刻乘坐电梯", isCorrect: false },
        { text: "靠近窗户观察", isCorrect: false },
        { text: "就近避险并保护头部", isCorrect: true },
        { text: "跑到阳台呼救", isCorrect: false },
      ],
    },
    {
      station: "贵州站 · 06",
      question: "太阳能属于哪一类能源？",
      options: [
        { text: "不可再生能源", isCorrect: false },
        { text: "可再生能源", isCorrect: true },
        { text: "化石能源", isCorrect: false },
        { text: "核能", isCorrect: false },
      ],
    },
  ] : [];

  onLoad() {
    this.initializeQuizEntry();
  }

  initializeQuizEntry() {
    if (this.isRealMode) {
      this.initializeRealRound();
      return;
    }

    const mockParticipant = KjgMockAccount.getActiveParticipant();
    this.activeParticipantId =
      mockParticipant && KjgMockAccount.isRegistered(mockParticipant.id)
        ? mockParticipant.id
        : "";
    if (this.activeParticipantId) {
      this.showQuizCautionForActiveRound();
      return;
    }
    this.showParticipantRequiredModal();
  }

  handleQuizCautionChoiceChange(event: any) {
    const values =
      event && event.detail && Array.isArray(event.detail.value)
        ? event.detail.value
        : [];
    this.quizCautionDoNotShowAgain = values.indexOf("never-show") >= 0;
  }

  confirmQuizCaution() {
    if (this.quizCautionDoNotShowAgain) {
      uni.setStorageSync(QUIZ_CAUTION_DISMISSED_STORAGE_KEY, true);
    }
    this.quizCautionVisible = false;
  }

  showQuizCautionForActiveRound() {
    if (this.quizCautionEvaluatedForThisVisit) {
      return;
    }
    this.quizCautionEvaluatedForThisVisit = true;
    if (!uni.getStorageSync(QUIZ_CAUTION_DISMISSED_STORAGE_KEY)) {
      this.quizCautionVisible = true;
    }
  }

  onUnload() {
    this.roundRequestVersion += 1;
    this.completionPointsRequestVersion += 1;
    if (this.busyRetryTimer) {
      clearTimeout(this.busyRetryTimer);
      this.busyRetryTimer = null;
    }
    if (this.completionPointsTimer) {
      clearTimeout(this.completionPointsTimer);
      this.completionPointsTimer = null;
    }
  }

  initializeRealRound() {
    this.activeParticipantId =
      ScienceTrainParticipantManagement.getActiveSubUserId();
    if (!this.activeParticipantId) {
      this.showParticipantRequiredModal();
      this.realStage = "error";
      this.realStateTitle = "请先报名并选择用户";
      this.realStateMessage = "当前没有可用于答题的已报名用户。";
      this.realCanRetry = false;
      return;
    }
    this.loadRealRound();
  }

  showParticipantRequiredModal() {
    uni.showModal({
      title: "请先报名并选择用户",
      content: "答题记录和积分需要归属到已报名用户，请前往活动规则页完成报名或选择。",
      cancelText: "返回",
      confirmText: "去报名",
      success: (result) => {
        if (result.confirm) {
          uni.redirectTo({
            url: "/pages/kjgActivityDetail/index?openRegistration=1",
          });
        } else {
          uni.navigateBack({
            delta: 1,
          });
        }
      },
    });
  }

  loadRealRound() {
    const requestVersion = ++this.roundRequestVersion;
    this.realStage = "loading";
    this.realCanRetry = false;
    this.realErrorCode = "";
    this.realRound = null;
    this.realRetryMode = "start";
    this.realStationReviews = {};
    this.reviewStationItemId = "";
    this.completionRoundConfirmed = false;
    this.completionRoundConfirming = false;
    this.resetRealAnswerState();
    this.requestRealRound(requestVersion, true);
  }

  requestRealRound(requestVersion: number, allowBusyRetry: boolean) {
    this.quizService
      .startDailyRound(this.activeParticipantId)
      .then((response) => {
        if (requestVersion !== this.roundRequestVersion) {
          return;
        }
        if (!response.success || !response.data) {
          if (allowBusyRetry && isScienceTrainRoundBusyError(response.code)) {
            this.realStateMessage = "答题服务正在创建今日轮次，即将自动重试一次。";
            this.busyRetryTimer = setTimeout(() => {
              this.busyRetryTimer = null;
              if (requestVersion === this.roundRequestVersion) {
                this.requestRealRound(requestVersion, false);
              }
            }, 1500);
            return;
          }
          this.handleRealRoundError(
            response.code,
            response.error || "今日答题加载失败，请稍后重试"
          );
          return;
        }
        this.applyRealRound(response.data);
      })
      .catch((error) => {
        if (requestVersion !== this.roundRequestVersion) {
          return;
        }
        console.error("[KJG] 开始或恢复每日答题轮次失败", error);
        this.realStage = "error";
        this.realStateTitle = "网络连接失败";
        this.realStateMessage = "无法读取今日题目，请检查网络后重新加载。";
        this.realCanRetry = true;
      });
  }

  applyRealRound(
    round: ScienceTrainDailyRound,
    loadedFromToday = false
  ): boolean {
    const validation = validateScienceTrainDailyRound(round);
    if (!validation.valid) {
      this.handleInvalidRound(validation.reason);
      return false;
    }

    this.realRound = round;
    this.realStage = round.status === "COMPLETED" ? "completed" : "ready";
    this.realStateMessage = "";
    this.realCanRetry = false;
    if (round.status === "COMPLETED") {
      this.completionRoundConfirmed = loadedFromToday;
      if (loadedFromToday) {
        this.beginCompletionPointsRefresh();
      } else {
        this.confirmCompletionRoundFromToday(round);
      }
    } else {
      this.completionRoundConfirmed = false;
      this.completionRoundConfirming = false;
      this.showQuizCautionForActiveRound();
    }
    return true;
  }

  confirmCompletionRoundFromToday(expectedRound: ScienceTrainDailyRound) {
    if (this.completionRoundConfirming) {
      return;
    }
    const requestVersion = ++this.roundRequestVersion;
    this.completionRoundConfirming = true;
    this.completionRoundConfirmed = false;
    this.completionOnlinePoints = "--";
    this.completionCompletedDays = "--";
    this.completionPointsMessage = "正在确认答题结果…";
    this.completionPointsCanRetry = false;
    this.quizService
      .getTodayRound(this.activeParticipantId)
      .then((response) => {
        if (requestVersion !== this.roundRequestVersion) {
          return;
        }
        if (!response.success || !response.data) {
          this.handleCompletionRoundConfirmationFailure(
            response.error || "答题结果确认失败，请稍后重试。"
          );
          return;
        }
        const validation = validateScienceTrainCompletedRoundRefresh(
          expectedRound,
          response.data
        );
        if (!validation.valid) {
          console.error("[KJG] 今日完成轮次复核异常", validation.reason);
          this.handleCompletionRoundConfirmationFailure(
            "答题结果仍在同步，请稍后重试。"
          );
          return;
        }
        this.completionRoundConfirming = false;
        this.applyRealRound(response.data, true);
      })
      .catch((error) => {
        if (requestVersion !== this.roundRequestVersion) {
          return;
        }
        console.error("[KJG] 今日完成轮次复核失败", error);
        this.handleCompletionRoundConfirmationFailure(
          "网络连接失败，请稍后重试。"
        );
      });
  }

  handleCompletionRoundConfirmationFailure(message: string) {
    this.completionRoundConfirming = false;
    this.completionRoundConfirmed = false;
    this.realStage = "completed";
    this.completionPointsMessage = message || "答题结果确认失败，请稍后重试。";
    this.completionPointsCanRetry = true;
  }

  beginCompletionPointsRefresh() {
    if (!this.completionRoundConfirmed) {
      return;
    }
    const requestVersion = ++this.completionPointsRequestVersion;
    if (this.completionPointsTimer) {
      clearTimeout(this.completionPointsTimer);
      this.completionPointsTimer = null;
    }
    this.completionOnlinePoints = "--";
    this.completionCompletedDays = "--";
    this.completionPointsMessage = "积分读取中…";
    this.completionPointsCanRetry = false;
    this.fetchCompletionPoints(requestVersion, true);
  }

  retryCompletionPoints() {
    if (!this.completionRoundConfirmed && this.realRound) {
      this.confirmCompletionRoundFromToday(this.realRound);
      return;
    }
    this.beginCompletionPointsRefresh();
  }

  fetchCompletionPoints(requestVersion: number, allowDelayedRefresh: boolean) {
    const summaryRequest = this.pointsService
      .getSummary(this.activeParticipantId)
      .catch((error) => {
        console.error("[KJG] 答题结算积分汇总加载失败", error);
        return null;
      });
    const progressRequest = this.pointsService
      .getProgress(this.activeParticipantId)
      .catch((error) => {
        console.error("[KJG] 答题结算进度加载失败", error);
        return null;
      });

    Promise.all([summaryRequest, progressRequest]).then(
      ([summaryResponse, progressResponse]) => {
        if (requestVersion !== this.completionPointsRequestVersion) {
          return;
        }

        const summary: ScienceTrainPointsSummary | undefined =
          summaryResponse && summaryResponse.success
            ? summaryResponse.data
            : undefined;
        const progress: ScienceTrainQuizProgress | undefined =
          progressResponse && progressResponse.success
            ? progressResponse.data
            : undefined;

        if (summary || progress) {
          this.completionOnlinePoints = formatScienceTrainPointValue(
            summary && summary.onlinePoints !== undefined
              ? summary.onlinePoints
              : progress && progress.onlinePoints
          );
          const completedDayCount = parseScienceTrainCount(
            progress && progress.completedDayCount !== undefined
              ? progress.completedDayCount
              : summary && summary.completedDayCount
          );
          this.completionCompletedDays =
            completedDayCount === null ? "--" : String(completedDayCount);
          this.completionPointsMessage = allowDelayedRefresh
            ? "积分同步中…"
            : "";
          this.completionPointsCanRetry = false;
        } else {
          this.completionPointsMessage = allowDelayedRefresh
            ? "积分同步中…"
            : "积分读取失败，请稍后重试。";
          this.completionPointsCanRetry = !allowDelayedRefresh;
        }

        if (allowDelayedRefresh) {
          this.completionPointsTimer = setTimeout(() => {
            this.completionPointsTimer = null;
            if (requestVersion === this.completionPointsRequestVersion) {
              this.fetchCompletionPoints(requestVersion, false);
            }
          }, 2000);
        }
      }
    );
  }

  handleInvalidRound(reason: string) {
    console.error("[KJG] 每日答题轮次结构异常", reason);
    this.realRound = null;
    this.realStage = "error";
    this.realStateTitle = "题目数据暂不可用";
    this.realStateMessage = "服务器返回的今日轮次不完整，请稍后重新加载。";
    this.realCanRetry = true;
  }

  handleRealRoundError(code: string, message: string) {
    console.warn("[KJG] 开始或恢复每日答题轮次业务失败", code, message);
    this.realErrorCode = code || "UNKNOWN";
    this.realRound = null;
    const failureView = resolveScienceTrainRoundError(code, message);
    this.realStage = failureView.stage;
    this.realStateTitle = failureView.title;
    this.realStateMessage = failureView.message;
    this.realCanRetry = failureView.canRetry;
  }

  retryRealRound() {
    if (!this.realCanRetry) {
      return;
    }
    if (this.realRetryMode === "today") {
      this.refreshRealRoundFromToday(this.realErrorCode);
      return;
    }
    this.loadRealRound();
  }

  selectRealOption(key: string) {
    if (this.isRealAnswerLocked || !this.openQuestion) {
      return;
    }
    this.selectedRealAnswerKeys = toggleScienceTrainAnswerKey(
      this.selectedRealAnswerKeys,
      key
    );
    this.answerFeedback = "";
  }

  canSelectRealStation(station: ScienceTrainDailyStation): boolean {
    if (this.isRealAnswerSubmitting || !!this.pendingRealAnswer) {
      return false;
    }
    return (
      station.status === "OPEN" || !!this.realStationReviews[station.itemId]
    );
  }

  isViewingRealStation(station: ScienceTrainDailyStation): boolean {
    if (this.reviewStationItemId) {
      return station.itemId === this.reviewStationItemId;
    }
    return station.status === "OPEN";
  }

  getRealStationAriaLabel(station: ScienceTrainDailyStation): string {
    const prefix = `第${station.stationNo}题`;
    if (station.status === "OPEN") {
      return `${prefix}，当前题目`;
    }
    if (this.realStationReviews[station.itemId]) {
      return `${prefix}，点击回看`;
    }
    return `${prefix}，尚未开放`;
  }

  selectRealStation(station: ScienceTrainDailyStation) {
    if (!this.canSelectRealStation(station)) {
      return;
    }
    this.reviewStationItemId =
      station.status === "OPEN" ? "" : station.itemId;
  }

  isRealOptionSelected(key: string): boolean {
    const selectedKeys = this.activeRealStationReview
      ? this.activeRealStationReview.selectedAnswerKeys
      : this.selectedRealAnswerKeys;
    return selectedKeys.indexOf(key) >= 0;
  }

  getRealOptionResultClass(key: string): string {
    if (this.displayRealAnswerCorrect === null) {
      return "";
    }
    if (this.realCorrectAnswerKeys.indexOf(key) >= 0) {
      return "is-answer-correct";
    }
    if (!this.isRealOptionSelected(key)) {
      return "";
    }
    return this.displayRealAnswerCorrect
      ? "is-answer-correct"
      : "is-answer-wrong";
  }

  handleRealPrimaryAction() {
    if (!this.canUseRealPrimaryAction) {
      return;
    }
    if (this.isReviewingRealStation) {
      this.reviewStationItemId = "";
      return;
    }
    if (this.realAnswerFeedback) {
      this.continueAfterRealAnswer();
      return;
    }
    this.submitRealAnswer();
  }

  submitRealAnswer() {
    if (this.isRealAnswerSubmitting || this.realAnswerFeedback) {
      return;
    }

    let pending = this.pendingRealAnswer;
    if (!pending) {
      const built = buildScienceTrainAnswerRequest(
        this.realRound,
        this.selectedRealAnswerKeys,
        createScienceTrainRequestId()
      );
      if (!built.valid || !built.request) {
        this.answerFeedback = built.reason || "当前答案无法提交。";
        return;
      }
      pending = { itemId: built.itemId, request: built.request };
      this.pendingRealAnswer = pending;
    }

    this.isRealAnswerSubmitting = true;
    this.canRetryRealAnswer = false;
    this.answerFeedback = "正在判定答案，请稍候。";
    this.quizService
      .answerDailyRoundItem(
        this.activeParticipantId,
        pending.itemId,
        pending.request
      )
      .then((response) => {
        if (!response.success || !response.data) {
          this.handleRealAnswerError(
            response.code,
            response.error || "答案提交失败，请稍后重试。"
          );
          return;
        }
        if (
          typeof response.data.correct !== "boolean" ||
          !response.data.round
        ) {
          this.handleRealAnswerError(
            "INVALID_RESPONSE",
            "答题服务返回的判题结果不完整，请使用同一请求重试。"
          );
          return;
        }

        const validation = validateScienceTrainDailyRound(response.data.round);
        if (!validation.valid) {
          this.handleRealAnswerError(
            "INVALID_RESPONSE",
            "答题服务返回的最新轮次不完整，请使用同一请求重试。"
          );
          return;
        }
        if (
          !this.realRound ||
          response.data.round.roundId !== this.realRound.roundId
        ) {
          this.handleRealAnswerError(
            "INVALID_RESPONSE",
            "答题服务返回的轮次与当前题目不一致，请使用同一请求重试。"
          );
          return;
        }
        this.pendingRealAnswer = null;
        this.canRetryRealAnswer = false;
        const feedback: RealAnswerFeedback = {
          correct: response.data.correct,
          correctAnswer: this.normalizeRealAnswerFeedbackText(
            response.data.answerFeedback &&
              response.data.answerFeedback.correctAnswer
          ),
          analysis: this.normalizeRealAnswerFeedbackText(
            response.data.answerFeedback && response.data.answerFeedback.analysis
          ),
          nextRound: response.data.round,
        };
        this.realAnswerFeedback = feedback;
        this.rememberRealStationAnswer(feedback);
        this.answerFeedback = response.data.correct ? "正确" : "错误";
      })
      .catch((error) => {
        console.error("[KJG] 提交每日答题答案失败", error);
        this.canRetryRealAnswer = true;
        this.answerFeedback =
          "网络连接失败。可重新提交，重试会复用同一个请求编号。";
      })
      .then(() => {
        this.isRealAnswerSubmitting = false;
      });
  }

  continueAfterRealAnswer() {
    const feedback = this.realAnswerFeedback;
    if (!feedback) {
      return;
    }
    const nextRound = feedback.nextRound;
    this.reviewStationItemId = "";
    this.resetRealAnswerState();
    this.applyRealRound(nextRound);
  }

  rememberRealStationAnswer(feedback: RealAnswerFeedback) {
    const station = this.openStation;
    if (!station || !station.question) {
      return;
    }
    this.realStationReviews = {
      ...this.realStationReviews,
      [station.itemId]: {
        station,
        selectedAnswerKeys: this.selectedRealAnswerKeys.slice(),
        correct: feedback.correct,
        correctAnswer: feedback.correctAnswer,
        analysis: feedback.analysis,
      },
    };
  }

  handleRealAnswerError(code: string, message: string) {
    console.warn("[KJG] 每日答题答案提交业务失败", code, message);
    if (shouldRefreshScienceTrainRoundAfterAnswerError(code)) {
      this.resetRealAnswerState();
      this.refreshRealRoundFromToday(code);
      return;
    }
    if (code === "UNAUTHORIZED") {
      this.resetRealAnswerState();
      this.realRetryMode = "start";
      this.handleRealRoundError(code, message);
      return;
    }
    this.canRetryRealAnswer = true;
    this.answerFeedback = `${message} 重新提交将复用同一个请求编号。`;
  }

  refreshRealRoundFromToday(sourceCode: string) {
    const requestVersion = ++this.roundRequestVersion;
    this.realRetryMode = "today";
    this.realErrorCode = sourceCode || "DAILY_ROUND_REFRESH_FAILED";
    this.realStage = "loading";
    this.realCanRetry = false;
    this.realStateTitle = "正在恢复今日进度";
    this.realStateMessage = "服务器题目状态已变化，正在恢复当天同一轮次。";
    this.quizService
      .getTodayRound(this.activeParticipantId)
      .then((response) => {
        if (requestVersion !== this.roundRequestVersion) {
          return;
        }
        if (!response.success || !response.data) {
          this.realStage = "error";
          this.realStateTitle = "今日进度恢复失败";
          this.realStateMessage = response.error || "请检查网络后重新恢复。";
          this.realCanRetry = response.code !== "UNAUTHORIZED";
          this.realErrorCode = sourceCode || response.code;
          return;
        }
        if (!this.applyRealRound(response.data, true)) {
          return;
        }
        this.answerFeedback =
          sourceCode === "DAILY_ROUND_EXPIRED"
            ? "当天轮次已过期，已按服务器状态恢复。"
            : "题目状态已变化，已从服务器恢复同一轮次。";
      })
      .catch((error) => {
        if (requestVersion !== this.roundRequestVersion) {
          return;
        }
        console.error("[KJG] 查询今日答题轮次失败", error);
        this.realStage = "error";
        this.realStateTitle = "今日进度恢复失败";
        this.realStateMessage = "无法恢复当天轮次，请检查网络后重试。";
        this.realCanRetry = true;
      })
      .then(() => {
        this.isRealAnswerSubmitting = false;
      });
  }

  resetRealAnswerState() {
    this.selectedRealAnswerKeys = [];
    this.pendingRealAnswer = null;
    this.isRealAnswerSubmitting = false;
    this.canRetryRealAnswer = false;
    this.answerFeedback = "";
    this.realAnswerFeedback = null;
  }

  goBackHome() {
    if (this.homeNavigationPending) {
      return;
    }
    this.homeNavigationPending = true;
    const homeRoute = "pages/tab/index";
    const backDelta = getBackDeltaToRoute(getCurrentPages(), homeRoute);
    if (backDelta > 0) {
      this.navigateBackHome(backDelta);
      return;
    }
    this.redirectHome();
  }

  goToLottery() {
    if (this.lotteryNavigationPending) {
      return;
    }
    this.lotteryNavigationPending = true;
    const url = "/pages/kjgLottery/index";
    const navigationUrl = `${url}?source=quiz-completion`;
    uni.redirectTo({
      url: navigationUrl,
      success: () => {
        this.lotteryNavigationPending = false;
      },
      fail: (navigateError) => {
        setTimeout(() => {
          if (isCurrentPageRoute(getCurrentPages(), url)) {
            this.lotteryNavigationPending = false;
            return;
          }
          this.lotteryNavigationPending = false;
          console.error("[KJG] 前往抽奖中心失败", navigateError);
          uni.showModal({
            title: "抽奖中心打开失败",
            content:
              (navigateError && navigateError.errMsg) || "请稍后重新进入。",
            showCancel: false,
          });
        }, 300);
      },
    });
  }

  navigateBackHome(delta: number) {
    (uni.navigateBack as any)({
      delta,
      success: () => {
        this.homeNavigationPending = false;
      },
      fail: (navigateError) => {
        console.warn("[KJG] 返回已有首页失败，改用页面替换", navigateError);
        setTimeout(() => {
          if (this.isHomePageActive()) {
            this.homeNavigationPending = false;
            return;
          }
          this.redirectHome(navigateError);
        }, 120);
      },
    });
  }

  redirectHome(previousError?: any) {
    const url = "/pages/tab/index";
    uni.redirectTo({
      url,
      success: () => {
        this.homeNavigationPending = false;
      },
      fail: (redirectError) => {
        console.warn("[KJG] 替换为首页失败，最后尝试重建页面栈", redirectError);
        setTimeout(() => {
          if (this.isHomePageActive()) {
            this.homeNavigationPending = false;
            return;
          }
          this.reLaunchHome(previousError || redirectError);
        }, 120);
      },
    });
  }

  reLaunchHome(previousError?: any) {
    uni.reLaunch({
      url: "/pages/tab/index",
      success: () => {
        this.homeNavigationPending = false;
      },
      fail: (reLaunchError) => {
        this.homeNavigationPending = false;
        console.error("[KJG] 返回科普列车首页失败", reLaunchError);
        uni.showModal({
          title: "返回首页失败",
          content:
            reLaunchError.errMsg ||
            (previousError && previousError.errMsg) ||
            "请稍后重试。",
          showCancel: false,
        });
      },
    });
  }

  isHomePageActive(): boolean {
    return isCurrentPageRoute(getCurrentPages(), "pages/tab/index");
  }

  get realStations(): ScienceTrainDailyStation[] {
    return this.realRound && Array.isArray(this.realRound.stations)
      ? this.realRound.stations
      : [];
  }

  get openStation(): ScienceTrainDailyStation | null {
    return getScienceTrainOpenStation(this.realRound);
  }

  get openQuestion(): ScienceTrainDailyQuestion | null {
    return this.openStation && this.openStation.question
      ? this.openStation.question
      : null;
  }

  get activeRealStationReview(): RealStationReview | null {
    return this.reviewStationItemId
      ? this.realStationReviews[this.reviewStationItemId] || null
      : null;
  }

  get isReviewingRealStation(): boolean {
    return !!this.activeRealStationReview;
  }

  get displayRealStation(): ScienceTrainDailyStation {
    return this.activeRealStationReview
      ? this.activeRealStationReview.station
      : (this.openStation as ScienceTrainDailyStation);
  }

  get displayRealQuestion(): ScienceTrainDailyQuestion | null {
    const station = this.displayRealStation;
    return station && station.question ? station.question : null;
  }

  get displayRealQuestionStem(): string {
    return this.displayRealQuestion
      ? String(this.displayRealQuestion.stem || "")
      : "";
  }

  get displayRealQuestionType(): string {
    return this.displayRealQuestion && this.displayRealQuestion.type
      ? String(this.displayRealQuestion.type)
      : "非选择题";
  }

  get displayRealQuestionOptions(): ScienceTrainQuestionOption[] {
    return mapScienceTrainQuestionOptions(this.displayRealQuestion);
  }

  get displayRealAnswerFeedback(): string {
    if (this.activeRealStationReview) {
      return this.activeRealStationReview.correct ? "正确" : "错误";
    }
    return this.answerFeedback;
  }

  get displayRealAnswerCorrect(): boolean | null {
    if (this.activeRealStationReview) {
      return this.activeRealStationReview.correct;
    }
    return this.realAnswerFeedback ? this.realAnswerFeedback.correct : null;
  }

  get displayRealCorrectAnswer(): string {
    if (this.activeRealStationReview) {
      return this.activeRealStationReview.correctAnswer;
    }
    return this.realAnswerFeedback ? this.realAnswerFeedback.correctAnswer : "";
  }

  get displayRealAnswerAnalysis(): string {
    if (this.activeRealStationReview) {
      return this.activeRealStationReview.analysis;
    }
    return this.realAnswerFeedback ? this.realAnswerFeedback.analysis : "";
  }

  get openQuestionStem(): string {
    return this.openQuestion ? String(this.openQuestion.stem || "") : "";
  }

  get openQuestionType(): string {
    return this.openQuestion && this.openQuestion.type
      ? String(this.openQuestion.type)
      : "非选择题";
  }

  get realQuestionOptions(): ScienceTrainQuestionOption[] {
    return mapScienceTrainQuestionOptions(this.openQuestion);
  }

  get realCorrectAnswerKeys(): string[] {
    return parseScienceTrainAnswerKeys(this.displayRealCorrectAnswer);
  }

  normalizeRealAnswerFeedbackText(value?: string | null): string {
    return typeof value === "string" ? value.trim() : "";
  }

  get isRealAnswerLocked(): boolean {
    return (
      this.isReviewingRealStation ||
      this.isRealAnswerSubmitting ||
      !!this.pendingRealAnswer ||
      !!this.realAnswerFeedback
    );
  }

  get canSubmitRealAnswer(): boolean {
    if (this.isRealAnswerSubmitting || !this.realQuestionOptions.length) {
      return false;
    }
    return this.canRetryRealAnswer || this.selectedRealAnswerKeys.length > 0;
  }

  get canUseRealPrimaryAction(): boolean {
    if (this.isReviewingRealStation) {
      return true;
    }
    return this.realAnswerFeedback
      ? !this.isRealAnswerSubmitting
      : this.canSubmitRealAnswer;
  }

  get realPrimaryButtonText(): string {
    if (this.isReviewingRealStation) {
      return "返回当前题目";
    }
    if (this.isRealAnswerSubmitting) {
      return "正在提交…";
    }
    if (this.realAnswerFeedback) {
      return "继续";
    }
    if (this.canRetryRealAnswer) {
      return "重新提交同一答案";
    }
    return "提交答案";
  }

  get realRetryActionText(): string {
    return this.realRetryMode === "today"
      ? "重新读取服务器状态"
      : "恢复今日进度";
  }

  get completionRetryText(): string {
    return this.completionRoundConfirmed ? "刷新积分" : "重新确认";
  }

  get completionTrainLeftPercent(): number {
    return getScienceTrainCompletionTrainPosition(this.realRound);
  }

  get currentStationPosition(): string {
    if (!this.openStation) {
      return "-";
    }
    return String(this.openStation.stationNo || "-");
  }

  get realProgressPercent(): number {
    const stationNo = Number(this.openStation && this.openStation.stationNo);
    return stationNo > 0 && stationNo <= 6 ? (stationNo / 6) * 100 : 0;
  }

  get answeredCountText(): string {
    const value = this.realRound && this.realRound.answeredCount;
    return value === undefined || value === null ? "0" : String(value);
  }

  get correctCountText(): string {
    const value = this.realRound && this.realRound.correctCount;
    return value === undefined || value === null ? "0" : String(value);
  }

  get canEnterLotteryFromCompletion(): boolean {
    return canEnterScienceTrainLotteryAfterRound(
      this.realRound,
      this.completionRoundConfirmed
    );
  }

  get completionTitle(): string {
    const stopReason = this.realRound && this.realRound.stopReason;
    return getScienceTrainCompletionTitle(stopReason || undefined);
  }

  get currentQuestion(): QuizQuestion {
    return this.questions[this.currentIndex];
  }

  get progressPercent(): number {
    return ((this.currentIndex + 1) / this.questions.length) * 100;
  }

  get isLastQuestion(): boolean {
    return this.currentIndex === this.questions.length - 1;
  }

  get isCurrentAnswerCorrect(): boolean {
    if (this.selectedIndex === -1) {
      return false;
    }
    return this.currentQuestion.options[this.selectedIndex].isCorrect;
  }

  selectOption(optionIndex: number) {
    if (this.selectedIndex !== -1) {
      return;
    }
    this.selectedIndex = optionIndex;
    if (this.currentQuestion.options[optionIndex].isCorrect) {
      this.score += 1;
    }
  }

  nextQuestion() {
    if (this.selectedIndex === -1) {
      return;
    }
    if (this.isLastQuestion) {
      if (!this.activeParticipantId) {
        uni.showToast({ title: "请先选择用户", icon: "none" });
        return;
      }
      KjgMockAccount.saveQuizResultForParticipant(this.activeParticipantId, {
        completedAt: new Date().getTime(),
        correctCount: this.score,
        totalCount: this.questions.length,
        points: 10,
      });
      KjgMockAccount.grantQuizLotteryChanceForParticipant(
        this.activeParticipantId
      );
      KjgMockAccount.grantPerfectQuizLotteryChanceForParticipant(
        this.activeParticipantId
      );
      uni.redirectTo({
        url: "/pages/kjgLottery/index",
      });
      return;
    }
    this.currentIndex += 1;
    this.selectedIndex = -1;
  }
}
</script>

<style lang="scss" scoped>
$kjg-cinnabar: #165ddb;
$kjg-cinnabar-deep: #103873;
$kjg-paper-light: #fffdfa;
$kjg-paper-deep: #edf5f7;
$kjg-line: #b9dce8;
$kjg-ink: #17233c;
$kjg-ink-soft: #667085;
$kjg-home-bg: #fffde9;

.quiz-page {
  box-sizing: border-box;
  min-height: 100vh;
  padding: 0 24rpx calc(30rpx + env(safe-area-inset-bottom));
  overflow-x: hidden;
  background: linear-gradient(180deg, #eef8fb 0, #fff 150rpx, $kjg-home-bg 100%);
  color: $kjg-ink;
  font-family: "PingFang SC", "Microsoft YaHei", Arial, sans-serif;
}

.quiz-board {
  position: relative;
  box-sizing: border-box;
  min-height: calc(100vh - env(safe-area-inset-bottom) - 30rpx);
  padding: 30rpx 28rpx 48rpx;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, $kjg-paper-light 58%, $kjg-home-bg 100%);
}

.quiz-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 126rpx;
  padding-bottom: 22rpx;
  border-bottom: 2rpx dashed #64bfff;
}

.quiz-heading-copy {
  flex: 1;
  min-width: 0;
}

.quiz-kicker {
  color: #FAC12A;
  font-size: 21rpx;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: 3rpx;
}

.page-title {
  margin-top: 10rpx;
  font-size: 38rpx;
  font-weight: 800;
  line-height: 1.25;
  color: $kjg-cinnabar-deep;
}

.quiz-header-visual {
  position: relative;
  display: flex;
  flex: 0 0 174rpx;
  align-items: flex-end;
  justify-content: flex-end;
  width: 174rpx;
  height: 118rpx;
  margin-left: 18rpx;
}

.quiz-header-image {
  width: 168rpx;
  height: 102rpx;
}

.progress-count {
  position: absolute;
  z-index: 2;
  top: 0;
  right: 0;
  box-sizing: border-box;
  min-width: 64rpx;
  padding: 5rpx 12rpx;
  border: 2rpx solid $kjg-cinnabar;
  border-radius: 24rpx;
  background: rgba(255, 253, 250, 0.94);
  font-size: 22rpx;
  font-weight: 700;
  line-height: 1.3;
  text-align: center;
  color: $kjg-cinnabar;
}

.progress-track {
  height: 10rpx;
  margin-top: 22rpx;
  overflow: hidden;
  border: 0;
  border-radius: 6rpx;
  background: #dfecef;
}

.progress-value {
  height: 100%;
  border-radius: 6rpx;
  background: linear-gradient(90deg, #165ddb, #16a6a0);
  transition: width 0.2s ease;
}

.real-round-content {
  margin-top: 26rpx;
}

.real-state-card {
  margin-top: 44rpx;
  padding: 40rpx 28rpx;
  border-top: 2rpx dashed #64bfff;
  border-bottom: 2rpx dashed #64bfff;
  background: rgba(255, 255, 255, 0.38);
  text-align: center;
}

.quiz-loading {
  margin-top: 40rpx;
  padding: 32rpx 6rpx 24rpx;
  text-align: center;
}

.loading-route {
  position: relative;
  height: 106rpx;
  margin: 0 18rpx 30rpx;
}

.loading-track {
  position: absolute;
  top: 63rpx;
  right: 8rpx;
  left: 8rpx;
  height: 4rpx;
  border-radius: 2rpx;
  background: #cfe3e8;
}

.loading-stations {
  position: absolute;
  top: 54rpx;
  right: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.loading-station {
  position: relative;
  z-index: 1;
  width: 20rpx;
  height: 20rpx;
  box-sizing: border-box;
  border: 4rpx solid #a8ccd4;
  border-radius: 50%;
  background: $kjg-paper-light;
  animation: loading-station-pulse 1.4s ease-in-out infinite;
}

.loading-train {
  z-index: 2;
  top: -32rpx;
  left: 10%;
  width: 124rpx;
  height: 124rpx;
  transition: none;
  animation: loading-train-journey 2.8s ease-in-out infinite;
}

.loading-title {
  color: $kjg-cinnabar-deep;
  font-size: 31rpx;
  font-weight: 700;
  line-height: 1.45;
}

.loading-copy {
  margin-top: 12rpx;
  color: $kjg-ink-soft;
  font-size: 24rpx;
  line-height: 1.6;
}

@keyframes loading-train-journey {
  0% {
    left: 10%;
  }
  48%,
  58% {
    left: 90%;
  }
  59% {
    opacity: 0;
    left: 90%;
  }
  60% {
    opacity: 0;
    left: 10%;
  }
  68%,
  100% {
    opacity: 1;
    left: 10%;
  }
}

@keyframes loading-station-pulse {
  0%,
  55%,
  100% {
    border-color: #a8ccd4;
    background: $kjg-paper-light;
    box-shadow: none;
  }
  25% {
    border-color: #16a6a0;
    background: #dff4f1;
    box-shadow: 0 0 0 8rpx rgba(22, 166, 160, 0.1);
  }
}

.state-title {
  font-size: 34rpx;
  font-weight: 700;
  line-height: 1.45;
  color: $kjg-cinnabar-deep;
}

.state-copy {
  margin-top: 18rpx;
  font-size: 26rpx;
  line-height: 1.7;
  color: $kjg-ink-soft;
}

.state-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 220rpx;
  min-height: 80rpx;
  margin-top: 32rpx;
  border: 2rpx solid $kjg-cinnabar;
  border-radius: 38rpx;
  background: linear-gradient(135deg, #1685e8 0%, $kjg-cinnabar 100%);
  box-shadow: 0 10rpx 22rpx rgba(22, 93, 219, 0.16);
  color: $kjg-paper-light;
  font-size: 27rpx;
  font-weight: 700;
}

.state-recovery-note {
  margin-top: 18rpx;
  font-size: 23rpx;
  line-height: 1.6;
  color: $kjg-ink-soft;
}

.completion-points {
  display: flex;
  margin-top: 30rpx;
  border-top: 2rpx dashed #64bfff;
  border-bottom: 2rpx dashed #64bfff;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.34);
}

.completion-points-item {
  flex: 1;
  padding: 24rpx 18rpx;
  text-align: center;
}

.completion-points-item + .completion-points-item {
  border-left: 2rpx solid rgba(102, 112, 133, 0.24);
}

.completion-points-value {
  color: #FAC12A;
  font-size: 38rpx;
  font-weight: 700;
}

.completion-points-label {
  margin-top: 8rpx;
  color: $kjg-ink-soft;
  font-size: 22rpx;
}

.completion-points-note {
  margin-top: 16rpx;
  color: $kjg-ink-soft;
  font-size: 22rpx;
  line-height: 1.6;
}

.completion-points-retry {
  margin-left: 12rpx;
  color: $kjg-cinnabar-deep;
  text-decoration: underline;
}

.station-overview.compact {
  display: flex;
  justify-content: space-between;
  gap: 12rpx;
  margin-top: 20rpx;
  padding-bottom: 22rpx;
  border-bottom: 2rpx dashed rgba(100, 191, 255, 0.76);
}

.completion-progress {
  margin-top: 46rpx;
}

.completion-progress-rail {
  position: relative;
  padding-top: 56rpx;
}

.completion-train {
  position: absolute;
  top: 0;
  width: 88rpx;
  height: 58rpx;
  transform: translateX(-50%);
  transition: left 0.28s ease-out;
}

.completion-train-image {
  top: -28rpx;
  width: 112rpx;
  height: 112rpx;
}

.train-cabin {
  position: absolute;
  left: 12rpx;
  bottom: 10rpx;
  width: 42rpx;
  height: 36rpx;
  border: 3rpx solid $kjg-cinnabar-deep;
  border-radius: 6rpx 6rpx 2rpx 2rpx;
  background: $kjg-cinnabar;
}

.train-window {
  position: absolute;
  top: 7rpx;
  left: 9rpx;
  width: 19rpx;
  height: 15rpx;
  border: 2rpx solid $kjg-cinnabar-deep;
  background: $kjg-paper-light;
}

.train-engine {
  position: absolute;
  right: 8rpx;
  bottom: 10rpx;
  width: 37rpx;
  height: 25rpx;
  border: 3rpx solid $kjg-cinnabar-deep;
  border-radius: 5rpx 12rpx 3rpx 3rpx;
  background: #506f66;
}

.train-chimney {
  position: absolute;
  right: 24rpx;
  bottom: 34rpx;
  width: 12rpx;
  height: 18rpx;
  border: 3rpx solid $kjg-cinnabar-deep;
  border-bottom: 0;
  background: #506f66;
}

.train-cowcatcher {
  position: absolute;
  right: 0;
  bottom: 9rpx;
  width: 16rpx;
  height: 12rpx;
  border-bottom: 4rpx solid $kjg-cinnabar-deep;
  transform: skewX(-28deg);
}

.train-wheel {
  position: absolute;
  bottom: 0;
  width: 17rpx;
  height: 17rpx;
  box-sizing: border-box;
  border: 4rpx solid $kjg-cinnabar-deep;
  border-radius: 50%;
  background: $kjg-paper-light;
}

.train-wheel-back {
  left: 19rpx;
}

.train-wheel-front {
  right: 16rpx;
}

.completion-progress-track {
  display: flex;
  width: 100%;
  height: 64rpx;
  overflow: hidden;
  border: 2rpx solid rgba(22, 93, 219, 0.3);
  border-radius: 32rpx;
  background: #edf5f7;
}

.completion-progress-segment {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  min-width: 0;
  border-right: 2rpx solid rgba(251, 247, 238, 0.72);
  color: $kjg-ink-soft;
  font-size: 22rpx;
  font-weight: 700;
}

.completion-progress-segment:last-child {
  border-right: 0;
}

.completion-progress-segment.status-correct {
  background: #078c83;
  color: $kjg-paper-light;
}

.completion-progress-segment.status-wrong {
  background: #d45d50;
  color: $kjg-paper-light;
}

.completion-progress-segment.status-skipped,
.completion-progress-segment.status-waiting {
  background: $kjg-paper-deep;
}

.completion-progress-legend {
  display: flex;
  justify-content: center;
  gap: 30rpx;
  margin-top: 20rpx;
  color: $kjg-ink-soft;
  font-size: 22rpx;
}

.completion-legend-item {
  display: flex;
  align-items: center;
  gap: 9rpx;
}

.completion-legend-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
}

.completion-legend-dot.is-correct {
  background: #078c83;
}

.completion-legend-dot.is-wrong {
  background: #d45d50;
}

.completion-legend-dot.is-skipped {
  box-sizing: border-box;
  border: 2rpx solid $kjg-line;
  background: $kjg-paper-deep;
}

.lottery-button,
.home-button {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 86rpx;
  margin-top: 44rpx;
  border: 2rpx solid $kjg-cinnabar;
  border-radius: 43rpx;
  background: linear-gradient(135deg, #1685e8 0%, $kjg-cinnabar 100%);
  box-shadow: 0 10rpx 24rpx rgba(22, 93, 219, 0.16);
  color: $kjg-paper-light;
  font-size: 28rpx;
  font-weight: 700;
}

.lottery-button {
  margin-top: 44rpx;
}

.home-button {
  background: $kjg-paper-light;
  box-shadow: none;
  color: $kjg-cinnabar-deep;
}

.home-button.has-lottery-action {
  margin-top: 18rpx;
}

.lottery-button.is-disabled,
.home-button.is-disabled {
  opacity: 0.68;
}

.station-dot {
  display: flex;
  flex: 0 0 54rpx;
  align-items: center;
  justify-content: center;
  width: 54rpx;
  height: 54rpx;
  border: 2rpx solid rgba(22, 93, 219, 0.24);
  border-radius: 50%;
  background: #f7fbfc;
  color: $kjg-ink-soft;
  font-size: 23rpx;
  font-weight: 700;
  transition: transform 0.16s ease, box-shadow 0.16s ease;
}

.station-dot.is-clickable:active {
  transform: scale(0.94);
}

.station-dot.is-viewing {
  box-shadow: 0 0 0 6rpx rgba(22, 93, 219, 0.12);
}

.station-dot.status-open {
  border-color: $kjg-cinnabar;
  background: $kjg-cinnabar;
  color: $kjg-paper-light;
}

.station-dot.status-correct {
  border-color: #078c83;
  background: rgba(7, 140, 131, 0.11);
  color: #FAC12A;
}

.station-dot.status-wrong,
.station-dot.status-skipped {
  border-color: rgba(212, 93, 80, 0.42);
  background: rgba(212, 93, 80, 0.08);
}

.station-tag {
  display: inline-block;
  margin-top: 30rpx;
  padding: 8rpx 14rpx;
  border: 2rpx solid rgba(7, 140, 131, 0.42);
  border-radius: 24rpx;
  background: rgba(255, 253, 250, 0.72);
  color: #FAC12A;
  font-size: 22rpx;
  font-weight: 700;
}

.question-text {
  margin-top: 20rpx;
  color: $kjg-cinnabar-deep;
  font-size: 35rpx;
  font-weight: 700;
  line-height: 1.5;
}

.option-list {
  margin-top: 30rpx;
}

.option-item {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  min-height: 96rpx;
  padding: 16rpx 18rpx;
  border: 2rpx solid rgba(185, 220, 232, 0.9);
  border-radius: 18rpx;
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 5rpx 14rpx rgba(31, 70, 112, 0.045);
  transition: border-color 0.18s ease, background 0.18s ease, transform 0.18s ease;
}

.option-item + .option-item {
  margin-top: 14rpx;
}

.option-item:active {
  transform: translateY(2rpx);
}

.real-option {
  cursor: pointer;
}

.real-option.is-locked {
  opacity: 0.72;
  cursor: default;
}

.real-option.is-answer-correct,
.real-option.is-answer-wrong {
  opacity: 1;
}

.real-option.is-answer-correct {
  border-color: #078c83;
  background: rgba(7, 140, 131, 0.1);
}

.real-option.is-answer-correct .option-index {
  border-color: #078c83;
  background: #078c83;
  color: $kjg-paper-light;
}

.real-option.is-answer-wrong {
  border-color: #d45d50;
  background: rgba(212, 93, 80, 0.09);
}

.real-option.is-answer-wrong .option-index {
  border-color: #d45d50;
  background: #d45d50;
  color: $kjg-paper-light;
}

.option-index {
  display: flex;
  flex: 0 0 52rpx;
  align-items: center;
  justify-content: center;
  width: 52rpx;
  height: 52rpx;
  margin-right: 20rpx;
  border: 2rpx solid rgba(22, 93, 219, 0.48);
  border-radius: 50%;
  color: $kjg-cinnabar-deep;
  font-size: 24rpx;
  font-weight: 700;
}

.option-text {
  flex: 1;
  font-size: 28rpx;
  line-height: 1.5;
}

.is-selected .option-index {
  background: $kjg-cinnabar;
  color: $kjg-paper-light;
}

.is-selected {
  border-color: rgba(22, 93, 219, 0.62);
  background: rgba(22, 93, 219, 0.06);
}

.is-correct {
  border-color: #078c83;
  background: rgba(7, 140, 131, 0.1);
}

.is-correct .option-index {
  border-color: #078c83;
  background: #078c83;
  color: $kjg-paper-light;
}

.is-wrong {
  border-color: #d45d50;
  background: rgba(212, 93, 80, 0.09);
}

.is-wrong .option-index {
  border-color: #d45d50;
  background: #d45d50;
  color: $kjg-paper-light;
}

.answer-feedback {
  margin-top: 26rpx;
  font-size: 25rpx;
  font-weight: 700;
  line-height: 1.5;
}

.answer-feedback.answer-result-correct,
.answer-feedback.answer-result-wrong {
  min-height: 76rpx;
  padding: 22rpx 24rpx;
  border: 2rpx solid;
  border-radius: 18rpx;
}

.answer-result-label {
  text-align: center;
  font-size: 30rpx;
}

.answer-feedback.answer-result-correct {
  border-color: #078c83;
  background: rgba(7, 140, 131, 0.09);
  color: #FAC12A;
}

.answer-feedback.answer-result-wrong {
  border-color: #d45d50;
  background: rgba(212, 93, 80, 0.08);
  color: #a33f35;
}

.answer-standard-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 18rpx;
  padding-top: 18rpx;
  border-top: 2rpx solid rgba(64, 51, 44, 0.18);
}

.answer-detail-label {
  color: $kjg-ink-soft;
  font-size: 23rpx;
  font-weight: 700;
  letter-spacing: 2rpx;
}

.answer-standard-value {
  min-width: 54rpx;
  color: $kjg-ink;
  font-size: 30rpx;
  font-weight: 800;
  text-align: right;
}

.answer-analysis-block {
  margin-top: 18rpx;
  padding-top: 18rpx;
  border-top: 2rpx solid rgba(64, 51, 44, 0.18);
}

.answer-analysis-text {
  display: block;
  margin-top: 10rpx;
  color: $kjg-ink;
  font-size: 25rpx;
  font-weight: 400;
  line-height: 1.75;
  white-space: pre-wrap;
  word-break: break-all;
}

.question-type-note {
  margin-top: 30rpx;
  padding: 22rpx 24rpx;
  border-top: 2rpx dashed #64bfff;
  border-bottom: 2rpx dashed #64bfff;
  background: rgba(255, 255, 255, 0.4);
  font-size: 24rpx;
  line-height: 1.65;
  color: $kjg-ink-soft;
}

.next-button {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-height: 86rpx;
  border: 2rpx solid $kjg-cinnabar;
  border-radius: 43rpx;
  font-size: 28rpx;
  font-weight: 700;
}

.next-button {
  margin-top: 34rpx;
  background: linear-gradient(135deg, #1685e8 0%, $kjg-cinnabar 100%);
  box-shadow: 0 10rpx 24rpx rgba(22, 93, 219, 0.16);
  color: $kjg-paper-light;
}

.next-button.is-disabled {
  background: $kjg-paper-deep;
  border-color: $kjg-line;
  box-shadow: none;
  color: $kjg-ink-soft;
}

.quiz-caution-overlay {
  position: fixed;
  z-index: 1200;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 40rpx;
  background: rgba(26, 35, 47, 0.52);
}

.quiz-caution-dialog {
  box-sizing: border-box;
  width: 100%;
  max-width: 620rpx;
  padding: 46rpx 38rpx 34rpx;
  border-radius: 28rpx;
  background: $kjg-paper-light;
  box-shadow: 0 24rpx 70rpx rgba(22, 42, 74, 0.2);
}

.quiz-caution-dialog-title {
  color: $kjg-ink;
  font-size: 34rpx;
  font-weight: 800;
  text-align: center;
}

.quiz-caution-dialog-copy {
  margin-top: 24rpx;
  color: $kjg-ink;
  font-size: 28rpx;
  line-height: 1.65;
  text-align: center;
}

.quiz-caution-choice {
  display: block;
  margin-top: 34rpx;
}

.quiz-caution-choice-label {
  display: flex;
  align-items: center;
  color: $kjg-ink-soft;
  font-size: 25rpx;
  line-height: 1.5;
}

.quiz-caution-choice-label checkbox {
  flex: none;
  margin-right: 12rpx;
  transform: scale(0.82);
}

.quiz-caution-confirm {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 82rpx;
  margin-top: 34rpx;
  border-radius: 41rpx;
  background: linear-gradient(135deg, #1685e8 0%, $kjg-cinnabar 100%);
  box-shadow: 0 10rpx 24rpx rgba(22, 93, 219, 0.16);
  color: $kjg-paper-light;
  font-size: 28rpx;
  font-weight: 700;
}

</style>
