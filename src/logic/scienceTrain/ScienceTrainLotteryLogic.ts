import {
  ScienceTrainLotteryDrawRecord,
  ScienceTrainLotteryPrizeItem,
  ScienceTrainLotterySummary,
  ScienceTrainLotteryTicketBalance,
  ScienceTrainLotteryTicketType,
  ScienceTrainMerchantTransferResult,
} from "../../beans/scienceTrain/ScienceTrainLottery";

export interface ScienceTrainLotteryValidationResult {
  valid: boolean;
  reason: string;
}

const SCIENCE_TRAIN_TEST_ACTIVITY_ID = "460544621232197";

const SCIENCE_TRAIN_TEST_PRIZE_ITEMS: {
  [key in ScienceTrainLotteryTicketType]: {
    maxCashAmountFen: number;
    winningProbabilityBasisPoints: number;
    items: ScienceTrainLotteryPrizeItem[];
  };
} = {
  EXPLORER: {
    maxCashAmountFen: 100,
    winningProbabilityBasisPoints: 7500,
    items: [
      {
        prizeKey: "EXPLORER_CASH_30_FALLBACK",
        prizeName: "0.3元微信红包",
        prizeType: "CASH_RED_PACKET",
        cashAmountFen: 30,
        probabilityBasisPoints: 7000
      },
      {
        prizeKey: "EXPLORER_NO_WIN_FALLBACK",
        prizeName: "未中奖",
        prizeType: "NO_WIN",
        probabilityBasisPoints: 2500
      },
      {
        prizeKey: "EXPLORER_CASH_100_FALLBACK",
        prizeName: "1元微信红包",
        prizeType: "CASH_RED_PACKET",
        cashAmountFen: 100,
        probabilityBasisPoints: 500
      }
    ]
  },
  LEAP: {
    maxCashAmountFen: 1000,
    winningProbabilityBasisPoints: 8500,
    items: [
      {
        prizeKey: "LEAP_CASH_100_FALLBACK",
        prizeName: "1元微信红包",
        prizeType: "CASH_RED_PACKET",
        cashAmountFen: 100,
        probabilityBasisPoints: 8000
      },
      {
        prizeKey: "LEAP_NO_WIN_FALLBACK",
        prizeName: "未中奖",
        prizeType: "NO_WIN",
        probabilityBasisPoints: 1500
      },
      {
        prizeKey: "LEAP_CASH_1000_FALLBACK",
        prizeName: "10元微信红包",
        prizeType: "CASH_RED_PACKET",
        cashAmountFen: 1000,
        probabilityBasisPoints: 500
      }
    ]
  }
};

export function getScienceTrainLotteryPrizeItems(
  summary: ScienceTrainLotterySummary | null,
  ticketType: ScienceTrainLotteryTicketType,
  activityId: string = ""
): ScienceTrainLotteryPrizeItem[] {
  const balance = getScienceTrainLotteryBalance(summary, ticketType);
  if (!balance) {
    return [];
  }
  const configuredItems = Array.isArray(balance.prizeItems)
    ? balance.prizeItems.filter(
        (item) =>
          !!item &&
          typeof item.prizeName === "string" &&
          item.prizeName.trim().length > 0 &&
          Number.isFinite(Number(item.probabilityBasisPoints)) &&
          Number(item.probabilityBasisPoints) >= 0
      )
    : [];
  if (configuredItems.length) {
    return configuredItems;
  }
  if (activityId !== SCIENCE_TRAIN_TEST_ACTIVITY_ID) {
    return [];
  }
  const fallback = SCIENCE_TRAIN_TEST_PRIZE_ITEMS[ticketType];
  const matchesCurrentConfiguration =
    parseScienceTrainLotteryInteger(balance.maxCashAmountFen) ===
      fallback.maxCashAmountFen &&
    parseScienceTrainLotteryInteger(balance.winningProbabilityBasisPoints) ===
      fallback.winningProbabilityBasisPoints;
  return matchesCurrentConfiguration
    ? fallback.items.map((item) => ({ ...item }))
    : [];
}

export function parseScienceTrainLotteryInteger(
  value: string | number | undefined | null
): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? Math.floor(parsed) : 0;
}

