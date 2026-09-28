import { isFollowedEnum } from '@/enums/activity/ActivityFullItemEnum'

export default class ActivityLikedCard {
  // id
  id = ''
  // 标题
  title = ''
  // 描述文字
  text = ''
  // 背景图片
  img = ''
  // 线上或线下文字
  type = ''
  // 活动时间
  time = ''
  // 报名url
  url = ''
  // 活动参与人数
  added = ''
  // 最后时间
  endTime = 0
  // 活动收藏
  isFollowed = isFollowedEnum.NO
  // 头像列表
  avatars?: Array<string> = []
}
