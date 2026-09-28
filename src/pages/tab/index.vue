<template>
  <view class="home-page" :style="pageSafeStyle">
    <view class="page-shell">
      <view class="fixed-home-header">
        <image
          class="home-title"
          src="/static/image/kjg-home/title.png"
          mode="aspectFit"
          aria-label="川渝黔科普列车"
        />
        <view class="rules-action" @click="goToActivity">
          <text>活动规则</text>
          <text class="rules-arrow">›</text>
        </view>
      </view>

      <view class="hero-section">
        <view
          class="hero-visual"
          :style="{ top: `-${topSafeInset}px` }"
          aria-hidden="true"
        >
          <image
            class="hero-image"
            src="https://contentdevsa-blob.ai121.net/testcontainer/621684277780484154_621684965985284175.png"
            mode="widthFix"
          />
        </view>
      </view>

      <view class="content-stack">
      <view class="journey-card">
        <view class="journey-card-heading">
          <view class="journey-title">我的科普旅程</view>
          <view class="journey-utilities">
            <view
              v-if="isLoggedIn"
              class="honor-entry-action"
              @click="goToPersonalCenter"
            >个人中心</view>
            <view class="lottery-entry-action" @click="goToLottery">
              <text>抽奖中心</text>
              <view v-if="lotteryAvailableChances" class="lottery-chance-badge">
                {{ lotteryAvailableChances }}
              </view>
            </view>
          </view>
        </view>

        <view class="journey-summary">
          <view class="participant-entry">
            <view
              class="participant-profile"
              role="button"
              aria-label="切换用户"
              @click="openParticipantSwitcher"
            >
              <image
                class="participant-avatar"
                mode="aspectFill"
                :src="participantAvatar"
              />
              <view class="participant-content">
                <view class="participant-name-row">
                  <view class="participant-name">{{ participantName }}</view>
                  <view class="participant-switch-arrow">⌄</view>
                </view>
                <view class="participant-switch-hint">
                  {{ isLoggedIn ? "点击切换用户" : "点击登录" }}
                </view>
              </view>
            </view>
          </view>
          <view class="score-entry">
            <view class="summary-label">当前积分</view>
            <image
              class="summary-image-icon point-summary-icon"
              src="/static/image/kjg-home/points.png"
              mode="aspectFit"
              aria-hidden="true"
            />
            <view class="summary-value">{{ totalPointsDisplay }}</view>
          </view>
          <view class="rank-entry" @click="goToRanking">
            <view class="summary-label">当前排名</view>
            <image
              class="summary-image-icon rank-summary-icon"
              src="/static/image/kjg-home/ranking.png"
              mode="aspectFit"
              aria-hidden="true"
            />
            <view
              class="summary-value rank-value"
              :class="{ 'rank-value-pending': !hasFormalRank }"
            >{{ rankDisplay }}</view>
            <view class="summary-unit rank-link">查看排行榜 ›</view>
          </view>
        </view>
      </view>

      <view class="task-grid">
        <view class="task-card quiz-card" @click="goToQuiz">
          <view class="task-heading">
            <view class="task-title">科普站点答题</view>
            <view class="task-arrow">›</view>
          </view>
          <view class="task-subline">
            <view class="task-meta">答题积分 {{ quizPointsDisplay }}</view>
            <view class="task-status">{{ quizStatusText }}</view>
          </view>
          <view class="task-image-slot quiz-image-slot" aria-hidden="true">
            <image class="task-image" src="https://contentdevsa-blob.ai121.net/testcontainer/621684277780484154_621684965985314177.png" mode="aspectFit" />
          </view>
        </view>
        <view class="task-card check-in-card" @click="goToCheckIn">
          <view class="task-heading">
            <view class="task-title">科普场馆打卡</view>
            <view class="task-arrow">›</view>
          </view>
          <view class="task-subline">
            <view class="task-meta">打卡积分 {{ checkInPointsDisplay }}</view>
            <view class="task-status">{{ checkInStatusText }}</view>
          </view>
          <view class="task-image-slot check-in-image-slot" aria-hidden="true">
            <image class="task-image" src="https://contentdevsa-blob.ai121.net/testcontainer/621684277780484154_621684965985304147.png" mode="aspectFit" />
          </view>
        </view>
      </view>

      <view class="museum-section">
        <view class="museum-section-header">
          <view class="museum-section-title">探索科技馆</view>
          <view class="museum-list-action" role="button" aria-label="查看场馆列表" @click="goToMuseum">
            <image class="museum-list-image" src="/static/image/kjg-home/museum-list.png" mode="aspectFit" aria-hidden="true" />
            <text class="museum-list-label">查看场馆列表</text>
          </view>
        </view>
        <view class="museum-feature-grid">
          <view class="museum-feature-card" @click="goToSichuanMuseum">
            <view class="museum-feature-label">四川科技馆</view>
            <view class="museum-image-slot" aria-hidden="true">
              <image
                v-if="sichuanMuseumCover"
                class="museum-feature-image"
                :src="sichuanMuseumCover"
                mode="aspectFill"
                @error="clearSichuanMuseumCover"
              />
            </view>
          </view>
          <view class="museum-feature-card" @click="goToChongqingMuseum">
            <view class="museum-feature-label">重庆科技馆</view>
            <view class="museum-image-slot" aria-hidden="true">
              <image
                v-if="chongqingMuseumCover"
                class="museum-feature-image"
                :src="chongqingMuseumCover"
                mode="aspectFill"
                @error="clearChongqingMuseumCover"
              />
            </view>
          </view>
        </view>
      </view>

      </view>
    </view>

    <van-action-sheet
      :show="participantSwitcherVisible"
      title="切换用户"
      @close="closeParticipantSwitcher"
      @click-overlay="closeParticipantSwitcher"
    >
      <view class="participant-switcher-sheet">
        <view class="switcher-copy">当前用户决定首页积分、排名和任务记录的归属。</view>
        <view v-if="participantSwitcherStage === 'loading'" class="switcher-state">
          正在读取已报名用户
        </view>
        <view v-else-if="participantSwitcherStage === 'error'" class="switcher-state">
          <view>{{ participantSwitcherError }}</view>
          <view class="switcher-retry" @click="loadParticipantSwitcher">重新加载</view>
        </view>
        <scroll-view v-else class="switcher-list" :scroll-y="true">
          <view
            v-for="participant in participantSwitcherItems"
            :key="participant.id"
            class="switcher-row"
            :class="{ 'is-current': participant.id === activeParticipantId }"
            @click="switchParticipant(participant)"
          >
            <image
              class="switcher-avatar"
              :src="participant.avatar || 'https://contentdevsa-blob.ai121.net/testcontainer/621684277780484154_621684965985294154.png'"
              mode="aspectFill"
            />
            <view class="switcher-main">
              <view class="switcher-name">{{ participant.name }}</view>
            </view>
            <view v-if="participant.id === activeParticipantId" class="switcher-current">当前</view>
            <view v-else class="switcher-arrow">›</view>
          </view>
          <view v-if="!participantSwitcherItems.length" class="switcher-empty">
            暂无已报名用户
          </view>
        </scroll-view>
        <view class="switcher-registration-action" @click="goToRegistrationFromSwitcher">
          为其他用户报名
        </view>
      </view>
    </van-action-sheet>
  </view>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import KjgMockAccount, {
  KjgParticipant,
} from "@/common/utils/KjgMockAccount";
import ActivityChild from "@/beans/common/ActivityChild";
import {
  ScienceTrainPointsSummary,
  ScienceTrainQuizProgress,
} from "@/beans/scienceTrain/ScienceTrainPoints";
import { isMockMode } from "@/common/utils/MockMode";
import LoginManagement from "@/management/login/LoginManagement";
import ScienceTrainParticipantManagement from "@/management/scienceTrain/ScienceTrainParticipantManagement";
import {
  formatScienceTrainPointValue,
  getScienceTrainQuizStatusText,
  hasScienceTrainQuizCompletion,
} from "@/logic/scienceTrain/ScienceTrainPointsLogic";
import {
  getScienceTrainHomeRankDisplay,
  getScienceTrainHomeRankErrorDisplay,
} from "@/logic/scienceTrain/ScienceTrainRankLogic";
import ScienceTrainParticipantService from "@/service/ScienceTrainParticipantService";
import ScienceTrainPointsService from "@/service/ScienceTrainPointsService";
import ScienceTrainRankService from "@/service/ScienceTrainRankService";
import CheckInService from "@/service/CheckInService";
import ActivityService from "@/service/ActivityService";
import {
  CHONGQING_SCIENCE_MUSEUM_ACTIVITY_ID,
  SCIENCE_TRAIN_ACTIVITY_ID,
  SICHUAN_SCIENCE_MUSEUM_ACTIVITY_ID,
} from "@/definition/scienceTrain/ScienceTrainConfig";
import { isCurrentPageRoute } from "@/logic/navigation/PageStackNavigationLogic";

