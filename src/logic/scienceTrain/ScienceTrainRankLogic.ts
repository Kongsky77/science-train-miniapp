import {
  ScienceTrainPersonalRankResponse,
  ScienceTrainPublicParticipantRecord,
  ScienceTrainRankRecord,
} from "@/beans/rank/ScienceTrainRankResponse";

export interface ScienceTrainParticipantNameMap {
  [userId: string]: string;
}

export interface ScienceTrainHomeRankDisplay {
  text: string;
  hasFormalRank: boolean;
}

export interface ScienceTrainLeaderboardErrorState {
  stage: "ready" | "pending" | "unavailable" | "error";
  message: string;
}

function hasRankValue(value: string | number | undefined | null): boolean {
  return value !== undefined && value !== null && String(value).trim() !== "";
}

export function getScienceTrainHomeRankDisplay(
  data: ScienceTrainPersonalRankResponse
): ScienceTrainHomeRankDisplay {
  const position = hasRankValue(data.position) ? data.position : data.rank;
  if (!hasRankValue(position)) {
    return {
      text: "排名更新中",
      hasFormalRank: false,
    };
  }

  return {
    text: `第${String(position)}名`,
    hasFormalRank: true,
  };
}

export function getScienceTrainHomeRankErrorDisplay(code: string): string {
  if (code === "ACTIVITY_POINTS_LEADERBOARD_NOT_READY") {
    return "排名更新中";
  }
  if (code === "RANK_NOT_ENABLED") {
    return "排行榜暂未开放";
  }
  if (code === "UNAUTHORIZED") {
    return "登录状态已失效";
  }
  return "排名加载失败";
}

export function buildScienceTrainParticipantNameMap(
  participants: ScienceTrainPublicParticipantRecord[]
): ScienceTrainParticipantNameMap {
  return (Array.isArray(participants) ? participants : []).reduce<
    ScienceTrainParticipantNameMap
  >((names, participant) => {
    const userId = String((participant && participant.userId) || "");
    const realName = String(
      (participant && participant.realName) || ""
    ).trim();
    if (userId && realName) {
      names[userId] = realName;
    }
    return names;
  }, {});
}

export function getScienceTrainRankParticipantName(
  record: ScienceTrainRankRecord,
  participantNames: ScienceTrainParticipantNameMap
): string {
  const userId = String((record && record.userId) || "");
  const mappedName = String(
    (participantNames && participantNames[userId]) || ""
  ).trim();
  const directName = String((record && record.realName) || "").trim();
  const leaderboardName = String((record && record.teamName) || "").trim();
  return mappedName || directName || leaderboardName || "未命名用户";
}

export function getScienceTrainLeaderboardErrorState(
  code: string,
  message: string,
  hasCachedRecords: boolean
): ScienceTrainLeaderboardErrorState {
  if (code === "ACTIVITY_POINTS_LEADERBOARD_NOT_READY") {
    return {
      stage: hasCachedRecords ? "ready" : "pending",
      message: "排行榜正在更新，请稍后刷新",
    };
  }
  if (code === "RANK_NOT_ENABLED") {
    return {
      stage: "unavailable",
      message: "",
    };
  }
  return {
    stage: hasCachedRecords ? "ready" : "error",
    message: message || "排行榜加载失败，请稍后重试",
  };
}
