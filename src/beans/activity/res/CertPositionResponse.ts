import { StringToNumConverter } from '@/common/json_ts_converter/StringToNumConverter'
import CertTypeEnum from '@/enums/activity/CertTypeEnum'
import { JsonObject,JsonProperty } from 'json2typescript'
// import { StringToNumConverter } from '@/common/json_ts_converter/StringToNumConverter'

@JsonObject
export default class CertPositionResponse {
  // 颁发机构名称
  @JsonProperty('awardOrgName',String,true)
  awardOrgName = ''

  // 证书图片
  @JsonProperty('img',String,true)
  img = ''

  // 证书类型
  @JsonProperty('type',StringToNumConverter,true)
  type = CertTypeEnum.OTHER

  // 编号在证书上打印的位置-left
  @JsonProperty('positionLeftNo',String,true)
  positionLeftNo = ''

  // 姓名在证书上打印的位置-left
  @JsonProperty('positionLeftRealName',String,true)
  positionLeftRealName = ''

  // 编号在证书上打印的位置-top
  @JsonProperty('positionTopNo',String,true)
  positionTopNo = ''

  // 姓名在证书上打印的位置-top
  @JsonProperty('positionTopRealName',String,true)
  positionTopRealName = ''

  // 证书描述
  @JsonProperty('summary',String,true)
  summary = ''

  // 颁奖日期在证书上打印的位置-top
  @JsonProperty('positionTopTime',String,true)
  positionTopTime = ''

  // 颁奖日期在证书上打印的位置-left
  @JsonProperty('positionLeftTime',String,true)
  positionLeftTime = ''

  @JsonProperty('positionTopOrg',String,true)
  positionTopOrg: string = ''

	@JsonProperty('positionLeftOrg', String, true)
	positionLeftOrg: string = ''

  @JsonProperty('positionTopTutor',String,true)
  positionTopTutor: string = ''

  @JsonProperty('positionLeftTutor', String, true)
  positionLeftTutor: string = ''
}
