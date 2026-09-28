import HttpService from '@/common/utils/HttpService';
import ApiResponse from '@/beans/ApiResponse';
import DsitrictItems from '@/beans/district/res/DsitrictItems';

const ACTIVITY_BASEAPI = process.env.VUE_APP_ACTIVITY_BASEAPI;

class DistrictService {
	getDistricts(parentId: string) {
		const url = `${ACTIVITY_BASEAPI}/api/v1/district/parent/${parentId}`;
		return HttpService.doRequest(url, 'get').then((response: any) => {
			return ApiResponse.parseArray(response, DsitrictItems);
		});
	}
}

export default DistrictService;
