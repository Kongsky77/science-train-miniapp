import { JsonObject,JsonProperty } from 'json2typescript'
import TeamUserTypeEnum from '@/definition/team/TeamUserTypeEnum'
import RankInfo from '@/components/rank/RankInfo.vue'
import SimpleRankResult from '@/beans/rank/SimpleRankResult'
import { StringToNumConverter } from '@/common/utils/StringToNumConverter'

@JsonObject
export default class TeamResultResponse {
  // 介绍
  @JsonProperty('description',String,true)
  description = ''

  // 每页显示数量
  @JsonProperty('id',String,true)
  id = ''

  // LOGO
  @JsonProperty('logo',String,true)
  logo = ''

  // 战队名称
  @JsonProperty('name',String,true)
  name = ''

  @JsonProperty('activityId',String,true)
  activityId: string = ''

  @JsonProperty('leaderGrade',String,true)
  leaderGrade: string = ''

  @JsonProperty('leaderName',String,true)
  leaderName: string = ''

  @JsonProperty('orgName',String,true)
  orgName: string = ''

  @JsonProperty('score',String,true)
  score: string = ''

  @JsonProperty('tutor',String,true)
  tutor: string = ''

  @JsonProperty('userType',StringToNumConverter,true)
  userType: TeamUserTypeEnum = TeamUserTypeEnum.ORDINARY_MEMBER

  @JsonProperty('ranks', SimpleRankResult, true)
  ranks: SimpleRankResult = new SimpleRankResult()
}
