import { JsonObject, JsonProperty } from 'json2typescript';
import { StringToNumConverter } from '@/common/json_ts_converter/StringToNumConverter';

@JsonObject
export default class MessageDayResponse {
	@JsonProperty('time', String, true)
	time = '';

	@JsonProperty('totalCount', StringToNumConverter, true)
	totalCount = 0;

	@JsonProperty('unreadCount', StringToNumConverter, true)
	unreadCount = 0;
}
