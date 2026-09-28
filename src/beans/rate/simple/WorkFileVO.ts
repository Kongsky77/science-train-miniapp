import { JsonObject,JsonProperty } from 'json2typescript'
import { StringToNumConverter } from '@/common/utils/StringToNumConverter'
import FileTypeEnum from '@/definition/common/FileTypeEnum'

@JsonObject
class WorkFileVO {
  @JsonProperty('id',String, true)
  id: string = ''
  @JsonProperty('type',StringToNumConverter, true)
  type: FileTypeEnum = FileTypeEnum.PICTURE
  @JsonProperty('url',String, true)
  url: string = ''

}

export default WorkFileVO
