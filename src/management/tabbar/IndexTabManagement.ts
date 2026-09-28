import IndexPageManagement from '@/definition/tabbar/IndexPageManagement';

export default class IndexTabManagement {
	savaIndexSwiper(data) {
		uni.setStorageSync(IndexPageManagement.INDEX_SWIPER_DATA, data);
	}

	getIndexSwiper() {
		const data = uni.getStorageSync(IndexPageManagement.INDEX_SWIPER_DATA);
		return data;
	}

	saveNewSwiper(data) {
		uni.setStorageSync(IndexPageManagement.NEW_ACTIVITY_SWIPER_DATA, data);
	}

	getNewSwiper() {
		const data = uni.getStorageSync(IndexPageManagement.NEW_ACTIVITY_SWIPER_DATA);
		return data;
	}

	clearStorage() {
		uni.removeStorageSync(IndexPageManagement.NEW_ACTIVITY_SWIPER_DATA);
		uni.removeStorageSync(IndexPageManagement.INDEX_SWIPER_DATA);
	}
}
