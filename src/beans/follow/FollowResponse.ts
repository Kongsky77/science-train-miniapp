import { JsonObject, JsonProperty } from 'json2typescript';
import { StringToNumConverter } from '@/common/json_ts_converter/StringToNumConverter';
import EntryUsersList from './EntryUsersList';
import ActivityFullItem from '../activity/ActivityFullItem';

@JsonObject
export default class FollowResponse extends ActivityFullItem {
	// 头像
	@JsonProperty('entryUsers', [ EntryUsersList ], true)
	entryUsers: Array<EntryUsersList> = [];
}
