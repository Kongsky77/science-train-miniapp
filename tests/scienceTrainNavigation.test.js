const fs = require("fs");
const path = require("path");

const readPage = (relativePath) =>
  fs.readFileSync(path.resolve(__dirname, relativePath), "utf8");

describe("科普列车页面跳转", () => {
  test("打卡页进入科普列车排行榜", () => {
    const source = readPage("../src/pages/kjgCheckIn/index.vue");
    expect(source).toContain(
      '"/pages/rank/index?mode=scienceTrain&activityId="'
    );
    expect(source).toContain("encodeURIComponent(SCIENCE_TRAIN_ACTIVITY_ID)");
    expect(source).toContain("当前总积分：");
    expect(source).not.toContain("当前活动总积分：");
  });

  test("选择打卡场馆后立即校验位置并精简页面步骤", () => {
    const source = readPage("../src/pages/kjgCheckIn/index.vue");
    const selectVenueStart = source.indexOf("async selectVenueFromPanel");
    const selectVenueSource = source.slice(
      selectVenueStart,
      source.indexOf("  venueStateText(venue", selectVenueStart)
    );

    expect(source).toContain("选择并校验场馆");
    expect(source).toContain("venue-validation-status");
    expect(selectVenueSource).toContain("await this.verifyLocation();");
    expect(source).toContain('class="section photo-section"');
    expect(source).toContain("{{ photoPlaceholderText }}");
    expect(source).toContain("{{ photoActionText }}");
    expect(source).toContain('class="daily-limit-notice"');
    expect(source).toContain("超过2个仍计入有效打卡，但不再获得积分");
    expect(source).not.toContain(
      'v-if="selectedVenue && selectedVenue.photoRequired && locationVerified && locationInRange"'
    );
    expect(source).not.toContain('class="step-index"');
    expect(source).not.toContain(">定位校验<");
    expect(source).not.toContain("开始校验");
    expect(source).not.toContain('@click="verifyLocation"');
  });

  test("排行榜报名入口直接打开报名面板并保留返回栈", () => {
    const source = readPage("../src/pages/rank/index.vue");
    expect(source).toContain(
      'url: "/pages/kjgActivityDetail/index?openRegistration=1"'
    );
    expect(source).toContain("uni.navigateTo({");
    expect(source).toContain('"报名" : "为其他用户报名"');
  });

  test("登录页不显示接口联调标记", () => {
    const source = readPage("../src/pages/login/index.vue");

    expect(source).not.toContain("真实接口联调");
    expect(source).not.toContain("integration-badge");
    expect(source).not.toContain("isIntegrationMode");
  });

  test("首页头像切换参与者，个人中心直达完整资料页", () => {
    const source = readPage("../src/pages/tab/index.vue");
    const switcherLoadSource = source.slice(
      source.indexOf("loadParticipantSwitcher() {"),
      source.indexOf("switchParticipant(participant")
    );
    expect(source).toContain('@click="openParticipantSwitcher"');
    expect(source).toContain('@click="goToPersonalCenter"');
    expect(source).toContain('title="切换用户"');
    expect(source).toContain("为其他用户报名");
    expect(source).not.toContain('class="switcher-meta"');
    expect(switcherLoadSource).not.toContain("participant.school");
    expect(switcherLoadSource).not.toContain("participant.grade");
    expect(switcherLoadSource).not.toContain("participant.orgName");
    expect(source).toContain('"/pages/setting/index"');
    expect(source).toContain("`?currentId=${encodeURIComponent(currentId)}`");
    expect(source).not.toContain('"/pages/editInfo/index"');
    expect(source).not.toContain('@click="goToHonor"');
  });

  test("首页与切换弹窗共享响应式的当前参与者状态", () => {
    const source = readPage("../src/pages/tab/index.vue");
    const switchSource = source.slice(
      source.indexOf("switchParticipant(participant"),
      source.indexOf("goToRegistrationFromSwitcher()")
    );

    expect(source).toContain('activeParticipantId = "";');
    expect(source).not.toContain("get activeParticipantId(): string");
    expect(source).toContain("this.activeParticipantId = activeSubUserId;");
    expect(source).toMatch(
      /this\.activeParticipantId\s*=\s*ScienceTrainParticipantManagement\.getActiveSubUserId\(\);/
    );
    expect(switchSource).toContain(
      "this.activeParticipantId = participant.id;"
    );
    expect(switchSource).toContain(
      "participant.id === this.renderedParticipantId"
    );
    expect(switchSource).toContain("this.refreshHomeState(true)");
    expect(source).toContain(
      "participant.id === activeParticipantId"
    );
  });

  test("首页自动选择第一个已报名参与者", () => {
    const source = readPage("../src/pages/tab/index.vue");
    expect(source).toContain("if (registeredParticipants.length)");
    expect(source).toContain(
      "String(registeredParticipants[0].userId)"
    );
    expect(source).toContain("this.refreshHomeState(true)");
  });

  test("首页进入打卡前检查登录和当前参与者", () => {
    const source = readPage("../src/pages/tab/index.vue");
    const methodSource = source.slice(
      source.indexOf("goToCheckIn()"),
      source.indexOf("goToLottery()")
    );
    expect(methodSource).toContain("if (!this.isLoggedIn)");
    expect(methodSource).toContain(
      "ScienceTrainParticipantManagement.getActiveSubUserId()"
    );
    expect(methodSource).toContain("KjgMockAccount.getActiveParticipant()");
    expect(methodSource).toContain("this.goToRegistration()");
    expect(methodSource).toContain('const url = "/pages/kjgCheckIn/index"');
    expect(methodSource).toContain("this.showLoginPrompt(");
  });

  test("未登录进入答题、打卡和抽奖前先展示可取消的登录提示", () => {
    const source = readPage("../src/pages/tab/index.vue");
    const promptSource = source.slice(
      source.indexOf("showLoginPrompt(content: string, returnPath: string)"),
      source.indexOf("goToRanking()")
    );

    expect(promptSource).toContain('title: "登录提示"');
    expect(promptSource).toContain('cancelText: "暂不登录"');
    expect(promptSource).toContain('confirmText: "去登录"');
    expect(promptSource).toContain("if (!result.confirm)");
    expect(promptSource).toContain('"/pages/login/index?pathKey="');
    expect(source).toContain(
      "登录后可记录答题进度、领取探索券并累计活动积分。是否前往登录？"
    );
    expect(source).toContain(
      "登录后可记录场馆打卡、领取探索券并累计活动积分。是否前往登录？"
    );
    expect(source).toContain(
      "登录后可使用探索券参与抽奖并查看中奖记录。是否前往登录？"
    );
  });

  test("首页答题跳转超时时先确认页面状态且不重复 navigateTo", () => {
    const source = readPage("../src/pages/tab/index.vue");
    const methodSource = source.slice(
      source.indexOf("goToQuiz()"),
      source.indexOf("goToCheckIn()")
    );

    expect(methodSource).toContain('const url = "/pages/kjgQuiz/index"');
    expect(methodSource).toContain("if (!this.isLoggedIn)");
    expect(methodSource).toContain("this.openQuizPage(url)");
    expect(methodSource).toContain("confirmQuizNavigation");
    expect(methodSource).toContain(
      "isCurrentPageRoute(getCurrentPages(), url)"
    );
    expect(methodSource).toContain("uni.redirectTo({");
    expect(methodSource).not.toContain("this.openQuizPage(url, true)");
    expect(methodSource).not.toContain(
      "答题页面首次跳转失败，自动重试"
    );
  });

  test("答题结算进入抽奖页时替换当前页并让抽奖骨架先渲染", () => {
    const quizSource = readPage("../src/pages/kjgQuiz/index.vue");
    const lotterySource = readPage("../src/pages/kjgLottery/index.vue");
    const navigationStart = quizSource.indexOf("goToLottery()");
    const navigationSource = quizSource.slice(
      navigationStart,
      quizSource.indexOf("navigateBackHome(", navigationStart)
    );
    const onShowSource = lotterySource.slice(
      lotterySource.indexOf("onShow()"),
      lotterySource.indexOf("onUnload()")
    );

    expect(navigationSource).toContain('const url = "/pages/kjgLottery/index"');
    expect(navigationSource).toContain(
      'const navigationUrl = `${url}?source=quiz-completion`'
    );
    expect(navigationSource).toContain("url: navigationUrl");
    expect(navigationSource).toContain("uni.redirectTo({");
    expect(navigationSource).toContain(
      "isCurrentPageRoute(getCurrentPages(), url)"
    );
    expect(navigationSource).not.toContain("uni.navigateTo({");
    expect(onShowSource).toContain("this.$nextTick(() =>");
    expect(onShowSource).toContain("this.refreshLottery()");
    expect(lotterySource).toContain(
      'this.shouldSyncQuizReward = options.source === "quiz-completion"'
    );
    expect(lotterySource).toContain(
      "summary.onlineTicketGrantedToday === true"
    );
    expect(lotterySource).toContain("this.scheduleQuizRewardSync(");
  });

  test("科普列车公开排行榜只展示参与者姓名", () => {
    const pageSource = readPage("../src/pages/rank/index.vue");
    const listSource = readPage("../src/components/rank/RankList.vue");

    expect(pageSource).toContain(":show-secondary=\"!isScienceTrainRank\"");
    expect(pageSource).toContain(
      'v-if="!isScienceTrainRank" class="user-school"'
    );
    expect(pageSource).toContain("getScienceTrainRankParticipantName(");
    expect(pageSource).not.toContain('teamName: "参与者"');
    expect(pageSource).toContain('schoolName: ""');
    expect(listSource).toContain(
      'v-if="showSecondary && item.schoolName"'
    );
  });

  test("答题页题号可回看已答题目且未开放题目保持只读", () => {
    const source = readPage("../src/pages/kjgQuiz/index.vue");

    expect(source).toContain('@click="selectRealStation(station)"');
    expect(source).toContain("canSelectRealStation(station)");
    expect(source).toContain('station.status === "OPEN"');
    expect(source).toContain("!!this.realStationReviews[station.itemId]");
    expect(source).toContain("this.rememberRealStationAnswer(feedback)");
    expect(source).toContain("this.isReviewingRealStation ||");
    expect(source).toContain('return "返回当前题目"');
  });

  test("活动规则报名面板展示全部参与者并标记报名状态", () => {
    const source = readPage("../src/pages/kjgActivityDetail/index.vue");
    expect(source).toContain(
      '<view class="footer-primary-action" @click="openRegistrationSheet">报名</view>'
    );
    expect(source).toContain('v-for="participant in participants"');
    expect(source).toContain('class="registered-tag"');
    expect(source).toContain("isActiveParticipant(participant)");
    expect(source).not.toContain(
      '<view v-if="participant.orgName" class="participant-meta">'
    );
    expect(source).not.toContain(
      '<view v-if="participant.grade" class="participant-meta">'
    );
    expect(source).not.toContain('class="participant-meta"');
    expect(source).toContain(
      "String(registeredParticipants[0].userId)"
    );
    expect(source).toContain(
      "if (!ScienceTrainParticipantManagement.getActiveSubUserId())"
    );
    expect(source).toContain("String(participant.userId)");
  });

  test("报名成功页返回首页并重建首页栈", () => {
    const source = readPage("../src/pages/kjgRegistrationSuccess/index.vue");
    expect(source).toContain('@click="backHome"');
    expect(source).toContain("<text>返回首页</text>");
    expect(source).toContain(
      'uni.reLaunch({ url: "/pages/tab/index" })'
    );
    expect(source).not.toContain("backToParticipants");
    expect(source).not.toContain('"/pages/kjgActivityDetail/index"');
  });

  test("新建用户只填写选填姓名和收件地址", () => {
    const formSource = readPage("../src/pages/writeChildInfo/index.vue");
    const avatarSource = readPage("../src/pages/avatar/index.vue");
    const requestSource = readPage(
      "../src/beans/children/req/AddChildRequest.ts"
    );

    expect(formSource).toContain('placeholder="姓名(选填)"');
    expect(formSource).toContain('placeholder="收件地址（选填）"');
    expect(formSource).not.toContain('placeholder="手机号（选填）"');
    expect(formSource).not.toContain('aria-label="手机号"');
    expect(formSource).toContain('<textarea');
    expect(formSource).toContain('@input="onRecipientAddressInput"');
    expect(formSource).not.toContain('type="textarea"');
    expect(formSource).not.toContain("contactsMobile");
    expect(formSource).not.toContain('title: "请填写收件地址"');
    expect(formSource).toContain("recipientAddress,");
    expect(formSource).not.toContain('placeholder="学校：非必填，可忽略"');
    expect(formSource).not.toContain("toggleGradePopUp");
    expect(formSource).not.toContain("selectSchool()");

    expect(avatarSource).not.toContain("contactsMobile: preData.contactsMobile");
    expect(avatarSource).toContain(
      "recipientAddress: preData.recipientAddress"
    );
    expect(avatarSource).not.toContain("requestData.grade = preData.grade");
    expect(avatarSource).not.toContain("requestData.orgCode = preData.school");
    expect(requestSource).toContain("contactsMobile?: string = ''");
    expect(requestSource).toContain("recipientAddress?: string = ''");
    expect(requestSource).not.toContain("mailingAddress");
  });

  test("个人中心可编辑姓名和收件地址并通过详情接口恢复保存值", () => {
    const source = readPage("../src/pages/setting/index.vue");
    const childrenServiceSource = readPage(
      "../src/service/ChildrenService.ts"
    );
    const responseSource = readPage(
      "../src/beans/common/UserInfoResponse.ts"
    );
    const mockSource = readPage("../src/common/utils/KjgMockAccount.ts");

    expect(source).toContain('<view class="label">姓名</view>');
    expect(source).toContain(':value="currentChild.realName"');
    expect(source).toContain('@input="onRealNameInput"');
    expect(source).not.toContain('class="profile-name-edit"');
    expect(source).toContain('maxlength="20"');
    expect(source).toContain('<view class="label">收件地址</view>');
    expect(source).toContain(':value="currentChild.recipientAddress"');
    expect(source).toContain('@input="onRecipientAddressInput"');
    expect(source).toContain("realName,");
    expect(source).toContain("recipientAddress,");
    expect(source).toContain('title: "请输入姓名"');
    expect(source).not.toContain('<view class="label">电话</view>');
    expect(source).not.toContain("currentChild.contactsMobile");
    expect(source).not.toContain("onContactsMobileChange");
    expect(source).not.toContain('<view class="label">学校</view>');
    expect(source).not.toContain('<view class="label">年级</view>');
    expect(source).not.toContain("selectSchool()");
    expect(source).not.toContain("gradePopUpVisible");
    expect(source).not.toContain("请填写完整信息哦");
    expect(source).toContain(
      ".editChildInfoPreservingSession(this.currentChild.userId, requestData)"
    );
    const profileSaveSource = source.slice(
      source.indexOf(
        ".editChildInfoPreservingSession(this.currentChild.userId, requestData)"
      ),
      source.indexOf("// 修改性别")
    );
    expect(profileSaveSource).toContain(
      "this.userSelectItems = this.userSelectItems.map"
    );
    expect(profileSaveSource).not.toContain("this.getChildrenList(");
    expect(source).toContain('res.error || "保存失败，请稍后重试"');
    expect(source).toContain('title: "保存失败，请检查网络后重试"');
    expect(source).toContain('data-action="save-profile"');
    expect(source).toContain('@tap.stop="saveProfile"');
    expect(source).not.toContain('@click="submit"');
    expect(source).toContain('data-action="logout"');
    expect(source).toContain('@tap.stop="requestLogout"');
    expect(source).toContain('if (action !== "logout")');
    expect(source).toContain('if (result.confirm)');
    expect(source).toContain(".getChildInfoPreservingSession(userId)");
    expect(source).toContain(
      "recipientAddress: child.recipientAddress || cachedAddress"
    );
    expect(source).toContain(
      "this.saveRecipientAddressCache(savedChild.userId"
    );
    expect(source).toContain(
      "uni.setStorageSync(RECIPIENT_ADDRESS_CACHE_KEY, cache)"
    );

    const saveMethodSource = source.slice(
      source.indexOf("saveProfile()"),
      source.indexOf("// 修改性别")
    );
    expect(saveMethodSource).not.toContain("loginOut(");

    expect(childrenServiceSource).toContain(
      "editChildInfoPreservingSession(id: string, data: AddChildRequest)"
    );
    expect(childrenServiceSource).toContain(
      "getChildInfoPreservingSession(id: string)"
    );
    expect(childrenServiceSource).toContain(
      "HttpService.doAuthenticatedRequest(url, 'put', data)"
    );
    expect(childrenServiceSource).toContain("response.statusCode === 401");
    expect(childrenServiceSource).toContain("'UNAUTHORIZED'");

    expect(responseSource).toContain("@JsonProperty('contactsMobile'");
    expect(responseSource).toContain("@JsonProperty('recipientAddress'");
    expect(mockSource).toContain("contactsMobile?: string;");
    expect(mockSource).toContain("recipientAddress?: string;");
  });

  test("我的荣誉页面下线且不再注册路由", () => {
    const pagesConfig = JSON.parse(readPage("../src/pages.json"));
    expect(
      pagesConfig.pages.some((page) => page.path === "pages/profile/index")
    ).toBe(false);
    expect(
      fs.existsSync(path.resolve(__dirname, "../src/pages/profile/index.vue"))
    ).toBe(false);
    [
      "../src/components/common/IconRow.vue",
      "../src/components/index/RecommendActivity.vue",
      "../src/pages/accountMerger/index.vue",
      "../src/pages/avatar/index.vue",
      "../src/pages/messageDetail/MessageDetail.vue",
      "../src/pages/profile/BadgeList.vue",
      "../src/pages/tab/index.vue",
    ].forEach((pagePath) => {
      expect(readPage(pagePath)).not.toContain("/pages/profile/index");
    });
  });
});
