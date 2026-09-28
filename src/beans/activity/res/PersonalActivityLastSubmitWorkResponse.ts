import {JsonObject, JsonProperty} from "json2typescript";
import PersonalActivityWorkResponseFileItem from "@/beans/activity/res/PersonalActivityWorkResponseFileItem";

@JsonObject
class PersonalActivityLastSubmitWorkResponse {
    @JsonProperty('description', String, true)
    description: string = ''
    @JsonProperty('files', [PersonalActivityWorkResponseFileItem], true)
    files: Array<PersonalActivityWorkResponseFileItem> = []
    @JsonProperty('periodId', String, true)
    periodId: string = ''
}

export default PersonalActivityLastSubmitWorkResponse