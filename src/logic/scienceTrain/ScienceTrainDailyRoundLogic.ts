import ScienceTrainDailyRound, {
  ScienceTrainDailyAnswerRequest,
  ScienceTrainDailyQuestion,
  ScienceTrainDailyStation,
  ScienceTrainDailyStationStatus,
} from "../../beans/scienceTrain/ScienceTrainDailyRound";

export interface ScienceTrainRoundValidationResult {
  valid: boolean;
  reason: string;
}

export interface ScienceTrainQuestionOption {
  key: string;
  text: string;
}

export interface ScienceTrainRoundFailureView {
  stage: "error" | "unavailable";
  title: string;
  message: string;
  canRetry: boolean;
}

export interface ScienceTrainAnswerBuildResult {
  valid: boolean;
  reason: string;
  itemId: string;
  request?: ScienceTrainDailyAnswerRequest;
}

export const SCIENCE_TRAIN_QUIZ_TICKET_CORRECT_COUNT = 3;

export function hasScienceTrainQuizTicketEligibility(
  correctCount: string | number | null | undefined
): boolean {
  const normalizedCorrectCount = Number(correctCount);
  return (
    Number.isFinite(normalizedCorrectCount) &&
    normalizedCorrectCount >= SCIENCE_TRAIN_QUIZ_TICKET_CORRECT_COUNT
  );
}

const STATION_STATUSES: ScienceTrainDailyStationStatus[] = [
  "WAITING",
  "OPEN",
  "CORRECT",
  "WRONG",
  "SKIPPED",
];

export function validateScienceTrainDailyRound(
  round: ScienceTrainDailyRound
): ScienceTrainRoundValidationResult {
  if (!round || typeof round !== "object") {
    return invalid("轮次数据不存在");
  }
  if (typeof round.roundId !== "string" || !round.roundId) {
    return invalid("roundId 必须是非空字符串");
  }
  if (typeof round.bizDate !== "string" || !round.bizDate) {
    return invalid("bizDate 必须是非空字符串");
  }
  if (round.status !== "IN_PROGRESS" && round.status !== "COMPLETED") {
    return invalid("轮次状态无效");
  }

  const stations = Array.isArray(round.stations) ? round.stations : [];
  if (stations.length !== 6) {
    return invalid("stations 必须固定为六项");
  }
  const stationNos = stations.map((station) => String(station.stationNo));
  if (stationNos.slice().sort().join(",") !== "1,2,3,4,5,6") {
    return invalid("stationNo 必须完整且唯一地覆盖 1-6");
  }
  if (stations.some((station) => !isValidStation(station))) {
    return invalid("站点基础字段或状态无效");
  }

  const openStations = stations.filter((station) => station.status === "OPEN");
  if (round.status === "IN_PROGRESS") {
    if (openStations.length !== 1) {
      return invalid("进行中轮次必须有且仅有一个 OPEN 站点");
    }
    if (!isValidOpenStation(openStations[0])) {
      return invalid("OPEN 站点必须携带有效题目");
    }
  }
  if (round.status === "COMPLETED" && openStations.length > 0) {
    return invalid("已完成轮次不能包含 OPEN 站点");
  }
  if (round.status === "COMPLETED") {
    const answeredCount = Number(round.answeredCount);
    if (!Number.isFinite(answeredCount) || answeredCount !== 6) {
      return invalid("已完成轮次必须答满六题");
    }
    if (
      stations.some(
        (station) =>
          station.status !== "CORRECT" && station.status !== "WRONG"
      )
    ) {
      return invalid("已完成轮次的六个站点都必须保留作答结果");
    }
  }

  return { valid: true, reason: "" };
}

export function validateScienceTrainCompletedRoundRefresh(
  expectedRound: ScienceTrainDailyRound,
  refreshedRound: ScienceTrainDailyRound
): ScienceTrainRoundValidationResult {
  const validation = validateScienceTrainDailyRound(refreshedRound);
  if (!validation.valid) {
    return validation;
  }
  if (!expectedRound || refreshedRound.roundId !== expectedRound.roundId) {
    return invalid("today 返回的不是当前答题轮次");
  }
  if (refreshedRound.status !== "COMPLETED") {
    return invalid("today 尚未确认当前轮次完成");
  }
  return { valid: true, reason: "" };
}

