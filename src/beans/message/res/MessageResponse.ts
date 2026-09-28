import { JsonObject, JsonProperty } from 'json2typescript';
import { StringToNumConverter } from '@/common/json_ts_converter/StringToNumConverter';

@JsonObject
export default class MessageResponse {
	@JsonProperty('content', String, true)
	content = '';
	@JsonProperty('createTime', StringToNumConverter, true)
	createTime = 0;
	@JsonProperty('id', String, true)
	id = '';
	@JsonProperty('read', StringToNumConverter, true)
	read = 0;
}
