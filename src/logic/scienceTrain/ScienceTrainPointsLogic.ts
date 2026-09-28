import {
  ScienceTrainPointsSummary,
  ScienceTrainPointValue,
  ScienceTrainQuizProgress,
} from "@/beans/scienceTrain/ScienceTrainPoints";

export function formatScienceTrainPointValue(
  value: ScienceTrainPointValue | undefined,
  fallback = "--"
): string {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }
  return String(value);
}

export function parseScienceTrainCount(
  value: ScienceTrainPointValue | undefined
): number | null {
  if (value === undefined || value === null || value === "") {
    return null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

export function isScienceTrainTrueFlag(
  value: boolean | ScienceTrainPointValue | undefined
): boolean {
  return value === true || value === 1 || value === "1" || value === "true";
}

export function getScienceTrainQuizStatusText(
  summary?: ScienceTrainPointsSummary,
  progress?: ScienceTrainQuizProgress
): string {
  if (summary && isScienceTrainTrueFlag(summary.answerBlocked)) {
    return "答题受限";
  }

  const completedDayCount = parseScienceTrainCount(
    progress && progress.completedDayCount !== undefined
      ? progress.completedDayCount
      : summary && summary.completedDayCount
  );
  if (completedDayCount === null) {
    return "进度待同步";
  }
  return completedDayCount > 0
    ? `累计完成 ${completedDayCount} 天`
    : "尚未答题";
}

export function hasScienceTrainQuizCompletion(
  summary?: ScienceTrainPointsSummary,
  progress?: ScienceTrainQuizProgress
): boolean {
  const completedDayCount = parseScienceTrainCount(
    progress && progress.completedDayCount !== undefined
      ? progress.completedDayCount
      : summary && summary.completedDayCount
  );
  return completedDayCount !== null && completedDayCount > 0;
}
