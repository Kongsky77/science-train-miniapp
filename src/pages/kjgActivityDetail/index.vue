<template>
  <view class="activity-detail-page">
    <view class="hero-section">
      <view class="hero-meta">
        <view class="hero-label">活动规则</view>
      </view>
      <view class="activity-name">科普列车川渝黔行</view>
      <view class="hero-tags">
        <text>线上答题</text>
        <text>线下打卡</text>
        <text>积分抽奖</text>
      </view>
    </view>

    <view class="section-block basic-section">
      <view class="section-number">01</view>
      <view class="section-heading">
        <view class="section-title">活动基本信息</view>
      </view>

      <view class="info-list">
        <view class="info-row">
          <view class="info-label">活动时间</view>
          <view class="info-value">2026年9月23日—2026年10月22日</view>
        </view>
        <view class="info-row">
          <view class="info-label">活动对象</view>
          <view class="info-value">川渝黔三地广大市民、青少年学生、科普爱好者及线上新媒体粉丝群体</view>
        </view>
        <view class="info-row">
          <view class="info-label">指导单位</view>
          <view class="info-value">四川省科学技术协会、重庆市科学技术协会、贵州省科学技术协会</view>
        </view>
        <view class="info-row">
          <view class="info-label">主办单位</view>
          <view class="info-value">四川科技馆、重庆科技馆、贵州科技馆</view>
        </view>
        <view class="info-row">
          <view class="info-label">支持单位</view>
          <view class="info-value">四川省自然科学博物馆协会</view>
        </view>
        <view class="info-row">
          <view class="info-label">承办单位</view>
          <view class="info-value">川渝黔三地50家优质科普基地</view>
        </view>
      </view>
    </view>

    <view class="section-block format-section">
      <view class="section-number">02</view>
      <view class="section-heading">
        <view class="section-title">活动形式</view>
      </view>

      <view class="rule-group">
        <view class="rule-tag">线上活动</view>
        <view class="rule-title">科普列车云端闯关答题积分抽奖</view>
        <view class="rule-copy">
          活动设置重庆、四川、贵州三大核心板块，共6个科普站点。用户通过答题闯关逐站解锁，沉浸式体验三地自然风貌、人文特色与科普基地资源。
        </view>
        <view class="rule-list">
          <view>1. 通过各科普基地官方平台发布的活动链接或二维码进入活动。</view>
          <view>2. 每日完成6道科普题且答对3道及以上，可获得1张科普探索券。</view>
          <view>3. 科普探索券可直接参与探索奖池抽奖，也可按3张探索券合成1张科普跃迁券。</view>
          <view>4. 探索奖池与跃迁奖池相互独立，奖品均为现金红包。</view>
        </view>
      </view>

      <view class="rule-group">
        <view class="rule-tag">线下活动</view>
        <view class="rule-title">科普场馆打卡积分抽奖</view>
        <view class="rule-list">
          <view>1. 每日首次完成有效场馆打卡，可获得1张科普探索券；当日后续打卡不再重复发券。</view>
          <view>2. 50家承办科普基地与3家主办场馆，共53家场馆均可打卡并按活动积分规则计分。</view>
          <view>3. 跨场馆打卡仍可累计积分并参与积分排名。</view>
        </view>
      </view>

      <view class="score-board">
        <view class="score-title">积分总览</view>
        <view class="score-formula">总积分 = 线下打卡积分 + 线上答题积分</view>
        <view class="score-grid">
          <view class="score-item">
            <view class="score-value">600</view>
            <view class="score-label">线下打卡满分 · 60%</view>
          </view>
          <view class="score-item">
            <view class="score-value">400</view>
            <view class="score-label">线上答题满分 · 40%</view>
          </view>
          <view class="score-item score-total">
            <view class="score-value">1000</view>
            <view class="score-label">活动总积分上限</view>
          </view>
        </view>
      </view>

      <view class="rule-group compact-group">
        <view class="rule-title">线下打卡积分规则</view>
        <view class="rule-list">
          <view>· 指定科普场馆单馆仅可打卡1次，完成定位签到及场馆科普体验认证得50分。</view>
          <view>· 每名用户每日前2个场馆打卡可获得积分；超过2个的打卡仍计入有效打卡，但不再获得积分。</view>
          <view>· 首馆额外奖励20分；累计5馆额外奖励50分。</view>
          <view>· 累计10馆基础分及阶梯奖励为570分；打卡场馆覆盖四川、重庆、贵州中任意两个省市，再加30分，达到600分上限。</view>
          <view>· 超过10馆不再额外加分；未满10馆按实际打卡数量及对应阶梯奖励计分。</view>
          <view>· 有效打卡须在活动有效期及场馆开放时间内完成，且场馆处于启用状态；重复打卡同一场馆不重复计分。</view>
        </view>
      </view>

      <view class="rule-group compact-group">
        <view class="rule-title">线上答题积分规则</view>
        <view class="rule-list">
          <view>· 每日完成全部6题得10分，不要求全部答对；答错后可继续作答，只完成部分题目不计当日积分。</view>
          <view>· 首次参与当日共20分；连续5天累计70分；连续7天累计100分。</view>
          <view>· 连续15天累计250分，并获得封顶100分的连续奖励；此后每个有效完成日继续获得10分基础积分。</view>
          <view>· 全周期累计完成30天即可达到线上400分上限，累计完成天数不要求连续。</view>
          <view>· 连续奖励按已达到的最高档累计发放且不重复；中断后连续天数重新计算，已获得积分保留。</view>
          <view>· 每日按北京时间自然日计算，跨日未完成的一轮作废且不能补记；重复提交不重复计分或发券。</view>
          <view>· 每日完成6题且答对3题及以上，可获得1张科普探索券；抽奖不消耗积分。</view>
        </view>
      </view>

      <view class="rule-group compact-group">
        <view class="rule-title">抽奖券与现金红包规则</view>
        <view class="rule-list">
          <view>· 单个用户每日最多获得2张科普探索券：答题达标1张、首次有效打卡1张。</view>
          <view>· 用户可自愿将3张科普探索券合成1张科普跃迁券，合成后原探索券将被消耗；每次抽奖消耗对应奖池的1张券。</view>
          <view>· 两类奖池的中奖概率及最高红包金额以服务器当前配置为准。</view>
          <view>· 中奖后通过微信商家转账领取现金红包；可在抽奖记录中继续确认领取。</view>
          <view>· 活动结束后，所有未使用的科普探索券和科普跃迁券即刻失效。</view>
        </view>
      </view>

      <view class="rule-group compact-group">
        <view class="rule-title">同分排序与违规处理</view>
        <view class="rule-list">
          <view>· 总积分相同时，依次按以下顺序排名：线下有效打卡累计用时更短、完成第10个有效场馆时间更早、历史最高连续答题天数更多、达到当前总积分时间更早、参与用户ID更小。</view>
          <view>· 第一次确认线下违规：本次打卡作废并重新计算线下积分，相关里程碑奖励可能被追回，当日暂停继续打卡，次日恢复。</view>
          <view>· 第二次确认线下违规：全部有效打卡作废、线下积分清零、取消积分排名资格并禁止后续打卡；线上答题积分不直接清零。</view>
        </view>
      </view>
    </view>

    <view class="page-note">本页面活动时间及规则以主办方最终发布信息为准</view>

    <view class="registration-footer">
      <view class="footer-primary-action" @click="openRegistrationSheet">报名</view>
    </view>

    <van-action-sheet
      :close-on-click-overlay="!isSubmitting"
      :show="registrationSheetVisible"
      title="报名"
      @close="closeRegistrationSheet"
      @click-overlay="closeRegistrationSheet"
    >
      <view class="registration-sheet">
        <view class="sheet-copy">
          可查看全部用户；点击未报名用户为其报名，用户切换请在首页点击头像。
        </view>

        <view v-if="participantStage === 'loading'" class="sheet-state">
          正在读取用户，请稍候
        </view>
        <view v-else-if="participantStage === 'error'" class="sheet-state">
          <view>{{ participantError }}</view>
          <view class="sheet-retry" @click="loadParticipants">重新加载</view>
        </view>
        <scroll-view v-else class="participant-list" :scroll-y="true">
          <view
            v-for="participant in participants"
            :key="participant.userId"
            :class="[
              'participant-row',
              isRegistered(participant) ? 'is-registered' : '',
              isSubmitting ? 'is-busy' : '',
            ]"
            @click="handleParticipantClick(participant)"
          >
            <image
              class="participant-avatar"
              :src="participant.avatar || 'https://contentdevsa-blob.ai121.net/testcontainer/621684277780484154_621684965985294154.png'"
              mode="aspectFill"
            />
            <view class="participant-main">
              <view class="participant-name">{{ participant.realName || "未命名用户" }}</view>
              <view v-if="!isRegistered(participant)" class="participant-hint">
                {{ getParticipantHint(participant) }}
              </view>
              <view v-else class="participant-hint participant-hint-registered">
                已加入本次活动
              </view>
            </view>
            <view
              v-if="isRegistered(participant)"
              class="registered-tag"
              :class="{ 'is-current': isActiveParticipant(participant) }"
            >{{ isActiveParticipant(participant) ? "当前" : "已报名" }}</view>
            <view
              v-else-if="submittingUserId === String(participant.userId)"
              class="submitting-mark"
            >报名中</view>
          </view>

          <view v-if="!participants.length" class="empty-participants">
            当前主账号下暂无用户，请先添加用户。
          </view>
          <view class="add-participant-row" @click="addParticipant">
            <view class="add-icon">＋</view>
            <view>添加用户</view>
          </view>
        </scroll-view>
      </view>
    </van-action-sheet>
  </view>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ActivityChild from "@/beans/common/ActivityChild";
