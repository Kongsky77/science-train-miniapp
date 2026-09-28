import dayjs from 'dayjs'
import { OperateModeEnum, isFollowedEnum } from '@/enums/activity/ActivityFullItemEnum'
import ActivityTypeEnum from '@/enums/activity/ActivityTypeEnum'
import ActivityFullItem from '@/beans/activity/ActivityFullItem'
import ActivityJoinedCard from '@/beans/activity/ActivityJoinedCard'
import ActivityLikedCard from '@/beans/activity/ActivityLikedCard'
import ActivityItem from '@/beans/activity/ActivityItem'
import FollowResponse from '@/beans/follow/FollowResponse'
import EntryUsersList from '@/beans/follow/EntryUsersList'
import ActivityService from '@/service/ActivityService'
import SwiperVO from '@/beans/activity/res/SwiperVO'
import SwiperModeEnum from '@/definition/common/SwiperModeEnum'

export const mapOperateMode = (type: SwiperModeEnum) => {
  return type === SwiperModeEnum.ONLINE ? '线上活动' : '线下活动'
}

export const mapLikeValue = (isLike: isFollowedEnum) => {
  return isLike === isFollowedEnum.YES
}

export const mapSwiperActivityList = (list: Array<SwiperVO>) => {
  return list.map((item) => ({
    id: item.src,
    title: item.title,
    img: item.img,
    text: item.slogan,
    type: mapOperateMode(item.mode),
    cardType: item.type,
    time: dayjs(Number(item.time)).format('YYYY-MM-DD')
  }))
}

export const mapActivityListCard = (list: Array<ActivityFullItem>) => {
  return list.map((item) => ({
    id: item.id,
    title: item.name,
    type: mapOperateMode(item.operateMode),
    liked: mapLikeValue(item.isFollowed),
    dateItemTitle: dayjs(Number(item.startTime)).format('YYYY-MM-DD'),
    dateItemText: '未开始',
    image: item.imgCover
  }))
}

export const mapJoinedActivityList = (list: Array<ActivityFullItem>): Array<ActivityJoinedCard> => {
  return list.map((item) => ({
    id: item.id,
    title: item.name,
    type: mapOperateMode(item.operateMode),
    text: item.slogan,
    // avatars: [ require('@/static/picture/boy_1@3x.png'), require('@/static/picture/boy_1@3x.png') ],
    avatars: [],
    img: item.imgCover
  }))
}

export const mapLikedActivityList = (list: Array<FollowResponse>): Array<ActivityLikedCard> => {
  const getAvatars = (entryUsers: Array<EntryUsersList>): Array<string> => {
    let avatasList: Array<string> = []
    let avatarsList: Array<string> = []
    if (entryUsers.length !== 0) {
      for (let i = 0; i < entryUsers.length; i++) {
        avatasList.push(entryUsers[i].avatar)
      }
    }
    avatarsList = avatasList.slice(0, 5)
    return avatarsList
  }

  return list.map((item) => ({
    id: item.id,
    title: item.name,
    text: item.slogan,
    img: item.imgCover,
    isFollowed: item.isFollowed,
    type: mapOperateMode(item.operateMode),
    time: dayjs(Number(item.startTime)).format('YYYY-MM-DD'),
    endTime: Number(item.endTime),
    url: item.guideStudyUrl || '',
    added: '',
    avatars: getAvatars(item.entryUsers)
  }))
}

export default Object.freeze({
  mapOperateMode,
  mapActivityListCard,
  mapJoinedActivityList,
  mapLikedActivityList
})