interface HomeParticipantOption {
  id: string;
  name: string;
  avatar: string;
}

@Component({
  name: "KjgHomeEntryPage",
})
export default class KjgHomeEntryPage extends Vue {
  participantService = new ScienceTrainParticipantService();
  pointsService = new ScienceTrainPointsService();
  rankService = new ScienceTrainRankService();
  checkInService = new CheckInService();
  museumActivityService = new ActivityService();
  isLoggedIn = false;
  hasParticipant = false;
  hasRegisteredParticipant = false;
  isRegistered = false;
  participantName = "登录后查看";
  participantAvatar = "https://contentdevsa-blob.ai121.net/testcontainer/621684277780484154_621684965985294154.png";
  participantMeta = "";
  quizPointsDisplay = "--";
  checkInPointsDisplay = "--";
  totalPointsDisplay = "--";
  rankDisplay = "-- / 待接入";
  hasFormalRank = false;
  quizStatusText = "--";
  checkInStatusText = "--";
  hasQuizResult = false;
  checkInCount = 0;
  lotteryAvailableChances = 0;
  topSafeInset = 0;
  bottomSafeInset = 0;
  quizNavigationPending = false;
  museumNavigationPending = false;
  checkInNavigationPending = false;
  lotteryNavigationPending = false;
  realHomeRequestVersion = 0;
  realHomeRefreshInFlight = false;
  realHomeRefreshKey = "";
  activeParticipantId = "";
  renderedParticipantId = "";
  homeHiddenSinceLastShow = false;
  participantSwitcherVisible = false;
  participantSwitcherStage = "idle";
  participantSwitcherError = "用户读取失败，请检查网络后重试。";
  participantSwitcherItems: HomeParticipantOption[] = [];
  sichuanMuseumCover = "";
  chongqingMuseumCover = "";

  onLoad() {
    this.refreshSafeInsets();
    this.loadFeaturedMuseumCovers();
  }

  loadFeaturedMuseumCovers() {
    this.museumActivityService
      .getPublicDetail(SICHUAN_SCIENCE_MUSEUM_ACTIVITY_ID)
      .then((response) => {
        if (response.success && response.data && response.data.imgCover) {
          this.sichuanMuseumCover = response.data.imgCover;
        }
      })
      .catch(() => {
        this.sichuanMuseumCover = "";
      });
    this.museumActivityService
      .getPublicDetail(CHONGQING_SCIENCE_MUSEUM_ACTIVITY_ID)
      .then((response) => {
        if (response.success && response.data && response.data.imgCover) {
          this.chongqingMuseumCover = response.data.imgCover;
        }
      })
      .catch(() => {
        this.chongqingMuseumCover = "";
      });
  }

  clearSichuanMuseumCover() {
    this.sichuanMuseumCover = "";
  }

  clearChongqingMuseumCover() {
    this.chongqingMuseumCover = "";
  }

  onShow() {
    this.quizNavigationPending = false;
    this.museumNavigationPending = false;
    this.checkInNavigationPending = false;
    this.lotteryNavigationPending = false;
    const isReturningToHome = this.homeHiddenSinceLastShow;
    this.homeHiddenSinceLastShow = false;
    this.refreshHomeState(isReturningToHome);
  }

  onHide() {
    this.homeHiddenSinceLastShow = true;
    this.realHomeRequestVersion += 1;
    this.realHomeRefreshInFlight = false;
    this.realHomeRefreshKey = "";
  }