export function getScienceTrainLotteryBalance(
  summary: ScienceTrainLotterySummary | null,
  ticketType: ScienceTrainLotteryTicketType
): ScienceTrainLotteryTicketBalance | null {
  if (!summary || !Array.isArray(summary.ticketBalances)) {
    return null;
  }
  return (
    summary.ticketBalances.find(
      (balance) => balance && balance.ticketType === ticketType
    ) || null
  );
}

export function formatScienceTrainProbability(
  basisPoints: string | number | undefined | null
): string {
  const value = Math.min(
    10000,
    parseScienceTrainLotteryInteger(basisPoints)
  );
  const percent = value / 100;
  return `${trimTrailingZeros(percent.toFixed(2))}%`;
}

export function formatScienceTrainCashFen(
  amountFen: string | number | undefined | null
): string {
  const fen = parseScienceTrainLotteryInteger(amountFen);
  return trimTrailingZeros((fen / 100).toFixed(2));
}

export function createScienceTrainLotteryRequestId(
  random: () => number = Math.random
): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (token) => {
    const value = Math.floor(random() * 16);
    const nibble = token === "x" ? value : (value & 0x3) | 0x8;
    return nibble.toString(16);
  });
}

export function validateScienceTrainLotterySummary(
  summary: ScienceTrainLotterySummary
): ScienceTrainLotteryValidationResult {
  if (!summary || typeof summary !== "object") {
    return invalid("抽奖摘要不存在");
  }
  if (!Array.isArray(summary.ticketBalances)) {
    return invalid("ticketBalances 必须是数组");
  }
  const explorer = getScienceTrainLotteryBalance(summary, "EXPLORER");
  const leap = getScienceTrainLotteryBalance(summary, "LEAP");
  if (!explorer || !leap) {
    return invalid("ticketBalances 必须同时包含 EXPLORER 和 LEAP");
  }
  if (!isValidBalance(explorer) || !isValidBalance(leap)) {
    return invalid("抽奖券余额或奖池配置无效");
  }
  if (typeof summary.drawOpen !== "boolean") {
    return invalid("drawOpen 必须是布尔值");
  }
  if (typeof summary.conversionOpen !== "boolean") {
    return invalid("conversionOpen 必须是布尔值");
  }
  return { valid: true, reason: "" };
}

export function isScienceTrainCashWinningRecord(
  record: ScienceTrainLotteryDrawRecord | null
): boolean {
  return !!(
    record &&
    record.drawStatus === "WON" &&
    record.prizeType === "CASH_RED_PACKET"
  );
}

export function canClaimScienceTrainCashRecord(
  record: ScienceTrainLotteryDrawRecord
): boolean {
  return (
    isScienceTrainCashWinningRecord(record) &&
    record.fulfillmentStatus !== "PROCESSING" &&
    record.fulfillmentStatus !== "SUCCEEDED"
  );
}

export function canOpenScienceTrainMerchantTransfer(
  result: ScienceTrainMerchantTransferResult | null | undefined
): boolean {
  return !!(
    result &&
    result.providerState === "WAIT_USER_CONFIRM" &&
    isNonEmptyString(result.appId) &&
    isNonEmptyString(result.mchId) &&
    isNonEmptyString(result.packageInfo)
  );
}

export function getScienceTrainRecordActionText(
  record: ScienceTrainLotteryDrawRecord
): string {
  return getScienceTrainFulfillmentText(record);
}

export function getScienceTrainFulfillmentText(
  record: ScienceTrainLotteryDrawRecord
): string {
  if (record.drawStatus === "NOT_WON") {
    return "未中奖";
  }
  if (
    record.fulfillmentStatus === "PROCESSING" ||
    record.fulfillmentStatus === "SUCCEEDED"
  ) {
    return "已领取";
  }
  return "领取奖励";
}

function isValidBalance(balance: ScienceTrainLotteryTicketBalance): boolean {
  return !!(
    balance &&
    (balance.ticketType === "EXPLORER" || balance.ticketType === "LEAP") &&
    typeof balance.displayName === "string" &&
    Number.isFinite(Number(balance.availableQuantity)) &&
    Number.isFinite(Number(balance.maxCashAmountFen)) &&
    Number.isFinite(Number(balance.winningProbabilityBasisPoints))
  );
}

function trimTrailingZeros(value: string): string {
  return value.replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function invalid(reason: string): ScienceTrainLotteryValidationResult {
  return { valid: false, reason };
}
