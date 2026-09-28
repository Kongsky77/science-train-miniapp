const UserApi = {
  prefix: '/api/',
  version: 'v1',
  userInfo: {
    method: 'get',
    requestUrl: '/user/base/public/{id}'
  },
  openId: {
    method: 'get',
    requestUrl: `/other/wx/openid/public`
  },
  competitionInfo: {
    method: 'get',
    requestUrl: '/compete/pb/user/public/{userId}/{competitionCode}'
  },
  queryAccountMergerType: {
    method: 'get',
    requestUrl: '/user/sub/merge/type'
  },
  accountMerger: {
    method: 'post',
    requestUrl: '/user/sub/merge/'
  }
}
export default UserApi
