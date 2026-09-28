import HttpService from '@/common/utils/HttpService';
import ApiResponse from '@/beans/ApiResponse';
import AddChildRequest from '@/beans/children/req/AddChildRequest';
import UserInfoResponse from '@/beans/common/UserInfoResponse';
import ActivityChild from '@/beans/common/ActivityChild';
import SaveFaceRequest from '@/beans/user/req/SaveFaceRequest';

const ACTIVITY_BASEAPI = process.env.VUE_APP_ACTIVITY_BASEAPI;
const USER_CENTER_BASEAPI = process.env.VUE_APP_USER_CENTER_BASEAPI;

class ChildrenService {
	addChildInfo(data: AddChildRequest) {
		const url = `${USER_CENTER_BASEAPI}/api/v1/user/sub`;

		return HttpService.doRequest(url, 'post', data).then((response: any) => {
			return ApiResponse.parseToObject(response, UserInfoResponse);
		});
	}

	getChildrens() {
		const url = `${USER_CENTER_BASEAPI}/api/v1/user/sub`;

		return HttpService.doRequest(url, 'get').then((response: any) => {
			return ApiResponse.parseArray(response, UserInfoResponse);
		});
	}

	getChildInfo(id: string) {
		const url = `${USER_CENTER_BASEAPI}/api/v1/user/sub/${id}`;

		return HttpService.doRequest(url, 'get').then((response: any) => {
			return ApiResponse.parseToObject(response, UserInfoResponse);
		});
	}

	getChildInfoPreservingSession(id: string) {
		const url = `${USER_CENTER_BASEAPI}/api/v1/user/sub/${id}`;

		return HttpService.doAuthenticatedRequest(url, 'get', undefined, undefined, false).then((response: any) => {
			if (response && response.statusCode === 401) {
				return new ApiResponse<UserInfoResponse>(
					false,
					'UNAUTHORIZED',
					'当前账号无权读取该用户'
				);
			}
			if (!response || !response.data || typeof response.data !== 'object') {
				return new ApiResponse<UserInfoResponse>(
					false,
					'INVALID_RESPONSE',
					'用户信息加载失败'
				);
			}
			return ApiResponse.parseToObject(response, UserInfoResponse);
		});
	}

	editChildInfo(id: string, data: AddChildRequest) {
		const url = `${USER_CENTER_BASEAPI}/api/v1/user/sub/${id}`;

		return HttpService.doRequest(url, 'put', data).then((response: any) => {
			return ApiResponse.parseToObject(response, UserInfoResponse);
		});
	}

	editChildInfoPreservingSession(id: string, data: AddChildRequest) {
		const url = `${USER_CENTER_BASEAPI}/api/v1/user/sub/${id}`;

		return HttpService.doAuthenticatedRequest(url, 'put', data).then((response: any) => {
			if (response && response.statusCode === 401) {
				return new ApiResponse<UserInfoResponse>(
					false,
					'UNAUTHORIZED',
					'保存失败，当前账号无权修改该用户'
				);
			}
			if (!response || !response.data || typeof response.data !== 'object') {
				const statusCode = response && response.statusCode;
				return new ApiResponse<UserInfoResponse>(
					false,
					statusCode ? `HTTP_${statusCode}` : 'INVALID_RESPONSE',
					'保存失败，请稍后重试'
				);
			}
			return ApiResponse.parseToObject(response, UserInfoResponse);
		});
	}

	getFaceInfo(id: string) {
		const url = `${USER_CENTER_BASEAPI}/api/v1/user/sub/${id}/face`;

		return HttpService.doRequest(url, 'get').then((response: any) => {
			return ApiResponse.parseToObject(response);
		});
	}

	saveFaceImage(userId: string, data: SaveFaceRequest) {
		const url = `${USER_CENTER_BASEAPI}/api/v1/user/sub/${userId}/face`;

		return HttpService.doRequest(url, 'post', data).then((response: any) => {
			return ApiResponse.parseToObject(response);
		});
	}

	getActivityChildren(activityId: string) {
		const url = `${ACTIVITY_BASEAPI}/api/v1/activity/${activityId}/sub-user`;

		return HttpService.doRequest(url, 'get', undefined, undefined, false).then((response: any) => {
			return ApiResponse.parseArray(response, ActivityChild);
		});
	}

	getChildEntryInfo(activityId: string, childId: string) {
		const url = `${ACTIVITY_BASEAPI}/api/v1/activity/${activityId}/entry-info/${childId}`;

		return HttpService.doRequest(url, 'get').then((response: any) => {
			return ApiResponse.parseToObject(response, ActivityChild);
		});
	}
}

export default ChildrenService;
