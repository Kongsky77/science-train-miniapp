import ApiResponse from "@/beans/ApiResponse";
import {
  ScienceTrainPointsSummary,
  ScienceTrainQuizProgress,
} from "@/beans/scienceTrain/ScienceTrainPoints";
import HttpService from "@/common/utils/HttpService";
import { SCIENCE_TRAIN_ACTIVITY_ID } from "@/definition/scienceTrain/ScienceTrainConfig";

const ACTIVITY_BASEAPI = process.env.VUE_APP_ACTIVITY_BASEAPI;

export default class ScienceTrainPointsService {
  getSummary(
    subUserId: string
  ): Promise<ApiResponse<ScienceTrainPointsSummary>> {
    const baseUrl = this.getPointsBaseUrl(subUserId);
    if (!baseUrl) {
      return Promise.resolve(this.missingBaseApiResponse<ScienceTrainPointsSummary>());
    }

    return HttpService.doAuthenticatedRequest(
      `${baseUrl}/summary`,
      "get",
      undefined,
      undefined,
      false
    ).then((response: any) => this.parseResponse<ScienceTrainPointsSummary>(response));
  }

  getProgress(
    subUserId: string
  ): Promise<ApiResponse<ScienceTrainQuizProgress>> {
    const baseUrl = this.getPointsBaseUrl(subUserId);
    if (!baseUrl) {
      return Promise.resolve(this.missingBaseApiResponse<ScienceTrainQuizProgress>());
    }

    return HttpService.doAuthenticatedRequest(
      `${baseUrl}/progress`,
      "get",
      undefined,
      undefined,
      false
    ).then((response: any) => this.parseResponse<ScienceTrainQuizProgress>(response));
  }

  private getPointsBaseUrl(subUserId: string): string {
    if (!ACTIVITY_BASEAPI) {
      return "";
    }
    return (
      `${ACTIVITY_BASEAPI}/api/v1/activity/main/points/` +
      `${encodeURIComponent(SCIENCE_TRAIN_ACTIVITY_ID)}/` +
      `${encodeURIComponent(String(subUserId))}`
    );
  }

  private parseResponse<T>(response: any): ApiResponse<T> {
    if (response && response.statusCode === 401) {
      return new ApiResponse<T>(false, "UNAUTHORIZED", "登录状态已失效");
    }
    if (!response || !response.data || typeof response.data !== "object") {
      const statusCode = response && response.statusCode;
      return new ApiResponse<T>(
        false,
        statusCode ? `HTTP_${statusCode}` : "INVALID_RESPONSE",
        "积分服务返回异常"
      );
    }
    return ApiResponse.parseToObject<T>(response);
  }

  private missingBaseApiResponse<T>(): ApiResponse<T> {
    return new ApiResponse<T>(
      false,
      "ACTIVITY_BASEAPI_MISSING",
      "积分服务地址尚未配置"
    );
  }
}
