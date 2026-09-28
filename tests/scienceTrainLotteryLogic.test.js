const {
  canClaimScienceTrainCashRecord,
  canOpenScienceTrainMerchantTransfer,
  createScienceTrainLotteryRequestId,
  formatScienceTrainCashFen,
  formatScienceTrainProbability,
  getScienceTrainFulfillmentText,
  getScienceTrainLotteryBalance,
  getScienceTrainLotteryPrizeItems,
  getScienceTrainRecordActionText,
  parseScienceTrainLotteryInteger,
  validateScienceTrainLotterySummary,
} = require("../src/logic/scienceTrain/ScienceTrainLotteryLogic.ts");

function createSummary() {
  return {
    drawOpen: true,
    conversionOpen: true,
    ticketBalances: [
      {
        ticketType: "EXPLORER",
        displayName: "科普探索券",
        availableQuantity: "3",
        maxCashAmountFen: "1000",
        winningProbabilityBasisPoints: "5000",
        prizeItems: [
          {
            prizeKey: "explorer-1",
            prizeName: "1 元现金红包",
            probabilityBasisPoints: "3000",
          },
          {
            prizeKey: "explorer-2",
            prizeName: "5 元现金红包",
            probabilityBasisPoints: "2000",
          },
        ],
      },
      {
        ticketType: "LEAP",
        displayName: "科普跃迁券",
        availableQuantity: "1",
        maxCashAmountFen: "3000",
        winningProbabilityBasisPoints: "7500",
      },
    ],
  };
}

