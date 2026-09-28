import { JsonObject, JsonProperty } from 'json2typescript'
import BooleanEnum from '@/enums/common/BooleanEnum'
import { StringToNumConverter } from '@/common/json_ts_converter/StringToNumConverter'

@JsonObject
export default class FormResponse {
  @JsonProperty('id', String, true)
  id: string = ''

  @JsonProperty('filedId', String, true)
  filedId: string = ''

  @JsonProperty('name', String, true)
  name: string = ''

  @JsonProperty('required', StringToNumConverter, true)
  required: BooleanEnum = BooleanEnum.NO

  @JsonProperty('placeholder', String, true)
  placeholder: string = ''

  @JsonProperty('type', StringToNumConverter, true)
  type: number = 0

  @JsonProperty('code', String, true)
  code: string = ''

  @JsonProperty('options', String, true)
  options: string = ''

  @JsonProperty('validPattern', String, true)
  validPattern: string = ''

  @JsonProperty('value', String, true)
  value: string = ''
}
