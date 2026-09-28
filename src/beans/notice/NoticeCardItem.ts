import { TargetType } from '@/enums/notice/NoticeItemEnum';

export default class NoticeCardItem {
	id = '';
	title = '';
	text = '';
	img = '';
	target = '';
	targetActivityId = '';
	targetUserId = '';
	targetType: TargetType = TargetType.ACTIVITY;
}