import LoginManagement from "@/management/login/LoginManagement";
import ScienceTrainParticipantManagement from "@/management/scienceTrain/ScienceTrainParticipantManagement";
import ScienceTrainParticipantService from "@/service/ScienceTrainParticipantService";

@Component({
  name: "KjgActivityDetailPage",
})
export default class KjgActivityDetailPage extends Vue {
  participantService = new ScienceTrainParticipantService();
  registrationSheetVisible = false;
  participantStage = "idle";
  participantError = "用户读取失败，请检查网络后重试。";
  participants: ActivityChild[] = [];
  isSubmitting = false;
  submittingUserId = "";
  shouldAutoOpenRegistration = false;

  onLoad(options: any) {
    this.shouldAutoOpenRegistration =
      !!options && String(options.openRegistration || "") === "1";
  }

  onShow() {
    if (this.shouldAutoOpenRegistration) {
      this.shouldAutoOpenRegistration = false;
      this.openRegistrationSheet();
      return;
    }
    if (this.registrationSheetVisible) {
      this.loadParticipants();
    }
  }

  openRegistrationSheet() {
    if (!new LoginManagement().isLogin()) {
      const returnPath = "/pages/kjgActivityDetail/index?openRegistration=1";
      uni.navigateTo({
        url:
          "/pages/login/index?pathKey=" +
          encodeURIComponent(JSON.stringify(returnPath)),
      });
      return;
    }
    this.registrationSheetVisible = true;
    this.loadParticipants();
  }

