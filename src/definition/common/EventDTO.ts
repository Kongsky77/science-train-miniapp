import OpenIdManagement from '@/management/user/OpenIdManagement'
import UserInfoManagement from '@/management/user/UserInfoManagement'
import ChannelManagement from '@/management/channel/ChannelManagement'
import ChannelKeyEnum from '@/definition/common/ChannelKeyEnum'

class EventDTO {
  open_id: string = ''
  user_id?: string
  channel_name?: string


  constructor() {
    this.open_id = OpenIdManagement.getOpenId()
    this.user_id = UserInfoManagement.getInstance().getUserInfo().userId ? UserInfoManagement.getInstance().getUserInfo().userId  : this.user_id
    this.channel_name = ChannelManagement.getChannelId(ChannelKeyEnum.KOC) ? ChannelManagement.getChannelId(ChannelKeyEnum.KOC) : this.channel_name
  }
}

export default EventDTO