export function getScienceTrainOpenStation(
  round: ScienceTrainDailyRound | null
): ScienceTrainDailyStation | null {
  if (!round || !Array.isArray(round.stations)) {
    return null;
  }
  return round.stations.find((station) => station.status === "OPEN") || null;
}

export function getScienceTrainCompletionTrainPosition(
  round: ScienceTrainDailyRound | null
): number {
  if (!round || !Array.isArray(round.stations)) {
    return 0;
  }
  const reachedStationNos = round.stations
    .filter(
      (station) => station.status === "CORRECT" || station.status === "WRONG"
    )
    .map((station) => Number(station.stationNo))
    .filter((stationNo) => stationNo >= 1 && stationNo <= 6);
  if (!reachedStationNos.length) {
    return 0;
  }
  const stationNo = Math.max(...reachedStationNos);
  return ((stationNo - 0.5) / 6) * 100;
}

export function canEnterScienceTrainLotteryAfterRound(
  round: ScienceTrainDailyRound | null,
  roundConfirmed: boolean
): boolean {
  if (!roundConfirmed || !round || round.status !== "COMPLETED") {
    return false;
  }
  return hasScienceTrainQuizTicketEligibility(round.correctCount);
}

export function mapScienceTrainQuestionOptions(
  question: ScienceTrainDailyQuestion | null
): ScienceTrainQuestionOption[] {
  const choices = question && question.choices;
  if (!choices || typeof choices !== "object" || Array.isArray(choices)) {
    return [];
  }
  return Object.keys(choices).reduce<ScienceTrainQuestionOption[]>(
    (options, key) => {
      const value = choices[key];
      if (isScienceTrainPlaceholderChoice(value)) {
        return options;
      }
      options.push({ key: String(key), text: String(value) });
      return options;
    },
    []
  );
}

export function parseScienceTrainAnswerKeys(
  answer?: string | null
): string[] {
  if (typeof answer !== "string") {
    return [];
  }
  return answer
    .split(",")
    .map((key) => key.trim())
    .filter((key, index, keys) => !!key && keys.indexOf(key) === index);
}

export function toggleScienceTrainAnswerKey(
  selectedKeys: string[],
  key: string
): string[] {
  const normalizedKey = String(key || "");
  if (!normalizedKey) {
    return selectedKeys.slice();
  }
  return [normalizedKey];
}

export function createScienceTrainRequestId(
  random: () => number = Math.random
): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (token) => {
    const value = Math.floor(random() * 16);
    const nibble = token === "x" ? value : (value & 0x3) | 0x8;
    return nibble.toString(16);
  });
}

export function buildScienceTrainAnswerRequest(
  round: ScienceTrainDailyRound | null,
  selectedKeys: string[],
  requestId: string
): ScienceTrainAnswerBuildResult {
  const openStation = getScienceTrainOpenStation(round);
  const question = openStation && openStation.question;
  if (!round || !openStation || !question) {
    return invalidAnswer("当前没有可提交的 OPEN 题目");
  }
  if (!selectedKeys.length) {
    return invalidAnswer("请先选择答案");
  }
  if (!requestId) {
    return invalidAnswer("requestId 不能为空");
  }

  const optionKeys = mapScienceTrainQuestionOptions(question).map(
    (option) => option.key
  );
  if (selectedKeys.some((key) => optionKeys.indexOf(key) < 0)) {
    return invalidAnswer("所选答案不属于服务器返回的选项");
  }
  if (selectedKeys.length !== 1) {
    return invalidAnswer("单选题只能提交一个选项");
  }

  const sortedKeys = optionKeys.filter((key) => selectedKeys.indexOf(key) >= 0);
  return {
    valid: true,
    reason: "",
    itemId: openStation.itemId,
    request: {
      roundId: round.roundId,
      roundItemId: openStation.itemId,
      questionId: question.id,
      answer: sortedKeys.join(","),
      requestId,
    },
  };
}