  closeRegistrationSheet() {
    if (!this.isSubmitting) {
      this.registrationSheetVisible = false;
    }
  }

  loadParticipants() {
    this.participantStage = "loading";
    this.participantError = "用户读取失败，请检查网络后重试。";
    this.participantService
      .getParticipants()
      .then((res) => {
        if (!res.success || !Array.isArray(res.data)) {
          this.participantStage = "error";
          this.participantError =
            res.error || res.code || "用户接口返回失败，请稍后重试。";
          return;
        }
        this.participants = res.data;
        const registeredParticipants = this.participants.filter((participant) =>
          this.isRegistered(participant)
        );
        const activeSubUserId = ScienceTrainParticipantManagement.getActiveSubUserId();
        const activeStillRegistered = registeredParticipants.some(
          (participant) =>
            String(participant.userId) === activeSubUserId
        );
        if (!activeStillRegistered && registeredParticipants.length) {
          ScienceTrainParticipantManagement.setActiveSubUserId(
            String(registeredParticipants[0].userId)
          );
        } else if (activeSubUserId && !activeStillRegistered) {
          ScienceTrainParticipantManagement.clearActiveSubUserId();
        }
        this.participantStage = "ready";
      })
      .catch(() => {
        this.participantStage = "error";
      });
  }

