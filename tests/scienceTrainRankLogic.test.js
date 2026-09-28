const {
  getScienceTrainHomeRankDisplay,
  getScienceTrainHomeRankErrorDisplay,
  getScienceTrainLeaderboardErrorState,
  buildScienceTrainParticipantNameMap,
  getScienceTrainRankParticipantName,
} = require("../src/logic/scienceTrain/ScienceTrainRankLogic.ts");

jest.mock("../src/common/utils/HttpService.ts", () => ({
  __esModule: true,
  default: {
    doAuthenticatedRequest: jest.fn(),
    doPublicRequest: jest.fn(),
  },
}));

process.env.VUE_APP_ACTIVITY_BASEAPI =
  "https://offline.invalid/activity-user-server";
process.env.VUE_APP_SCIENCE_TRAIN_ACTIVITY_ID = "670418552893509";

const HttpService = require("../src/common/utils/HttpService.ts").default;
const ScienceTrainRankService = require("../src/service/ScienceTrainRankService.ts")
  .default;

describe("科普列车首页正式个人排名离线契约", () => {
  beforeEach(() => {
    HttpService.doAuthenticatedRequest.mockReset();
    HttpService.doPublicRequest.mockReset();
  });

  test("个人排名使用当前 subUserId 和主账号认证接口", async () => {
    HttpService.doAuthenticatedRequest.mockResolvedValue({
      statusCode: 200,
      data: {
        success: true,
        errorCode: "",
        errorDesc: "",
        data: { userId: "sub user/1", position: "12" },
      },
    });

    const response = await new ScienceTrainRankService().getPersonalRank(
      "sub user/1"
    );

    expect(response.success).toBe(true);
    expect(response.data.position).toBe("12");
    expect(HttpService.doAuthenticatedRequest).toHaveBeenCalledWith(
      "https://offline.invalid/activity-user-server/api/v1/rank/data/670418552893509/sub%20user%2F1/user",
      "get",
      undefined,
      undefined,
      false
    );
  });

  test("首页只展示服务器返回的 position 或 rank", () => {
    expect(
      getScienceTrainHomeRankDisplay({
        userId: "9988",
        position: "7",
        totalPoints: "999999",
      })
    ).toEqual({ text: "第7名", hasFormalRank: true });
    expect(
      getScienceTrainHomeRankDisplay({ userId: "9988", rank: 0 })
    ).toEqual({ text: "第0名", hasFormalRank: true });
  });

  test("仅返回 userId 时显示排名更新中且不根据积分推算", () => {
    expect(
      getScienceTrainHomeRankDisplay({
        userId: "9988",
        totalPoints: "999999",
      })
    ).toEqual({ text: "排名更新中", hasFormalRank: false });
  });

  test.each([
    ["ACTIVITY_POINTS_LEADERBOARD_NOT_READY", "排名更新中"],
    ["RANK_NOT_ENABLED", "排行榜暂未开放"],
    ["UNAUTHORIZED", "登录状态已失效"],
    ["SOME_OTHER_ERROR", "排名加载失败"],
  ])("错误码 %s 映射为独立排名状态", (code, text) => {
    expect(getScienceTrainHomeRankErrorDisplay(code)).toBe(text);
  });

  test("公开参与者接口获取全部分页用于排行榜姓名映射", async () => {
    HttpService.doPublicRequest
      .mockResolvedValueOnce({
        statusCode: 200,
        data: {
          success: true,
          data: {
            pageNo: "1",
            pageSize: "500",
            total: "501",
            pages: "2",
            records: [{ userId: "9988", realName: "小科" }],
          },
        },
      })
      .mockResolvedValueOnce({
        statusCode: 200,
        data: {
          success: true,
          data: {
            pageNo: "2",
            pageSize: "500",
            total: "501",
            pages: "2",
            records: [{ userId: "9989", realName: "小普" }],
          },
        },
      });

    const response = await new ScienceTrainRankService().getPublicParticipants();

    expect(response.success).toBe(true);
    expect(response.data.records.map((record) => record.realName)).toEqual([
      "小科",
      "小普",
    ]);
    expect(HttpService.doPublicRequest).toHaveBeenNthCalledWith(
      1,
      "https://offline.invalid/activity-user-server/api/v1/activity/670418552893509/users/public?pageNo=1&pageSize=500",
      "get",
      undefined,
      undefined,
      false
    );
    expect(HttpService.doPublicRequest).toHaveBeenNthCalledWith(
      2,
      "https://offline.invalid/activity-user-server/api/v1/activity/670418552893509/users/public?pageNo=2&pageSize=500",
      "get",
      undefined,
      undefined,
      false
    );
  });

  test("公开榜单按 userId 展示真实姓名且不回退为参与者", () => {
    const names = buildScienceTrainParticipantNameMap([
      { userId: "9988", realName: " 小科 " },
      { userId: "empty", realName: "" },
    ]);

    expect(names).toEqual({ "9988": "小科" });
    expect(
      getScienceTrainRankParticipantName(
        { userId: "9988", position: "1", score: "100" },
        names
      )
    ).toBe("小科");
    expect(
      getScienceTrainRankParticipantName(
        {
          userId: "direct",
          position: "2",
          score: "90",
          realName: "接口姓名",
        },
        names
      )
    ).toBe("接口姓名");
    expect(
      getScienceTrainRankParticipantName(
        {
          userId: "leaderboard",
          position: "3",
          score: "80",
          teamName: "排行榜姓名",
        },
        names
      )
    ).toBe("排行榜姓名");
    expect(
      getScienceTrainRankParticipantName(
        { userId: "unknown", position: "4", score: "70" },
        names
      )
    ).toBe("未命名用户");
  });

  test("榜单投影未就绪时使用待更新状态并保留已有榜单", () => {
    expect(
      getScienceTrainLeaderboardErrorState(
        "ACTIVITY_POINTS_LEADERBOARD_NOT_READY",
        "活动积分排行榜尚未就绪",
        false
      )
    ).toEqual({
      stage: "pending",
      message: "排行榜正在更新，请稍后刷新",
    });
    expect(
      getScienceTrainLeaderboardErrorState(
        "ACTIVITY_POINTS_LEADERBOARD_NOT_READY",
        "活动积分排行榜尚未就绪",
        true
      )
    ).toEqual({
      stage: "ready",
      message: "排行榜正在更新，请稍后刷新",
    });
  });

  test("401 由首页按未认证状态处理且不回退 Mock", async () => {
    HttpService.doAuthenticatedRequest.mockResolvedValue({
      statusCode: 401,
      data: {},
    });

    const response = await new ScienceTrainRankService().getPersonalRank(
      "9988"
    );
    expect(response).toMatchObject({
      success: false,
      code: "UNAUTHORIZED",
    });
  });
});