  refreshSafeInsets() {
    const systemInfo: any = uni.getSystemInfoSync();
    const statusBarHeight = Number(systemInfo.statusBarHeight || 0);
    let contentTop = statusBarHeight + 48;
    if (
      typeof wx !== "undefined" &&
      typeof wx.getMenuButtonBoundingClientRect === "function"
    ) {
      const menuButtonRect = wx.getMenuButtonBoundingClientRect();
      if (menuButtonRect && menuButtonRect.bottom) {
        contentTop = Math.max(contentTop, menuButtonRect.bottom + 10);
      }
    }

    const screenHeight = Number(
      systemInfo.screenHeight || systemInfo.windowHeight || 0
    );
    const safeAreaBottom =
      systemInfo.safeArea && screenHeight
        ? Math.max(0, screenHeight - Number(systemInfo.safeArea.bottom || 0))
        : 0;
    this.topSafeInset = contentTop;
    this.bottomSafeInset = Math.max(safeAreaBottom, 16);
  }

  get pageSafeStyle(): any {
    return {
      paddingTop: this.topSafeInset
        ? `${this.topSafeInset}px`
        : "calc(env(safe-area-inset-top) + 76rpx)",
      paddingBottom: this.bottomSafeInset
        ? `${this.bottomSafeInset}px`
        : "calc(env(safe-area-inset-bottom) + 64rpx)",
    };
  }

  refreshHomeState(forceRefresh = false) {
    if (!isMockMode()) {
      const isLoggedIn = new LoginManagement().isLogin();
      const activeSubUserId = isLoggedIn
        ? ScienceTrainParticipantManagement.getActiveSubUserId()
        : "";
      this.activeParticipantId = activeSubUserId;
      const refreshKey = `${isLoggedIn ? "logged-in" : "logged-out"}:${activeSubUserId}`;
      if (
        !forceRefresh &&
        this.realHomeRefreshInFlight &&
        this.realHomeRefreshKey === refreshKey
      ) {
        return;
      }
      const requestVersion = ++this.realHomeRequestVersion;
      this.refreshRealHomeState(
        requestVersion,
        isLoggedIn,
        activeSubUserId,
        refreshKey
      );
      return;
    }
    ++this.realHomeRequestVersion;
    this.resetHomeState();
    this.refreshMockHomeState();
  }

  refreshMockHomeState() {
    this.isLoggedIn = KjgMockAccount.isLoggedIn();
    this.activeParticipantId = "";
    if (!this.isLoggedIn) {
      return;
    }

    const participants = KjgMockAccount.getParticipants();
    this.hasRegisteredParticipant = KjgMockAccount.hasRegisteredParticipant();
    const activeParticipant = KjgMockAccount.getActiveParticipant();
    this.activeParticipantId = activeParticipant
      ? String(activeParticipant.id)
      : "";
    const currentParticipant =
      activeParticipant ||
      participants.find((participant) =>
        KjgMockAccount.isRegistered(participant.id)
      ) ||
      participants[0] ||
      null;

    this.quizPointsDisplay = "0";
    this.checkInPointsDisplay = "0";
    this.totalPointsDisplay = "0";
    this.quizStatusText = "尚未答题";
    this.checkInStatusText = "尚未打卡";
    if (!currentParticipant) {
      this.participantName = "暂无用户";
      this.participantMeta = "";
      return;
    }

    this.applyParticipantState(currentParticipant);
  }

  refreshRealHomeState(
    requestVersion: number,
    isLoggedIn: boolean,
    activeSubUserId: string,
    refreshKey: string
  ) {
    const preserveRenderedState = !!(
      isLoggedIn &&
      activeSubUserId &&
      this.isRegistered &&
      this.renderedParticipantId === activeSubUserId
    );
    this.isLoggedIn = isLoggedIn;
    if (!this.isLoggedIn) {
      this.resetHomeState();
      return;
    }

    if (!preserveRenderedState) {
      this.resetHomeState();
      this.isLoggedIn = true;
      this.renderedParticipantId = activeSubUserId;
      this.participantName = "用户加载中";
      this.quizStatusText = activeSubUserId ? "进度加载中" : "未报名";
      this.checkInStatusText = activeSubUserId ? "待开放" : "未报名";
      this.rankDisplay = activeSubUserId ? "排名加载中" : "--";
    }

    this.realHomeRefreshInFlight = true;
    this.realHomeRefreshKey = refreshKey;
    const requests: Array<Promise<any>> = [
      this.loadRealParticipants(
        activeSubUserId,
        requestVersion,
        preserveRenderedState
      ),
    ];
    if (activeSubUserId) {
      requests.push(
        this.loadRealPoints(
          activeSubUserId,
          requestVersion,
          preserveRenderedState
        ),
        this.loadRealRank(
          activeSubUserId,
          requestVersion,
          preserveRenderedState
        )
      );
    }
    Promise.all(requests).finally(() => {
      if (requestVersion === this.realHomeRequestVersion) {
        this.realHomeRefreshInFlight = false;
      }
    });
  }

  loadRealParticipants(
    activeSubUserId: string,
    requestVersion: number,
    preserveRenderedState: boolean
  ): Promise<void> {
    return this.participantService
      .getParticipants()
      .then((res) => {
        if (requestVersion !== this.realHomeRequestVersion) {
          return;
        }
        if (!res.success || !Array.isArray(res.data)) {
          if (!preserveRenderedState) {
            this.participantName = "用户加载失败";
            this.participantMeta = "请稍后重试";
          }
          return;
        }

        const participants = res.data;
        const registeredParticipants = participants.filter(
          (participant) => Number(participant.isEntry) === 1
        );
        const activeParticipant = registeredParticipants.find(
          (participant) => String(participant.userId) === activeSubUserId
        );

        this.hasParticipant = participants.length > 0;
        this.hasRegisteredParticipant = registeredParticipants.length > 0;
        if (activeSubUserId && !activeParticipant) {
          ScienceTrainParticipantManagement.clearActiveSubUserId();
          this.activeParticipantId = "";
        }
        if (activeParticipant) {
          this.activeParticipantId = String(activeParticipant.userId);
          this.applyRealParticipantState(activeParticipant);
          return;
        }
        if (registeredParticipants.length) {
          const firstRegisteredParticipantId = String(registeredParticipants[0].userId);
          ScienceTrainParticipantManagement.setActiveSubUserId(
            firstRegisteredParticipantId
          );
          this.activeParticipantId = firstRegisteredParticipantId;
          this.refreshHomeState(true);
          return;
        }

        this.activeParticipantId = "";
        this.renderedParticipantId = "";
        this.isRegistered = false;
        this.participantAvatar = "https://contentdevsa-blob.ai121.net/testcontainer/621684277780484154_621684965985294154.png";
        this.quizPointsDisplay = "--";
        this.checkInPointsDisplay = "--";
        this.totalPointsDisplay = "--";
        this.rankDisplay = "--";
        this.hasFormalRank = false;
        this.participantName = this.hasRegisteredParticipant
          ? "请选择用户"
          : this.hasParticipant
          ? "暂无已报名用户"
          : "暂无用户";
        this.participantMeta = this.hasRegisteredParticipant
          ? `${registeredParticipants.length} 个已报名账号`
          : "";
        this.quizStatusText = this.hasRegisteredParticipant
          ? "待选择用户"
          : "未报名";
        this.checkInStatusText = this.quizStatusText;
      })
      .catch((error) => {
        if (requestVersion !== this.realHomeRequestVersion) {
          return;
        }
        console.error("[KJG] 首页用户加载失败", error);
        if (!preserveRenderedState) {
          this.participantName = "用户加载失败";
          this.participantMeta = "请检查网络后重试";
        }
      });
  }

