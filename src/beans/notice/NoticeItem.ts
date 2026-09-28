import { JsonObject, JsonProperty } from 'json2typescript';
import { StringToNumConverter } from '@/common/json_ts_converter/StringToNumConverter';
import { Action, TargetType } from '@/enums/notice/NoticeItemEnum';

@JsonObject
export default class NoticeItem {
	// 行为：0-通知、1-私信、2-收藏
	@JsonProperty('action', StringToNumConverter, true)
	action = Action.NOTICE;

	// 消息内容（不一定有值）
	@JsonProperty('content', String, true)
	content = '';

	// 消息ID
	@JsonProperty('messageId', StringToNumConverter, true)
	messageId = '';

	// 目标对象标识，如：活动ID、证书ID
	@JsonProperty('target', String, true)
	target = '';

	//目标活动id
	@JsonProperty('targetActivityId', String, true)
	targetActivityId = '';

	//目标用户id
	@JsonProperty('targetUserId', String, true)
	targetUserId = '';

	// 目标对象类型：1-群发、2-用户、3-活动、4-证书、5-徽章
	@JsonProperty('targetType', StringToNumConverter, true)
	targetType = TargetType.ACTIVITY;

	// 标题
	@JsonProperty('title', String, true)
	title = '';

	// icon 图片
	@JsonProperty('img', String, true)
	img = '';
}
