export interface ScienceTrainRankRecord {
  userId: string;
  position: string;
  score: string;
  realName?: string;
  teamName?: string;
  scoreReachedAt?: string;
  userAvatar?: string;
  orgName?: string;
  provinceCode?: string;
  cityCode?: string;
  districtCode?: string;
  onlinePoints?: string;
  offlinePoints?: string;
  totalPoints?: string;
  maxConsecutiveDays?: string;
}

export interface ScienceTrainPublicParticipantRecord {
  userId: string;
  realName?: string;
}

export interface ScienceTrainPublicParticipantResponse {
  pageNo: string;
  pageSize: string;
  total: string;
  pages: string;
  records: ScienceTrainPublicParticipantRecord[];
}

export default interface ScienceTrainRankResponse {
  pageNo: string;
  pageSize: string;
  total: string;
  pages: string;
  records: ScienceTrainRankRecord[];
}

export interface ScienceTrainPersonalRankResponse {
  userId: string;
  position?: string | number;
  rank?: string | number;
  score?: string;
  onlinePoints?: string;
  offlinePoints?: string;
  totalPoints?: string;
  maxConsecutiveDays?: string;
}
