const ACTIVE_SUB_USER_ID_KEY = "scienceTrainActiveSubUserId";

export default class ScienceTrainParticipantManagement {
  static setActiveSubUserId(subUserId: string) {
    if (!subUserId) {
      ScienceTrainParticipantManagement.clearActiveSubUserId();
      return;
    }
    uni.setStorageSync(ACTIVE_SUB_USER_ID_KEY, String(subUserId));
  }

  static getActiveSubUserId(): string {
    const subUserId = uni.getStorageSync(ACTIVE_SUB_USER_ID_KEY);
    return subUserId ? String(subUserId) : "";
  }

  static clearActiveSubUserId() {
    uni.removeStorageSync(ACTIVE_SUB_USER_ID_KEY);
  }
}
