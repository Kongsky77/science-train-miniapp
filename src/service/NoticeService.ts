import { Utils } from '@/common/utils/Utils';
import HttpService from '@/common/utils/HttpService';
import ApiResponse from '@/beans/ApiResponse';
import NoticeData from '@/beans/notice/res/NoticeData';

const ACTIVITY_BASEAPI = process.env.VUE_APP_ACTIVITY_BASEAPI;

class NoticeService {
	getNoticeList() {
		const url = `${ACTIVITY_BASEAPI}/api/v1/message/self/page`;
		return HttpService.doRequest(url, 'get', undefined, undefined, false).then((response: any) => {
			return ApiResponse.parseToObject(response, NoticeData);
		});
	}
}

export default NoticeService;
