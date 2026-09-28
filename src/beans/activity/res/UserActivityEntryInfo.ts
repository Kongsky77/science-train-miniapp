import FormResponse from '@/beans/common/FormResponse'
import { StringToNumConverter } from '@/common/json_ts_converter/StringToNumConverter'
import { JsonObject, JsonProperty } from 'json2typescript'

@JsonObject
class UserActivityEntryInfo {
  @JsonProperty('realName', String, true)
  realName: string = ''
  @JsonProperty('phoneNumber', String, true)
  phoneNumber: string = ''
  @JsonProperty('orgCode', StringToNumConverter, true)
  orgCode = -1
  @JsonProperty('orgName', String, true)
  orgName: string = ''
  @JsonProperty('grade', StringToNumConverter, true)
  grade: number = undefined
  @JsonProperty('fields', [FormResponse], true)
  fields: FormResponse[] = [];

  @JsonProperty('cityCode', String, true)
  cityCode: string = ''

  @JsonProperty('provinceCode', String, true)
  provinceCode: string = ''

  @JsonProperty('districtCode', String, true)
  districtCode: string = ''

  @JsonProperty('cityName', String, true)
  cityName: string = ''

  @JsonProperty('provinceName', String, true)
  provinceName: string = ''

  @JsonProperty('districtName', String, true)
  districtName: string = ''

  @JsonProperty("idNo", String, true)
  idNo: string = "";
}

export default UserActivityEntryInfo
