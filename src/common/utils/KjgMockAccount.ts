import TokenManagement from "@/management/token/TokenManagement";
import UserInfoManagement from "@/management/user/UserInfoManagement";
import {
  hasScienceTrainQuizTicketEligibility,
} from "@/logic/scienceTrain/ScienceTrainDailyRoundLogic";

export interface KjgMockSession {
  phone: string;
  loggedInAt: number;
}

export interface KjgParticipant {
  id: string;
  ownerPhone: string;
  avatar?: string;
  gender?: number;
  name: string;
  school: string;
  grade: string;
  contactsMobile?: string;
  recipientAddress?: string;
  createdAt: number;
  isMainAccount: boolean;
}

export interface KjgParticipantFormData {
  avatar?: string;
  gender?: number;
  name: string;
  school: string;
  grade: string;
  contactsMobile?: string;
  recipientAddress?: string;
}

export interface KjgRegistration {
  participantId: string;
  registeredAt: number;
}

export interface KjgQuizResult {
  completedAt: number;
  correctCount: number;
  totalCount: number;
  points: number;
}

export interface KjgCheckInFormData {
  participantId: string;
  venueId: string;
  venueName: string;
  photoPath: string;
  latitude: number;
  longitude: number;
  distanceMeters: number;
  points: number;
}

export interface KjgCheckInRecord extends KjgCheckInFormData {
  id: string;
  checkedInAt: number;
}

export type KjgLotteryType = "pass" | "redPacket";

export type KjgLotteryChanceSource =
  | "quiz"
  | "quizCompletion"
  | "perfectQuiz"
  | "checkIn";

export interface KjgLotteryChance {
  id: string;
  participantId: string;
  lotteryType?: KjgLotteryType;
  sourceType: KjgLotteryChanceSource;
  sourceId: string;
  grantedAt: number;
  consumedAt?: number;
}

export interface KjgLotteryDrawRecord {
  id: string;
  participantId: string;
  chanceId: string;
  lotteryType?: KjgLotteryType;
  sourceType?: KjgLotteryChanceSource;
  prizeId: string;
  prizeLevel: string;
  prizeName: string;
  drawnAt: number;
}

export interface KjgLotterySummary {
  availableChances: number;
  totalGranted: number;
  drawRecords: KjgLotteryDrawRecord[];
}

interface KjgMockPrize {
  id: string;
  level: string;
  name: string;
}

const PARTICIPANTS_KEY = "kjgMockParticipants";
const REGISTRATIONS_KEY = "kjgMockRegistrations";
const ACTIVE_PARTICIPANT_KEY = "kjgMockActiveParticipant";
const QUIZ_RESULTS_KEY = "kjgMockQuizResults";
const CHECK_IN_RECORDS_KEY = "kjgMockCheckInRecords";
const LOTTERY_CHANCES_KEY = "kjgMockLotteryChances";
const LOTTERY_DRAW_RECORDS_KEY = "kjgMockLotteryDrawRecords";

const MOCK_PASS_PRIZE_POOL: KjgMockPrize[] = [
  { id: "participation-1", level: "参与奖", name: "纪念徽章（待配置）" },
  { id: "participation-2", level: "参与奖", name: "纪念徽章（待配置）" },
  { id: "participation-3", level: "参与奖", name: "纪念徽章（待配置）" },
  { id: "excellence-1", level: "优秀奖", name: "科普文创（待配置）" },
  { id: "excellence-2", level: "优秀奖", name: "科普文创（待配置）" },
  { id: "third-1", level: "三等奖", name: "神秘礼品（待配置）" },
];

const MOCK_RED_PACKET_PRIZE_POOL: KjgMockPrize[] = [
  { id: "red-packet-088", level: "红包奖励", name: "微信红包 0.88 元（Mock）" },
  { id: "red-packet-188", level: "红包奖励", name: "微信红包 1.88 元（Mock）" },
  { id: "red-packet-288", level: "红包奖励", name: "微信红包 2.88 元（Mock）" },
];

export default class KjgMockAccount {
  static getSession(): KjgMockSession | null {
    const token = TokenManagement.getInstance().getToken();
    const user = UserInfoManagement.getInstance().getUserInfo();
    if (!token || !user || !user.userId) {
      return null;
    }
    return {
      phone: user.phoneNumber,
      loggedInAt: 0,
    };
  }

