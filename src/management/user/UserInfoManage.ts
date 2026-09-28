import UserInfoManagement from './UserInfoManagement';

export default class UserInfoManage {
	getUserInfo() {
		const data = new UserInfoManagement().getUserInfo();
		return data;
	}
}
