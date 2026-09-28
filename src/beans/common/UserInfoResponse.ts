import { JsonObject, JsonProperty } from 'json2typescript'
import { StringToNumConverter } from '@/common/json_ts_converter/StringToNumConverter'
import { StringToBooleanConverter } from '@/common/json_ts_converter/StringToBooleanConverter'

@JsonObject
export default class UserInfoResponse {
  @JsonProperty('avatar', String, true)
  avatar = ''

  @JsonProperty('birthday', StringToNumConverter, true)
  birthday = 0

  @JsonProperty('nickName', String, true)
  nickName = ''

  @JsonProperty('phoneNumber', String, true)
  phoneNumber = ''

  @JsonProperty('contactsMobile', String, true)
  contactsMobile = ''

  @JsonProperty('recipientAddress', String, true)
  recipientAddress = ''

  @JsonProperty('parentUserId', String, true)
  parentUserId = ''

  @JsonProperty('realName', String, true)
  realName = ''

  @JsonProperty('userId', String, true)
  userId = ''

  @JsonProperty('orgName', String, true)
  orgName = ''

  @JsonProperty('grade', StringToNumConverter, true)
  grade = ''

  @JsonProperty('orgCode', String, true)
  orgCode = ''

  @JsonProperty('gender', String, true)

  gender = ''

  @JsonProperty('ident', StringToNumConverter, true)
  ident = ''

  @JsonProperty('amount', String, true)
  amount = 0

  @JsonProperty('freeze', StringToBooleanConverter, true)
  freeze = false

  @JsonProperty('gradeName', String, true)
  gradeName = ''

  @JsonProperty('cityCode', String, true)
  cityCode = ''

  @JsonProperty('provinceCode', String, true)
  provinceCode = ''

  @JsonProperty('districtCode', String, true)
  districtCode = ''

  @JsonProperty('provinceName', String, true)
  provinceName = ''

  @JsonProperty('cityName', String, true)
  cityName = ''

  @JsonProperty('districtName', String, true)
  districtName = ''

  @JsonProperty("idNo", String, true)
  idNo = "";
}
