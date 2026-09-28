import UserInfo from '@/definition/user/UserInfo'
import UserInfoResponse from '@/beans/common/UserInfoResponse'

export default class UserInfoManagement {
 private static _instance: UserInfoManagement

	saveUserInfo(data: UserInfoResponse) {
		uni.setStorageSync(UserInfo.USER_INFO, data)
	}

	static getInstance (): UserInfoManagement {
		if (!UserInfoManagement._instance) {
			UserInfoManagement._instance = new UserInfoManagement()
		}
		return UserInfoManagement._instance
	}

	getUserInfo(): UserInfoResponse {
		return uni.getStorageSync(UserInfo.USER_INFO)
	}

	clearStorage() {
		uni.removeStorageSync(UserInfo.USER_INFO);
	}
}