  static isLoggedIn(): boolean {
    return KjgMockAccount.getSession() !== null;
  }

  static getParticipants(): KjgParticipant[] {
    const session = KjgMockAccount.getSession();
    const user = UserInfoManagement.getInstance().getUserInfo();
    if (!session || !user || !user.userId) {
      return [];
    }
    const participants = uni.getStorageSync(PARTICIPANTS_KEY);
    const additionalParticipants: KjgParticipant[] = Array.isArray(participants)
      ? participants.filter(
          (item) =>
            item.ownerPhone === session.phone && item.id !== user.userId
        )
      : [];
    const mainParticipant: KjgParticipant = {
      id: user.userId,
      ownerPhone: session.phone,
      avatar: user.avatar || "",
      gender: Number(user.gender) || 0,
      name:
        user.realName ||
        user.nickName ||
        (session.phone ? `手机号 ${session.phone.slice(-4)}` : "主账号用户"),
      school: user.orgName || "",
      grade: user.gradeName || "",
      contactsMobile: user.contactsMobile || "",
      recipientAddress: user.recipientAddress || "",
      createdAt: 0,
      isMainAccount: true,
    };
    return [mainParticipant, ...additionalParticipants];
  }

  static getParticipant(id: string): KjgParticipant | null {
    return KjgMockAccount.getParticipants().find((item) => item.id === id) || null;
  }

  static addParticipant(data: KjgParticipantFormData): KjgParticipant {
    const participants = uni.getStorageSync(PARTICIPANTS_KEY);
    const allParticipants: KjgParticipant[] = Array.isArray(participants)
      ? participants
      : [];
    const session = KjgMockAccount.getSession();
    const participant: KjgParticipant = {
      ...data,
      id: `kjg-participant-${new Date().getTime()}`,
      ownerPhone: session ? session.phone : "",
      createdAt: new Date().getTime(),
      isMainAccount: false,
    };
    allParticipants.push(participant);
    uni.setStorageSync(PARTICIPANTS_KEY, allParticipants);
    return participant;
  }

  static updateParticipant(
    participantId: string,
    data: Partial<KjgParticipantFormData>
  ): KjgParticipant | null {
    const user = UserInfoManagement.getInstance().getUserInfo();
    if (user && participantId === user.userId) {
      if (data.avatar !== undefined) user.avatar = data.avatar;
      if (data.gender !== undefined) user.gender = String(data.gender);
      if (data.name !== undefined) user.realName = data.name;
      if (data.school !== undefined) user.orgName = data.school;
      if (data.grade !== undefined) user.gradeName = data.grade;
      if (data.contactsMobile !== undefined) {
        user.contactsMobile = data.contactsMobile;
      }
      if (data.recipientAddress !== undefined) {
        user.recipientAddress = data.recipientAddress;
      }
      UserInfoManagement.getInstance().saveUserInfo(user);
      return KjgMockAccount.getParticipant(participantId);
    }

    const storedParticipants = uni.getStorageSync(PARTICIPANTS_KEY);
    const participants: KjgParticipant[] = Array.isArray(storedParticipants)
      ? storedParticipants
      : [];
    const participantIndex = participants.findIndex(
      (participant) => participant.id === participantId
    );
    if (participantIndex < 0) {
      return null;
    }
    participants.splice(participantIndex, 1, {
      ...participants[participantIndex],
      ...data,
    });
    uni.setStorageSync(PARTICIPANTS_KEY, participants);
    return KjgMockAccount.getParticipant(participantId);
  }

  static getRegistrations(): KjgRegistration[] {
    const registrations = uni.getStorageSync(REGISTRATIONS_KEY);
    return Array.isArray(registrations) ? registrations : [];
  }

  static isRegistered(participantId: string): boolean {
    return KjgMockAccount.getRegistrations().some(
      (item) => item.participantId === participantId
    );
  }

  static getRegistration(participantId: string): KjgRegistration | null {
    return (
      KjgMockAccount.getRegistrations().find(
        (item) => item.participantId === participantId
      ) || null
    );
  }

  static hasRegisteredParticipant(): boolean {
    return KjgMockAccount.getParticipants().some((participant) =>
      KjgMockAccount.isRegistered(participant.id)
    );
  }

