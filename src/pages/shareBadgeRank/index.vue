<template>
  <web-view :src="url"></web-view>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import CanvasContext = UniApp.CanvasContext
import BadgeService from '@/service/BadgeService'
import BuriedPointRequest from '@/beans/user/req/BuriedPointRequest'
import { Utils } from '@/common/utils/Utils'
import UserInfoManagement from '@/management/user/UserInfoManagement'
import LangEnum from '@/definition/lang/LangEnum'

@Component({
  name : 'ShareBadgeRank'
})
export default class ShareBadgeRank extends Vue {
  url: string = ''
  buriedPointId: string = ''

  onLoad (option) {
    this.url = decodeURIComponent(option.url)
    this.onEnterPage()
  }

  onEnterPage () {
    let buriedPointRequest = new BuriedPointRequest()
    buriedPointRequest.uri = '/pages/shareBadgeRank/index'
    buriedPointRequest.referer = process.env.VUE_APP_PROJECT_NAME
    this.buriedPoint(buriedPointRequest)
  }

  /**
   * 埋点
   */
  buriedPoint (buriedPointRequest: BuriedPointRequest) {
    let badgeService = new BadgeService()
    badgeService.buriedPoint(buriedPointRequest).then(res => {
      this.buriedPointId = res.data
    })
  }

  beforeDestroy () {
    this.onLeavePage()
  }

  onLeavePage () {
    let buriedPointRequest = new BuriedPointRequest()
    buriedPointRequest.reqId = this.buriedPointId
    this.buriedPoint(buriedPointRequest)
  }

}
</script>

<style scoped>
</style>