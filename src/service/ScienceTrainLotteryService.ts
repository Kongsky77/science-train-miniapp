import ApiResponse from "@/beans/ApiResponse";
import {
  ScienceTrainLotteryConversionResult,
  ScienceTrainLotteryDrawRecord,
  ScienceTrainLotteryDrawResult,
  ScienceTrainLotterySummary,
  ScienceTrainLotteryTicketType,
  ScienceTrainMerchantTransferResult,
} from "@/beans/scienceTrain/ScienceTrainLottery";
import HttpService from "@/common/utils/HttpService";
import { SCIENCE_TRAIN_LOTTERY_ACTIVITY_ID } from "@/definition/scienceTrain/ScienceTrainConfig";

const ACTIVITY_BASEAPI = process.env.VUE_APP_ACTIVITY_BASEAPI;

export default class ScienceTrainLotteryService {
  getSummary(
    subUserId: string
  ): Promise<ApiResponse<ScienceTrainLotterySummary>> {
    const baseUrl = this.getDrawBaseUrl(subUserId);
    if (!baseUrl) {
      return Promise.resolve(
        this.missingBaseApiResponse<ScienceTrainLotterySummary>()
      );
    }
    return HttpService.doAuthenticatedRequest(
      `${baseUrl}/summary`,
      "get",
      undefined,
      undefined,
      false
    ).then((response: any) =>
      this.parseResponse<ScienceTrainLotterySummary>(response)
    );
  }

  convertTickets(
    subUserId: string,
    requestId: string
  ): Promise<ApiResponse<ScienceTrainLotteryConversionResult>> {
    const baseUrl = this.getDrawBaseUrl(subUserId);
    if (!baseUrl) {
      return Promise.resolve(
        this.missingBaseApiResponse<ScienceTrainLotteryConversionResult>()
      );
    }
    return HttpService.doAuthenticatedRequest(
      `${baseUrl}/ticket-conversions`,
      "post",
      { requestId },
      undefined,
      false
    ).then((response: any) =>
      this.parseResponse<ScienceTrainLotteryConversionResult>(response)
    );
  }

  draw(
    subUserId: string,
    ticketType: ScienceTrainLotteryTicketType,
    requestId: string
  ): Promise<ApiResponse<ScienceTrainLotteryDrawResult>> {
    const baseUrl = this.getDrawBaseUrl(subUserId);
    if (!baseUrl) {
      return Promise.resolve(
        this.missingBaseApiResponse<ScienceTrainLotteryDrawResult>()
      );
    }
    return HttpService.doAuthenticatedRequest(
      `${baseUrl}/draws`,
      "post",
      { requestId, ticketType },
      undefined,
      false
    ).then((response: any) =>
      this.parseResponse<ScienceTrainLotteryDrawResult>(response)
    );
  }

  getRecords(
    subUserId: string,
    limit = 20,
    offset = 0
  ): Promise<ApiResponse<ScienceTrainLotteryDrawRecord[]>> {
    const baseUrl = this.getDrawBaseUrl(subUserId);
    if (!baseUrl) {
      return Promise.resolve(
        this.missingBaseApiResponse<ScienceTrainLotteryDrawRecord[]>()
      );
    }
    const safeLimit = Math.max(1, Math.min(50, Math.floor(Number(limit) || 20)));
    const safeOffset = Math.max(0, Math.floor(Number(offset) || 0));
    return HttpService.doAuthenticatedRequest(
      `${baseUrl}/records?limit=${safeLimit}&offset=${safeOffset}`,
      "get",
      undefined,
      undefined,
      false
    ).then((response: any) =>
      this.parseResponse<ScienceTrainLotteryDrawRecord[]>(response)
    );
  }

  getMerchantTransfer(
    subUserId: string,
    recordId: string
  ): Promise<ApiResponse<ScienceTrainMerchantTransferResult>> {
    const baseUrl = this.getDrawBaseUrl(subUserId);
    if (!baseUrl) {
      return Promise.resolve(
        this.missingBaseApiResponse<ScienceTrainMerchantTransferResult>()
      );
    }
    return HttpService.doAuthenticatedRequest(
      `${baseUrl}/records/${encodeURIComponent(String(recordId))}/merchant-transfer`,
      "post",
      undefined,
      undefined,
      false
    ).then((response: any) =>
      this.parseResponse<ScienceTrainMerchantTransferResult>(response)
    );
  }

  private getDrawBaseUrl(subUserId: string): string {
    if (!ACTIVITY_BASEAPI) {
      return "";
    }
    return (
      `${ACTIVITY_BASEAPI}/api/v1/activity/main/draw/` +
      `${encodeURIComponent(SCIENCE_TRAIN_LOTTERY_ACTIVITY_ID)}/` +
      `${encodeURIComponent(String(subUserId))}`
    );
  }

  private parseResponse<T>(response: any): ApiResponse<T> {
    if (response && response.statusCode === 401) {
      return new ApiResponse<T>(false, "UNAUTHENTICATED", "登录状态已失效");
    }
    if (!response || !response.data || typeof response.data !== "object") {
      const statusCode = response && response.statusCode;
      return new ApiResponse<T>(
        false,
        statusCode ? `HTTP_${statusCode}` : "INVALID_RESPONSE",
        "抽奖服务返回异常"
      );
    }
    return ApiResponse.parseToObject<T>(response);
  }

  private missingBaseApiResponse<T>(): ApiResponse<T> {
    return new ApiResponse<T>(
      false,
      "ACTIVITY_BASEAPI_MISSING",
      "抽奖服务地址尚未配置"
    );
  }
}