  static register(participantId: string): KjgRegistration {
    const registrations = KjgMockAccount.getRegistrations();
    const existing = registrations.find(
      (item) => item.participantId === participantId
    );
    if (existing) {
      KjgMockAccount.setActiveParticipant(participantId);
      return existing;
    }
    const registration: KjgRegistration = {
      participantId,
      registeredAt: new Date().getTime(),
    };
    registrations.push(registration);
    uni.setStorageSync(REGISTRATIONS_KEY, registrations);
    KjgMockAccount.setActiveParticipant(participantId);
    return registration;
  }

  static setActiveParticipant(participantId: string) {
    uni.setStorageSync(ACTIVE_PARTICIPANT_KEY, participantId);
  }

  static getActiveParticipant(): KjgParticipant | null {
    const participantId = uni.getStorageSync(ACTIVE_PARTICIPANT_KEY);
    return participantId ? KjgMockAccount.getParticipant(participantId) : null;
  }

  static hasActiveRegisteredParticipant(): boolean {
    const participant = KjgMockAccount.getActiveParticipant();
    return !!participant && KjgMockAccount.isRegistered(participant.id);
  }

  static saveQuizResult(result: KjgQuizResult) {
    const participant = KjgMockAccount.getActiveParticipant();
    if (!participant) {
      return;
    }
    KjgMockAccount.saveQuizResultForParticipant(participant.id, result);
  }

  static saveQuizResultForParticipant(
    participantId: string,
    result: KjgQuizResult
  ) {
    if (!participantId) {
      return;
    }
    const storedResults = uni.getStorageSync(QUIZ_RESULTS_KEY);
    const results = storedResults && typeof storedResults === "object"
      ? storedResults
      : {};
    results[participantId] = result;
    uni.setStorageSync(QUIZ_RESULTS_KEY, results);
  }

  static getQuizResult(): KjgQuizResult | null {
    const participant = KjgMockAccount.getActiveParticipant();
    if (!participant) {
      return null;
    }
    return KjgMockAccount.getQuizResultForParticipant(participant.id);
  }

  static getQuizResultForParticipant(participantId: string): KjgQuizResult | null {
    const results = uni.getStorageSync(QUIZ_RESULTS_KEY);
    return results && results[participantId] ? results[participantId] : null;
  }

  static getLotteryChances(): KjgLotteryChance[] {
    const chances = uni.getStorageSync(LOTTERY_CHANCES_KEY);
    return Array.isArray(chances) ? chances : [];
  }

  static getLotteryDrawRecords(): KjgLotteryDrawRecord[] {
    const records = uni.getStorageSync(LOTTERY_DRAW_RECORDS_KEY);
    return Array.isArray(records) ? records : [];
  }

  static getLotterySummaryForParticipant(
    participantId: string,
    lotteryType?: KjgLotteryType
  ): KjgLotterySummary {
    KjgMockAccount.syncLotteryEligibilityForParticipant(participantId);
    const chances = KjgMockAccount.getLotteryChances().filter(
      (chance) =>
        chance.participantId === participantId &&
        (!lotteryType || KjgMockAccount.getChanceLotteryType(chance) === lotteryType)
    );
    const drawRecords = KjgMockAccount.getLotteryDrawRecords()
      .filter(
        (record) =>
          record.participantId === participantId &&
          (!lotteryType ||
            KjgMockAccount.getDrawRecordLotteryType(record) === lotteryType)
      )
      .sort((left, right) => right.drawnAt - left.drawnAt);
    return {
      availableChances: chances.filter((chance) => !chance.consumedAt).length,
      totalGranted: chances.length,
      drawRecords,
    };
  }

  static getLotterySummary(): KjgLotterySummary {
    const participant = KjgMockAccount.getActiveParticipant();
    if (!participant) {
      return {
        availableChances: 0,
        totalGranted: 0,
        drawRecords: [],
      };
    }
    return KjgMockAccount.getLotterySummaryForParticipant(participant.id);
  }

  static getLotterySummaryByType(
    lotteryType: KjgLotteryType
  ): KjgLotterySummary {
    const participant = KjgMockAccount.getActiveParticipant();
    if (!participant) {
      return {
        availableChances: 0,
        totalGranted: 0,
        drawRecords: [],
      };
    }
    return KjgMockAccount.getLotterySummaryForParticipant(
      participant.id,
      lotteryType
    );
  }

