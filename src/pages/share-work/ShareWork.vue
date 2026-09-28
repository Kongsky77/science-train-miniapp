<template>
  <web-view :src="url" />
</template>

<script lang="ts">
import { Component,Vue } from 'vue-property-decorator'
import ShareWorkModelEnum from '@/definition/common/ShareWorkModelEnum'
import PageLinkEnum from '@/definition/lang/PageLinkEnum'
import RateService from '@/service/RateService'
import WorkContentVO from '@/beans/rate/WorkContentVO'
import ChildrenService from '@/service/ChildrenService'
import UserInfoResponse from '@/beans/common/UserInfoResponse'
import EntityTypeEnum from '@/definition/rate/EntityTypeEnum'
import StarEvaluationVO from '@/beans/rate/StarEvaluationVO'
import TokenManagement from '@/management/token/TokenManagement'

interface OptionScene {
  productId: string
  activityId: string
  currentFileUrl: string
  childrenId: string
  shareWorkModel: ShareWorkModelEnum
}

@Component({
  name: 'ShareWork'
})

export default class ShareWork extends Vue {
  url = ''
  productId = ''
  activityId = ''
  currentFileUrl = ''
  childrenId = ''
  shareWorkModel = ShareWorkModelEnum.WORK
  workContentVO: WorkContentVO = new WorkContentVO()
  userInfo: UserInfoResponse = new UserInfoResponse()
  starEvaluationVO: StarEvaluationVO = new StarEvaluationVO()

  onLoad (option: OptionScene) {
    this.productId = option.productId
    this.activityId = option.activityId
    this.childrenId = option.childrenId
    this.currentFileUrl = option.currentFileUrl
    this.shareWorkModel = Number(option.shareWorkModel)
    uni.setNavigationBarTitle({
      title: this.title
    })
    this.fetchMyWorkDetail()
  }

  get title () {
    let title = ''
    switch (this.shareWorkModel) {
      case ShareWorkModelEnum.WORK:
        title = '分享作品'
        break
      case ShareWorkModelEnum.RATE:
        title = '分享评分'
        break
      default:
        title = ''
        break
    }

    return title
  }

  fetchMyWorkDetail () {
    const rateService = new RateService()
    rateService.receiveWorkDetail(this.productId,this.receiveWorkDetailCallback)
  }

  receiveWorkDetailCallback (success: boolean,result: WorkContentVO) {
    if (success) {
      this.workContentVO = result
      this.fetchChildrenInfo()
    }
  }

  fetchStarEvaluation () {
    const rateService = new RateService()
    const entityType = EntityTypeEnum.PERSONAL_WORKS
    rateService.receiveStarSystemEvaluation(entityType,this.productId,this.receiveStarSystemEvaluationCallback)
  }

  receiveStarSystemEvaluationCallback (success: boolean,result: StarEvaluationVO) {
    if (success) this.starEvaluationVO = result
    this.chooseModel()
  }


  fetchChildrenInfo () {
    const childrenService = new ChildrenService()
    childrenService.getChildInfo(this.childrenId).then(res => {
      this.userInfo = res.data
      this.fetchStarEvaluation()

    })
  }

  chooseModel () {
    switch (this.shareWorkModel) {
      case ShareWorkModelEnum.RATE:
        this.loadShareRateWorkPage()
        break
      case ShareWorkModelEnum.WORK:
        this.loadShareWorkPage()
        break
      default:
        this.loadShareWorkPage()
        break
    }
  }

  loadShareWorkPage () {
    const prefix = process.env.VUE_APP_CARMELA_APP_URL
    this.url =
        `${ prefix + PageLinkEnum.SHARE_PRODUCT
        + '?' + `productId=${ this.productId }`
        + '&' + `token=${TokenManagement.getInstance().getToken()}`
        + '&' + `currentFileUrl=${ encodeURIComponent(this.currentFileUrl) }`
        + '&' + `userInfo=${JSON.stringify(this.userInfo)}`
        + '&' + `activityId=${ this.activityId }` }`
        + '&' + `childrenId=${this.childrenId}`
  }

  loadShareRateWorkPage () {
    const prefix = process.env.VUE_APP_CARMELA_APP_URL

    this.url =
        `${
        prefix + PageLinkEnum.SHARE_PRODUCT_RATE
        + '?' + `productId=${ this.productId }`
        + '&' + `activityId=${ this.activityId }` }`
        + '&' + `starEvaluation=${JSON.stringify(this.starEvaluationVO)}`
        + `&` + `currentFileUrl=${encodeURIComponent(this.currentFileUrl)}`
  }

}

</script>

<style lang="scss" scoped>
</style>
