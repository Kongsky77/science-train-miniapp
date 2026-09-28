import ProductionPublishedListDTO from '@/beans/activity/productionPublished/dto/ProductionPublishedListDTO'

const ActivityApi = {
  prefix: '/api/',
  version: 'v1',
  // 项目详情
  getActivityList(activityId?: string, periodId?: string, subUserId?: string) {
    return {
      method: 'get',
      requestUrl: `/activity/production/${ activityId }/${ periodId }/${ subUserId }/list`
    }
  },
  saveActivityWorks(activityId?: string, periodId?: string, subUserId?: string) {
    return {
      method: 'post',
      requestUrl: `/activity/production/${ activityId }/${ subUserId }/${ periodId }/submit`
    }
  },
  getPersonalSubmitConfig(activityId?: string) {
    return {
      method: 'get',
      requestUrl: `/activity/production/${ activityId }/config`
    }
  },
  surplusCardTotalPrice: {
    requestUrl: '/activity/',
    suffix: '/card-price/no',
    method: 'get'
  },
  productionPublished: {
    requestUrl: '/activity/production/',
    suffix: '/production/publised/public',
    method: 'get'
  },
  cardPrice: {
    requestUrl: '/activity/',
    suffix: '/card-price/public',
    method: 'get'
  },
  other: {
    url: `/other`,
    storage: {
      save: {
        requestUrl: '/storage',
        method: 'post'
      },
      get: {
        requestUrl: '/storage/',
        method: 'get'
      }
    }
  },
  organizationList: {
    requestUrl: '/organization/district/page',
    method: 'get'
  },
  columnList: {
    requestUrl: '/column/list/public',
    method: 'get'
  },
  searchList: {
    requestUrl: '/activity/search/public',
    method: 'get'
  },
  priceDetail: {
    requestUrl: '/activity/',
    suffix: '/price/public',
    method: 'get'
  },
  cardCount: {
    requestUrl: '/activity/',
    suffix: '/card/count',
    method: 'get'
  },
  tagList: {
    requestUrl: '/tag/activity/public',
    method: 'get'
  },
  popupInfo: {
    requestUrl: '/popup/',
    method: 'get',
    suffix: '/public'
  },
  adInfo: {
    requestUrl: '/ad/public',
    method: 'get'
  },
  appStatus: {
    requestUrl: '/wx/app/status/public',
    method: 'get'
  },
  getUserEntryInfo: {
    requestUrl: '/activity/{activityId}/{childId}/entry-field',
    method: 'get'
  },
  updateUserEntryInfo: {
    requestUrl: '/activity/{activityId}/{childId}/entry-field',
    method: 'put'
  }
}


export default ActivityApi
