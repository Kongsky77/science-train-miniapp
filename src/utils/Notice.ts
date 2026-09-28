import { Action, TargetType } from '@/enums/notice/NoticeItemEnum';
import NoticeItem from '@/beans/notice/NoticeItem';

export const mapMessageTitle = (action: Action, targetType: TargetType) => {
	if (action === Action.NOTICE) {
		return '系统消息';
	}

	if (action === Action.LIKE) {
		return '我的收藏';
	}

	if (targetType === TargetType.BADGE) {
		return '我的徽章';
	}

	return '';
};

export const mapMessageIcon = (action: Action, targetType: TargetType) => {
	// if (action === Action.NOTICE) {
	//   return require('@/static/picture/xiaoxi@3x.png')
	// }

	if (action === Action.LIKE) {
		return "https://contentdevsa-blob.ai121.net/testcontainer/activity/image/875f1e43-7e48-462c-858b-375f8c1f8444.png"
	}

	if (targetType === TargetType.BADGE) {
		return "https://contentdevsa-blob.ai121.net/testcontainer/activity/image/708379a2-1c4d-4fb6-b437-d108dea026ad.svg"
	}

	if (targetType === TargetType.CERT) {
		return "https://contentdevsa-blob.ai121.net/testcontainer/activity/image/1a67a15f-2e0a-4a5c-9cf5-e79ddc5ac4f5.svg"
	}

	return "https://contentdevsa-blob.ai121.net/testcontainer/activity/image/9bdc6669-bf6b-4803-852f-02f87b47ec1d.png"
};

export const mapMessageCard = (list: Array<NoticeItem>) => {
	return list.map((item) => ({
		id: item.messageId,
		title: item.title || mapMessageTitle(item.action, item.targetType),
		text: item.content,
		img: mapMessageIcon(item.action, item.targetType),
		// img:'',
		target: item.target,
		targetActivityId: item.targetActivityId,
		targetUserId: item.targetUserId,
		targetType: item.targetType
	}));
};

export default Object.freeze({
	mapMessageTitle,
	mapMessageIcon,
	mapMessageCard
});
