const Team = {
  prefix: '/api/',
  version: 'v1',
  // 项目详情
  userInfo: {
    method: 'get',
    requestUrl: '/compete/pb/user/public/{userId}/{competitionCode}'
  },
  teamInfo: {
    method: 'get',
    requestUrl: '/team/',
    suffix: '/public'
  },
  joinTeam: {
    method: 'post',
    requestUrl: '/team/join'
  }
}
export default Team