  resetHomeState() {
    this.isLoggedIn = false;
    this.hasParticipant = false;
    this.hasRegisteredParticipant = false;
    this.isRegistered = false;
    this.participantName = "登录后查看";
    this.participantAvatar = "https://contentdevsa-blob.ai121.net/testcontainer/621684277780484154_621684965985294154.png";
    this.participantMeta = "";
    this.quizPointsDisplay = "--";
    this.checkInPointsDisplay = "--";
    this.totalPointsDisplay = "--";
    this.rankDisplay = "-- / 待接入";
    this.hasFormalRank = false;
    this.quizStatusText = "--";
    this.checkInStatusText = "--";
    this.hasQuizResult = false;
    this.checkInCount = 0;
    this.lotteryAvailableChances = 0;
    this.renderedParticipantId = "";
  }

  applyParticipantState(participant: KjgParticipant) {
    this.hasParticipant = true;
    this.isRegistered = KjgMockAccount.isRegistered(participant.id);
    this.renderedParticipantId = String(participant.id);
    this.participantName = participant.name || "未命名用户";
    this.participantAvatar =
      participant.avatar || "https://contentdevsa-blob.ai121.net/testcontainer/621684277780484154_621684965985294154.png";
    const participantInfo = [participant.school, participant.grade].filter(
      Boolean
    );
    this.participantMeta = participantInfo.length
      ? participantInfo.join(" · ")
      : participant.isMainAccount
      ? ""
      : "附属用户";

    const quizResult = KjgMockAccount.getQuizResultForParticipant(
      participant.id
    );
    const checkInPoints = KjgMockAccount.getCheckInPointsForParticipant(
      participant.id
    );
    const checkInRecords = KjgMockAccount.getCheckInRecordsForParticipant(
      participant.id
    );
    const lotterySummary = KjgMockAccount.getLotterySummaryForParticipant(
      participant.id
    );
    this.hasQuizResult = !!quizResult;
    this.checkInCount = checkInRecords.length;
    this.lotteryAvailableChances = lotterySummary.availableChances;
    this.quizPointsDisplay = String(quizResult ? quizResult.points : 0);
    this.checkInPointsDisplay = String(checkInPoints);
    this.totalPointsDisplay = String(
      KjgMockAccount.getTotalPointsForParticipant(participant.id)
    );
    this.quizStatusText = quizResult
      ? `${quizResult.correctCount}/${quizResult.totalCount}`
      : this.isRegistered
      ? "尚未答题"
      : "未报名";
    this.checkInStatusText = this.checkInCount
      ? `${this.checkInCount} 馆`
      : this.isRegistered
      ? "尚未打卡"
      : "未报名";
  }

  applyRealParticipantState(participant: ActivityChild) {
    this.hasParticipant = true;
    this.hasRegisteredParticipant = true;
    this.isRegistered = true;
    this.participantName = participant.realName || "未命名用户";
    this.participantAvatar =
      participant.avatar || "https://contentdevsa-blob.ai121.net/testcontainer/621684277780484154_621684965985294154.png";
    this.participantMeta = [participant.orgName, participant.grade]
      .filter(Boolean)
      .join(" · ");
    this.renderedParticipantId = String(participant.userId);
  }

  isCurrentRealParticipantRequest(
    participantId: string,
    requestVersion: number
  ): boolean {
    return (
      requestVersion === this.realHomeRequestVersion &&
      participantId ===
        ScienceTrainParticipantManagement.getActiveSubUserId()
    );
  }

  loadRealRank(
    participantId: string,
    requestVersion: number,
    preserveRenderedState = false
  ): Promise<void> {
    if (!preserveRenderedState) {
      this.rankDisplay = "排名加载中";
      this.hasFormalRank = false;
    }
    return this.rankService
      .getPersonalRank(participantId)
      .then((response) => {
        if (
          !this.isCurrentRealParticipantRequest(
            participantId,
            requestVersion
          )
        ) {
          return;
        }
        if (!response.success || !response.data) {
          if (!preserveRenderedState) {
            this.rankDisplay = getScienceTrainHomeRankErrorDisplay(
              response.code
            );
            this.hasFormalRank = false;
          }
          return;
        }

        const display = getScienceTrainHomeRankDisplay(response.data);
        this.rankDisplay = display.text;
        this.hasFormalRank = display.hasFormalRank;
      })
      .catch((error) => {
        if (
          !this.isCurrentRealParticipantRequest(
            participantId,
            requestVersion
          )
        ) {
          return;
        }
        console.error("[KJG] 首页个人排名加载失败", error);
        if (!preserveRenderedState) {
          this.rankDisplay = getScienceTrainHomeRankErrorDisplay("");
          this.hasFormalRank = false;
        }
      });
  }

