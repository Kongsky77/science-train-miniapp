const {
  buildScienceTrainAnswerRequest,
  canEnterScienceTrainLotteryAfterRound,
  createScienceTrainRequestId,
  getScienceTrainCompletionTrainPosition,
  getScienceTrainCompletionTitle,
  getScienceTrainOpenStation,
  hasScienceTrainQuizTicketEligibility,
  isScienceTrainRoundBusyError,
  mapScienceTrainQuestionOptions,
  parseScienceTrainAnswerKeys,
  resolveScienceTrainRoundError,
  shouldRefreshScienceTrainRoundAfterAnswerError,
  toggleScienceTrainAnswerKey,
  validateScienceTrainCompletedRoundRefresh,
  validateScienceTrainDailyRound,
} = require("../src/logic/scienceTrain/ScienceTrainDailyRoundLogic.ts");

jest.mock("../src/common/utils/HttpService.ts", () => ({
  __esModule: true,
  default: {
    doAuthenticatedRequest: jest.fn(),
  },
}));

process.env.VUE_APP_SAMWELL_BASEAPI =
  "https://offline.invalid/content-user-server";
process.env.VUE_APP_SCIENCE_TRAIN_ACTIVITY_ID = "670418552893509";

const HttpService = require("../src/common/utils/HttpService.ts").default;
const ScienceTrainQuizService = require("../src/service/ScienceTrainQuizService.ts")
  .default;
const KjgMockAccount = require("../src/common/utils/KjgMockAccount.ts").default;

function createInProgressRound() {
  return {
    roundId: "61549709198336",
    bizDate: "1787760000000",
    status: "IN_PROGRESS",
    currentStationNo: 1,
    answeredCount: 0,
    correctCount: 0,
    stations: [1, 2, 3, 4, 5, 6].map((stationNo) => ({
      itemId: `6154970921600${stationNo}`,
      stationNo,
      stationName: `测试站点${stationNo}`,
      status: stationNo === 1 ? "OPEN" : "WAITING",
      ...(stationNo === 1
        ? {
            question: {
              id: "31971716483328",
              type: "SINGLE_CHOICE",
              stem: "<p>离线契约测试题干</p>",
              choices: {
                A: "<p>选项 A</p>",
                B: "<p>选项 B</p>",
                C: "<p>选项 C</p>",
                D: "<p>选项 D</p>",
              },
            },
          }
        : {}),
    })),
  };
}

function createCompletedRound() {
  const round = createInProgressRound();
  round.status = "COMPLETED";
  round.answeredCount = 6;
  round.correctCount = 6;
  round.stopReason = "ALL_CORRECT";
  round.stations.forEach((station) => {
    station.status = "CORRECT";
    delete station.question;
  });
  return round;
}

function createMixedCompletedRound(correctCount) {
  const round = createInProgressRound();
  round.status = "COMPLETED";
  round.answeredCount = 6;
  round.correctCount = correctCount;
  round.stopReason = "COMPLETED";
  round.stations.forEach((station) => {
    station.status = station.stationNo <= correctCount ? "CORRECT" : "WRONG";
    delete station.question;
  });
  return round;
}

function createLegacyWrongStoppedRound(stationNo) {
  const round = createInProgressRound();
  round.status = "COMPLETED";
  round.answeredCount = stationNo;
  round.correctCount = stationNo - 1;
  round.stopReason = "WRONG_ANSWER";
  round.stations.forEach((station) => {
    station.status =
      station.stationNo < stationNo
        ? "CORRECT"
        : station.stationNo === stationNo
        ? "WRONG"
        : "SKIPPED";
    delete station.question;
  });
  return round;
}