  isRegistered(participant: ActivityChild) {
    return Number(participant.isEntry) === 1;
  }

  isActiveParticipant(participant: ActivityChild) {
    return (
      this.isRegistered(participant) &&
      String(participant.userId) ===
        ScienceTrainParticipantManagement.getActiveSubUserId()
    );
  }

  isParticipantEligible(participant: ActivityChild) {
    return (
      Number(participant.inActivityRange) === 1 &&
      Number(participant.inActivityAgeRange) === 1
    );
  }

  getParticipantHint(participant: ActivityChild) {
    if (Number(participant.inActivityRange) !== 1) {
      return "不在本活动参与范围内";
    }
    if (Number(participant.inActivityAgeRange) !== 1) {
      return "不符合本活动年龄要求";
    }
    return "点击报名";
  }

  handleParticipantClick(participant: ActivityChild) {
    if (this.isSubmitting || !participant.userId) {
      return;
    }
    if (this.isRegistered(participant)) {
      uni.showToast({ title: "该用户已报名", icon: "none" });
      return;
    }
    if (!this.isParticipantEligible(participant)) {
      uni.showToast({
        title: this.getParticipantHint(participant),
        icon: "none",
        duration: 2500,
      });
      return;
    }
    this.registerParticipant(participant);
  }

  registerParticipant(participant: ActivityChild) {
    this.isSubmitting = true;
    this.submittingUserId = String(participant.userId);
    this.participantService
      .registerParticipant(this.submittingUserId)
      .then((res) => {
        if (!res.success) {
          uni.showToast({
            title: res.error || res.code || "报名失败，请稍后重试。",
            icon: "none",
            duration: 3000,
          });
          return;
        }
        participant.isEntry = 1;
        if (!ScienceTrainParticipantManagement.getActiveSubUserId()) {
          ScienceTrainParticipantManagement.setActiveSubUserId(
            String(participant.userId)
          );
        }
        const query = [
          "participantId=" + encodeURIComponent(String(participant.userId)),
          "name=" + encodeURIComponent(participant.realName || "未命名用户"),
          "avatar=" + encodeURIComponent(participant.avatar || ""),
          "orgName=" + encodeURIComponent(participant.orgName || ""),
          "grade=" + encodeURIComponent(participant.grade || ""),
        ].join("&");
        uni.navigateTo({
          url: "/pages/kjgRegistrationSuccess/index?" + query,
        });
      })
      .catch(() => {
        uni.showToast({
          title: "报名请求失败，请检查网络后重试。",
          icon: "none",
          duration: 3000,
        });
      })
      .then(() => {
        this.isSubmitting = false;
        this.submittingUserId = "";
      });
  }

  addParticipant() {
    if (!this.isSubmitting) {
      uni.navigateTo({ url: "/pages/writeChildInfo/index" });
    }
  }
}
</script>

<style lang="scss" scoped>
$blue: #165ddb;
$navy: #103873;
$teal: #078c83;
$paper: #fffdfa;
$mist: #edf5f7;
$line: #b9dce8;
$ink: #17233c;
$muted: #667085;
$danger: #d45d50;

.activity-detail-page {
  box-sizing: border-box;
  min-height: 100vh;
  padding: 24rpx 24rpx calc(180rpx + env(safe-area-inset-bottom));
  background: #f7f5ef;
  color: $ink;
  font-family: "PingFang SC", "Microsoft YaHei", Arial, sans-serif;
}

.hero-section {
  position: relative;
  box-sizing: border-box;
  padding: 28rpx 28rpx 26rpx;
  overflow: hidden;
  border: 2rpx solid rgba(185, 220, 232, 0.78);
  border-radius: 26rpx;
  background: $paper;
  box-shadow: 0 10rpx 30rpx rgba(31, 70, 112, 0.075);
}

.hero-section::after {
  position: absolute;
  right: 28rpx;
  bottom: 0;
  left: 28rpx;
  height: 4rpx;
  border-radius: 2rpx;
  background: linear-gradient(90deg, $blue, $teal);
  content: "";
}

