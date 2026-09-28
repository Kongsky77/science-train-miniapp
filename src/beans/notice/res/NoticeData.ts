import { JsonObject, JsonProperty } from 'json2typescript';
import { StringToNumConverter } from '@/common/json_ts_converter/StringToNumConverter';
import NoticeItem from '../NoticeItem';

@JsonObject
export default class NoticeData {
	// 当前页码
	@JsonProperty('pageNo', StringToNumConverter, true)
	pageNo = 1;

	// 每页显示数量
	@JsonProperty('pageSize', StringToNumConverter, true)
	pageSize = 10;

	// 总页数
	@JsonProperty('pages', String, true)
	pages = '';

	// 总页数
	@JsonProperty('total', String, true)
	total = '';

	// 数据
	@JsonProperty('records', [ NoticeItem ], true)
	records = [];
}
