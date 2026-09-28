import HttpService from '@/common/utils/HttpService'
import ApiResponse from '@/beans/ApiResponse'
import CreateTeamRequest from '@/beans/team/req/CreateTeamRequest'
import TeamResultResponse from '@/beans/team/res/TeamResultResponse'
import Team from '@/definition/service_api/Team'
import MyJsonConverter from '@/common/utils/MyJsonConverter'
import JoinTeamDTO from '@/beans/team/req/JoinTeamDTO'

const ACTIVITY_BASEAPI = process.env.VUE_APP_ACTIVITY_BASEAPI

class TeamService {
  createTeam (data: CreateTeamRequest) {
    const url = `${ ACTIVITY_BASEAPI }/api/v1/team`

    return HttpService.doRequest(url,'post',data).then((response: any) => {
      return ApiResponse.parseToObject(response)
    })
  }

  static async reviveTeamInfo (id: string,callback: (success: boolean,teamResult: TeamResultResponse) => void) {
    const url = `${ ACTIVITY_BASEAPI + Team.prefix + Team.version + Team.teamInfo.requestUrl + id + Team.teamInfo.suffix }`
    const {data: data} = await HttpService.doRequest(url,Team.teamInfo.method)
    const {data: result,success: success} = data
    const teamResult = MyJsonConverter.getInstance().deserializeObject(result,TeamResultResponse)
    callback(success,teamResult)
  }

  static async doJoinTeam (child: JoinTeamDTO,callback: (success: boolean,errCode: string) => void) {
    const url = `${ ACTIVITY_BASEAPI + Team.prefix + Team.version + Team.joinTeam.requestUrl }`
    const {data: data} = await HttpService.doRequest(url,Team.joinTeam.method,child)
    const {success: success,errorCode: errorCode} = data
    callback(success,errorCode)
  }
}

export default TeamService
