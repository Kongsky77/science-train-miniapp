export type ScienceTrainDailyRoundStatus = "IN_PROGRESS" | "COMPLETED";

export type ScienceTrainDailyStationStatus =
  | "WAITING"
  | "OPEN"
  | "CORRECT"
  | "WRONG"
  | "SKIPPED";

export interface ScienceTrainDailyQuestion {
  id: string;
  type?: string;
  stem: string;
  choices?: { [key: string]: string };
  clozeList?: any[];
  answerLimit?: string | number;
  showAnswerResult?: boolean | string | number;
  showAnalysis?: boolean | string | number;
}

export interface ScienceTrainDailyStation {
  itemId: string;
  stationNo: string | number;
  stationName: string;
  status: ScienceTrainDailyStationStatus;
  question?: ScienceTrainDailyQuestion;
}

export interface ScienceTrainDailyAnswerRequest {
  roundId: string;
  roundItemId: string;
  questionId: string;
  answer: string;
  requestId: string;
}

export interface ScienceTrainDailyAnswerFeedback {
  correct?: boolean;
  correctAnswer?: string | null;
  analysis?: string | null;
  answeredCount?: string | number;
  correctCount?: string | number;
  nextStationNo?: string | number;
  roundStatus?: ScienceTrainDailyRoundStatus;
}

export interface ScienceTrainDailyAnswerResponse {
  correct: boolean;
  corrected?: boolean | string | number;
  questionScoreDelta?: string | number;
  duplicate?: boolean;
  answerFeedback?: ScienceTrainDailyAnswerFeedback | null;
  round: ScienceTrainDailyRound;
}

export default interface ScienceTrainDailyRound {
  roundId: string;
  bizDate: string;
  status: ScienceTrainDailyRoundStatus;
  currentStationNo?: string | number;
  answeredCount?: string | number;
  correctCount?: string | number;
  completedAt?: string;
  stopReason?: string;
  stations: ScienceTrainDailyStation[];
}