.hero-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.hero-label {
  flex: none;
  padding: 6rpx 12rpx;
  border: 2rpx solid rgba(22, 93, 219, 0.2);
  border-radius: 20rpx;
  background: rgba(22, 93, 219, 0.055);
  color: $navy;
  font-size: 19rpx;
  font-weight: 700;
}

.activity-name {
  margin-top: 22rpx;
  color: $navy;
  font-size: 42rpx;
  font-weight: 800;
  line-height: 1.25;
}

.hero-tags {
  display: flex;
  margin-top: 20rpx;
}

.hero-tags text {
  margin-right: 10rpx;
  padding: 7rpx 13rpx;
  border-radius: 20rpx;
  background: $mist;
  color: $navy;
  font-size: 20rpx;
  font-weight: 700;
}

.section-block {
  position: relative;
  box-sizing: border-box;
  margin-top: 18rpx;
  padding: 30rpx 26rpx 32rpx;
  border: 2rpx solid rgba(185, 220, 232, 0.74);
  border-radius: 24rpx;
  background: $paper;
  box-shadow: 0 8rpx 24rpx rgba(31, 70, 112, 0.055);
}

.section-number {
  position: absolute;
  top: 26rpx;
  right: 26rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background: rgba(22, 93, 219, 0.08);
  color: $blue;
  font-size: 19rpx;
  font-weight: 800;
}

.section-heading {
  position: relative;
  z-index: 1;
  padding-right: 62rpx;
}

.section-title {
  color: $navy;
  font-size: 34rpx;
  font-weight: 800;
  line-height: 1.35;
}

.info-list {
  margin-top: 28rpx;
  border-top: 2rpx solid $line;
}

.info-row {
  display: flex;
  padding: 20rpx 0;
  border-bottom: 2rpx solid rgba(185, 220, 232, 0.55);
}

.info-label {
  flex: 0 0 126rpx;
  color: $navy;
  font-size: 24rpx;
  font-weight: 700;
}

.info-value {
  flex: 1;
  min-width: 0;
  color: $muted;
  font-size: 24rpx;
  line-height: 1.7;
}

.rule-group {
  margin-top: 28rpx;
  padding: 0 0 28rpx 18rpx;
  border-bottom: 2rpx solid rgba(185, 220, 232, 0.72);
  border-left: 5rpx solid rgba(22, 93, 219, 0.42);
}

.rule-group:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.compact-group {
  border-left-color: rgba(7, 140, 131, 0.42);
}

.rule-tag {
  display: inline-block;
  padding: 6rpx 12rpx;
  border: 2rpx solid rgba(7, 140, 131, 0.28);
  border-radius: 20rpx;
  background: rgba(7, 140, 131, 0.065);
  color: #FAC12A;
  font-size: 20rpx;
  font-weight: 700;
}

.rule-title {
  margin-top: 13rpx;
  color: $navy;
  font-size: 29rpx;
  font-weight: 800;
  line-height: 1.45;
}

.compact-group .rule-title {
  margin-top: 0;
}

.rule-copy,
.rule-list {
  margin-top: 15rpx;
  color: $muted;
  font-size: 24rpx;
  line-height: 1.78;
}

.rule-list > view + view {
  margin-top: 10rpx;
}

.score-board {
  margin-top: 28rpx;
  padding: 24rpx;
  border: 2rpx solid rgba(22, 93, 219, 0.2);
  border-radius: 20rpx;
  background: #f3f8ff;
}

.score-title {
  color: $navy;
  font-size: 29rpx;
  font-weight: 800;
}

.score-formula {
  margin-top: 10rpx;
  color: $muted;
  font-size: 22rpx;
  line-height: 1.6;
}

.score-grid {
  display: flex;
  flex-wrap: wrap;
  margin-top: 20rpx;
  overflow: hidden;
  border: 2rpx solid $line;
  border-radius: 16rpx;
  background: $paper;
}

.score-item {
  box-sizing: border-box;
  width: 50%;
  padding: 20rpx 10rpx;
  text-align: center;
}

.score-item + .score-item {
  border-left: 2rpx solid $line;
}

