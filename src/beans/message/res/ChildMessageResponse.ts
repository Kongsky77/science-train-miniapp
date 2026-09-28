import { JsonObject, JsonProperty } from 'json2typescript';
import { StringToNumConverter } from '@/common/json_ts_converter/StringToNumConverter';

@JsonObject
export default class ChildMessageResponse {
	//头像
	@JsonProperty('avatar', String, true)
	avatar = '';

	@JsonProperty('dailyCount', StringToNumConverter, true)
	dailyCount = 0;

	@JsonProperty('lastEntryActivityId', String, true)
	lastEntryActivityId = '';

	@JsonProperty('lastEntryActivityName', String, true)
	lastEntryActivityName = '';

	@JsonProperty('lastLoginTime', String, true)
	lastLoginTime = '';

	@JsonProperty('realName', String, true)
	realName = '';

	@JsonProperty('unreadCount', StringToNumConverter, true)
	unreadCount = 0;

	@JsonProperty('userId', String, true)
	userId = '';
}
