import IconEnum from '@/definition/icon/IconEnum'

export default class IconRowItem {
  id: IconEnum = IconEnum.NONE
  icon: string = ''
  text: string = ''
  certId?: string = ''
  badgeId?: string = ''
  productId?: string = ''
  officialcertId?: string = ''
  userReportIsGen?: number = 0
  process?: number = 0
  backgroundColor?: string = ''
  textColor?: string = ''
  productionCommentUnread: boolean = false
}