export function shouldRefreshScienceTrainRoundAfterAnswerError(
  code: string
): boolean {
  return (
    code === "DAILY_ROUND_ITEM_NOT_OPEN" ||
    code === "DAILY_ROUND_ANSWER_BINDING_DRIFT" ||
    code === "DAILY_ROUND_EXPIRED"
  );
}

export function isScienceTrainRoundBusyError(code: string): boolean {
  return (
    code === "DAILY_ROUND_START_BUSY" ||
    code === "DAILY_ROUND_CONFLICT_RETRY_EXHAUSTED"
  );
}

export function resolveScienceTrainRoundError(
  code: string,
  message: string
): ScienceTrainRoundFailureView {
  if (code === "DAILY_ROUND_NOT_ENTERED") {
    return {
      stage: "unavailable",
      title: "活动尚未到答题时间",
      message: "当前时段不能开始今日答题，请以活动开放时间为准。",
      canRetry: false,
    };
  }
  if (
    code === "DAILY_QUESTION_POOL_EXHAUSTED" ||
    code === "DAILY_ROUND_RULE_UNAVAILABLE"
  ) {
    return {
      stage: "unavailable",
      title: "今日答题暂不可用",
      message: "题目或答题规则尚未准备完成，请稍后再试。",
      canRetry: false,
    };
  }
  if (code === "DAILY_ROUND_SUB_USER_FORBIDDEN") {
    return {
      stage: "unavailable",
      title: "当前用户无法答题",
      message: "请返回活动规则页，选择当前账号下已报名的用户。",
      canRetry: false,
    };
  }
  if (code === "UNAUTHORIZED") {
    return {
      stage: "unavailable",
      title: "登录状态已失效",
      message: "请重新登录后再进入答题页面。",
      canRetry: false,
    };
  }
  if (isScienceTrainRoundBusyError(code)) {
    return {
      stage: "error",
      title: "答题服务正忙",
      message: "已自动重试一次，仍未能恢复今日轮次，请稍后再进入。",
      canRetry: false,
    };
  }
  return {
    stage: "error",
    title: "今日答题加载失败",
    message: message || "请稍后重新加载。",
    canRetry: true,
  };
}

export function getScienceTrainCompletionTitle(stopReason?: string): string {
  if (stopReason === "ALL_CORRECT") {
    return "六站闯关完成";
  }
  return "今日答题完成";
}

function isValidOpenStation(station: ScienceTrainDailyStation): boolean {
  const question = station && station.question;
  return !!(
    station &&
    typeof station.itemId === "string" &&
    station.itemId &&
    station.stationName &&
    question &&
    typeof question.id === "string" &&
    question.id &&
    typeof question.stem === "string" &&
    question.stem
  );
}

function isScienceTrainPlaceholderChoice(value: any): boolean {
  if (value === undefined || value === null) {
    return true;
  }
  const rawText = String(value).trim();
  if (!rawText) {
    return true;
  }
  const visibleText = rawText
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;|&#160;|&#xA0;/gi, " ")
    .trim();
  return /^(?:[A-F]\s*[.．、:：]\s*)?%%$/i.test(visibleText);
}

function isValidStation(station: ScienceTrainDailyStation): boolean {
  return !!(
    station &&
    typeof station.itemId === "string" &&
    station.itemId &&
    station.stationNo !== undefined &&
    station.stationNo !== null &&
    typeof station.stationName === "string" &&
    station.stationName &&
    STATION_STATUSES.indexOf(station.status) >= 0
  );
}

function invalid(reason: string): ScienceTrainRoundValidationResult {
  return { valid: false, reason };
}

function invalidAnswer(reason: string): ScienceTrainAnswerBuildResult {
  return { valid: false, reason, itemId: "" };
}