.score-total {
  width: 100%;
  border-top: 2rpx solid $line;
  border-left: 0 !important;
  background: rgba(7, 140, 131, 0.055);
}

.score-value {
  color: #FAC12A;
  font-size: 38rpx;
  font-weight: 800;
}

.score-label {
  margin-top: 6rpx;
  color: $muted;
  font-size: 20rpx;
  line-height: 1.45;
}

.page-note {
  padding: 28rpx 18rpx 0;
  color: $muted;
  font-size: 21rpx;
  line-height: 1.6;
  text-align: center;
}

.registration-footer {
  position: fixed;
  z-index: 10;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  box-sizing: border-box;
  padding: 16rpx 24rpx calc(env(safe-area-inset-bottom) + 16rpx);
  border-top: 2rpx solid rgba(185, 220, 232, 0.78);
  background: rgba(255, 253, 250, 0.98);
  box-shadow: 0 -10rpx 30rpx rgba(31, 70, 112, 0.1);
}

.footer-primary-action {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-height: 86rpx;
  padding: 12rpx;
  border: 2rpx solid $blue;
  border-radius: 43rpx;
  background: $blue;
  color: $paper;
  font-size: 27rpx;
  font-weight: 700;
  text-align: center;
}

.footer-primary-action:active {
  opacity: 0.78;
}

.registration-sheet {
  box-sizing: border-box;
  padding: 0 24rpx calc(env(safe-area-inset-bottom) + 24rpx);
  color: $ink;
}

.sheet-copy {
  padding: 8rpx 4rpx 20rpx;
  color: $muted;
  font-size: 23rpx;
  line-height: 1.6;
}

.sheet-state,
.empty-participants {
  padding: 64rpx 24rpx;
  color: $muted;
  font-size: 25rpx;
  line-height: 1.6;
  text-align: center;
}

.sheet-retry {
  margin-top: 22rpx;
  color: $blue;
  font-weight: 700;
  text-decoration: underline;
}

.participant-list {
  max-height: 720rpx;
  border-top: 2rpx solid rgba(185, 220, 232, 0.72);
}

.participant-row,
.add-participant-row {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  min-height: 126rpx;
  padding: 20rpx 8rpx;
  border-bottom: 2rpx solid rgba(185, 220, 232, 0.58);
}

.participant-row.is-busy {
  opacity: 0.72;
}

.participant-row.is-registered {
  background: rgba(7, 140, 131, 0.055);
}

.participant-avatar {
  flex: 0 0 82rpx;
  width: 82rpx;
  height: 82rpx;
  margin-right: 18rpx;
  border: 2rpx solid $line;
  border-radius: 50%;
  background: $mist;
}

.participant-main {
  flex: 1;
  min-width: 0;
}

.participant-name {
  color: $navy;
  font-size: 29rpx;
  font-weight: 700;
}

.participant-hint {
  margin-top: 5rpx;
  color: $danger;
  font-size: 21rpx;
}

.participant-hint-registered {
  color: #FAC12A;
}

.registered-tag,
.submitting-mark {
  flex: 0 0 auto;
  margin-left: 10rpx;
  padding: 7rpx 11rpx;
  border: 2rpx solid rgba(22, 93, 219, 0.34);
  border-radius: 20rpx;
  color: $navy;
  font-size: 20rpx;
  font-weight: 700;
}

.registered-tag {
  border-color: rgba(7, 140, 131, 0.36);
  color: #FAC12A;
}

.registered-tag.is-current {
  border-color: $teal;
  background: $teal;
  color: $paper;
}

.submitting-mark {
  color: $muted;
}

.add-participant-row {
  color: $blue;
  font-size: 27rpx;
  font-weight: 700;
}

.add-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 82rpx;
  height: 82rpx;
  margin-right: 18rpx;
  border: 2rpx dashed rgba(22, 93, 219, 0.4);
  border-radius: 50%;
  background: rgba(22, 93, 219, 0.05);
  font-size: 42rpx;
  font-weight: 400;
}

@media screen and (max-width: 350px) {
  .activity-name {
    font-size: 38rpx;
  }

  .info-row {
    display: block;
  }

  .info-value {
    margin-top: 8rpx;
  }
}
</style>
