<template>
  <main></main>
</template>

<script lang="ts">
import { Vue,Component } from 'vue-property-decorator'

class ThirdPartyOption {
  appId: string = ''
  page: string = ''
  params: string = ''
}

@Component({
  name: 'ThirdParty'
})

export default class ThirdParty extends Vue {
  option: ThirdPartyOption = new ThirdPartyOption()

  onLoad (option: ThirdPartyOption) {
    this.option = option
    this.showToast()
  }

  showToast () {
    let that = this
    uni.showModal({
      title: '即将跳转到第三方小程序',
      showCancel: false,
      success: () => {
        that.navigateToOtherMiniProgram()
      }
    })
  }

  navigateToOtherMiniProgram () {
    let that = this
    uni.navigateToMiniProgram({
      appId: that.option.appId,
      path: decodeURIComponent(that.option.page + '?' + that.option.params),
      envVersion: process.env.NODE_ENV === 'development' ? 'release' : 'trial',
      fail: (res) => {
         uni.navigateBack({
           delta: 0
         })
      }
    })
  }
}

</script>

<style lang="scss" scoped>
</style>
