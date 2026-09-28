<template>
  <view class="rank-page" :class="{ 'rank-page--kjg': isKjgTheme }">
    <view class="fixed">
      <van-button
        @click="goToDetail"
        type="primary"
        :color="isKjgTheme ? '#1b63d9' : '#FF7E4D'"
        block
      >{{
        userSelectItems.length === 0 ? "报名" : "为其他用户报名"
      }}</van-button>
    </view>
    <scroll-view
      class="rank-scroll"
      @scrolltolower="loadMore"
      scroll-y
      lower-threshold="20"
      :refresher-enabled="true"
      @refresherrefresh="onRefresh"
      :refresher-triggered="refreshState"
    >
      <view class="box">
        <view class="header-box">
          <view class="rule-row">
            <view class="rule-btn" @click="toRankRule(rankRule)"> 规则 </view>
          </view>
          <UserSelect
            v-if="userSelectItems.length > 0"
            :childs="userSelectItems"
            @change="onChangeChild"
          />
          <view class="team-name">{{ currentChild.realName || (isConfigurationPending ? pendingActivityName : "") }}</view>
          <view v-if="!isScienceTrainRank" class="user-school">{{ currentChild.orgName || (isConfigurationPending ? pendingActivityHint : "") }}</view>
          <view v-if="showPersonalRank">
            <view class="rank-text">
              <div class="team-core">
                <span class="team-text">{{ isScienceTrainRank ? "正式积分:" : "当前积分:" }}</span>
                <span class="team-num" v-if="currentUserCore">{{
                  currentUserCore
                }}</span>
                <span class="team-text team-text-empty" v-else>
                  &nbsp;&nbsp;&nbsp;&nbsp;--</span
                >
              </div>
              <div class="center-line">|</div>
              <div class="team-core">
                <span class="team-text">排名:</span>
                <span class="team-num" v-if="currentUserRank">{{
                  currentUserRank
                }}</span>
                <span class="team-text team-text-empty" v-else>
                  &nbsp;&nbsp;&nbsp;&nbsp;--</span
                >
              </div>
            </view>
            <view
              v-if="isScienceTrainRank && personalRankMessage"
              class="personal-rank-status"
            >{{ personalRankMessage }}</view>
          </view>
          <view v-else class="personal-rank-hint">
            {{ personalRankHint }}
          </view>
        </view>

        <view class="content-box">
          <view class="nav-box">
            <Nav @change="onNavChange" :navs="navs" :shadow="true" />
          </view>
          <view class="rank-rule" v-if="rankUpdateRule!==''">排行榜整点刷新时间：</view>
          <view class="rank-rule" v-if="rankUpdateRule!==''">{{ rankUpdateRule }}</view>
          <view
            v-if="isScienceTrainRank && rankStage === 'loading' && !rankList.length"
            class="rank-pending-box"
          >
            <view class="rank-pending-title">正在加载总分榜</view>
            <view class="rank-pending-text">请稍候</view>
          </view>
          <view
            v-else-if="isScienceTrainRank && rankStage === 'pending' && !rankList.length"
            class="rank-pending-box"
          >
            <view class="rank-pending-title">排行榜正在更新</view>
            <view class="rank-pending-text">请稍后点击重新加载</view>
            <view class="rank-retry" @click="retryScienceTrainRank">重新加载</view>
          </view>
          <view
            v-else-if="isScienceTrainRank && rankStage === 'unavailable'"
            class="rank-pending-box"
          >
            <view class="rank-pending-title">排行榜暂未开放</view>
            <view class="rank-pending-text">请留意活动后续通知</view>
          </view>
          <view
            v-else-if="isScienceTrainRank && rankStage === 'error' && !rankList.length"
            class="rank-pending-box"
          >
            <view class="rank-pending-title">排行榜加载失败</view>
            <view class="rank-pending-text">{{ rankMessage }}</view>
            <view class="rank-retry" @click="retryScienceTrainRank">重新加载</view>
          </view>
          <view v-else-if="isConfigurationPending" class="rank-pending-box">
            <view class="rank-pending-title">排行榜框架已就绪</view>
            <view class="rank-pending-text">活动业务接口接入后，将在这里展示积分排名。</view>
          </view>
          <view v-else class="rank-list-box">
            <view
              v-if="isScienceTrainRank && rankMessage"
              class="rank-notice"
            >{{ rankMessage }}</view>
            <view
              v-if="isScienceTrainRank && rankMessage && !isRankRequesting"
              class="rank-retry"
              @click="retryScienceTrainRank"
            >重新加载</view>
            <RankList
              :list="rankList"
              :show-secondary="!isScienceTrainRank"
            ></RankList>
            <view
              v-if="isScienceTrainRank && rankStage === 'empty'"
              class="rank-list-state"
            >当前暂无上榜用户</view>
            <view
              v-else-if="isScienceTrainRank && isRankRequesting && rankList.length"
              class="rank-list-state"
            >正在加载</view>
            <view
              v-else-if="isScienceTrainRank && rankList.length && pageNo >= Number(pages)"
              class="rank-list-state"
            >已经到底了</view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import UserSelect from "@/components/common/UserSelect.vue";
