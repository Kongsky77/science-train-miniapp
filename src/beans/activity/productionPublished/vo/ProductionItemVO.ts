import { JsonObject, JsonProperty } from 'json2typescript'

@JsonObject
export default class ProductionItemVO {
  @JsonProperty('cover', String, true)
  cover: string = ''
  @JsonProperty('fileName', String, true)
  fileName: string = ''
  @JsonProperty('fileSize', String, true)
  fileSize: string = ''
  @JsonProperty('fileType', String, true)
  fileType: string = ''
  @JsonProperty('fileUrl', String, true)
  fileUrl: string = ''
  @JsonProperty('id', String, true)
  id: string = ''
}
