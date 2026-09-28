import { StringToBooleanConverter } from "@/common/json_ts_converter/StringToBooleanConverter";
import { JsonObject, JsonProperty } from "json2typescript";
import PeriodsItem from "../PeriodsItem";

@JsonObject
class PersonalSubmitConfigResponse {
    @JsonProperty('enabled', StringToBooleanConverter, true)
    enabled: boolean = true
    @JsonProperty('currentPeriod', PeriodsItem, true)
    currentPeriod: PeriodsItem = new PeriodsItem()
    @JsonProperty('periods', [PeriodsItem], true)
    periods: Array<PeriodsItem> = []
}

export default PersonalSubmitConfigResponse