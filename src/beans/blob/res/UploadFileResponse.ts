import { JsonObject, JsonProperty } from 'json2typescript'

@JsonObject
export default class UploadFileResponse {
  @JsonProperty('success', Boolean, true)
  success = true

  @JsonProperty('data', String, true)
  data: string = ''
}
