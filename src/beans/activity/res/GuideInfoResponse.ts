import { JsonObject, JsonProperty } from 'json2typescript'

@JsonObject
export default class GuideInfoResponse {
  // 活动ID
  @JsonProperty('activityId', String, true)
  activityId = ''

  // 背景图
  @JsonProperty('guideBgImg', String, true)
  guideBgImg = ''

  // 客服图
  @JsonProperty('guideKfImg', String, true)
  guideKfImg = ''

  // 推文链接
  @JsonProperty('guidePromotionLink', String, true)
  guidePromotionLink = ''

  // 学习平台地址
  @JsonProperty('guideStudyUrl', String, true)
  guideStudyUrl = ''

  // 教学图
  @JsonProperty('guideTeachImg', String, true)
  guideTeachImg = ''
}