import Nav from "@/components/common/Nav.vue";
import RankList from "@/components/rank/RankList.vue";
import RankListItemType from "@/beans/rank/RankListItemType";
import ChildrenService from "@/service/ChildrenService";
import ActivityChild from "@/beans/common/ActivityChild";
import ActivityService from "@/service/ActivityService";
import ListRequest from "@/beans/activity/req/ListRequest";
import uParse from "@/components/feng-parse/parse.vue";
import LoginManagement from "@/management/login/LoginManagement";
import KjgMockAccount from "@/common/utils/KjgMockAccount";
import { isMockMode } from "@/common/utils/MockMode";
import ScienceTrainParticipantManagement from "@/management/scienceTrain/ScienceTrainParticipantManagement";
import ScienceTrainParticipantService from "@/service/ScienceTrainParticipantService";
import ScienceTrainRankService from "@/service/ScienceTrainRankService";
import ScienceTrainRankResponse, {
  ScienceTrainPersonalRankResponse,
  ScienceTrainPublicParticipantResponse,
  ScienceTrainRankRecord,
} from "@/beans/rank/ScienceTrainRankResponse";
import { SCIENCE_TRAIN_ACTIVITY_ID } from "@/definition/scienceTrain/ScienceTrainConfig";
import {
  buildScienceTrainParticipantNameMap,
  getScienceTrainLeaderboardErrorState,
  getScienceTrainRankParticipantName,
  ScienceTrainParticipantNameMap,
} from "@/logic/scienceTrain/ScienceTrainRankLogic";

class NavItem {
  id!: string;
  text = "";
}

@Component({
  name: "Rank",
  components: {
    UserSelect,
    Nav,
    RankList,
    uParse,
  },
})
export default class Rank extends Vue {
  childrenService = new ChildrenService();
  activityService = new ActivityService();
  participantService = new ScienceTrainParticipantService();
  scienceTrainRankService = new ScienceTrainRankService();
  defaultActivityId = "";
  navId = "";
  activityId = "";
  isScienceTrainRank = false;
  // 文字描述
  rankRule = "";
  // 刷新时间
  rankUpdateRule = "";
  // 当前用户排名
  currentUserRank = "";
  //当前用户积分
  currentUserCore = "";
  pendingActivityName = "科普列车川渝黔行";
  pendingActivityHint = "排行榜数据待接入";

  data = new ListRequest();

  pages = "";
  pageNo = 1;
  pageSize = 10;
  refreshState = false;
  dialogState = false;
  rankStage = "idle";
  rankMessage = "";
  isRankRequesting = false;
  scienceTrainParticipantNames: ScienceTrainParticipantNameMap = {};
  personalRankStage = "idle";
  personalRankMessage = "";
  personalRankSubUserId = "";
  personalRankRequestVersion = 0;

  navs: NavItem[] = [
    {
      id: "1",
      text: "模型排行",
    },
    {
      id: "2",
      text: "热度排行",
    },
  ];
  currentNav = new NavItem();

  rankList: Array<RankListItemType> = [];
  rankList1: Array<RankListItemType> = [];

  isLogin = false;

  get isKjgTheme(): boolean {
    return process.env.VUE_APP_THEME_TYPE === "kjg";
  }

  // 孩子选择列表数据
  userSelectItems: Array<ActivityChild> = [];
  // 当前孩子数据
  currentChild = new ActivityChild();

  get isConfigurationPending(): boolean {
    return !this.activityId && !this.isScienceTrainRank;
  }

  get showPersonalRank(): boolean {
    return this.isLogin && !!this.currentChild.userId;
  }

  get personalRankHint(): string {
    if (!this.isLogin) {
      return "登录后查看个人积分和排名";
    }
    if (!this.currentChild.userId) {
      return "请选择用户后查看个人积分和排名";
    }
    return "请选择用户后查看个人积分和排名";
  }

