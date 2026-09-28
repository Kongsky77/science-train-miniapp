import HttpService from '@/common/utils/HttpService';
import ApiResponse from '@/beans/ApiResponse';
import ActivityFullList from '@/beans/activity/res/ActivityFullList';
import ListRequest from '@/beans/activity/req/ListRequest';
import { LikeType } from '@/enums/notice/NoticeItemEnum';
import FollowList from '@/beans/follow/FollowList';

const ACTIVITY_BASEAPI = process.env.VUE_APP_ACTIVITY_BASEAPI;

class LikeService {
	getLikedActivity(data: ListRequest = new ListRequest()) {
		const url = `${ACTIVITY_BASEAPI}/api/v1/follow/self/page`;

		return HttpService.doRequest(url, 'get', data).then((response: any) => {
			return ApiResponse.parseToObject(response, FollowList);
		});
	}

	like(id: string, type: LikeType) {
		const url = `${ACTIVITY_BASEAPI}/api/v1/follow/${type}/${id}`;
		return HttpService.doRequest(url, 'post', undefined, undefined, false).then((response: any) => {
			return ApiResponse.parseToObject(response);
		});
	}

	unlike(id: string, type: LikeType) {
		const url = `${ACTIVITY_BASEAPI}/api/v1/follow/${type}/${id}`;
		return HttpService.doRequest(url, 'delete', undefined, undefined, false).then((response: any) => {
			return ApiResponse.parseToObject(response);
		});
	}
}

export default LikeService;
