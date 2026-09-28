import ApiResponse from "@/beans/ApiResponse";
import ScienceTrainRankResponse, {
  ScienceTrainPersonalRankResponse,
  ScienceTrainPublicParticipantResponse,
} from "@/beans/rank/ScienceTrainRankResponse";
import HttpService from "@/common/utils/HttpService";
import { SCIENCE_TRAIN_ACTIVITY_ID } from "@/definition/scienceTrain/ScienceTrainConfig";

const ACTIVITY_BASEAPI = process.env.VUE_APP_ACTIVITY_BASEAPI;

export default class ScienceTrainRankService {
  getPublicTotalRank(
    pageNo: number,
    pageSize: number
  ): Promise<ApiResponse<ScienceTrainRankResponse>> {
    const url =
      `${ACTIVITY_BASEAPI}/api/v1/rank/data/` +
      `${SCIENCE_TRAIN_ACTIVITY_ID}/1/public/new/0` +
      `?pageNo=${pageNo}&pageSize=${pageSize}`;

    return HttpService.doPublicRequest(
      url,
      "get",
      undefined,
      undefined,
      false
    ).then((response: any) => ApiResponse.parseToObject(response));
  }

  getPublicParticipants(
    pageSize = 500
  ): Promise<ApiResponse<ScienceTrainPublicParticipantResponse>> {
    return this.getPublicParticipantPage(1, pageSize).then((firstPage) => {
      if (!firstPage.success || !firstPage.data) {
        return firstPage;
      }

      const totalPages = Math.max(1, Number(firstPage.data.pages || 1));
      if (totalPages === 1) {
        return firstPage;
      }

      const remainingRequests: Array<
        Promise<ApiResponse<ScienceTrainPublicParticipantResponse>>
      > = [];
      for (let pageNo = 2; pageNo <= totalPages; pageNo += 1) {
        remainingRequests.push(
          this.getPublicParticipantPage(pageNo, pageSize)
        );
      }

      return Promise.all(remainingRequests).then((remainingPages) => {
        const failedPage = remainingPages.find(
          (response) => !response.success || !response.data
        );
        if (failedPage) {
          return failedPage;
        }

        firstPage.data!.records = remainingPages.reduce(
          (records, response) =>
            records.concat(
              response.data && Array.isArray(response.data.records)
                ? response.data.records
                : []
            ),
          Array.isArray(firstPage.data!.records)
            ? firstPage.data!.records.slice()
            : []
        );
        return firstPage;
      });
    });
  }

  private getPublicParticipantPage(
    pageNo: number,
    pageSize: number
  ): Promise<ApiResponse<ScienceTrainPublicParticipantResponse>> {
    const url =
      `${ACTIVITY_BASEAPI}/api/v1/activity/` +
      `${encodeURIComponent(SCIENCE_TRAIN_ACTIVITY_ID)}/users/public` +
      `?pageNo=${pageNo}&pageSize=${pageSize}`;

    return HttpService.doPublicRequest(
      url,
      "get",
      undefined,
      undefined,
      false
    ).then((response: any) => ApiResponse.parseToObject(response));
  }

  getPersonalRank(
    subUserId: string
  ): Promise<ApiResponse<ScienceTrainPersonalRankResponse>> {
    if (!ACTIVITY_BASEAPI) {
      return Promise.resolve(
        new ApiResponse<ScienceTrainPersonalRankResponse>(
          false,
          "ACTIVITY_BASEAPI_MISSING",
          "排行榜服务地址尚未配置"
        )
      );
    }
    const url =
      `${ACTIVITY_BASEAPI}/api/v1/rank/data/` +
      `${encodeURIComponent(SCIENCE_TRAIN_ACTIVITY_ID)}/` +
      `${encodeURIComponent(String(subUserId))}/user`;

    return HttpService.doAuthenticatedRequest(
      url,
      "get",
      undefined,
      undefined,
      false
    ).then((response: any) => {
      if (response && response.statusCode === 401) {
        return new ApiResponse<ScienceTrainPersonalRankResponse>(
          false,
          "UNAUTHORIZED",
          "登录状态已失效"
        );
      }
      if (!response || !response.data || typeof response.data !== "object") {
        const statusCode = response && response.statusCode;
        return new ApiResponse<ScienceTrainPersonalRankResponse>(
          false,
          statusCode ? `HTTP_${statusCode}` : "INVALID_RESPONSE",
          "排行榜服务返回异常"
        );
      }
      return ApiResponse.parseToObject(response);
    });
  }
}