  onLoad(options: any) {
    this.isScienceTrainRank =
      !!options && String(options.mode || "") === "scienceTrain";
    const activityId = options && options.activityId
      ? String(options.activityId)
      : this.isScienceTrainRank
      ? SCIENCE_TRAIN_ACTIVITY_ID
      : "";
    this.defaultActivityId = activityId;
    this.activityId = activityId;
    this.isLogin = new LoginManagement().isLogin();
    if (this.isScienceTrainRank) {
      this.navs = [{ id: "total", text: "总分榜" }];
      this.navId = "total";
      this.rankRule = "";
      this.rankUpdateRule = "";
      if (this.isLogin) {
        this.loadLocalRegisteredParticipants();
      } else {
        this.resetPersonalRankState();
      }
      this.loadScienceTrainPublicRank(1, true);
      return;
    }
    if (this.isConfigurationPending) {
      this.navs = [{ id: "total", text: "综合排行" }];
      if (this.isLogin) {
        this.loadLocalRegisteredParticipants();
      } else {
        this.resetPersonalRankState();
      }
      return;
    }
    if (this.isLogin) {
      this.getChildrenList(this.activityId);
    } else {
      this.userSelectItems = [];
      this.currentChild = new ActivityChild();
      this.getRankTabs(this.activityId);
    }
  }

  loadMore() {
    if (this.isScienceTrainRank) {
      if (!this.isRankRequesting && this.pageNo < Number(this.pages)) {
        this.loadScienceTrainPublicRank(this.pageNo + 1, false);
      }
      return;
    }
    if (this.isConfigurationPending) {
      return;
    }
    console.log("加载更多");
    if (this.pageNo < Number(this.pages)) {
      this.pageNo++;
      console.log("当前页和总页数", this.pageNo, this.pages);
      // console.log("这里打印排行榜列表", this.rankList);
      this.getRankList(this.activityId, this.navId, this.pageNo);
    } else {
      uni.showToast({
        title: "到底了，没有数据了",
        icon: "none",
        duration: 2000,
        position: "center",
      });
    }
  }
  get imgUrl() {
    return `${process.env.VUE_APP_BLOB_IMAGE_URL_NEW}/competition-rank`;
  }
  // 生成排名前缀图标
  // 1,2,3名有特殊图标
  mapRankPostionIcon = (rankPosition: string) => {
    switch (rankPosition) {
      case "1":
        return this.imgUrl + "/no_1.png";
      case "2":
        return this.imgUrl + "/no_2.png";
      case "3":
        return this.imgUrl + "/no_3.png";
      default:
        return "";
    }
  };
  onPullDownRefresh() {
    if (this.isScienceTrainRank) {
      this.loadScienceTrainPublicRank(1, true);
      this.refreshScienceTrainPersonalRank();
      return;
    }
    this.resetList();
    if (this.isConfigurationPending) {
      uni.stopPullDownRefresh();
      return;
    }
    if (this.isLogin) {
      this.reloadChildrenList(this.activityId);
    } else {
      this.getRankTabs(this.activityId);
    }
    setTimeout(function() {
      uni.stopPullDownRefresh();
    }, 1000);
  }

  onRefresh() {
    this.refreshState = true;
    if (this.isScienceTrainRank) {
      this.loadScienceTrainPublicRank(1, true);
      this.refreshScienceTrainPersonalRank();
      return;
    }
    this.resetList();
    if (this.isConfigurationPending) {
      this.refreshState = false;
      return;
    }
    if (this.isLogin) {
      this.reloadChildrenList(this.activityId);
    } else {
      this.getRankTabs(this.activityId);
      this.refreshState = false;
    }
    setTimeout(function() {
      uni.stopPullDownRefresh();
    }, 1000);
  }
  // 科普列车排行榜直接打开用户报名面板
  goToDetail() {
    if (this.isScienceTrainRank || this.isConfigurationPending) {
      uni.navigateTo({
        url: "/pages/kjgActivityDetail/index?openRegistration=1",
      });
      return;
    }
    uni.redirectTo({
      url: `/pages/activityDetail/index?id=${this.activityId}`,
    });
  }

  resetList() {
    // this.activityId = this.defaultActivityId;
    this.pageNo = 1;
    this.pageSize = 10;
    this.rankList = [];
  }

  resetPersonalRankState() {
    this.userSelectItems = [];
    this.currentChild = new ActivityChild();
    this.currentUserCore = "";
    this.currentUserRank = "";
    this.personalRankStage = "idle";
    this.personalRankMessage = "";
    this.personalRankSubUserId = "";
    this.personalRankRequestVersion += 1;
  }

  onNavChange(navItem: NavItem) {
    if (this.isScienceTrainRank || this.isConfigurationPending) {
      return;
    }
    // 暂时不执行任何操作，这个版本就一个排名分类
    // return;
    this.resetList();
    this.navId = navItem.id;
    this.getRankList(this.activityId, navItem.id, 1);
    if (this.isLogin) {
      this.updateUserRank();
    }
  }

