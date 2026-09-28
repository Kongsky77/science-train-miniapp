export type ScienceTrainLotteryTicketType = "EXPLORER" | "LEAP";

export type ScienceTrainLotteryDrawStatus = "WON" | "NOT_WON";

export type ScienceTrainLotteryFulfillmentStatus =
  | "NONE"
  | "PENDING"
  | "PROCESSING"
  | "RETRYABLE_FAILED"
  | "SUCCEEDED"
  | "FAILED";

export interface ScienceTrainLotteryPrizeItem {
  prizeKey?: string;
  prizeName: string;
  prizeDescription?: string;
  prizeType?: "CASH_RED_PACKET" | string;
  cashAmountFen?: string | number;
  probabilityBasisPoints: string | number;
}

export interface ScienceTrainLotteryTicketBalance {
  ticketType: ScienceTrainLotteryTicketType;
  displayName: string;
  availableQuantity: string | number;
  maxCashAmountFen: string | number;
  winningProbabilityBasisPoints: string | number;
  prizeItems?: ScienceTrainLotteryPrizeItem[];
}

export interface ScienceTrainLotteryConversionRule {
  sourceTicketType: ScienceTrainLotteryTicketType;
  sourceQuantity: string | number;
  targetTicketType: ScienceTrainLotteryTicketType;
  targetQuantity: string | number;
  conversionAvailable: boolean;
}

export interface ScienceTrainLotterySummary {
  availableQuantity?: string | number;
  onlineGrantedQuantity?: string | number;
  offlineGrantedQuantity?: string | number;
  offlineRemainingToday?: string | number;
  drawOpen: boolean;
  displayMessage?: string;
  closedReason?: string;
  ticketBalances: ScienceTrainLotteryTicketBalance[];
  conversionRule?: ScienceTrainLotteryConversionRule;
  onlineTicketGrantedToday?: boolean;
  offlineTicketGrantedToday?: boolean;
  conversionOpen: boolean;
}

export interface ScienceTrainLotteryConversionResult {
  conversionId: string;
  requestId: string;
  sourceTicketType: ScienceTrainLotteryTicketType;
  sourceQuantity: string | number;
  targetTicketType: ScienceTrainLotteryTicketType;
  targetQuantity: string | number;
  ticketBalances: { [key: string]: string | number };
  occurredAt: string | number;
}

export interface ScienceTrainLotteryDrawRecord {
  drawRecordId: string;
  requestId: string;
  drawStatus: ScienceTrainLotteryDrawStatus;
  fulfillmentStatus: ScienceTrainLotteryFulfillmentStatus;
  prizeId?: string;
  prizeType?: "CASH_RED_PACKET" | "NO_WIN" | string;
  prizeName?: string;
  prizeDescription?: string;
  prizeImageUrl?: string;
  prizeBannerUrl?: string;
  claimInstruction?: string;
  occurredAt: string | number;
  ticketType: ScienceTrainLotteryTicketType;
  poolCode?: string;
  prizeKey?: string;
  cashCapFenSnapshot?: string | number;
}

export interface ScienceTrainLotteryDrawResult {
  drawRecord: ScienceTrainLotteryDrawRecord;
  availableQuantity: string | number;
  ticketType: ScienceTrainLotteryTicketType;
  poolCode?: string;
  prizeKey?: string;
  cashCapFenSnapshot?: string | number;
}

export interface ScienceTrainMerchantTransferResult {
  fulfillmentStatus: ScienceTrainLotteryFulfillmentStatus;
  providerState?: "WAIT_USER_CONFIRM" | "TRANSFERING" | string;
  failureReason?: string;
  appId?: string;
  mchId?: string;
  packageInfo?: string;
}