describe("科普列车每日轮次离线契约", () => {
  test("接受固定六站且只有一个 OPEN 题目的进行中轮次", () => {
    const round = createInProgressRound();
    expect(validateScienceTrainDailyRound(round)).toEqual({
      valid: true,
      reason: "",
    });
    expect(getScienceTrainOpenStation(round).stationNo).toBe(1);
  });

  test("接受不含 OPEN 题目的服务器完成态", () => {
    const round = createCompletedRound();
    expect(validateScienceTrainDailyRound(round).valid).toBe(true);
    expect(getScienceTrainOpenStation(round)).toBeNull();
    expect(getScienceTrainCompletionTitle(round.stopReason)).toBe("六站闯关完成");
    expect(getScienceTrainCompletionTitle("WRONG_ANSWER")).toBe("今日答题完成");
    expect(getScienceTrainCompletionTitle()).toBe("今日答题完成");
  });

  test("拒绝答错后提前结束并跳过后续题目的旧接口返回", () => {
    expect(
      validateScienceTrainDailyRound(createLegacyWrongStoppedRound(3))
    ).toEqual({
      valid: false,
      reason: "已完成轮次必须答满六题",
    });
  });

  test("结算列车停在服务器最后实际作答的站点", () => {
    expect(
      getScienceTrainCompletionTrainPosition(createCompletedRound())
    ).toBeCloseTo(91.6667, 3);
  });

  test("服务器确认答满六题且答对至少三题时显示抽奖入口", () => {
    const completedWithThreeCorrect = createMixedCompletedRound(3);
    expect(completedWithThreeCorrect.answeredCount).toBe(6);
    expect(completedWithThreeCorrect.correctCount).toBe(3);
    expect(canEnterScienceTrainLotteryAfterRound(completedWithThreeCorrect, true)).toBe(
      true
    );
    expect(canEnterScienceTrainLotteryAfterRound(completedWithThreeCorrect, false)).toBe(
      false
    );
    expect(
      canEnterScienceTrainLotteryAfterRound(createMixedCompletedRound(2), true)
    ).toBe(false);
    expect(hasScienceTrainQuizTicketEligibility("3")).toBe(true);
    expect(hasScienceTrainQuizTicketEligibility(2)).toBe(false);
  });

  test("模拟答题同样只为答对至少三题的用户发放抽奖资格", () => {
    const storage = {};
    global.uni = {
      getStorageSync: (key) => storage[key],
      setStorageSync: (key, value) => {
        storage[key] = value;
      },
    };
    const completedAt = new Date().getTime();

    KjgMockAccount.saveQuizResultForParticipant("below-threshold", {
      completedAt,
      correctCount: 2,
      totalCount: 6,
      points: 10,
    });
    expect(
      KjgMockAccount.grantQuizLotteryChanceForParticipant("below-threshold")
    ).toBe(false);

    KjgMockAccount.saveQuizResultForParticipant("at-threshold", {
      completedAt,
      correctCount: 3,
      totalCount: 6,
      points: 10,
    });
    expect(
      KjgMockAccount.grantQuizLotteryChanceForParticipant("at-threshold")
    ).toBe(true);
  });

  test("完成后只接受 today 返回的同一已完成轮次", () => {
    const expectedRound = createCompletedRound();
    const refreshedRound = createCompletedRound();
    expect(
      validateScienceTrainCompletedRoundRefresh(expectedRound, refreshedRound)
    ).toEqual({ valid: true, reason: "" });

    refreshedRound.roundId = "another-round";
    expect(
      validateScienceTrainCompletedRoundRefresh(expectedRound, refreshedRound).reason
    ).toBe("today 返回的不是当前答题轮次");
  });

  test("完成后拒绝 today 将轮次重新开放", () => {
    expect(
      validateScienceTrainCompletedRoundRefresh(
        createCompletedRound(),
        createInProgressRound()
      ).reason
    ).toBe("today 尚未确认当前轮次完成");
  });

  test("拒绝不足六站的轮次", () => {
    const round = createInProgressRound();
    round.stations.pop();
    expect(validateScienceTrainDailyRound(round)).toEqual({
      valid: false,
      reason: "stations 必须固定为六项",
    });
  });

  test("拒绝重复或缺失的 stationNo", () => {
    const round = createInProgressRound();
    round.stations[5].stationNo = 5;
    expect(validateScienceTrainDailyRound(round).reason).toBe(
      "stationNo 必须完整且唯一地覆盖 1-6"
    );
  });

  test("拒绝进行中轮次出现多个 OPEN 站点", () => {
    const round = createInProgressRound();
    round.stations[1].status = "OPEN";
    round.stations[1].question = {
      id: "31971716483329",
      stem: "第二个不应出现的开放题目",
    };
    expect(validateScienceTrainDailyRound(round).reason).toBe(
      "进行中轮次必须有且仅有一个 OPEN 站点"
    );
  });

  test("拒绝已完成轮次仍携带 OPEN 题目", () => {
    const round = createInProgressRound();
    round.status = "COMPLETED";
    expect(validateScienceTrainDailyRound(round).reason).toBe(
      "已完成轮次不能包含 OPEN 站点"
    );
  });

  test("拒绝数值型 ID，避免大整数精度丢失后继续使用", () => {
    const round = createInProgressRound();
    round.roundId = 61549709198336;
    expect(validateScienceTrainDailyRound(round).reason).toBe(
      "roundId 必须是非空字符串"
    );
  });

  test("拒绝 OPEN 站点缺少服务器题目", () => {
    const round = createInProgressRound();
    delete round.stations[0].question;
    expect(validateScienceTrainDailyRound(round).reason).toBe(
      "OPEN 站点必须携带有效题目"
    );
  });

  test("按服务器 choices 映射有效选项并过滤空值与 %% 占位", () => {
    const options = mapScienceTrainQuestionOptions({
      id: "question-1",
      stem: "题干",
      choices: {
        A: "A、北极熊",
        B: 0,
        C: null,
        D: "  ",
        E: "<p>E.%%</p>",
        F: "<p>F．&nbsp;%%</p>",
      },
    });
    expect(options).toEqual([
      { key: "A", text: "A、北极熊" },
      { key: "B", text: "0" },
    ]);
  });

  test("只过滤占位内容，不按固定选项数量截断", () => {
    const options = mapScienceTrainQuestionOptions({
      id: "question-1",
      stem: "题干",
      choices: {
        A: "A.选项一",
        B: "B.选项二",
        C: "C.选项三",
        D: "D.选项四",
        E: "E.选项五",
        F: "F.%%",
      },
    });
    expect(options.map((option) => option.key)).toEqual([
      "A",
      "B",
      "C",
      "D",
      "E",
    ]);
  });

  test("按服务器正确答案字段解析选项键并去除空白和重复项", () => {
    expect(parseScienceTrainAnswerKeys(" A, B, A, ")).toEqual(["A", "B"]);
    expect(parseScienceTrainAnswerKeys("")).toEqual([]);
    expect(parseScienceTrainAnswerKeys(null)).toEqual([]);
  });

  test("只使用服务器选项键构造答案请求且 itemId 与 roundItemId 一致", () => {
    const round = createInProgressRound();
    const result = buildScienceTrainAnswerRequest(
      round,
      ["B"],
      "123e4567-e89b-42d3-a456-426614174000"
    );

    expect(result).toEqual({
      valid: true,
      reason: "",
      itemId: "61549709216001",
      request: {
        roundId: "61549709198336",
        roundItemId: "61549709216001",
        questionId: "31971716483328",
        answer: "B",
        requestId: "123e4567-e89b-42d3-a456-426614174000",
      },
    });
  });

  test("拒绝提交服务器 choices 中不存在的选项", () => {
    const result = buildScienceTrainAnswerRequest(
      createInProgressRound(),
      ["Z"],
      "123e4567-e89b-42d3-a456-426614174000"
    );
    expect(result).toMatchObject({
      valid: false,
      reason: "所选答案不属于服务器返回的选项",
    });
  });

  test("忽略旧题型字段并始终按单选替换选择和校验提交", () => {
    const round = createInProgressRound();
    round.stations[0].question.type = "MULTIPLE_CHOICE";
    round.stations[0].question.answerLimit = 2;

    let selected = toggleScienceTrainAnswerKey([], "B");
    selected = toggleScienceTrainAnswerKey(selected, "A");
    expect(selected).toEqual(["A"]);
    expect(
      buildScienceTrainAnswerRequest(
        round,
        ["A", "B"],
        "123e4567-e89b-42d3-a456-426614174000"
      )
    ).toMatchObject({
      valid: false,
      reason: "单选题只能提交一个选项",
    });
  });

  test("生成符合 UUID v4 格式的稳定请求编号载体", () => {
    const requestId = createScienceTrainRequestId(() => 0.25);
    expect(requestId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
    );
    const first = buildScienceTrainAnswerRequest(
      createInProgressRound(),
      ["A"],
      requestId
    );
    const retry = buildScienceTrainAnswerRequest(
      createInProgressRound(),
      ["A"],
      requestId
    );
    expect(retry.request.requestId).toBe(first.request.requestId);
  });

  test.each([
    "DAILY_ROUND_ITEM_NOT_OPEN",
    "DAILY_ROUND_ANSWER_BINDING_DRIFT",
    "DAILY_ROUND_EXPIRED",
  ])("答案错误 %s 必须通过 today 刷新服务器轮次", (code) => {
    expect(shouldRefreshScienceTrainRoundAfterAnswerError(code)).toBe(true);
  });

  test.each([
    "DAILY_ROUND_START_BUSY",
    "DAILY_ROUND_CONFLICT_RETRY_EXHAUSTED",
  ])("识别可自动重试一次的 busy 错误 %s", (code) => {
    expect(isScienceTrainRoundBusyError(code)).toBe(true);
  });

  test.each([
    ["DAILY_ROUND_NOT_ENTERED", "活动尚未到答题时间"],
    ["DAILY_QUESTION_POOL_EXHAUSTED", "今日答题暂不可用"],
    ["DAILY_ROUND_RULE_UNAVAILABLE", "今日答题暂不可用"],
    ["DAILY_ROUND_SUB_USER_FORBIDDEN", "当前用户无法答题"],
    ["UNAUTHORIZED", "登录状态已失效"],
  ])("错误 %s 映射为不可重试的可见状态", (code, title) => {
    expect(resolveScienceTrainRoundError(code, "服务端原始错误")).toMatchObject({
      stage: "unavailable",
      title,
      canRetry: false,
    });
  });

  test("busy 自动重试耗尽后不继续开放页面重试", () => {
    expect(
      resolveScienceTrainRoundError("DAILY_ROUND_START_BUSY", "服务正忙")
    ).toMatchObject({
      stage: "error",
      title: "答题服务正忙",
      canRetry: false,
    });
  });

  test("未知错误保留服务端信息并允许重新加载", () => {
    expect(resolveScienceTrainRoundError("UNKNOWN", "自定义错误说明")).toEqual({
      stage: "error",
      title: "今日答题加载失败",
      message: "自定义错误说明",
      canRetry: true,
    });
  });
});

