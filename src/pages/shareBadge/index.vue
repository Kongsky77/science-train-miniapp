<template>
  <web-view :src="url"></web-view>
</template>

<script lang='ts'>
import { Vue, Component } from 'vue-property-decorator'
import BuriedPointRequest from '@/beans/user/req/BuriedPointRequest'
import BadgeService from '@/service/BadgeService'

@Component({
  components : {}
})
export default class shareBadge extends Vue {
  url: string = ''
  buriedPointId: string = ''

  onLoad (option) {
    this.url = decodeURIComponent(option.url)
    console.log('onLoad url',this.url)
    this.onEnterPage()
  }

  onEnterPage () {
    let buriedPointRequest = new BuriedPointRequest()
    buriedPointRequest.uri = '/pages/shareBadge/index'
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