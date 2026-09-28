jest.mock("../src/common/utils/HttpService.ts", () => ({
  __esModule: true,
  default: {
    doAuthenticatedRequest: jest.fn(),
  },
}));

jest.mock("../src/service/BlobService.ts", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    upLoadFile: jest.fn(),
  })),
}));

process.env.VUE_APP_ACTIVITY_BASEAPI = "https://offline.invalid/activity-user-server";

const HttpService = require("../src/common/utils/HttpService.ts").default;
const BlobService = require("../src/service/BlobService.ts").default;
const CheckInService = require("../src/service/CheckInService.ts").default;
const CheckInPhotoService = require("../src/service/CheckInPhotoService.ts").default;

const successResponse = (data) => ({
  statusCode: 200,
  data: {
    success: true,
    errorCode: "",
    errorDesc: "",
    data,
  },
});

describe("科普列车正式打卡离线接口契约", () => {
  beforeEach(() => {
    HttpService.doAuthenticatedRequest.mockReset();
    BlobService.mockClear();
  });

  test("查询接口编码活动和参与者 ID，并解析 V2 积分", async () => {
    HttpService.doAuthenticatedRequest.mockResolvedValue(successResponse({
      enabled: true,
      points: [{ id: "843700000000001", status: "AVAILABLE" }],
      activityPoints: { totalPoints: "170", projectionVersion: "3" },
    }));

    const response = await new CheckInService().getPoints("activity/id", "sub user/1", false);

    expect(HttpService.doAuthenticatedRequest).toHaveBeenCalledWith(
      "https://offline.invalid/activity-user-server/api/v1/activity/main/check-in/activity%2Fid/sub%20user%2F1/points",
      "get",
      undefined,
      undefined,
      false
    );
    expect(response.data.points[0].id).toBe("843700000000001");
    expect(response.data.activityPoints.totalPoints).toBe(170);
  });

  test("提交接口编码打卡点 ID 并原样传递同一请求 ID", async () => {
    const request = {
      latitude: 30.657,
      longitude: 104.066,
      accuracyMeter: 18.6,
      photoUrl: "https://blob.invalid/photo.jpg",
      requestId: "same-request-id",
    };
    HttpService.doAuthenticatedRequest.mockResolvedValue(successResponse({
      recordId: "843700000000100",
      pointId: "point/id",
      checkedInAt: "1788200100000",
      activityPoints: { totalPoints: 90 },
    }));

    const response = await new CheckInService().submit("460", "9988", "point/id", request);

    expect(HttpService.doAuthenticatedRequest).toHaveBeenCalledWith(
      "https://offline.invalid/activity-user-server/api/v1/activity/main/check-in/460/9988/points/point%2Fid",
      "post",
      request,
      undefined,
      false
    );
    expect(response.data.recordId).toBe("843700000000100");
    expect(response.data.checkedInAt).toBe("1788200100000");
  });

  test("照片路径严格使用活动、参与者、场馆和同一请求 ID", async () => {
    const upload = jest.fn().mockResolvedValue({
      success: true,
      data: "https://blob.invalid/460/checkin/9988/101/request-id.jpg",
    });
    BlobService.mockImplementationOnce(() => ({ upLoadFile: upload }));

    const url = await new CheckInPhotoService().upload(
      "/tmp/photo.JPG",
      "460",
      "9988",
      "101",
      "request-id"
    );

    expect(upload).toHaveBeenCalledWith(
      "/tmp/photo.JPG",
      "460/checkin/9988/101",
      "request-id.jpg"
    );
    expect(url).toBe("https://blob.invalid/460/checkin/9988/101/request-id.jpg");
  });

  test("401 明确返回登录失效，不回退到本地模拟", async () => {
    HttpService.doAuthenticatedRequest.mockResolvedValue({ statusCode: 401, data: {} });
    const response = await new CheckInService().getPoints("460", "9988", false);
    expect(response).toMatchObject({ success: false, code: "UNAUTHENTICATED" });
  });
});
