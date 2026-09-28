import HttpService from '@/common/utils/HttpService';
import ApiResponse from '@/beans/ApiResponse';
import TokenManagement from '@/management/token/TokenManagement';
import UploadFileResponse from '@/beans/blob/res/UploadFileResponse';

const USER_CENTER_BASEAPI = process.env.VUE_APP_USER_CENTER_BASEAPI;

class BlobService {
	getBlobCert(data?: any) {
		const url = `${process.env.VUE_APP_USER_CENTER_BASEAPI}/api/v1/azure/blob/upload/policy`;

		return HttpService.doRequest(url, 'post', data).then((response: any) => {
			return ApiResponse.parseToObject(response);
		});
	}

	upLoadFile(filePath: string, blobDir: string, blobName: string, showLoading?: boolean): Promise<UploadFileResponse> {
		const token = new TokenManagement().getToken();
		return new Promise((resolve, reject) => {
			if (showLoading) {
				uni.showLoading({
					title: '加载中',
					mask: true
				});
			}
			uni.uploadFile({
				url: `${USER_CENTER_BASEAPI}/api/v1/azure/blob/upload`,
				filePath: filePath,
				name: 'file',
				formData: {
					blobDir,
					blobName,
					referer: process.env.VUE_APP_PROJECT_NAME
				},
				header: {
					authorization: 'Bearer ' + token
				},
				success: (uploadFileRes: any) => {
					if (showLoading) {
						uni.hideLoading();
					}
					const uploadFileResponse: UploadFileResponse = JSON.parse(uploadFileRes.data);
					resolve(uploadFileResponse);
				},
				fail(err: any) {
					if (showLoading) {
						uni.hideLoading();
					}
					reject(err);
				}
			});
		});
	}
}

export default BlobService;
