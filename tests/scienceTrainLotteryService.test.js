jest.mock("../src/common/utils/HttpService.ts", () => ({
  __esModule: true,
  default: {
    doAuthenticatedRequest: jest.fn(),
  },
}));

process.env.VUE_APP_ACTIVITY_BASEAPI =
  "https://offline.invalid/activity-user-server";
process.env.VUE_APP_SCIENCE_TRAIN_ACTIVITY_ID = "670418552893509";
process.env.VUE_APP_SCIENCE_TRAIN_LOTTERY_ACTIVITY_ID = "460544621232197";

const HttpService = require("../src/common/utils/HttpService.ts").default;
const ScienceTrainLotteryService = require("../src/service/ScienceTrainLotteryService.ts")
  .default;

const successResponse = (data) => ({
  statusCode: 200,
  data: {
    success: true,
    errorCode: "",
    errorDesc: "",
    data,
  },
});

describe("科普列车正式抽奖离线接口契约", () => {
  beforeEach(() => {
    HttpService.doAuthenticatedRequest.mockReset();
  });

  test("抽奖摘要只使用独立测试活动 ID 和当前参与者", async () => {
    HttpService.doAuthenticatedRequest.mockResolvedValue(
      successResponse({ drawOpen: true, conversionOpen: true, ticketBalances: [] })
    );

    await new ScienceTrainLotteryService().getSummary("sub user/1");

    expect(HttpService.doAuthenticatedRequest).toHaveBeenCalledWith(
      "https://offline.invalid/activity-user-server/api/v1/activity/main/draw/460544621232197/sub%20user%2F1/summary",
      "get",
      undefined,
      undefined,
      false
    );
  });

  test("合成与抽奖传递同一请求 ID，并显式传券种", async () => {
    HttpService.doAuthenticatedRequest.mockResolvedValue(successResponse({}));
    const service = new ScienceTrainLotteryService();

    await service.convertTickets("9988", "conversion-request");
    await service.draw("9988", "LEAP", "draw-request");

    expect(HttpService.doAuthenticatedRequest).toHaveBeenNthCalledWith(
      1,
      "https://offline.invalid/activity-user-server/api/v1/activity/main/draw/460544621232197/9988/ticket-conversions",
      "post",
      { requestId: "conversion-request" },
      undefined,
      false
    );
    expect(HttpService.doAuthenticatedRequest).toHaveBeenNthCalledWith(
      2,
      "https://offline.invalid/activity-user-server/api/v1/activity/main/draw/460544621232197/9988/draws",
      "post",
      { requestId: "draw-request", ticketType: "LEAP" },
      undefined,
      false
    );
  });

  test("记录分页和商家转账接口遵循公开契约", async () => {
    HttpService.doAuthenticatedRequest.mockResolvedValue(successResponse([]));
    const service = new ScienceTrainLotteryService();

    await service.getRecords("9988", 99, -5);
    await service.getMerchantTransfer("9988", "record/id");

    expect(HttpService.doAuthenticatedRequest).toHaveBeenNthCalledWith(
      1,
      "https://offline.invalid/activity-user-server/api/v1/activity/main/draw/460544621232197/9988/records?limit=50&offset=0",
      "get",
      undefined,
      undefined,
      false
    );
    expect(HttpService.doAuthenticatedRequest).toHaveBeenNthCalledWith(
      2,
      "https://offline.invalid/activity-user-server/api/v1/activity/main/draw/460544621232197/9988/records/record%2Fid/merchant-transfer",
      "post",
      undefined,
      undefined,
      false
    );
  });

  test("401 不回退本地 Mock", async () => {
    HttpService.doAuthenticatedRequest.mockResolvedValue({
      statusCode: 401,
      data: {},
    });

    const response = await new ScienceTrainLotteryService().getSummary("9988");
    expect(response).toMatchObject({
      success: false,
      code: "UNAUTHENTICATED",
    });
  });
});