  onChangeChild(child: ActivityChild) {
    if (!child) {
      return;
    }
    this.currentChild = child;
    if (this.isScienceTrainRank) {
      if (!isMockMode()) {
        this.loadScienceTrainPersonalRank(String(child.userId));
      }
      return;
    }
    if (this.isConfigurationPending) {
      this.updatePendingLocalPoints(child.userId);
      return;
    }
    if (this.isLogin) {
      this.updateUserRank();
    }
    // 切换孩子的时候清空排行榜
    this.resetList();
    this.getRankList(this.activityId, this.navId, this.pageNo);
  }

  loadLocalRegisteredParticipants() {
    if (!isMockMode()) {
      this.loadRealRegisteredParticipants();
      return;
    }
    const participants = KjgMockAccount.getParticipants().filter((participant) =>
      KjgMockAccount.isRegistered(participant.id)
    );
    const activeParticipant = KjgMockAccount.getActiveParticipant();
    const activeIndex = activeParticipant
      ? participants.findIndex((participant) => participant.id === activeParticipant.id)
      : -1;
    if (activeIndex > 0) {
      const activeItems = participants.splice(activeIndex, 1);
      participants.unshift(activeItems[0]);
    }
    this.userSelectItems = participants.map((participant) => {
      const child = new ActivityChild();
      child.userId = participant.id;
      child.avatar = participant.avatar || "https://contentdevsa-blob.ai121.net/testcontainer/621684277780484154_621684965985294154.png";
      child.realName = participant.name;
      child.orgName = participant.school;
      child.grade = participant.grade;
      return child;
    });
    this.currentChild = this.userSelectItems[0] || new ActivityChild();
    if (this.isScienceTrainRank) {
      this.currentUserCore = "";
      this.currentUserRank = "";
    } else {
      this.updatePendingLocalPoints(this.currentChild.userId);
    }
  }

  loadRealRegisteredParticipants() {
    this.participantService
      .getRegisteredParticipants()
      .then((response) => {
        if (!response.success || !Array.isArray(response.data)) {
          uni.showToast({
            title: response.error || response.code || "用户读取失败",
            icon: "none",
          });
          return;
        }
        const activeSubUserId =
          ScienceTrainParticipantManagement.getActiveSubUserId();
        const participants = response.data.slice();
        const activeIndex = participants.findIndex(
          (participant) => String(participant.userId) === activeSubUserId
        );
        if (activeIndex > 0) {
          const activeItems = participants.splice(activeIndex, 1);
          participants.unshift(activeItems[0]);
        }
        this.userSelectItems = participants;
        this.currentChild = this.userSelectItems[0] || new ActivityChild();
        if (this.isScienceTrainRank) {
          this.loadScienceTrainPersonalRank(
            String(this.currentChild.userId || "")
          );
        } else {
          this.updatePendingLocalPoints(String(this.currentChild.userId || ""));
        }
      })
      .catch(() => {
        uni.showToast({ title: "用户读取失败，请检查网络", icon: "none" });
      });
  }

  updatePendingLocalPoints(participantId: string) {
    const points = participantId
      ? KjgMockAccount.getTotalPointsForParticipant(participantId)
      : 0;
    this.currentUserCore = points > 0 ? String(points) : "";
    this.currentUserRank = "";
  }

  refreshScienceTrainPersonalRank() {
    if (!this.isLogin || isMockMode() || !this.currentChild.userId) {
      return;
    }
    this.loadScienceTrainPersonalRank(String(this.currentChild.userId));
  }

  loadScienceTrainPersonalRank(subUserId: string) {
    if (!subUserId) {
      this.currentUserCore = "";
      this.currentUserRank = "";
      this.personalRankStage = "idle";
      this.personalRankMessage = "";
      this.personalRankSubUserId = "";
      this.personalRankRequestVersion += 1;
      return;
    }
    if (
      this.personalRankSubUserId === subUserId &&
      this.personalRankStage === "loading"
    ) {
      return;
    }

    this.personalRankSubUserId = subUserId;
    const requestVersion = ++this.personalRankRequestVersion;
    const hasCurrentData = !!(this.currentUserCore || this.currentUserRank);
    this.personalRankStage = "loading";
    this.personalRankMessage = hasCurrentData
      ? "正在更新当前用户的正式积分和排名"
      : "正在读取当前用户的正式积分和排名";

    this.scienceTrainRankService
      .getPersonalRank(subUserId)
      .then((response) => {
        if (requestVersion !== this.personalRankRequestVersion) {
          return;
        }
        if (!response.success || !response.data) {
          this.handleScienceTrainPersonalRankError(
            response.code,
            response.error || "个人排名读取失败，请稍后重试"
          );
          return;
        }
        this.applyScienceTrainPersonalRank(response.data);
      })
      .catch((error) => {
        if (requestVersion !== this.personalRankRequestVersion) {
          return;
        }
        console.error("[KJG] 用户个人排名请求失败", error);
        this.currentUserCore = "";
        this.currentUserRank = "";
        this.personalRankStage = "error";
        this.personalRankMessage = "个人排名读取失败，请稍后重试";
      });
  }

