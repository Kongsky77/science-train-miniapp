import { JsonObject, JsonProperty } from 'json2typescript';
import { StringToNumConverter } from '@/common/json_ts_converter/StringToNumConverter';
import FollowResponse from './FollowResponse';

@JsonObject
export default class ActivityFullList {
	// 当前页码
	@JsonProperty('pageNo', StringToNumConverter, true)
	pageNo = 1;

	// 每页显示数量
	@JsonProperty('pageSize', StringToNumConverter, true)
	pageSize = 10;

	// 总页数
	@JsonProperty('pages', String, true)
	pages = '';

	// 数据
	@JsonProperty('records', [ FollowResponse ], true)
	records = [];
}