  loadRealPoints(
    participantId: string,
    requestVersion: number,
    preserveRenderedState = false
  ): Promise<void> {
    const summaryRequest = this.pointsService
      .getSummary(participantId)
      .catch((error) => {
        console.error("[KJG] 首页积分汇总加载失败", error);
        return null;
      });
    const progressRequest = this.pointsService
      .getProgress(participantId)
      .catch((error) => {
        console.error("[KJG] 首页答题进度加载失败", error);
        return null;
      });
    const checkInRequest = this.checkInService
      .getPoints(SCIENCE_TRAIN_ACTIVITY_ID, participantId, false)
      .catch((error) => {
        console.error("[KJG] 首页打卡进度加载失败", error);
        return null;
      });

    return Promise.all([summaryRequest, progressRequest, checkInRequest]).then(
      ([summaryResponse, progressResponse, checkInResponse]) => {
        if (
          !this.isCurrentRealParticipantRequest(
            participantId,
            requestVersion
          )
        ) {
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
        const checkInSnapshot =
          checkInResponse && checkInResponse.success
            ? checkInResponse.data
            : undefined;

        if (summary) {
          this.quizPointsDisplay = formatScienceTrainPointValue(
            summary.onlinePoints
          );
          this.checkInPointsDisplay = formatScienceTrainPointValue(
            summary.offlinePoints
          );
          this.totalPointsDisplay = formatScienceTrainPointValue(
            summary.totalPoints
          );
        } else if (progress) {
          this.quizPointsDisplay = formatScienceTrainPointValue(
            progress.onlinePoints
          );
        }

        if (summary || progress) {
          this.hasQuizResult = hasScienceTrainQuizCompletion(
            summary,
            progress
          );
          this.quizStatusText = getScienceTrainQuizStatusText(
            summary,
            progress
          );
        } else if (!preserveRenderedState) {
          this.quizStatusText = "积分加载失败";
        }

        if (checkInSnapshot) {
          this.checkInCount = Number(checkInSnapshot.completedCount) || 0;
          this.checkInStatusText = checkInSnapshot.enabled
            ? this.checkInCount
              ? `${this.checkInCount} 馆`
              : "尚未打卡"
            : "暂未开放";
        } else if (!preserveRenderedState) {
          this.checkInStatusText = "进度加载失败";
        }
      }
    );
  }

  get accountStateText(): string {
    if (!this.isLoggedIn) {
      return "未登录";
    }
    if (this.hasRegisteredParticipant && !this.isRegistered) {
      return "已登录 · 待选择";
    }
    return this.isRegistered ? "已登录 · 已报名" : "已登录 · 未报名";
  }

  get quizActionText(): string {
    if (!isMockMode()) {
      return "进入今日答题";
    }
    return this.hasQuizResult ? "查看答题结果" : "开始答题";
  }

  get checkInActionText(): string {
    return this.checkInCount ? "继续打卡" : "开始打卡";
  }

  openParticipantSwitcher() {
    if (!this.isLoggedIn) {
      const returnPath = "/pages/tab/index";
      uni.navigateTo({
        url:
          "/pages/login/index?pathKey=" +
          encodeURIComponent(JSON.stringify(returnPath)),
      });
      return;
    }
    this.participantSwitcherVisible = true;
    this.loadParticipantSwitcher();
  }

  closeParticipantSwitcher() {
    this.participantSwitcherVisible = false;
  }

  loadParticipantSwitcher() {
    this.participantSwitcherStage = "loading";
    this.participantSwitcherError = "用户读取失败，请检查网络后重试。";
    if (isMockMode()) {
      const activeParticipant = KjgMockAccount.getActiveParticipant();
      this.activeParticipantId = activeParticipant
        ? String(activeParticipant.id)
        : "";
      this.participantSwitcherItems = KjgMockAccount.getParticipants()
        .filter((participant) => KjgMockAccount.isRegistered(participant.id))
        .map((participant) => ({
          id: String(participant.id),
          name: participant.name || "未命名用户",
          avatar: participant.avatar || "",
        }));
      this.participantSwitcherStage = "ready";
      return;
    }
    this.activeParticipantId =
      ScienceTrainParticipantManagement.getActiveSubUserId();
    this.participantService
      .getParticipants()
      .then((res) => {
        if (!res.success || !Array.isArray(res.data)) {
          this.participantSwitcherStage = "error";
          this.participantSwitcherError =
            res.error || res.code || "用户接口返回失败，请稍后重试。";
          return;
        }
        this.participantSwitcherItems = res.data
          .filter((participant) => Number(participant.isEntry) === 1)
          .map((participant) => ({
            id: String(participant.userId),
            name: participant.realName || "未命名用户",
            avatar: participant.avatar || "",
          }));
        this.participantSwitcherStage = "ready";
      })
      .catch(() => {
        this.participantSwitcherStage = "error";
      });
  }

  switchParticipant(participant: HomeParticipantOption) {
    if (!participant.id) {
      this.closeParticipantSwitcher();
      return;
    }
    const alreadyRendered =
      participant.id === this.activeParticipantId &&
      participant.id === this.renderedParticipantId;
    if (alreadyRendered) {
      this.closeParticipantSwitcher();
      return;
    }
    if (participant.id !== this.activeParticipantId) {
      if (isMockMode()) {
        KjgMockAccount.setActiveParticipant(participant.id);
      } else {
        ScienceTrainParticipantManagement.setActiveSubUserId(participant.id);
      }
    }
    this.activeParticipantId = participant.id;
    this.closeParticipantSwitcher();
    uni.showToast({ title: `已切换至${participant.name}`, icon: "success" });
    this.refreshHomeState(true);
  }

  goToRegistrationFromSwitcher() {
    this.closeParticipantSwitcher();
    this.goToRegistration();
  }

  goToPersonalCenter() {
    const currentId = this.activeParticipantId;
    uni.navigateTo({
      url:
        "/pages/setting/index" +
        (currentId ? `?currentId=${encodeURIComponent(currentId)}` : ""),
    });
  }

  goToActivity() {
    uni.navigateTo({
      url: "/pages/kjgActivityDetail/index",
    });
  }

  goToRegistration() {
    uni.navigateTo({
      url: "/pages/kjgActivityDetail/index?openRegistration=1",
    });
  }

  showLoginPrompt(content: string, returnPath: string) {
    uni.showModal({
      title: "登录提示",
      content,
      cancelText: "暂不登录",
      confirmText: "去登录",
      success: (result) => {
        if (!result.confirm) {
          return;
        }
        uni.navigateTo({
          url:
            "/pages/login/index?pathKey=" +
            encodeURIComponent(JSON.stringify(returnPath)),
        });
      },
    });
  }

  goToRanking() {
    uni.navigateTo({
      url:
        "/pages/rank/index?mode=scienceTrain&activityId=" +
        encodeURIComponent(SCIENCE_TRAIN_ACTIVITY_ID),
    });
  }

  goToQuiz() {
    if (this.quizNavigationPending) {
      return;
    }
    const url = "/pages/kjgQuiz/index";
    if (!this.isLoggedIn) {
      this.showLoginPrompt(
        "登录后可记录答题进度、领取探索券并累计活动积分。是否前往登录？",
        url
      );
      return;
    }
    if (
      !isMockMode() &&
      !ScienceTrainParticipantManagement.getActiveSubUserId()
    ) {
      uni.showModal({
        title: "请先报名并选择用户",
        content: "答题记录和积分需要归属到已报名用户，请前往活动规则页完成报名或选择。",
        cancelText: "取消",
        confirmText: "去报名",
        success: (result) => {
          if (result.confirm) {
            this.goToRegistration();
          }
        },
      });
      return;
    }
    this.quizNavigationPending = true;
    this.openQuizPage(url);
  }

  openQuizPage(url: string) {
    uni.navigateTo({
      url,
      success: () => {
        this.quizNavigationPending = false;
      },
      fail: (navigateError) => {
        const errMsg = String(
          navigateError && navigateError.errMsg
            ? navigateError.errMsg
            : ""
        );
        const confirmDelay = errMsg.includes("timeout") ? 300 : 0;
        setTimeout(
          () => this.confirmQuizNavigation(url, navigateError),
          confirmDelay
        );
      },
    });
  }

  confirmQuizNavigation(url: string, navigateError: any) {
    if (isCurrentPageRoute(getCurrentPages(), url)) {
      this.quizNavigationPending = false;
      return;
    }

    uni.redirectTo({
      url,
      success: () => {
        this.quizNavigationPending = false;
      },
      fail: (redirectError) => {
        setTimeout(() => {
          if (isCurrentPageRoute(getCurrentPages(), url)) {
            this.quizNavigationPending = false;
            return;
          }
          this.quizNavigationPending = false;
          console.error("答题页面跳转失败", redirectError);
          uni.showModal({
            title: "答题页面打开失败",
            content:
              redirectError.errMsg ||
              navigateError.errMsg ||
              "请重新编译小程序后再试。",
            showCancel: false,
          });
        }, 200);
      },
    });
  }

  goToCheckIn() {
    if (this.checkInNavigationPending) {
      return;
    }
    const url = "/pages/kjgCheckIn/index";
    if (!this.isLoggedIn) {
      this.showLoginPrompt(
        "登录后可记录场馆打卡、领取探索券并累计活动积分。是否前往登录？",
        url
      );
      return;
    }
    if (
      (!isMockMode() &&
        !ScienceTrainParticipantManagement.getActiveSubUserId()) ||
      (isMockMode() && !KjgMockAccount.getActiveParticipant())
    ) {
      uni.showModal({
        title: "请先选择用户",
        content: "打卡记录和积分需要归属到已报名用户。",
        cancelText: "取消",
        confirmText: "去报名",
        success: (result) => {
          if (result.confirm) {
            this.goToRegistration();
          }
        },
      });
      return;
    }
    this.checkInNavigationPending = true;
    uni.navigateTo({
      url,
      complete: () => {
        this.checkInNavigationPending = false;
      },
    });
  }

  goToLottery() {
    if (this.lotteryNavigationPending) {
      return;
    }
    const url = "/pages/kjgLottery/index";
    if (!this.isLoggedIn) {
      this.showLoginPrompt(
        "登录后可使用探索券参与抽奖并查看中奖记录。是否前往登录？",
        url
      );
      return;
    }
    if (
      (!isMockMode() &&
        !ScienceTrainParticipantManagement.getActiveSubUserId()) ||
      (isMockMode() && !KjgMockAccount.getActiveParticipant())
    ) {
      uni.showModal({
        title: "请先选择用户",
        content: "抽奖券、抽奖结果和红包记录需要归属到已报名用户。",
        cancelText: "取消",
        confirmText: "去报名",
        success: (result) => {
          if (result.confirm) {
            this.goToRegistration();
          }
        },
      });
      return;
    }
    this.lotteryNavigationPending = true;
    uni.navigateTo({
      url,
      complete: () => {
        this.lotteryNavigationPending = false;
      },
    });
  }

  goToMuseum() {
    if (this.museumNavigationPending) {
      return;
    }
    const url = "/pages/kjgMuseum/index";
    this.museumNavigationPending = true;
    uni.showLoading({ title: "正在打开", mask: true });
    this.openMuseumPage(url, false);
  }

  goToSichuanMuseum() {
    if (this.museumNavigationPending) {
      return;
    }
    const url = `/pages/kjgMuseum/detail?id=${SICHUAN_SCIENCE_MUSEUM_ACTIVITY_ID}`;
    this.museumNavigationPending = true;
    uni.showLoading({ title: "正在打开", mask: true });
    this.openMuseumPage(url, false);
  }

  goToChongqingMuseum() {
    if (this.museumNavigationPending) {
      return;
    }
    const url = `/pages/kjgMuseum/detail?id=${CHONGQING_SCIENCE_MUSEUM_ACTIVITY_ID}`;
    this.museumNavigationPending = true;
    uni.showLoading({ title: "正在打开", mask: true });
    this.openMuseumPage(url, false);
  }

  openMuseumPage(url: string, isRetry: boolean) {
    uni.navigateTo({
      url,
      success: () => {
        this.museumNavigationPending = false;
        uni.hideLoading();
      },
      fail: (navigateError) => {
        if (!isRetry) {
          console.warn("科技馆列表首次跳转失败，自动重试", navigateError);
          setTimeout(() => this.openMuseumPage(url, true), 120);
          return;
        }
        this.museumNavigationPending = false;
        uni.hideLoading();
        this.showMuseumNavigationError(navigateError);
      },
    });
  }

  showMuseumNavigationError(error: any) {
    console.error("科技馆列表页面跳转失败", error);
    uni.showModal({
      title: "页面跳转失败",
      content:
        (error && error.errMsg) || "请重新编译小程序后再试。",
      showCancel: false,
    });
  }
}
</script>

<style lang="scss" scoped>
/* 一体式车票功能区：共用渐变底色，以虚线划分旅程与任务。 */
$home-bg: #fefde1;
$home-surface: #fffdfa;
$home-navy: #103873;
$home-blue: #165ddb;
$home-blue-soft: #b9dce8;
$home-teal: #078c83;
$home-text: #17233c;
$home-muted: #667085;

.home-page {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
  height: 100vh;
  min-height: 0;
  padding-top: calc(env(safe-area-inset-top) + 76rpx);
  padding-right: 24rpx;
  padding-bottom: calc(env(safe-area-inset-bottom) + 44rpx);
  padding-left: 24rpx;
  overflow: hidden;
  background: $home-bg;
  color: $home-text;
  font-family: "PingFang SC", "Microsoft YaHei", Arial, sans-serif;
}

.page-shell {
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  min-height: 0;
  max-width: 750rpx;
  margin: 0 auto;
}

.hero-section {
  position: relative;
  flex: 1 1 auto;
  height: 570rpx;
  min-height: 0;
  max-height: 570rpx;
}

.fixed-home-header {
  position: fixed;
  z-index: 4;
  top: 0;
  right: 0;
  left: 0;
  box-sizing: border-box;
  padding: calc(env(safe-area-inset-top) + 76rpx) 24rpx 24rpx;
  pointer-events: none;
}

.home-title {
  display: block;
  width: 406rpx;
  height: 76rpx;
}

.rules-action {
  pointer-events: auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-width: 148rpx;
  min-height: 58rpx;
  margin-top: 28rpx;
  padding: 8rpx 20rpx;
  border: 2rpx solid $home-blue;
  border-radius: 30rpx;
  background: rgba(255, 253, 250, 0.72);
  color: $home-blue;
  font-size: 25rpx;
  font-weight: 500;
}

.rules-arrow {
  margin-left: 12rpx;
  font-family: Arial, sans-serif;
  font-size: 34rpx;
  line-height: 1;
}

.hero-visual {
  position: absolute;
  z-index: 0;
  right: -24rpx;
  bottom: 0;
  left: -24rpx;
  box-sizing: border-box;
  width: auto;
  height: auto;
  margin: 0;
  overflow: hidden;
  pointer-events: none;
  background: #fff;
}

.hero-image {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
}

.content-stack {
  position: relative;
  z-index: 2;
  box-sizing: border-box;
  width: calc(100% + 48rpx);
  margin-left: -24rpx;
  padding: 0 40rpx;
  background: linear-gradient(180deg, #fff 0%, #fff 24%, $home-bg 100%);
}

/* 渐隐贴住功能区上沿，避免安全区高度差使头图与内容出现硬边。 */
.content-stack::before {
  position: absolute;
  right: 0;
  bottom: 100%;
  left: 0;
  height: 140rpx;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.6) 55%, #fff 100%);
  pointer-events: none;
  content: "";
}

.journey-card {
  position: relative;
  z-index: 2;
  box-sizing: border-box;
  margin-top: 0;
  padding: 20rpx 20rpx 28rpx;
  background: transparent;
}

.journey-card-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 50rpx;
}