  static getChanceLotteryType(chance: KjgLotteryChance): KjgLotteryType {
    return chance.lotteryType || "pass";
  }

  static getDrawRecordLotteryType(
    record: KjgLotteryDrawRecord
  ): KjgLotteryType {
    return record.lotteryType || "pass";
  }

  static getLotterySourceText(
    sourceType?: KjgLotteryChanceSource
  ): string {
    if (sourceType === "perfectQuiz") {
      return "单轮六题全对";
    }
    if (sourceType === "checkIn") {
      return "场馆打卡";
    }
    return "六站答题完成";
  }

  private static grantLotteryChance(data: {
    participantId: string;
    lotteryType: KjgLotteryType;
    sourceType: KjgLotteryChanceSource;
    sourceId: string;
  }): boolean {
    const chances = KjgMockAccount.getLotteryChances();
    if (chances.some((chance) => chance.sourceId === data.sourceId)) {
      return false;
    }
    chances.push({
      id: `kjg-lottery-chance-${new Date().getTime()}-${chances.length}`,
      participantId: data.participantId,
      lotteryType: data.lotteryType,
      sourceType: data.sourceType,
      sourceId: data.sourceId,
      grantedAt: new Date().getTime(),
    });
    uni.setStorageSync(LOTTERY_CHANCES_KEY, chances);
    return true;
  }

  private static syncLotteryEligibilityForParticipant(participantId: string) {
    if (!participantId) {
      return;
    }
    const quizResult = KjgMockAccount.getQuizResultForParticipant(participantId);
    if (
      quizResult &&
      quizResult.totalCount >= 6 &&
      hasScienceTrainQuizTicketEligibility(quizResult.correctCount)
    ) {
      KjgMockAccount.grantLotteryChance({
        participantId,
        lotteryType: "pass",
        sourceType: "quizCompletion",
        sourceId: `${participantId}:quiz-completion`,
      });
      if (quizResult.correctCount === quizResult.totalCount) {
        KjgMockAccount.grantLotteryChance({
          participantId,
          lotteryType: "redPacket",
          sourceType: "perfectQuiz",
          sourceId: `${participantId}:perfect-quiz`,
        });
      }
    }
    KjgMockAccount.getCheckInRecordsForParticipant(participantId).forEach(
      (record) => {
        KjgMockAccount.grantLotteryChance({
          participantId,
          lotteryType: "pass",
          sourceType: "checkIn",
          sourceId: `${participantId}:check-in:${record.venueId}`,
        });
      }
    );
  }

  static grantQuizLotteryChance(): boolean {
    const participant = KjgMockAccount.getActiveParticipant();
    if (!participant || !KjgMockAccount.isRegistered(participant.id)) {
      return false;
    }
    return KjgMockAccount.grantQuizLotteryChanceForParticipant(participant.id);
  }

  static grantQuizLotteryChanceForParticipant(participantId: string): boolean {
    const quizResult = KjgMockAccount.getQuizResultForParticipant(participantId);
    if (
      !quizResult ||
      quizResult.totalCount < 6 ||
      !hasScienceTrainQuizTicketEligibility(quizResult.correctCount)
    ) {
      return false;
    }
    const sourceId = `${participantId}:quiz-completion`;
    return KjgMockAccount.grantLotteryChance({
      participantId,
      lotteryType: "pass",
      sourceType: "quizCompletion",
      sourceId,
    });
  }

  static grantPerfectQuizLotteryChance(): boolean {
    const participant = KjgMockAccount.getActiveParticipant();
    if (!participant || !KjgMockAccount.isRegistered(participant.id)) {
      return false;
    }
    return KjgMockAccount.grantPerfectQuizLotteryChanceForParticipant(
      participant.id
    );
  }

  static grantPerfectQuizLotteryChanceForParticipant(
    participantId: string
  ): boolean {
    const quizResult = KjgMockAccount.getQuizResultForParticipant(participantId);
    if (
      !quizResult ||
      quizResult.totalCount < 6 ||
      quizResult.correctCount !== quizResult.totalCount
    ) {
      return false;
    }
    return KjgMockAccount.grantLotteryChance({
      participantId,
      lotteryType: "redPacket",
      sourceType: "perfectQuiz",
      sourceId: `${participantId}:perfect-quiz`,
    });
  }

