import ActivityTabManagement from '../tabbar/ActivtiyTabManagement';

export default class ActivityManagement {
	getActivity() {
		const data = new ActivityTabManagement().getActivity();
		return data;
	}

	getLikeActivity() {
		const data = new ActivityTabManagement().getLikeActivity();
		return data;
	}
}