describe("科普列车开始轮次请求契约", () => {
  beforeEach(() => {
    HttpService.doAuthenticatedRequest.mockReset();
  });

  test("today 使用认证 GET 请求恢复服务器轮次", async () => {
    const round = createInProgressRound();
    HttpService.doAuthenticatedRequest.mockResolvedValue({
      statusCode: 200,
      data: { success: true, data: round },
    });

    const response = await new ScienceTrainQuizService().getTodayRound(
      "sub/user 01"
    );

    expect(HttpService.doAuthenticatedRequest).toHaveBeenCalledWith(
      "https://offline.invalid/content-user-server/n/api/v1/activity/" +
        "670418552893509/daily-round/sub%2Fuser%2001/today",
      "get",
      undefined,
      undefined,
      false
    );
    expect(response).toMatchObject({ success: true, data: round });
  });

  test("answer 使用认证 POST 并原样提交稳定 requestId", async () => {
    const round = createInProgressRound();
    const request = {
      roundId: "61549709198336",
      roundItemId: "61549709216001",
      questionId: "31971716483328",
      answer: "A",
      requestId: "123e4567-e89b-42d3-a456-426614174000",
    };
    const answerData = {
      correct: true,
      corrected: 0,
      questionScoreDelta: "1",
      duplicate: false,
      answerFeedback: {
        correct: true,
        correctAnswer: "A",
        analysis: "示例答案解析",
        answeredCount: "1",
        correctCount: "1",
        nextStationNo: "2",
        roundStatus: "IN_PROGRESS",
      },
      round,
    };
    HttpService.doAuthenticatedRequest.mockResolvedValue({
      statusCode: 200,
      data: { success: true, data: answerData },
    });

    const service = new ScienceTrainQuizService();
    const first = await service.answerDailyRoundItem(
      "sub/user 01",
      "61549709216001",
      request
    );
    await service.answerDailyRoundItem(
      "sub/user 01",
      "61549709216001",
      request
    );

    expect(HttpService.doAuthenticatedRequest).toHaveBeenNthCalledWith(
      1,
      "https://offline.invalid/content-user-server/n/api/v1/activity/" +
        "670418552893509/daily-round/sub%2Fuser%2001/items/" +
        "61549709216001/answer",
      "post",
      request,
      undefined,
      false
    );
    expect(HttpService.doAuthenticatedRequest.mock.calls[1][2].requestId).toBe(
      request.requestId
    );
    expect(first).toMatchObject({ success: true, data: answerData });
  });

  test("使用认证 POST 请求且不携带请求体", async () => {
    const round = createInProgressRound();
    HttpService.doAuthenticatedRequest.mockResolvedValue({
      statusCode: 200,
      data: { success: true, data: round },
    });

    const response = await new ScienceTrainQuizService().startDailyRound(
      "sub/user 01"
    );

    expect(HttpService.doAuthenticatedRequest).toHaveBeenCalledTimes(1);
    expect(HttpService.doAuthenticatedRequest).toHaveBeenCalledWith(
      "https://offline.invalid/content-user-server/n/api/v1/activity/" +
        "670418552893509/daily-round/sub%2Fuser%2001/start",
      "post",
      undefined,
      undefined,
      false
    );
    expect(response).toMatchObject({ success: true, data: round });
  });

  test("401 响应映射为登录失效且不触发真实网络", async () => {
    HttpService.doAuthenticatedRequest.mockResolvedValue({
      statusCode: 401,
      data: {},
    });

    const response = await new ScienceTrainQuizService().startDailyRound(
      "sub-user-01"
    );

    expect(response).toMatchObject({
      success: false,
      code: "UNAUTHORIZED",
      error: "登录状态已失效",
    });
  });
});
