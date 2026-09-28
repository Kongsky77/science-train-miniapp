const fs = require("fs");
const path = require("path");
const {
  countTodayCheckIns,
  DAILY_SCORED_CHECK_IN_LIMIT,
} = require("../src/utils/check-in/DailyCheckInLimit");

describe("科普列车每日打卡积分提示", () => {
  test("只统计当前本地日期内已经完成的场馆", () => {
    const now = new Date(2026, 8, 21, 12, 0, 0);
    const todayMorning = new Date(2026, 8, 21, 8, 30, 0);
    const todaySeconds = Math.floor(new Date(2026, 8, 21, 9, 30, 0).getTime() / 1000);
    const yesterday = new Date(2026, 8, 20, 23, 59, 0);

    expect(countTodayCheckIns([
      { checkedInAt: String(todayMorning.getTime()) },
      { checkedInAt: String(todaySeconds) },
      { checkedInAt: String(yesterday.getTime()) },
      { checkedInAt: null },
      { checkedInAt: "invalid" },
    ], now)).toBe(DAILY_SCORED_CHECK_IN_LIMIT);
  });

  test("选择第三个场馆时提示仍可打卡但不再获得积分", () => {
    const source = fs.readFileSync(
      path.resolve(__dirname, "../src/pages/kjgCheckIn/index.vue"),
      "utf8"
    );
    const activityRuleSource = fs.readFileSync(
      path.resolve(__dirname, "../src/pages/kjgActivityDetail/index.vue"),
      "utf8"
    );

    expect(source).toContain("if (isNewSelection && this.hasReachedDailyScoreLimit)");
    expect(source).toContain("超过2个仍计入有效打卡，但不再获得积分");
    expect(activityRuleSource).toContain("超过2个的打卡仍计入有效打卡，但不再获得积分");
    expect(source).not.toContain("不计入有效打卡");
    expect(activityRuleSource).not.toContain("不计入有效打卡");
    expect(source).toContain("今日打卡积分已达上限");
    expect(source).toContain("本次仍可继续打卡，但不会获得积分");
    expect(source).toContain('cancelText: "暂不打卡"');
    expect(source).toContain('confirmText: "继续打卡"');
  });
});
