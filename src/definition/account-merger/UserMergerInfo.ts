import MergerEnum from '@/definition/account-merger/MergerEnum'
import { JsonObject , JsonProperty } from 'json2typescript'
import { StringToNumConverter } from '@/common/utils/StringToNumConverter'

@JsonObject
class UserMergerInfo {
  @JsonProperty('cSubUserId', StringToNumConverter, true)
  cSubUserId: string = ''
  @JsonProperty('type', StringToNumConverter, true)
  type: MergerEnum = MergerEnum.NO_SUB_ACCOUNT
}

export default UserMergerInfo
