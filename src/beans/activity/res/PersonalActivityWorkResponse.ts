import { JsonObject, JsonProperty } from "json2typescript"
import {StringToNumConverter} from "@/common/json_ts_converter/StringToNumConverter";
import PersonalActivityLastSubmitWorkResponse from "@/beans/activity/res/PersonalActivityLastSubmitWorkResponse";

@JsonObject
class PersonalActivityWorkResponse {
    @JsonProperty('lastSubmitted', PersonalActivityLastSubmitWorkResponse, true)
    lastSubmitted: PersonalActivityLastSubmitWorkResponse = new PersonalActivityLastSubmitWorkResponse()
    @JsonProperty('leftSubmitLimit', StringToNumConverter, true)
    leftSubmitLimit: number = 0
    @JsonProperty('totalSubmitLimit', StringToNumConverter, true)
    totalSubmitLimit: number = 0
}

export default PersonalActivityWorkResponse