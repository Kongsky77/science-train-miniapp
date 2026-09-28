import { StringToNumConverter } from '@/common/json_ts_converter/StringToNumConverter'
import CertTypeEnum from '@/enums/activity/CertTypeEnum'
import { JsonObject, JsonProperty } from 'json2typescript'
import CertPositionResponse from './CertPositionResponse'

@JsonObject
export default class CertResponse {
  // 活动id
  @JsonProperty('activityId', StringToNumConverter, true)
  activityId = 0

  // 活动名字
  @JsonProperty('activityName', StringToNumConverter, true)
  activityName = 0

  // 颁发机构名称
  @JsonProperty('awardOrgName', String, true)
  awardOrgName = ''

  // 颁发时间
  @JsonProperty('awardTime', String, true)
  awardTime = ''

  // 证书类型
  @JsonProperty('certType', StringToNumConverter, true)
  certType = CertTypeEnum.OTHER

  // 证书编号
  @JsonProperty('id', StringToNumConverter, true)
  id = 0

  @JsonProperty('certSrc', String, true)
  certSrc: string = ''

  // 证书编号
  @JsonProperty('certConfig', Object, true)
  certConfig: CertPositionResponse = new CertPositionResponse()

  // // 编号在证书上打印的位置-left
  // @JsonProperty('positionLeftNo', String, true)
  // positionLeftNo = '';

  // // 姓名在证书上打印的位置-left
  // @JsonProperty('positionLeftRealName', String, true)
  // positionLeftRealName = '';

  // // 编号在证书上打印的位置-top
  // @JsonProperty('positionTopNo', String, true)
  // positionTopNo = '';

  // // 姓名在证书上打印的位置-top
  // @JsonProperty('positionTopRealName', String, true)
  // positionTopRealName = '';

  // 真实姓名
  @JsonProperty('realName', String, true)
  realName = ''

  // 独有的证书编号（人工输入）
  @JsonProperty('uniqueNumber', String, true)
  uniqueNumber = ''

  // 所属用户ID
  @JsonProperty('userId', StringToNumConverter, true)
  userId = 0

  @JsonProperty('orgName', String, true)
  orgName = ''

  @JsonProperty('tutorName', String, true)
  tutorName = ''
}
