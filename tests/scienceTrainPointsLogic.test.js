const {
  formatScienceTrainPointValue,
  getScienceTrainQuizStatusText,
  hasScienceTrainQuizCompletion,
  isScienceTrainTrueFlag,
  parseScienceTrainCount,
} = require("../src/logic/scienceTrain/ScienceTrainPointsLogic.ts");

jest.mock("../src/common/utils/HttpService.ts", () => ({
  __esModule: true,
  default: {
    doAuthenticatedRequest: jest.fn(),
  },
}));

process.env.VUE_APP_ACTIVITY_BASEAPI =
  "https://offline.invalid/activity-user-server";
process.env.VUE_APP_SCIENCE_TRAIN_ACTIVITY_ID = "670418552893509";

const HttpService = require("../src/common/utils/HttpService.ts").default;
const ScienceTrainPointsService = require("../src/service/ScienceTrainPointsService.ts")
  .default;

describe("科普列车正式积分离线契约", () => {
  beforeEach(() => {
    HttpService.doAuthenticatedRequest.mockReset();
  });

  test("积分展示保留服务器返回的零值且不自行累加", () => {
    expect(formatScienceTrainPointValue(0)).toBe("0");
    expect(formatScienceTrainPointValue("50")).toBe("50");
    expect(formatScienceTrainPointValue(undefined)).toBe("--");
    expect(parseScienceTrainCount("3")).toBe(3);
    expect(parseScienceTrainCount("invalid")).toBeNull();
  });

  test("答题状态只由服务器完成天数与限制标记生成", () => {
    expect(getScienceTrainQuizStatusText({ completedDayCount: 0 })).toBe(
      "尚未答题"
    );
    expect(
      getScienceTrainQuizStatusText(undefined, { completedDayCount: "4" })
    ).toBe("累计完成 4 天");
    expect(
      getScienceTrainQuizStatusText({
        completedDayCount: 4,
        answerBlocked: "1",
      })
    ).toBe("答题受限");
    expect(hasScienceTrainQuizCompletion({ completedDayCount: "1" })).toBe(
      true
    );
    expect(isScienceTrainTrueFlag("true")).toBe(true);
  });

  test("积分汇总使用主账号认证读取正式 summary 接口", async () => {
    HttpService.doAuthenticatedRequest.mockResolvedValue({
      statusCode: 200,
      data: {
        success: true,
        errorCode: "",
        errorDesc: "",
        data: { onlinePoints: 10, offlinePoints: 0, totalPoints: 10 },
      },
    });
    const service = new ScienceTrainPointsService();
    const response = await service.getSummary("sub user/1");

    expect(response.success).toBe(true);
    expect(response.data.totalPoints).toBe(10);
    expect(HttpService.doAuthenticatedRequest).toHaveBeenCalledWith(
      "https://offline.invalid/activity-user-server/api/v1/activity/main/points/670418552893509/sub%20user%2F1/summary",
      "get",
      undefined,
      undefined,
      false
    );
  });

  test("答题进度使用主账号认证读取正式 progress 接口", async () => {
    HttpService.doAuthenticatedRequest.mockResolvedValue({
      statusCode: 200,
      data: {
        success: true,
        errorCode: "",
        errorDesc: "",
        data: { completedDayCount: 2, onlinePoints: 20 },
      },
    });
    const service = new ScienceTrainPointsService();
    const response = await service.getProgress("9988");

    expect(response.success).toBe(true);
    expect(response.data.completedDayCount).toBe(2);
    expect(HttpService.doAuthenticatedRequest).toHaveBeenCalledWith(
      "https://offline.invalid/activity-user-server/api/v1/activity/main/points/670418552893509/9988/progress",
      "get",
      undefined,
      undefined,
      false
    );
  });

  test("401 由页面按未认证处理而不触发 Mock 回退", async () => {
    HttpService.doAuthenticatedRequest.mockResolvedValue({
      statusCode: 401,
      data: {},
    });
    const response = await new ScienceTrainPointsService().getSummary("9988");
    expect(response).toMatchObject({
      success: false,
      code: "UNAUTHORIZED",
    });
  });
});