.journey-title {
  color: $home-navy;
  font-size: 34rpx;
  font-weight: 800;
  letter-spacing: 1rpx;
  white-space: nowrap;
}

.journey-utilities {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-left: 12rpx;
}

.honor-entry-action,
.lottery-entry-action {
  position: relative;
  box-sizing: border-box;
  min-height: 50rpx;
  padding: 8rpx 14rpx;
  border: 2rpx solid $home-blue-soft;
  border-radius: 28rpx;
  background: #f8fcfd;
  color: $home-blue;
  font-size: 22rpx;
  font-weight: 600;
  line-height: 1.3;
  white-space: nowrap;
}

.lottery-entry-action {
  margin-left: 8rpx;
  border-color: $home-blue;
  background: $home-blue;
  color: #fff;
}

.lottery-chance-badge {
  top: -13rpx;
  right: -7rpx;
  min-width: 30rpx;
  height: 30rpx;
  padding: 0 6rpx;
  border: 2rpx solid $home-blue;
  border-radius: 18rpx;
  background: $home-surface;
  color: $home-blue;
  font-size: 16rpx;
}

.journey-summary {
  display: flex;
  min-height: 168rpx;
  margin-top: 10rpx;
}

.participant-entry,
.score-entry,
.rank-entry {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 8rpx 10rpx;
}

