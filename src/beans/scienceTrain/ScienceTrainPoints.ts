export type ScienceTrainPointValue = string | number;

export interface ScienceTrainPointsSummary {
  onlinePoints?: ScienceTrainPointValue;
  offlinePoints?: ScienceTrainPointValue;
  totalPoints?: ScienceTrainPointValue;
  onlineCap?: ScienceTrainPointValue;
  offlineCap?: ScienceTrainPointValue;
  totalCap?: ScienceTrainPointValue;
  completedDayCount?: ScienceTrainPointValue;
  currentConsecutiveDays?: ScienceTrainPointValue;
  maxConsecutiveDays?: ScienceTrainPointValue;
  highestStreakBonus?: ScienceTrainPointValue;
  participantStatus?: string;
  answerBlocked?: boolean | ScienceTrainPointValue;
  scope?: string;
  complete?: boolean | ScienceTrainPointValue;
}

export interface ScienceTrainQuizProgress {
  completedDayCount?: ScienceTrainPointValue;
  currentConsecutiveDays?: ScienceTrainPointValue;
  maxConsecutiveDays?: ScienceTrainPointValue;
  highestStreakBonus?: ScienceTrainPointValue;
  lastCompletedDate?: string;
  onlinePoints?: ScienceTrainPointValue;
  onlineCap?: ScienceTrainPointValue;
  scope?: string;
  complete?: boolean | ScienceTrainPointValue;
}
