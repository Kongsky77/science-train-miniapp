import { StringToNumConverter } from '@/common/json_ts_converter/StringToNumConverter';
import { JsonObject, JsonProperty } from 'json2typescript';

@JsonObject
export default class UnreadMessage {
    @JsonProperty('data',StringToNumConverter)
    data = 0
}