import { JsonObject,JsonProperty } from 'json2typescript'
import WorkFileVO from '@/beans/rate/simple/WorkFileVO'
import { StringToNumConverter } from '@/common/utils/StringToNumConverter'

@JsonObject
class WorkContentVO {
  @JsonProperty('id',String,true)
  id: string = ''
  @JsonProperty('periodId',String,true)
  periodId: string = ''
  @JsonProperty('description',String,true)
  description: string = ''
  @JsonProperty('submitTime',StringToNumConverter,true)
  submitTime: number = 0
  @JsonProperty('files',[WorkFileVO],true)
  files: Array<WorkFileVO> = []
}

export default WorkContentVO
