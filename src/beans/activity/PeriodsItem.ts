import { StringToNumConverter } from "@/common/json_ts_converter/StringToNumConverter"
import { JsonObject, JsonProperty } from "json2typescript"
import { StringToBooleanConverter } from '@/common/json_ts_converter/StringToBooleanConverter'

@JsonObject
class PeriodsItem {
    @JsonProperty('id', String, true)
    id: string = ''
    @JsonProperty('title', String, true)
    title: string = ''
    @JsonProperty('endTime', StringToNumConverter, true)
    endTime: number = 0
    @JsonProperty('startTime', StringToNumConverter, true)
    startTime: number = 0
    @JsonProperty('fileNumMax', StringToNumConverter, true)
    fileNumMax: number = 0
    @JsonProperty('descriptionWordLimit', StringToNumConverter, true)
    descriptionWordLimit: number = 0
    @JsonProperty('submitLimit', StringToNumConverter , true)
    submitLimit: number = 0
    @JsonProperty('descriptionPlaceholder', String, true)
    descriptionPlaceholder: string = ''
    @JsonProperty('descriptionRequired',StringToBooleanConverter, true)
    descriptionRequired: boolean = false
    @JsonProperty('submitTitle', String, true)
    submitTitle: string = ''
}

export default PeriodsItem
