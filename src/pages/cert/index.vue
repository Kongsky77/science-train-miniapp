<template>
  <web-view :src="url"></web-view>
</template>

<script lang="ts">
import { Component,Vue } from 'vue-property-decorator'
import ActivityService from '@/service/ActivityService'
import CertResponse from '@/beans/activity/res/CertResponse'
import dayjs from 'dayjs'

@Component({
  name: 'cert'
})
export default class Cert extends Vue {
  url = ''
  activityService = new ActivityService()
  certName = '-'
  certDetail = new CertResponse()
  certWidth = 0
  windowWidth = 0
  certNarrow = 0
  windowHeight = 0

  onLoad (options: any) {
    let certId = options.id

    if (options.scene) {
      certId = decodeURIComponent(options.scene)
    }

    this.getCertInfo(certId)
  }

  getCertInfo (certId: string) {
    const that = this

    this.activityService.getCertInfo(certId).then(res => {
      if (res.success && res.data) {
        let data = res.data

        let certData = new CertResponse()
        // this.certName = data.realName;
        certData.id = data.id
        certData.realName = data.realName
        certData.orgName = data.orgName
        certData.tutorName = data.tutorName

        certData.certConfig.positionLeftNo = data.certConfig.positionLeftNo
        certData.certConfig.positionLeftRealName =
            data.certConfig.positionLeftRealName
        certData.certConfig.positionTopNo = data.certConfig.positionTopNo
        certData.certConfig.positionTopRealName =
            data.certConfig.positionTopRealName
        certData.certConfig.img = data.certConfig.img
        certData.awardTime = dayjs(Number(data.awardTime)).format('YYYY-MM-DD')
        certData.certConfig.positionTopTime = data.certConfig.positionTopTime
        certData.certConfig.positionLeftTime = data.certConfig.positionLeftTime
        certData.certConfig.positionLeftOrg = data.certConfig.positionLeftOrg
        certData.certConfig.positionTopOrg = data.certConfig.positionTopOrg
        certData.certConfig.positionLeftTutor = data.certConfig.positionLeftTutor
        certData.certConfig.positionTopTutor = data.certConfig.positionTopTutor
        that.certDetail = certData

        this.fetchWindowWidth()
        this.fetchCertSize(data.certConfig.img).then((res: any) => {
          const certDetail = JSON.stringify(this.certDetail)
          this.url = ` ${ process.env.VUE_APP_CARMELA_APP_URL }/cert-share?windowHeight=${ this.windowHeight }&certDetail=${ certDetail }&certWidth=${ res.width }&certHeight=${ res.height }&windowWidth=${ this.windowWidth }&certNarrow=${ this.certNarrow }`
          console.log(this.url)
        })
      }
    })
  }

  fetchWindowWidth () {
    uni.getSystemInfo({
      success: res => {
        this.windowWidth = res.windowWidth
        this.windowHeight = res.windowHeight
      }
    })
  }

  fetchCertSize (srcs: string) {
    return new Promise(resolve => {
      uni.getImageInfo({
        src: srcs,
        success: res => {
          resolve({width: res.width,height: res.height})
        }
      })
    })
  }
}
</script>
