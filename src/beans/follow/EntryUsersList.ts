import { JsonObject, JsonProperty } from 'json2typescript';
import { StringToNumConverter } from '@/common/json_ts_converter/StringToNumConverter';
import BooleanEnum from '@/enums/common/BooleanEnum';
import TeamResultResponse from '../team/res/TeamResultResponse';

@JsonObject
export default class EntryUsersList {
	// 头像
	@JsonProperty('avatar', String, true)
	avatar = '';

	// 报名时间，单位：毫秒时间戳
	@JsonProperty('entryTime', StringToNumConverter, true)
	entryTime = '';

	// 年级
	@JsonProperty('grade', StringToNumConverter, true)
	grade = '';

	// 是否在活动对象区域内：0-否（无法参与活动）、1-是
	@JsonProperty('inActivityRange', StringToNumConverter, true)
	inActivityRange: BooleanEnum = BooleanEnum.NO;

	// 所在组织机构名称
	@JsonProperty('orgName', String, true)
	orgName = '';

	// 完成进度，百分比，如：88
	@JsonProperty('process', String, true)
	process = '';

	// 真实姓名
	@JsonProperty('realName', String, true)
	realName = '';

	// 队伍
	@JsonProperty('team', TeamResultResponse, true)
	team: TeamResultResponse = undefined;

	// 用户ID
	@JsonProperty('userId', StringToNumConverter, true)
	userId = '';
}