.participant-entry {
  width: 38%;
}

.score-entry,
.rank-entry {
  width: 31%;
  justify-content: flex-start;
  padding-top: 10rpx;
  border-left: 2rpx solid rgba(102, 112, 133, 0.28);
  text-align: center;
}

.participant-profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-width: 0;
}

.participant-avatar {
  width: 96rpx;
  height: 96rpx;
  flex: none;
  border: 4rpx solid #edf6f7;
  border-radius: 50%;
  background: #edf6f7;
}

.participant-content {
  width: 100%;
  min-width: 0;
  margin-top: 6rpx;
  text-align: center;
}

.participant-name-row {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-width: 0;
}

.participant-name {
  max-width: calc(100% - 26rpx);
  margin-top: 0;
  overflow: hidden;
  color: $home-navy;
  font-size: 25rpx;
  font-weight: 700;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.participant-switch-arrow {
  flex: none;
  margin-left: 4rpx;
  color: $home-blue;
  font-size: 24rpx;
  font-weight: 800;
  line-height: 1;
}

.participant-switch-hint {
  margin-top: 3rpx;
  color: $home-text;
  font-size: 19rpx;
  line-height: 1.3;
}

.participant-switcher-sheet {
  box-sizing: border-box;
  padding: 0 24rpx calc(env(safe-area-inset-bottom) + 24rpx);
  color: $home-navy;
}

.switcher-copy {
  padding: 8rpx 4rpx 20rpx;
  color: $home-text;
  font-size: 23rpx;
  line-height: 1.6;
}

.switcher-state,
.switcher-empty {
  padding: 58rpx 24rpx;
  color: $home-text;
  font-size: 25rpx;
  line-height: 1.6;
  text-align: center;
}

.switcher-retry {
  margin-top: 20rpx;
  color: $home-blue;
  font-weight: 700;
  text-decoration: underline;
}

.switcher-list {
  max-height: 600rpx;
  border-top: 2rpx solid rgba(185, 220, 232, 0.72);
}

.switcher-row {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  min-height: 126rpx;
  padding: 20rpx 8rpx;
  border-bottom: 2rpx solid rgba(185, 220, 232, 0.58);
}

.switcher-row.is-current {
  background: rgba(7, 140, 131, 0.06);
}

.switcher-avatar {
  flex: 0 0 82rpx;
  width: 82rpx;
  height: 82rpx;
  margin-right: 18rpx;
  border: 2rpx solid $home-blue-soft;
  border-radius: 50%;
  background: #edf6f7;
}

.switcher-main {
  flex: 1;
  min-width: 0;
}

.switcher-name {
  overflow: hidden;
  color: $home-navy;
  font-size: 29rpx;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.switcher-current,
.switcher-arrow {
  flex: none;
  margin-left: 12rpx;
  color: #FAC12A;
  font-size: 21rpx;
  font-weight: 700;
}

.switcher-arrow {
  color: $home-blue;
  font-size: 34rpx;
}

.switcher-registration-action {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 84rpx;
  margin-top: 20rpx;
  border: 2rpx solid $home-blue;
  border-radius: 42rpx;
  color: $home-blue;
  font-size: 27rpx;
  font-weight: 700;
}

.summary-label {
  color: $home-text;
  font-size: 22rpx;
  line-height: 1.35;
}

.summary-image-icon {
  height: 72rpx;
  margin-top: 4rpx;
}

.point-summary-icon {
  width: 82rpx;
}

.rank-summary-icon {
  width: 96rpx;
}

.summary-value {
  max-width: 100%;
  margin-top: 8rpx;
  overflow: hidden;
  color: #FAC12A;
  font-size: 42rpx;
  font-weight: 700;
  line-height: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rank-value-pending {
  font-size: 20rpx;
  line-height: 1.25;
  white-space: normal;
}

.summary-unit {
  margin-top: 4rpx;
  color: $home-muted;
  font-size: 18rpx;
}

.rank-link {
  color: $home-blue;
}

.task-grid {
  display: flex;
  justify-content: space-between;
  margin-top: 0;
  padding: 18rpx 0;
  border-top: 1rpx dashed #64bfff;
  border-bottom: 1rpx dashed #64bfff;
}

.task-card {
  position: relative;
  box-sizing: border-box;
  width: calc(50% - 9rpx);
  min-height: 274rpx;
  padding: 20rpx 20rpx 14rpx;
  overflow: hidden;
  background: transparent;
}

.task-heading {
  display: flex;
  align-items: center;
  min-height: 46rpx;
  padding-right: 22rpx;
}

.task-title {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  color: $home-navy;
  font-size: 31rpx;
  font-weight: 800;
  line-height: 1.25;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task-subline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 0;
  margin-top: 8rpx;
}

.task-status {
  flex: none;
  max-width: 146rpx;
  margin-left: 8rpx;
  padding: 4rpx 8rpx;
  overflow: hidden;
  border: 2rpx solid rgba(7, 140, 131, 0.42);
  border-radius: 22rpx;
  color: #FAC12A;
  font-size: 18rpx;
  font-weight: 600;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task-arrow {
  position: absolute;
  top: 22rpx;
  right: 14rpx;
  color: $home-blue;
  font-family: Arial, sans-serif;
  font-size: 38rpx;
  line-height: 1;
}

.task-meta {
  min-width: 0;
  overflow: hidden;
  color: $home-muted;
  font-size: 20rpx;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task-image-slot {
  position: absolute;
  right: 18rpx;
  bottom: 12rpx;
  left: 18rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 136rpx;
  overflow: hidden;
  border-radius: 16rpx;
  background: transparent;
}

.task-image {
  width: 100%;
  height: 100%;
}

.museum-section {
  box-sizing: border-box;
  margin-top: 0;
  padding: 22rpx 20rpx 6rpx;
  background: transparent;
}

.museum-section-title {
  color: $home-navy;
  font-size: 30rpx;
  font-weight: 800;
}

.museum-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 48rpx;
}

.museum-list-action {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: none;
  width: 220rpx;
  min-height: 70rpx;
  margin-left: 12rpx;
}

.museum-list-image {
  position: absolute;
  right: 0;
  width: 158rpx;
  height: 56rpx;
}

.museum-list-label {
  position: relative;
  color: #0d60a2;
  font-size: 24rpx;
  font-weight: 700;
  text-shadow: 0 2rpx #fff, 2rpx 0 #fff, 0 -2rpx #fff, -2rpx 0 #fff;
}

.museum-feature-grid {
  display: flex;
  align-items: stretch;
  gap: 16rpx;
  width: 100%;
  margin: 12rpx auto 0;
}

.museum-feature-card {
  box-sizing: border-box;
  flex: 1;
  min-width: 0;
  padding: 22rpx 18rpx 18rpx;
  overflow: hidden;
  border-radius: 24rpx;
  background: #e6eee2;
}

.museum-feature-label {
  color: $home-navy;
  font-size: 30rpx;
  font-weight: 700;
  line-height: 1.3;
}

.museum-image-slot {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 158rpx;
  margin-top: 16rpx;
  overflow: hidden;
  border-radius: 16rpx;
  background: linear-gradient(180deg, rgba(226, 242, 246, 0.36), rgba(212, 235, 241, 0.9));
}

.museum-feature-image {
  display: block;
  width: 100%;
  height: 100%;
}

.rules-action:active,
.honor-entry-action:active,
.participant-profile:active,
.rank-entry:active,
.task-card:active,
.museum-feature-card:active {
  opacity: 0.72;
}

.museum-list-action:active {
  opacity: 0.72;
}

.lottery-entry-action:active {
  background: $home-navy;
}

.switcher-registration-action:active,
.switcher-row:active {
  opacity: 0.72;
}

@media screen and (max-width: 350px) {
  .journey-card {
    padding-right: 20rpx;
    padding-left: 20rpx;
  }

  .journey-title {
    font-size: 34rpx;
  }

  .honor-entry-action,
  .lottery-entry-action {
    padding-right: 10rpx;
    padding-left: 10rpx;
    font-size: 21rpx;
  }

  .task-title {
    font-size: 28rpx;
  }

  .task-status {
    max-width: 104rpx;
  }
}
</style>
