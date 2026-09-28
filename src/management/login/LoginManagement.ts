import TokenManagement from '@/management/token/TokenManagement';

export default class LoginManagement {
	isLogin() {
		const token = new TokenManagement().getToken();
		return !!token;
	}
}
