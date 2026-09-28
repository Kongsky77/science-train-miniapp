import { StringToNumConverter } from "@/common/json_ts_converter/StringToNumConverter"
import FileTypeEnum from "@/definition/common/FileTypeEnum"
import { JsonObject, JsonProperty } from "json2typescript"

@JsonObject
class PersonalActivityWorkResponseFileItem {
    @JsonProperty('type', StringToNumConverter, true)
    type:FileTypeEnum = FileTypeEnum.PICTURE
    @JsonProperty('id', String, true)
    id: string = ''
    @JsonProperty('url', String, true)
    url: string = ''
}

export default PersonalActivityWorkResponseFileItem