  applyScienceTrainPersonalRank(data: ScienceTrainPersonalRankResponse) {
    const score =
      data.totalPoints !== undefined && data.totalPoints !== null
        ? data.totalPoints
        : data.score;
    const position =
      data.position !== undefined && data.position !== null
        ? data.position
        : data.rank;
    const hasScore =
      score !== undefined && score !== null && String(score) !== "";
    const hasPosition =
      position !== undefined && position !== null && String(position) !== "";

    this.currentUserCore = hasScore ? String(score) : "";
    this.currentUserRank = hasPosition ? String(position) : "";
    if (!hasScore && !hasPosition) {
      this.personalRankStage = "unranked";
      this.personalRankMessage = "暂无正式积分，暂未上榜";
      return;
    }

    this.personalRankStage = "ready";
    this.personalRankMessage = hasPosition
      ? ""
      : "正式积分已生成，排名正在更新";
  }

  handleScienceTrainPersonalRankError(code: string, message: string) {
    console.warn("[KJG] 用户个人排名业务失败", code, message);
    if (code === "ACTIVITY_POINTS_LEADERBOARD_NOT_READY") {
      this.personalRankStage = "pending";
      this.personalRankMessage = "个人排名正在更新，请稍后刷新";
      return;
    }
    this.currentUserCore = "";
    this.currentUserRank = "";
    if (code === "UNAUTHORIZED") {
      this.personalRankStage = "unauthorized";
      this.personalRankMessage = "登录状态已失效，重新登录后可查看个人排名";
      return;
    }
    if (code === "RANK_NOT_ENABLED") {
      this.personalRankStage = "unavailable";
      this.personalRankMessage = "当前活动暂未开放个人排名";
      return;
    }
    this.personalRankStage = "error";
    this.personalRankMessage = message || "个人排名读取失败，请稍后重试";
  }

  loadScienceTrainPublicRank(pageNo: number, replace: boolean) {
    if (this.isRankRequesting) {
      this.refreshState = false;
      uni.stopPullDownRefresh();
      return;
    }
    this.isRankRequesting = true;
    if (replace) {
      this.rankMessage = "";
      if (!this.rankList.length) {
        this.rankStage = "loading";
      }
    }

    const participantsRequest =
      replace || !Object.keys(this.scienceTrainParticipantNames).length
        ? this.scienceTrainRankService
            .getPublicParticipants()
            .catch((error) => {
              console.warn("[KJG] 公开榜单用户姓名请求失败", error);
              return null;
            })
        : Promise.resolve(null);

    Promise.all([
      this.scienceTrainRankService.getPublicTotalRank(pageNo, this.pageSize),
      participantsRequest,
    ])
      .then(([response, participantsResponse]) => {
        if (!response.success || !response.data) {
          this.handleScienceTrainRankError(
            response.code,
            response.error || "排行榜加载失败，请稍后重试"
          );
          return;
        }

        const data: ScienceTrainRankResponse = response.data;
        const participantData: ScienceTrainPublicParticipantResponse | null =
          participantsResponse && participantsResponse.success
            ? participantsResponse.data || null
            : null;
        if (participantData && Array.isArray(participantData.records)) {
          this.scienceTrainParticipantNames =
            buildScienceTrainParticipantNameMap(participantData.records);
        }
        const records = Array.isArray(data.records) ? data.records : [];
        const mappedRecords = records.map((record) =>
          this.mapScienceTrainRankRecord(
            record,
            this.scienceTrainParticipantNames
          )
        );
        this.pageNo = Number(data.pageNo || pageNo);
        this.pages = String(data.pages || "0");
        this.rankList = replace
          ? mappedRecords
          : this.appendUniqueRankRecords(mappedRecords);
        this.rankStage = this.rankList.length ? "ready" : "empty";
        this.rankMessage = "";
      })
      .catch((error) => {
        console.error("[KJG] 公开总分榜请求失败", error);
        this.rankMessage = "网络异常，请检查网络后重试";
        this.rankStage = this.rankList.length ? "ready" : "error";
      })
      .then(() => {
        this.isRankRequesting = false;
        this.refreshState = false;
        uni.stopPullDownRefresh();
      });
  }

  mapScienceTrainRankRecord(
    record: ScienceTrainRankRecord,
    participantNames: ScienceTrainParticipantNameMap
  ): RankListItemType {
    return {
      id: String(record.userId || ""),
      rank: Number(record.position || 0),
      icon: this.mapRankPostionIcon(String(record.position || "")),
      avatar: record.userAvatar || "https://contentdevsa-blob.ai121.net/testcontainer/621684277780484154_621684965985294154.png",
      teamName: getScienceTrainRankParticipantName(record, participantNames),
      schoolName: "",
      score: String(record.totalPoints || record.score || "0"),
    };
  }

