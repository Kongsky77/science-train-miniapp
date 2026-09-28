import ProfilePageManagement from '@/definition/tabbar/ProfilePageManagement';

export default class ProfileTabManagement {
	saveProfile(data) {
		uni.setStorageSync(ProfilePageManagement.PROFILE, data);
	}

	getProfile() {
		const data = uni.getStorageSync(ProfilePageManagement.PROFILE);
		return data;
	}
}
