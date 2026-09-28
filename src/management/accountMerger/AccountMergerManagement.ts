import WebStorage from '@/common/utils/WebStorage'
import LangEnum from '@/definition/lang/LangEnum'
import TokenConstant from '@/definition/user/TokenConstant'

class AccountMergerManagement {
  private static _instance: AccountMergerManagement

  static getInstance (): AccountMergerManagement {
    if (!AccountMergerManagement._instance) {
      AccountMergerManagement._instance = new AccountMergerManagement()
    }
    return AccountMergerManagement._instance
  }

  saveSubUserId (userId: string): void {
    if(userId !== undefined) uni.setStorageSync(LangEnum.ACCOUNT_MERGER_USER_ID_KEY,userId)
  }

  getSubUserId (): string{
    return uni.getStorageSync(LangEnum.ACCOUNT_MERGER_USER_ID_KEY)
  }

  removeSubUserId (): void {
    return uni.removeStorageSync(LangEnum.ACCOUNT_MERGER_USER_ID_KEY)
  }
}

export default AccountMergerManagement
