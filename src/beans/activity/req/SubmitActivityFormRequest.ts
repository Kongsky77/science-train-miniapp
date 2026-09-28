import SubmitActivityFormField from '@/beans/activity/SubmitActivityFormField'
import ChannelManagement from '@/management/channel/ChannelManagement'
import ChannelKeyEnum from '@/definition/common/ChannelKeyEnum'

export default class SubmitActivityFormRequest {
  entryWay = '4' // 小程序
  subUserId = ''
  preview = '0'
  fromUserId: string = ChannelManagement.getChannelId(ChannelKeyEnum.FROM_USER_ID)
  fields: Array<SubmitActivityFormField> = []
	kocId?: string = ''
}