  appendUniqueRankRecords(
    records: RankListItemType[]
  ): RankListItemType[] {
    const existingIds = this.rankList.map((item) => item.id);
    return this.rankList.concat(
      records.filter((item) => existingIds.indexOf(item.id) < 0)
    );
  }

  handleScienceTrainRankError(code: string, message: string) {
    console.warn("[KJG] 公开总分榜业务失败", code, message);
    const state = getScienceTrainLeaderboardErrorState(
      code,
      message,
      this.rankList.length > 0
    );
    if (code === "RANK_NOT_ENABLED") {
      this.rankList = [];
    }
    this.rankMessage = state.message;
    this.rankStage = state.stage;
  }

  retryScienceTrainRank() {
    this.loadScienceTrainPublicRank(1, true);
    this.refreshScienceTrainPersonalRank();
  }

  getChildrenList(activityId: string) {
    this.childrenService.getActivityChildren(activityId).then((res) => {
      if (res.success && res.data) {
        const data = res.data;
        const userSelectItems = data.filter((child) => child.isEntry);
        this.userSelectItems = userSelectItems;
        this.currentChild = userSelectItems[0] || new ActivityChild();

        // 获取 tab 数据
        this.getRankTabs(this.activityId);
      }
    });
  }

  reloadChildrenList(activityId: string) {
    this.childrenService.getActivityChildren(activityId).then((res) => {
      if (res.success && res.data) {
        const data = res.data;
        const userSelectItems = data.filter((child) => child.isEntry);
        this.userSelectItems = userSelectItems;
        // this.currentChild =  this.currentChild ? userSelectItems[0] :  this.currentChild

        // console.log("重置当前孩子数据");
        this.refreshState = false;

        // 获取 tab 数据
        this.getRankTabs(this.activityId);
      }
    });
  }

  getRankTabs(activityId: string) {
    this.activityService.getRankTabs(activityId).then((res) => {
      if (res.success && res.data) {
        const data = res.data;
        if (data.rankRefreshTimes !== "") {
          let rankRule1 = data.rankRefreshTimes.split(",");
          for (let i = 0; i < rankRule1.length; i++) {
            rankRule1[i] = rankRule1[i] + ":00";
          }
          this.rankUpdateRule = `${rankRule1.toString()}`;
        } else {
          this.rankUpdateRule = '';
        }
        // this.rankRule = addRichClass(appendStyle(data.rankRuleDesc));
        this.rankRule = data.rankRuleDesc;

        const rankItems = Array.isArray(data.rankItems) ? data.rankItems : [];
        const navs = rankItems.map((item) => ({
          id: item.type,
          text: item.title,
        }));

        this.navs = navs;
        if (navs.length === 0) {
          this.navId = "";
          this.rankList = [];
          this.currentUserRank = "";
          this.currentUserCore = "";
          return;
        }
        this.navId = navs[0].id;

        // 获取第一个排行数据
        this.getRankList(this.activityId, navs[0].id, 1);
        // 获取当前用户排名数据
        if (this.isLogin) {
          this.updateUserRank();
        }
      }
    });
  }

  getRankList(activityId: string, type: string, page: number) {
    if (!activityId || !type) {
      return;
    }
    this.data.pageNo = page;
    this.data.pageSize = 10;
    const childId = this.isLogin ? this.currentChild.userId : "";
    this.activityService.getRankList(
      activityId,
      type,
      this.data,
      childId,
      this.getRankListCallback
    );
  }

  getRankListCallback(success, data) {
    if (success && data) {
      const records = Array.isArray(data.records) ? data.records : [];
      this.pages = data.pages;
      const rankList = records.map((record, index) => ({
        id: record.userId,
        rank: Number(record.position),
        icon: this.mapRankPostionIcon(record.position),
        avatar: record.userAvatar,
        teamName: record.teamName,
        schoolName: record.orgName,
        score: this.saveFourDecimalPlaces(record.score + ""),
      }));
      this.rankList = this.rankList.concat(rankList);
      // console.log("排行榜列表数据", rankList);
    }
  }

  // 战队积分保留小数点后四位
  saveFourDecimalPlaces(scoreString: string): string {
    let score: string = "";
    let scoreList = scoreString.split(".");
    if (scoreList.length <= 1) {
      score = scoreList[0];
    } else {
      let decimals = scoreList[1];
      if (decimals.length > 4) {
        score = Number(scoreString).toFixed(4);
      } else {
        score = scoreString;
      }
    }
    return score;
  }

