const fs = require("fs");
const path = require("path");

const readPage = relativePath =>
  fs.readFileSync(path.resolve(__dirname, relativePath), "utf8");

describe("科普列车页面文案精简", () => {
  test("抽奖页不显示活动眉题、虚拟票号和底部说明操作区", () => {
    const source = readPage("../src/pages/kjgLottery/index.vue");

    expect(source).not.toContain("科普列车活动");
    expect(source).not.toContain("NO. KJG-2026");
    expect(source).not.toContain(
      "活动结束后，未使用的探索券和跃迁券即刻失效。"
    );
    expect(source).not.toContain('class="page-actions"');
    expect(source).not.toContain("查看排行榜");
  });

  test("首页不展示开发占位文字或重复场馆入口", () => {
    const source = readPage("../src/pages/tab/index.vue");

    expect(source).not.toContain("首页主视觉");
    expect(source).not.toContain("背景图片预留区域");
    expect(source).not.toContain("配图预留");
    expect(source).not.toContain("查看场馆列表 ›");
    expect(source).not.toContain("上传主视觉");
    expect(source).not.toContain("更换主视觉");
    expect(source).not.toContain("KJG_JOURNEY_BACKGROUND");
    expect(source).not.toContain("chooseJourneyBackground");
  });

  test("首页四川和重庆科技馆双卡片直达各自介绍页", () => {
    const source = readPage("../src/pages/tab/index.vue");
    const configSource = readPage(
      "../src/definition/scienceTrain/ScienceTrainConfig.ts"
    );

    expect(source).toContain('<view class="museum-feature-grid">');
    expect(source).toContain('<view class="museum-feature-card" @click="goToSichuanMuseum">');
    expect(source).toContain('<view class="museum-feature-card" @click="goToChongqingMuseum">');
    expect(source).toContain('<view class="museum-feature-label">四川科技馆</view>');
    expect(source).toContain('<view class="museum-feature-label">重庆科技馆</view>');
    expect(source).toContain(':src="sichuanMuseumCover"');
    expect(source).toContain(':src="chongqingMuseumCover"');
    expect(source).not.toContain("走近科学，发现城市里的探索空间");
    expect(source).toContain(
      '.getPublicDetail(SICHUAN_SCIENCE_MUSEUM_ACTIVITY_ID)'
    );
    expect(source).toContain(
      '.getPublicDetail(CHONGQING_SCIENCE_MUSEUM_ACTIVITY_ID)'
    );
    expect(configSource).toContain(
      'const SICHUAN_SCIENCE_MUSEUM_ACTIVITY_ID = "849467725103173";'
    );
    expect(configSource).toContain(
      'const CHONGQING_SCIENCE_MUSEUM_ACTIVITY_ID = "847711669686341";'
    );
    expect(source).toContain(
      'const url = `/pages/kjgMuseum/detail?id=${SICHUAN_SCIENCE_MUSEUM_ACTIVITY_ID}`;'
    );
    expect(source).toContain(
      'const url = `/pages/kjgMuseum/detail?id=${CHONGQING_SCIENCE_MUSEUM_ACTIVITY_ID}`;'
    );
  });

  test("活动规则删除装饰性概述但保留完整业务规则", () => {
    const source = readPage("../src/pages/kjgActivityDetail/index.vue");

    expect(source).not.toContain("ACTIVITY INFORMATION");
    expect(source).not.toContain("ONLINE + OFFLINE");
    expect(source).not.toContain("全民可参与、全覆盖、深互动");
    [
      "活动时间",
      "2026年9月23日—2026年10月22日",
      "支持单位",
      "四川省自然科学博物馆协会",
      "川渝黔三地50家优质科普基地",
      "答对3道及以上，可获得1张科普探索券",
      "答对3题及以上，可获得1张科普探索券",
      "共53家场馆均可打卡",
      "超过2个的打卡仍计入有效打卡，但不再获得积分",
      "全周期累计完成30天即可达到线上400分上限",
      "参与用户ID更小",
      "线上答题积分不直接清零",
      "线下打卡积分规则",
      "线上答题积分规则",
      "抽奖券与现金红包规则",
      "同分排序与违规处理",
      "活动结束后"
    ].forEach(copy => expect(source).toContain(copy));
    expect(source).not.toContain("2026年8月1日—10月7日（暂定）");
    expect(source).not.toContain("约70家优质科普基地");
    expect(source).not.toContain("川渝黔三地49家优质科普基地");
    expect(source).not.toContain("共52家场馆均可打卡");
    expect(source).not.toContain("答对4道及以上");
    expect(source).not.toContain("答对4题及以上");
    expect(source).not.toContain("全周期连续30天答题封顶400分");
    expect(source).not.toContain("答题脚本刷分");
  });

  test("报名成功页只保留结果、参与者与准确的下一步", () => {
    const source = readPage("../src/pages/kjgRegistrationSuccess/index.vue");

    expect(source).not.toContain("报名结果");
    expect(source).not.toContain("SIGNED");
    expect(source).not.toContain("本页只反馈");
    expect(source).toContain("如需切换，请在首页点击头像");
    expect(source).toContain("返回首页");
    expect(source).not.toContain("返回参与者列表");
    expect(source).toContain("$home-blue");
    expect(source).toContain("$home-teal");
    expect(source).not.toContain("$kjg-cinnabar");
  });

  test("答题页移除实现说明并保留答题约束和反馈", () => {
    const source = readPage("../src/pages/kjgQuiz/index.vue");

    expect(source).not.toContain("完成状态来自服务器");
    expect(source).not.toContain("本页不会计算或保存正式积分");
    expect(source).not.toContain("科普列车川渝黔行");
    expect(source).not.toContain("今日轮次已结束");
    expect(source).not.toContain("当天答题轮次只有一次");
    expect(source).not.toContain("积分与完成天数均以服务器返回为准");
    expect(source).toContain('v-if="completionPointsMessage"');
    expect(source).toContain("仅恢复当天唯一轮次");
    expect(source).toContain("正确答案");
    expect(source).toContain("答案解析");
    expect(source).not.toContain("部分题目难度较高，请谨慎作答");
    expect(source).not.toContain('class="quiz-caution-tip"');
    expect(source).toContain('class="quiz-caution-overlay"');
    expect(source).toContain("题目有难度，请谨慎作答");
    expect(source).toContain("下次不再显示此弹窗");
    expect(source).toContain("KJG_QUIZ_CAUTION_DISMISSED_V1");
    expect(source).toContain("uni.setStorageSync(QUIZ_CAUTION_DISMISSED_STORAGE_KEY, true)");
    expect(source).toContain("showQuizCautionForActiveRound()");
    expect(source).toContain('if (round.status === "COMPLETED")');
    expect(source).not.toContain("this.quizCautionVisible = true;\n      return;\n    }\n    this.initializeQuizEntry();");
  });

  test("答题加载态使用六站轨道而不是嵌套提示卡", () => {
    const source = readPage("../src/pages/kjgQuiz/index.vue");
    const loadingSource = source.slice(
      source.indexOf("v-if=\"realStage === 'loading'\""),
      source.indexOf("v-else-if=\"realStage === 'completed'\"")
    );

    expect(loadingSource).toContain('class="quiz-loading"');
    expect(loadingSource).toContain('class="loading-route"');
    expect(loadingSource).toContain('v-for="(_station, stationIndex) in 6"');
    expect(loadingSource).toContain('class="completion-train loading-train"');
    expect(loadingSource).toContain("正在准备今日答题");
    expect(loadingSource).toContain("同步题目与作答进度…");
    expect(loadingSource).not.toContain('class="real-state-card"');
    expect(source).toContain("@keyframes loading-train-journey");
    expect(source).toContain("@keyframes loading-station-pulse");
  });

  test("抽奖页通过圆形按钮整合剩余机会与抽奖操作", () => {
    const source = readPage("../src/pages/kjgLottery/index.vue");

    expect(source).toContain("剩余机会");
    expect(source).toContain("每次抽奖消耗 1 张券");
    expect(source).not.toContain(
      "当前可用 ${this.currentAvailableQuantity} 张"
    );
    expect(source).toContain("当前中奖率");
    expect(source).toContain("红包");
    expect(source).toContain("machine-draw-button");
    expect(source).toContain("currentAvailableQuantity");
    expect(source).not.toContain('class="prize-help-action"');
    expect(source).not.toContain('class="prize-detail-mask"');
    expect(source).not.toContain("查看奖项和中奖率明细");
    expect(source).not.toContain("showPrizeDetails");
    expect(source).toContain('v-if="isLotteryBalanceLoading"');
    expect(source).toContain('class="machine-draw-loading"');
    expect(source).toContain("答题奖励到账后将自动更新");
    expect(source).toContain("正在读取抽奖次数");
    expect(source).toContain('this.lotteryStage === "loading"');
    expect(source).toContain("LOTTERY_ENTRY_LOADING_DURATION = 1000");
    expect(source).toContain("this.startLotteryEntryLoading()");
    expect(source).toContain("this.isLotteryEntryLoading");
    expect(source).toContain("@keyframes quiz-reward-loading-spin");
    expect(source).not.toContain("machine-console");
    expect(source).not.toContain("display-pulse");
  });

  test("抽奖页使用出票机阶段动画并在结果确认后吐出票根", () => {
    const source = readPage("../src/pages/kjgLottery/index.vue");
    const formalDrawSource = source.slice(
      source.indexOf("startDraw()"),
      source.indexOf("startMockDraw()")
    );
    const showResultSource = source.slice(
      source.indexOf("get showLatestResult()"),
      source.indexOf("get ticketCaption()")
    );
    const onShowSource = source.slice(
      source.indexOf("onShow()"),
      source.indexOf("onUnload()")
    );

    expect(source).toContain(
      'type DrawAnimationStage = "idle" | "processing" | "ejecting" | "revealed"'
    );
    expect(source).toContain('class="machine-slot"');
    expect(source).toContain('class="ticket-output"');
    expect(source).toContain('class="result-ticket-background"');
    expect(source).toContain("621684277780484154_622517413882884170.png");
    expect(source).toContain("621684277780484154_622516515292164167.png");
    expect(source).toContain("this.ejectingDraw = displayRecord");
    expect(source).toContain('this.drawAnimationStage = "ejecting"');
    expect(source).toContain('@click="handleTicketResultAction"');
    expect(source).toContain("中奖票根，点击领取现金红包");
    expect(source).toContain("'ticket-claim-action'");
    expect(source).toContain('class="ticket-claim-stamp"');
    expect(source).toContain("正在打开微信领取页…");
    expect(source).toContain("@keyframes ticket-claim-stamp");
    expect(source).toContain("立即领取红包");
    expect(formalDrawSource).not.toContain("claimCashRecord(");
    expect(showResultSource).toContain("!!this.revealedDraw");
    expect(showResultSource).not.toContain("latestDraw");
    expect(source).not.toContain("updateLatestDraw");
    expect(onShowSource).toContain("this.revealedDraw = null");
    expect(onShowSource).toContain('this.drawAnimationStage = "idle"');
    expect(source).toContain("@keyframes ticket-eject");
    expect(source).toContain("visibility: hidden");
    expect(source).not.toContain("transition: height");
    expect(source).not.toContain("translateY(-318rpx)");
    expect(source).not.toContain("scaleY(");
    expect(source).not.toContain("@keyframes result-stamp");
  });

  test("中奖票根突出领取入口并在领取前二次确认", () => {
    const source = readPage("../src/pages/kjgLottery/index.vue");
    const actionSource = source.slice(
      source.indexOf("  handleRecordAction(record"),
      source.indexOf("  claimCashRecord(record")
    );
    const claimStyleSource = source.slice(
      source.indexOf(".ticket-claim-action {"),
      source.indexOf(".is-winning .ticket-title {")
    );

    expect(actionSource).toContain("this.confirmCashRecordClaim(record.realRecord)");
    expect(actionSource).toContain('title: "确认领取红包"');
    expect(actionSource).toContain('confirmText: "确认领取"');
    expect(actionSource).toContain('cancelText: "稍后再领"');
    expect(actionSource).toContain("if (result.confirm)");
    expect(claimStyleSource).toContain("font-size: 25rpx;");
    expect(claimStyleSource).toContain("min-height: 60rpx;");
    expect(claimStyleSource).toContain("background: #FAC12A;");
  });

  test("抽奖页积分图标与抽奖记录按钮保持同行居中", () => {
    const source = readPage("../src/pages/kjgLottery/index.vue");
    const headerSideSource = source.slice(
      source.indexOf(".page-header-side {"),
      source.indexOf(".page-header-image {")
    );

    expect(headerSideSource).toContain("display: flex;");
    expect(headerSideSource).toContain("align-items: center;");
    expect(headerSideSource).toContain("gap: 12rpx;");
    expect(headerSideSource).not.toContain("position: absolute;");
  });

  test("抽奖记录入口持续提示未领取奖品数量", () => {
    const source = readPage("../src/pages/kjgLottery/index.vue");
    const onShowSource = source.slice(
      source.indexOf("onShow()"),
      source.indexOf("onUnload()")
    );
    const refreshSource = source.slice(
      source.indexOf("  refreshLottery() {"),
      source.indexOf("  refreshMockLottery() {")
    );

    expect(source).toContain('class="records-claim-badge"');
    expect(source).toContain("claimableRecordCount");
    expect(source).toContain("this.isRecordClaimable(record)");
    expect(source).toContain("个待领取奖品");
    expect(source).not.toContain("返回上一页");
    expect(source).not.toContain("records-home-action");
    expect(onShowSource).toContain("this.refreshLottery()");
    expect(refreshSource).toContain("this.loadFormalRecords(true)");
  });

  test("场馆列表保留封面，场馆介绍页直接展示正文", () => {
    const listSource = readPage("../src/pages/kjgMuseum/index.vue");
    const detailSource = readPage("../src/pages/kjgMuseum/detail.vue");

    expect(listSource).not.toContain("当前显示");
    expect(listSource).not.toContain("场馆主图预留");
    expect(listSource).not.toContain("KJG_MUSEUMS");
    expect(listSource).toContain(
      'const MUSEUM_COLUMN_ID = "847745989091397";'
    );
    expect(listSource).toContain(
      'const FENGJIE_SCIENCE_MUSEUM_ACTIVITY_ID = "847747001024581";'
    );
    expect(listSource).toContain(
      '["全部", "四川", "重庆", "贵州"]'
    );
    expect(listSource).toContain(
      'const MUSEUM_REGION_ORDER: MuseumRegion[] = ["四川", "重庆", "贵州"];'
    );
    expect(listSource).toContain(
      "MUSEUM_REGION_ORDER.reduce<ActivityFullItem[]>"
    );
    expect(listSource).toContain("receiveActivityList(");
    expect(listSource).toContain("filter.pageSize = 100;");
    expect(listSource).toContain("ensureSichuanMuseum(page.records)");
    expect(listSource).toContain("this.ensureFengjieMuseum(museums)");
    expect(listSource).toContain(
      ".getPublicDetail(SICHUAN_SCIENCE_MUSEUM_ACTIVITY_ID)"
    );
    expect(listSource).toContain(
      ".getPublicDetail(FENGJIE_SCIENCE_MUSEUM_ACTIVITY_ID)"
    );
    expect(listSource).toContain("return [response.data, ...museums];");
    expect(listSource).toContain(':src="museum.imgCover"');
    expect(listSource).toContain(
      'import { resolveCheckInRegion } from "@/utils/check-in/CheckInRegion";'
    );
    expect(listSource).toContain("const resolvedRegion = resolveCheckInRegion({");
    expect(listSource).toContain("address: museum.operateLocation");
    expect(listSource).toContain("SICHUAN_MUSEUM_ACTIVITY_ID_WHITELIST");
    expect(listSource).toContain('"849518550028357", // 袁隆平杂交水稻科技馆');
    expect(listSource).toContain('"849558344605765", // 宁南县科技馆');
    expect(listSource).toContain('"849559649062981", // 江安县科技馆');
    expect(listSource).toContain('"849560697475141", // 生命奥秘博物馆');
    expect(listSource).toContain(
      "SICHUAN_MUSEUM_ACTIVITY_ID_WHITELIST.has(String(museum.id))"
    );
    expect(listSource).toContain(
      'url: `/pages/kjgMuseum/detail?id=${encodeURIComponent(id)}`'
    );
    expect(detailSource).not.toContain("场馆主视觉图预留");
    expect(detailSource).not.toContain("后期可直接替换");
    expect(listSource).toContain("region-filter-count");
    expect(detailSource).toContain("getPublicDetail(id)");
    expect(detailSource).toContain("getPublicDetailCopy(id)");
    expect(detailSource).toContain(':img-options="false"');
    expect(detailSource).not.toContain('class="museum-cover"');
    expect(detailSource).not.toContain('class="intro-heading"');
    expect(detailSource).not.toContain("museumName");
    expect(detailSource).not.toContain("museum.operateLocation");
    expect(detailSource).not.toContain("@click");
    expect(detailSource).not.toContain("立即参加");
    expect(detailSource).not.toContain("选择用户");
    expect(detailSource).not.toContain("场馆小程序");
    expect(detailSource).not.toContain("官方公众号");
  });
});
