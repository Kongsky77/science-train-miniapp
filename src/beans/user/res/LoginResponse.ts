import { JsonObject, JsonProperty } from 'json2typescript'
import UserInfoResponse from '@/beans/common/UserInfoResponse'

@JsonObject
export default class LoginResponse {
  @JsonProperty('accessToken', String, true)
  accessToken = ''

  @JsonProperty('user', UserInfoResponse, true)
  user: UserInfoResponse = new UserInfoResponse()
}