  updateUserRank() {
    if (
      !this.isLogin ||
      !this.activityId ||
      !this.navId ||
      !this.currentChild.userId
    ) {
      this.currentUserRank = "";
      this.currentUserCore = "";
      return;
    }
    const activityId = this.activityId;
    const type = this.navId;
    const teamId = this.currentChild.team?.id || "0";
    const userId = this.currentChild.userId;

    this.activityService
      .getUserRank(activityId, type, teamId, userId)
      .then((res) => {
        if (res.success && res.data) {
          if (res.success && res.data) {
            this.currentUserRank = res.data.position;
            this.currentUserCore = this.saveFourDecimalPlaces(
              res.data.score + ""
            );
          }
        } else {
          this.currentUserRank = "";
          this.currentUserCore = "";
        }
      });
  }
  // changeDialog(state: boolean) {
  //   console.log("点击了点击事件，用于打开弹窗", state);

  //   this.dialogState = state;
  // }

  toRankRule(rankRule: string) {
    if (this.isScienceTrainRank) {
      uni.navigateTo({
        url: "/pages/kjgActivityDetail/index",
      });
      return;
    }
    if (this.isConfigurationPending) {
      uni.showToast({
        title: "排行榜规则待业务接口接入",
        icon: "none",
      });
      return;
    }
    // console.log("这里打印rankRue", rankRule);
    uni.$emit("toRank", rankRule);
    const rankRule11 = encodeURIComponent(rankRule);
    uni.navigateTo({
      url: `/pages/rank/rankRule?content=${rankRule11}`,
    });
  }
}

const addRichClass = (content: string) => {
  const reg = new RegExp("<([a-z\\d]+)", "g");
  return content.replace(reg, '<$1 class="rich-$1"');
};

const appendStyle = (content: string) => {
  const style = `
<style>
img {
  max-width: 100%;
}
p {
  line-height: 2;
}
ul {
  list-style: none;
}
.rich-ul {
  list-style: none;
}
</style>
  `;

  return "<div>" + content + style + "</div>";
};
</script>
<style scoped lang="scss">
.rank-page {
  position: relative;
  box-sizing: border-box;
  height: 100vh;
  min-height: 100vh;
  overflow: hidden;
}

.rank-scroll {
  box-sizing: border-box;
  width: 100%;
  height: 100vh;
}

.box {
  box-sizing: border-box;
  min-height: 100%;
  padding-bottom: calc(180rpx + env(safe-area-inset-bottom));
}
.header-box {
  background: #fff;
  padding: 40rpx 0;
  border-radius: 40rpx;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
}

.rule-row {
  display: flex;
  justify-content: flex-end;
  padding: 20rpx 40rpx;
}

.rule-btn {
  color: #5181d9;
  border: 1px solid #5181d9;
  padding: 10rpx 20rpx;
  font-size: 28rpx;
  border-radius: 10rpx;
}

.team-name {
  text-align: center;
  font-size: 44rpx;
  font-weight: bold;
  margin-bottom: 35rpx;
  color: #555555;
}

.user-school {
  text-align: center;
  font-size: 30rpx;
  margin-bottom: 35rpx;
}

