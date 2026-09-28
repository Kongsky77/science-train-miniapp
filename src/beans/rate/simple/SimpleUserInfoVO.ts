import { JsonObject,JsonProperty } from 'json2typescript'

@JsonObject
class SimpleUserInfoVO {
  @JsonProperty('avatar', String, true)
  avatar: string = ''
  @JsonProperty('orgName', String, true)
  orgName: string = ''
  @JsonProperty('intro', String, true)
  intro: string = ''
  @JsonProperty('nickname', String, true)
  realName: string = ''
  @JsonProperty('tagList', [String], true)
  tagList: string[] = []
  @JsonProperty('userId', String, true)
  userId: string = ''
}

export default SimpleUserInfoVO
