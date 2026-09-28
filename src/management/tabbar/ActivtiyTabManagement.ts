import ActivityPageManagement from '@/definition/tabbar/ActivityPageManagement';

export default class ActivityTabManagement {
	saveActivity(data) {
		uni.setStorageSync(ActivityPageManagement.ACTIVITY, data);
	}

	getActivity() {
		const data = uni.getStorageSync(ActivityPageManagement.ACTIVITY);
		return data;
	}

	saveLikeActivity(data) {
		uni.setStorageSync(ActivityPageManagement.LIKE_ACTIVITY, data);
	}

	getLikeActivity() {
		const data = uni.getStorageSync(ActivityPageManagement.LIKE_ACTIVITY);
		return data;
	}

	clearStorage() {
		uni.removeStorageSync(ActivityPageManagement.ACTIVITY);
		uni.removeStorageSync(ActivityPageManagement.LIKE_ACTIVITY);
	}
}
