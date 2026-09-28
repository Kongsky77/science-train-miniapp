import IndexTabManagement from '../tabbar/IndexTabManagement';

export default class IndedxManagement {
	indexSwiper() {
		const data = new IndexTabManagement().getIndexSwiper();
		return data;
	}

	newSwiper() {
		const data = new IndexTabManagement().getNewSwiper();
		return data;
	}
}
