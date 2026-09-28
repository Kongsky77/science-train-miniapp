import { JsonObject, JsonProperty } from 'json2typescript'
import { StringToNumConverter } from '@/common/json_ts_converter/StringToNumConverter'
import {
  BadgeIsAwardEnum,
  CertIsAwardEnum,
  EntryWayEnum,
  KnowledgeIsGetEnum,
  OperateModeEnum,
  RankEnableEnum,
  UserReportIsGenEnum,
  isFollowedEnum,
  isPublishedEnum
} from '@/enums/activity/ActivityFullItemEnum'
import { StringToBooleanConverter } from '@/common/json_ts_converter/StringToBooleanConverter'
import SwiperModeEnum from '@/definition/common/SwiperModeEnum'
import PaymentModel from '@/definition/order/PaymentModel'

@JsonObject
export default class ActivityFullItem {
  // 是否颁发活动徽章：0-否、1-是
  @JsonProperty('badgeIsAward', StringToNumConverter, true)
  badgeIsAward = BadgeIsAwardEnum.NO

  // 是否颁发活动证书：0-否、1-是
  @JsonProperty('certIsAward', StringToNumConverter, true)
  certIsAward = CertIsAwardEnum.NO

  // 咨询二维码地址
  @JsonProperty('consultQr', String, true)
  consultQr = ''

  // 活动ID
  @JsonProperty('contentId', String, true)
  contentId = ''

  // 活动结束时间，13位时间戳
  @JsonProperty('endTime', StringToNumConverter, true)
  endTime: any = 0

  @JsonProperty('teamForceCreate', StringToBooleanConverter, true)
  teamForceCreate: boolean = false

  // 报名页面展示的文案
  @JsonProperty('entryCopy', String, true)
  entryCopy = ''

  @JsonProperty('tags', [String], true)
  tags: string[] = []

  // 报名截止时间
  @JsonProperty('entryEndTime', StringToNumConverter, true)
  entryEndTime = 0

  // 报名起始页面背景图
  @JsonProperty('entryPageBgImg', String, true)
  entryPageBgImg = ''

  // 报名开始时间
  @JsonProperty('entryStartTime', StringToNumConverter, true)
  entryStartTime = 0

  @JsonProperty('paymentModel', StringToNumConverter, true)
  paymentModel: PaymentModel = PaymentModel.POST_PAYMENT

  @JsonProperty('isPayment', StringToBooleanConverter, true)
  isPayment: boolean = false

  @JsonProperty('productionIconShow', StringToBooleanConverter, true)
  productionIconShow: boolean = false

  @JsonProperty('entryUserTotal', StringToNumConverter, true)
  entryUserTotal = 0

  // 指定的报名页面地址
  @JsonProperty('entryUrl', String, true)
  entryUrl = ''

  // 报名途径：1-默认、2-URL
  @JsonProperty('entryWay', StringToNumConverter, true)
  entryWay = EntryWayEnum.DEFAULT

  // 活动封面图URL地址
  @JsonProperty('imgCover', String, true)
  imgCover = ''

  // 是否获得知识点：0-否、1-是
  @JsonProperty('knowledgeIsGet', StringToNumConverter, true)
  knowledgeIsGet = KnowledgeIsGetEnum.NO

  // 是否获得知识点：0-否、1-是
  @JsonProperty('name', String, true)
  name = ''

  // 活动开展地址
  @JsonProperty('operateLocation', String, true)
  operateLocation = ''

  // 活动运作模式：1-线上、2-线下
  @JsonProperty('operateMode', StringToNumConverter, true)
  operateMode = SwiperModeEnum.ONLINE

  // 活动运作模式：1-线上、2-线下
  @JsonProperty('rankEnable', StringToNumConverter, true)
  rankEnable = RankEnableEnum.NO

  // 是否开启定位打卡：0-否、1-是
  @JsonProperty('checkInEnabled', StringToNumConverter, true)
  checkInEnabled = 0

  // 允许的最大定位精度，单位：米
  @JsonProperty('checkInAccuracyLimitMeter', StringToNumConverter, true)
  checkInAccuracyLimitMeter = 0

  // 活动标语
  @JsonProperty('slogan', String, true)
  slogan = ''

  // 活动开始时间，13位时间戳
  @JsonProperty('startTime', StringToNumConverter, true)
  startTime: any = 0

  // 是否生成用户数据报告：0-否、1-是
  @JsonProperty('userReportIsGen', StringToNumConverter, true)
  userReportIsGen = UserReportIsGenEnum.NO

  // 活动报告访问地址
  @JsonProperty('userReportUrl', String, true)
  userReportUrl = ''

  // id
  @JsonProperty('id', String, true)
  id = ''

  // 是否收藏
  @JsonProperty('isFollowed', StringToNumConverter, true)
  isFollowed = isFollowedEnum.NO

  //是否发布
  @JsonProperty('isPublished', StringToNumConverter, true)
  isPublised = isPublishedEnum.NO

  // id
  @JsonProperty('guideStudyUrl', String, true)
  guideStudyUrl = '-'

  // 报名人数上限
  @JsonProperty('entryPeopleMax', StringToNumConverter, true)
  entryPeopleMax = 0

  // 报名年龄最大值，0表示不限制
  @JsonProperty('entryAgeMax', StringToNumConverter, true)
  entryAgeMax = ''

  // 报名年龄最小值，0表示不限制
  @JsonProperty('entryAgeMin', StringToNumConverter, true)
  entryAgeMin = ''

  @JsonProperty('productionEnabled', StringToBooleanConverter, true)
  productionEnabled: boolean = false

  // 判断活动是否有官方表彰
  @JsonProperty('officialCertIsAward', StringToBooleanConverter, true)
  officialCertIsAward: boolean = false

  avatar?: string[] = []
  totalMember?: number = 0
  isUpdate: boolean = false

  @JsonProperty('teamEnabled', StringToBooleanConverter, true)
  teamEnabled: boolean = false

  @JsonProperty('openSubscription', StringToBooleanConverter, true)
  openSubscription: boolean = false

  @JsonProperty('skipEntryForm', StringToBooleanConverter, true)
  skipEntryForm: boolean = false

  @JsonProperty("isTurnOnDistrict", StringToBooleanConverter, true)
  isTurnOnDistrict: boolean = false;

  @JsonProperty("exerciseEntranceName", String, true) // 课程包入口名
  exerciseEntranceName: string = "";

  @JsonProperty("mustIdNo", StringToBooleanConverter, true)
  mustIdNo: boolean = false;
}