.rank-text {
  font-size: 30rpx;
  margin-top: 35rpx;
  margin-bottom: 35rpx;
  color: #f2a563;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.team-core {
  width: 45%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.center-line {
  font-size: 40rpx;
  color: #dedede;
}
.team-text {
  color: #c1c1c1;
  padding-right: 20rpx;
}
.team-text-empty {
  color: #f89430;
}
.team-num {
  font-size: 40rpx;
  font-weight: 500;
  color: #f89430;
}

.personal-rank-hint {
  margin: 35rpx 0;
  color: #999999;
  font-size: 28rpx;
  line-height: 1.5;
  text-align: center;
}

.personal-rank-status {
  margin: -15rpx 0 35rpx;
  color: #999999;
  font-size: 26rpx;
  line-height: 1.5;
  text-align: center;
}

.nav-box {
  margin: 40rpx;
  /deep/ .van-button {
    border-radius: 16rpx;
  }
}
.fixed {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 68rpx;
  width: 100%;
  box-sizing: border-box;
  z-index: 1;
  padding: 0 40rpx;

  /deep/ .van-button {
    border-radius: 16rpx;
  }
}

.rank-list-box {
  padding: 0 50rpx 50rpx;
  min-height: 500rpx;
}

.rank-pending-box {
  box-sizing: border-box;
  min-height: 500rpx;
  margin: 0 50rpx 50rpx;
  padding: 120rpx 48rpx;
  border: 2rpx dashed #d8d8d8;
  border-radius: 20rpx;
  text-align: center;
}

.rank-pending-title {
  color: #555555;
  font-size: 34rpx;
  font-weight: 600;
}

.rank-pending-text {
  margin-top: 24rpx;
  color: #a0a0a0;
  font-size: 28rpx;
  line-height: 1.7;
}

.rank-retry {
  display: inline-block;
  margin-top: 32rpx;
  padding: 14rpx 30rpx;
  border: 2rpx solid #5181d9;
  border-radius: 10rpx;
  color: #5181d9;
  font-size: 27rpx;
}

.rank-notice {
  margin-bottom: 24rpx;
  padding: 18rpx 22rpx;
  border-radius: 10rpx;
  background: #fff7e8;
  color: #9a6a25;
  font-size: 26rpx;
  line-height: 1.5;
  text-align: center;
}

.rank-list-state {
  padding: 28rpx 0 12rpx;
  color: #999999;
  font-size: 26rpx;
  text-align: center;
}

.rank-rule {
  color: #a0a0a0;
  font-size: 32rpx;
  text-align: center;
  margin-bottom: 10rpx;
  padding: 0 40rpx;
  word-wrap: break-word;
  word-break: break-word;
}

.rank-page--kjg {
  background: linear-gradient(180deg, #f7f3ea 0%, #edf7f7 58%, #f8fbfa 100%);
  color: #17365f;

  .header-box {
    border: 2rpx solid rgba(183, 220, 229, 0.92);
    background: rgba(255, 253, 249, 0.96);
    box-shadow: 0 12rpx 32rpx rgba(18, 71, 103, 0.08);
  }

  .rule-btn {
    border: 2rpx solid #b8dce5;
    border-radius: 999rpx;
    background: #f3fafa;
    color: #1b63d9;
  }

  .team-name {
    color: #123d73;
  }

  .user-school,
  .team-text,
  .personal-rank-hint,
  .personal-rank-status,
  .rank-list-state,
  .rank-rule {
    color: #718194;
  }

  .rank-text {
    color: #FAC12A;
  }

  .team-num,
  .team-text-empty {
    color: #FAC12A;
  }

  .center-line {
    color: #d7e8eb;
  }

  .nav-box {
    /deep/ .nav-row {
      border: 2rpx solid #c4e0e7;
      background: rgba(255, 253, 249, 0.9);
    }

    /deep/ .nav-row.shadow {
      box-shadow: 0 8rpx 22rpx rgba(18, 71, 103, 0.07);
    }

    /deep/ .nav-item {
      color: #61758a;
    }

    /deep/ .nav-item.active {
      background: #1b63d9;
      color: #fff;
    }
  }

  .rank-list-box {
    border-top: 2rpx solid rgba(185, 220, 228, 0.72);
    border-bottom: 2rpx solid rgba(185, 220, 228, 0.72);
    background: rgba(255, 253, 249, 0.7);
  }

  /deep/ .avatar-select .avatar {
    border-color: #fff;
    background: #eaf5f5;
    box-shadow: 0 8rpx 22rpx rgba(16, 74, 108, 0.12);
  }

  /deep/ .avatar-select .avatar.active {
    border-color: #1b63d9;
    box-shadow: 0 8rpx 24rpx rgba(27, 99, 217, 0.18);
  }

  /deep/ .rank-list .list-row {
    border-bottom: 2rpx solid #e2edef;
  }

  /deep/ .rank-list .list-row:last-child {
    border-bottom: 0;
  }

  /deep/ .rank-list .rank-text,
  /deep/ .rank-list .team-name {
    color: #234565;
  }

  /deep/ .rank-list .team-school {
    color: #7b8c9c;
  }

  /deep/ .rank-list .team-avatar {
    border: 4rpx solid #fff;
    background: #eaf5f5;
    box-shadow: 0 5rpx 14rpx rgba(18, 71, 103, 0.1);
  }

  /deep/ .rank-list .rank-type {
    color: #FAC12A;
  }

  .rank-pending-box {
    border-color: #afd6df;
    background: rgba(255, 253, 249, 0.72);
  }

  .rank-pending-title {
    color: #123d73;
  }

  .rank-pending-text {
    color: #718194;
  }

  .rank-retry {
    border-color: #75bdb8;
    border-radius: 999rpx;
    background: #eff9f7;
    color: #FAC12A;
  }

  .rank-notice {
    border: 2rpx solid #ead29f;
    background: #fff9eb;
  }

  .fixed {
    background: linear-gradient(
      180deg,
      rgba(248, 251, 250, 0) 0%,
      rgba(248, 251, 250, 0.92) 34%,
      #f8fbfa 100%
    );

    /deep/ .van-button {
      border: 0;
      border-radius: 999rpx;
      box-shadow: 0 10rpx 24rpx rgba(27, 99, 217, 0.2);
    }
  }
}
</style>

