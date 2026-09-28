import ApiResponse from "@/beans/ApiResponse";
import ScienceTrainDailyRound, {
  ScienceTrainDailyAnswerRequest,
  ScienceTrainDailyAnswerResponse,
} from "@/beans/scienceTrain/ScienceTrainDailyRound";
import HttpService from "@/common/utils/HttpService";
import { SCIENCE_TRAIN_ACTIVITY_ID } from "@/definition/scienceTrain/ScienceTrainConfig";

const SAMWELL_BASEAPI = process.env.VUE_APP_SAMWELL_BASEAPI;

export default class ScienceTrainQuizService {
  startDailyRound(
    subUserId: string
  ): Promise<ApiResponse<ScienceTrainDailyRound>> {
    if (!SAMWELL_BASEAPI) {
      return Promise.resolve(
        new ApiResponse<ScienceTrainDailyRound>(
          false,
          "SAMWELL_BASEAPI_MISSING",
          "答题服务地址尚未配置"
        )
      );
    }

    const url =
      `${SAMWELL_BASEAPI}/n/api/v1/activity/` +
      `${encodeURIComponent(SCIENCE_TRAIN_ACTIVITY_ID)}/daily-round/` +
      `${encodeURIComponent(String(subUserId))}/start`;

    return HttpService.doAuthenticatedRequest(
      url,
      "post",
      undefined,
      undefined,
      false
    ).then((response: any) => this.parseRoundResponse(response));
  }

  getTodayRound(
    subUserId: string
  ): Promise<ApiResponse<ScienceTrainDailyRound>> {
    const baseUrl = this.getDailyRoundBaseUrl(subUserId);
    if (!baseUrl) {
      return Promise.resolve(this.missingBaseApiResponse<ScienceTrainDailyRound>());
    }

    return HttpService.doAuthenticatedRequest(
      `${baseUrl}/today`,
      "get",
      undefined,
      undefined,
      false
    ).then((response: any) => this.parseResponse<ScienceTrainDailyRound>(response));
  }

  answerDailyRoundItem(
    subUserId: string,
    itemId: string,
    request: ScienceTrainDailyAnswerRequest
  ): Promise<ApiResponse<ScienceTrainDailyAnswerResponse>> {
    const baseUrl = this.getDailyRoundBaseUrl(subUserId);
    if (!baseUrl) {
      return Promise.resolve(
        this.missingBaseApiResponse<ScienceTrainDailyAnswerResponse>()
      );
    }

    const url =
      `${baseUrl}/items/${encodeURIComponent(String(itemId))}/answer`;
    return HttpService.doAuthenticatedRequest(
      url,
      "post",
      request,
      undefined,
      false
    ).then((response: any) =>
      this.parseResponse<ScienceTrainDailyAnswerResponse>(response)
    );
  }

  private parseRoundResponse(
    response: any
  ): ApiResponse<ScienceTrainDailyRound> {
    return this.parseResponse<ScienceTrainDailyRound>(response);
  }

  private parseResponse<T>(response: any): ApiResponse<T> {
    if (response && response.statusCode === 401) {
      return new ApiResponse<T>(
        false,
        "UNAUTHORIZED",
        "登录状态已失效"
      );
    }

    if (!response || !response.data || typeof response.data !== "object") {
      const statusCode = response && response.statusCode;
      return new ApiResponse<T>(
        false,
        statusCode ? `HTTP_${statusCode}` : "INVALID_RESPONSE",
        "答题服务返回异常"
      );
    }

    return ApiResponse.parseToObject<T>(response);
  }

  private getDailyRoundBaseUrl(subUserId: string): string {
    if (!SAMWELL_BASEAPI) {
      return "";
    }
    return (
      `${SAMWELL_BASEAPI}/n/api/v1/activity/` +
      `${encodeURIComponent(SCIENCE_TRAIN_ACTIVITY_ID)}/daily-round/` +
      `${encodeURIComponent(String(subUserId))}`
    );
  }

  private missingBaseApiResponse<T>(): ApiResponse<T> {
    return new ApiResponse<T>(
      false,
      "SAMWELL_BASEAPI_MISSING",
      "答题服务地址尚未配置"
    );
  }
}