  static grantCheckInLotteryChance(
    record: KjgCheckInRecord
  ): boolean {
    if (!record.participantId) {
      return false;
    }
    return KjgMockAccount.grantLotteryChance({
      participantId: record.participantId,
      lotteryType: "pass",
      sourceType: "checkIn",
      sourceId: `${record.participantId}:check-in:${record.venueId}`,
    });
  }

  static drawLottery(
    lotteryType: KjgLotteryType = "pass"
  ): KjgLotteryDrawRecord | null {
    const participant = KjgMockAccount.getActiveParticipant();
    if (!participant || !KjgMockAccount.isRegistered(participant.id)) {
      return null;
    }
    return KjgMockAccount.drawLotteryForParticipant(
      participant.id,
      lotteryType
    );
  }

  static drawLotteryForParticipant(
    participantId: string,
    lotteryType: KjgLotteryType = "pass"
  ): KjgLotteryDrawRecord | null {
    if (!participantId) {
      return null;
    }
    const chances = KjgMockAccount.getLotteryChances();
    const chance = chances.find(
      (item) =>
        item.participantId === participantId &&
        KjgMockAccount.getChanceLotteryType(item) === lotteryType &&
        !item.consumedAt
    );
    if (!chance) {
      return null;
    }

    const prizePool =
      lotteryType === "redPacket"
        ? MOCK_RED_PACKET_PRIZE_POOL
        : MOCK_PASS_PRIZE_POOL;
    const prize = prizePool[Math.floor(Math.random() * prizePool.length)];
    const drawnAt = new Date().getTime();
    const record: KjgLotteryDrawRecord = {
      id: `kjg-lottery-draw-${drawnAt}`,
      participantId,
      chanceId: chance.id,
      lotteryType,
      sourceType: chance.sourceType,
      prizeId: prize.id,
      prizeLevel: prize.level,
      prizeName: prize.name,
      drawnAt,
    };
    chance.consumedAt = drawnAt;
    const records = KjgMockAccount.getLotteryDrawRecords();
    records.push(record);
    uni.setStorageSync(LOTTERY_CHANCES_KEY, chances);
    uni.setStorageSync(LOTTERY_DRAW_RECORDS_KEY, records);
    return record;
  }

  static getCheckInRecords(): KjgCheckInRecord[] {
    const records = uni.getStorageSync(CHECK_IN_RECORDS_KEY);
    return Array.isArray(records) ? records : [];
  }

  static getCheckInRecordsForParticipant(
    participantId: string
  ): KjgCheckInRecord[] {
    return KjgMockAccount.getCheckInRecords().filter(
      (record) => record.participantId === participantId
    );
  }

  static getCheckInRecord(
    participantId: string,
    venueId: string
  ): KjgCheckInRecord | null {
    return (
      KjgMockAccount.getCheckInRecords().find(
        (record) =>
          record.participantId === participantId && record.venueId === venueId
      ) || null
    );
  }

  static saveCheckInRecord(data: KjgCheckInFormData): KjgCheckInRecord {
    const records = KjgMockAccount.getCheckInRecords();
    const existing = records.find(
      (record) =>
        record.participantId === data.participantId &&
        record.venueId === data.venueId
    );
    if (existing) {
      return existing;
    }
    const record: KjgCheckInRecord = {
      ...data,
      id: `kjg-check-in-${new Date().getTime()}`,
      checkedInAt: new Date().getTime(),
    };
    records.push(record);
    uni.setStorageSync(CHECK_IN_RECORDS_KEY, records);
    KjgMockAccount.grantCheckInLotteryChance(record);
    return record;
  }

  static getCheckInPointsForParticipant(participantId: string): number {
    return KjgMockAccount.getCheckInRecordsForParticipant(participantId).reduce(
      (total, record) => total + Number(record.points || 0),
      0
    );
  }

  static getTotalPointsForParticipant(participantId: string): number {
    const quizPoints =
      KjgMockAccount.getQuizResultForParticipant(participantId)?.points || 0;
    return (
      Number(quizPoints) +
      KjgMockAccount.getCheckInPointsForParticipant(participantId)
    );
  }
}
