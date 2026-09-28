import SexEnum from '@/enums/common/SexEnum'
import RoleEnum from '@/enums/common/RoleEnum'

export default class AddChildRequest {
  avatar?: string = ''
  gender?: SexEnum = SexEnum.PRIVATE
  birthday?: number = 0
  grade?: number = 1
  ident?: RoleEnum = RoleEnum.OTHER
  orgCode?: number = -1
  orgName?: string = ''
  realName?: string = ''
  contactsMobile?: string = ''
  recipientAddress?: string = ''
  referer?: string = process.env.VUE_APP_PROJECT_NAME
  districtCode?: string = ''
  cityCode?: string = ''
  provinceCode?: string = ''
  kocId?: string = ''
  provinceName?: string = ''
  cityName?: string = ''
  districtName?: string = ''
  idNo?: string = "";
}