describe("科普列车抽奖展示逻辑", () => {
  test("按券种读取服务端余额且不依赖数组顺序", () => {
    const summary = createSummary();
    summary.ticketBalances.reverse();

    expect(getScienceTrainLotteryBalance(summary, "EXPLORER")).toMatchObject({
      availableQuantity: "3",
      maxCashAmountFen: "1000",
    });
    expect(getScienceTrainLotteryBalance(summary, "LEAP")).toMatchObject({
      availableQuantity: "1",
      winningProbabilityBasisPoints: "7500",
    });
  });

  test("按万分比和分格式化服务端配置", () => {
    expect(formatScienceTrainProbability("5000")).toBe("50%");
    expect(formatScienceTrainProbability("7555")).toBe("75.55%");
    expect(formatScienceTrainCashFen("70")).toBe("0.7");
    expect(formatScienceTrainCashFen("3000")).toBe("30");
    expect(parseScienceTrainLotteryInteger("invalid")).toBe(0);
  });

  test("按券种读取有效奖项和逐项中奖率", () => {
    const summary = createSummary();
    expect(getScienceTrainLotteryPrizeItems(summary, "EXPLORER")).toEqual([
      expect.objectContaining({
        prizeName: "1 元现金红包",
        probabilityBasisPoints: "3000",
      }),
      expect.objectContaining({
        prizeName: "5 元现金红包",
        probabilityBasisPoints: "2000",
      }),
    ]);
    expect(getScienceTrainLotteryPrizeItems(summary, "LEAP")).toEqual([]);

    summary.ticketBalances[0].prizeItems.push({
      prizeName: "",
      probabilityBasisPoints: "invalid",
    });
    expect(getScienceTrainLotteryPrizeItems(summary, "EXPLORER")).toHaveLength(
      2
    );
  });

  test("测试活动在摘要仅返回汇总值时展示后台奖项明细", () => {
    const summary = createSummary();
    summary.ticketBalances[0] = {
      ...summary.ticketBalances[0],
      maxCashAmountFen: "100",
      winningProbabilityBasisPoints: "7500",
      prizeItems: undefined,
    };
    summary.ticketBalances[1] = {
      ...summary.ticketBalances[1],
      maxCashAmountFen: "1000",
      winningProbabilityBasisPoints: "8500",
    };

    expect(
      getScienceTrainLotteryPrizeItems(
        summary,
        "EXPLORER",
        "460544621232197"
      )
    ).toEqual([
      expect.objectContaining({
        prizeName: "0.3元微信红包",
        probabilityBasisPoints: 7000,
      }),
      expect.objectContaining({
        prizeName: "未中奖",
        probabilityBasisPoints: 2500,
      }),
      expect.objectContaining({
        prizeName: "1元微信红包",
        probabilityBasisPoints: 500,
      }),
    ]);
    expect(
      getScienceTrainLotteryPrizeItems(summary, "LEAP", "460544621232197")
    ).toEqual([
      expect.objectContaining({
        prizeName: "1元微信红包",
        probabilityBasisPoints: 8000,
      }),
      expect.objectContaining({
        prizeName: "未中奖",
        probabilityBasisPoints: 1500,
      }),
      expect.objectContaining({
        prizeName: "10元微信红包",
        probabilityBasisPoints: 500,
      }),
    ]);
    expect(
      getScienceTrainLotteryPrizeItems(summary, "LEAP", "another-activity")
    ).toEqual([]);
  });

  test("摘要必须同时包含两类券和开关状态", () => {
    expect(validateScienceTrainLotterySummary(createSummary())).toEqual({
      valid: true,
      reason: "",
    });
    const incomplete = createSummary();
    incomplete.ticketBalances = incomplete.ticketBalances.slice(0, 1);
    expect(validateScienceTrainLotterySummary(incomplete)).toMatchObject({
      valid: false,
    });
  });

  test("抽奖记录仅展示未中奖、领取奖励和已领取三种用户状态", () => {
    const record = {
      drawRecordId: "1",
      requestId: "request-1",
      drawStatus: "WON",
      fulfillmentStatus: "PENDING",
      prizeType: "CASH_RED_PACKET",
      occurredAt: "1",
      ticketType: "EXPLORER",
    };
    expect(canClaimScienceTrainCashRecord(record)).toBe(true);
    expect(getScienceTrainRecordActionText(record)).toBe("领取奖励");

    ["RETRYABLE_FAILED", "FAILED", "NONE"].forEach(fulfillmentStatus => {
      const unclaimedRecord = { ...record, fulfillmentStatus };
      expect(canClaimScienceTrainCashRecord(unclaimedRecord)).toBe(true);
      expect(getScienceTrainRecordActionText(unclaimedRecord)).toBe("领取奖励");
    });

    ["PROCESSING", "SUCCEEDED"].forEach(fulfillmentStatus => {
      const claimedRecord = { ...record, fulfillmentStatus };
      expect(canClaimScienceTrainCashRecord(claimedRecord)).toBe(false);
      expect(getScienceTrainRecordActionText(claimedRecord)).toBe("已领取");
    });

    const notWonRecord = {
      ...record,
      drawStatus: "NOT_WON",
      fulfillmentStatus: "NONE",
    };
    expect(canClaimScienceTrainCashRecord(notWonRecord)).toBe(false);
    expect(getScienceTrainFulfillmentText(notWonRecord)).toBe("未中奖");
  });

  test("仅完整的待用户确认参数可以调起微信收款页", () => {
    const transfer = {
      fulfillmentStatus: "PROCESSING",
      providerState: "WAIT_USER_CONFIRM",
      appId: "wx-app-id",
      mchId: "merchant-id",
      packageInfo: "opaque-package",
    };

    expect(canOpenScienceTrainMerchantTransfer(transfer)).toBe(true);
    expect(
      canOpenScienceTrainMerchantTransfer({
        ...transfer,
        providerState: "TRANSFERING",
      })
    ).toBe(false);
    expect(
      canOpenScienceTrainMerchantTransfer({
        ...transfer,
        packageInfo: "   ",
      })
    ).toBe(false);
  });

  test("请求 ID 满足 UUID v4 形态且不超过接口长度", () => {
    const requestId = createScienceTrainLotteryRequestId(() => 0);
    expect(requestId).toBe("00000000-0000-4000-8000-000000000000");
    expect(requestId.length).toBeLessThanOrEqual(64);
  });
});
