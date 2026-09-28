import StorageKeyEnum from '@/definition/lang/StorageKeyEnum'
import HistoryRecordVO from '@/beans/activity/res/HistoryRecordVO'

class SearchHistoryManagement {
  private static _instance: SearchHistoryManagement

  static getInstance (): SearchHistoryManagement {
    if (!SearchHistoryManagement._instance) {
      SearchHistoryManagement._instance = new SearchHistoryManagement()
    }
    return SearchHistoryManagement._instance
  }

  saveSearchHistory (historyRecords: HistoryRecordVO[]): void {
    uni.setStorageSync(StorageKeyEnum.SEARCH_HISTORY, historyRecords)
  }

  getSearchHistory (): HistoryRecordVO[] {
    try {
      return uni.getStorageSync(StorageKeyEnum.SEARCH_HISTORY)
    }catch (e) {
      return []
    }
  }

  getHistoryById (id: string): HistoryRecordVO {
    const searchHistories: HistoryRecordVO[] = uni.getStorageSync(StorageKeyEnum.SEARCH_HISTORY)
    return searchHistories.find(item => {
      return item.id === id
    })
  }

  removeSearchHistory (): void {
    uni.removeStorageSync(StorageKeyEnum.SEARCH_HISTORY)
  }
}

export default SearchHistoryManagement
