<script lang="ts">
import { Action } from 'vuex-class'
import { Component, Vue } from 'vue-property-decorator'
import TokenManagement from '@/management/token/TokenManagement'
import ActivityService from '@/service/ActivityService'
import AppStatus from '@/beans/common/AppStatus'
import AppStatusEnum from '@/definition/common/AppStatusEnum'
import LangEnum from '@/definition/lang/LangEnum'
import ChannelManagement from '@/management/channel/ChannelManagement'
import ChannelKeyEnum from '@/definition/common/ChannelKeyEnum'
import OpenIdManagement from '@/management/user/OpenIdManagement'
import WeAnalysisEventManagement from '@/management/wx/WeAnalysisEventManagement'
import EventNameEnum from '@/definition/common/EventNameEnum'
import VisitFromDTO from '@/definition/common/event/VisitFromDTO'
import { isMockMode } from '@/common/utils/MockMode'
import ShowModalRes = UniApp.ShowModalRes
import LaunchOptionsApp = UniApp.LaunchOptionsApp

@Component({
  name: 'App',
})
export default class App extends Vue {
  buriedPointId: string = ''
  @Action('getUser') private getUser!: Function

  onLaunch (option: LaunchOptionsApp) {
    console.log(`[KJG BUILD] ${process.env.VUE_APP_INTEGRATION_MODE === 'true' ? 'real-api-integration' : 'standard'}`)
    // ChannelManagement.removeChannelId(ChannelKeyEnum.KOC)
    // ChannelManagement.removeChannelId(ChannelKeyEnum.FROM_USER_ID)
    if (!isMockMode()) {
      this.setUserOpenId()
      this.getUserInfo()
    }
    console.log('App onLaunch option',option.referrerInfo)
    if (option.referrerInfo.appId) {
      WeAnalysisEventManagement.reportEvent(EventNameEnum.VISIT_FROM,new VisitFromDTO(option.referrerInfo.appId))
    }
    if (isMockMode()) {
      uni.setStorageSync(LangEnum.IS_HIDDEN_KEY, false)
    } else {
      this.fetchAppStatus()
    }
  }

  onHide () {
    //   ChannelManagement.removeChannelId(ChannelKeyEnum.KOC)
    // ChannelManagement.removeChannelId(ChannelKeyEnum.FROM_USER_ID)
  }

  fetchAppStatus () {
    const activityService = new ActivityService()
    activityService.receiveAppStatus(this.receiveAppStatusCallback)
  }

  receiveAppStatusCallback (success: boolean, appStatus: AppStatus) {
    if (success) {
      if (appStatus.audit === AppStatusEnum.UNDER_REVIEW) {
        uni.setStorageSync(LangEnum.IS_HIDDEN_KEY,true)
      }else {
        uni.setStorageSync(LangEnum.IS_HIDDEN_KEY,false)
      }
    }else {
      uni.setStorageSync(LangEnum.IS_HIDDEN_KEY,false)
    }
  }

  async setUserOpenId() {
    const code = await this.getWxLoginCode()
    await OpenIdManagement.setOpenId(code)
  }

  getWxLoginCode(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      wx.login({
        success: res => {
          if (res.errMsg === 'login:ok') {
            resolve(res.code)
          } else {
            reject(res.errMsg)
          }
        },
        fail: res => reject(res.errMsg)
      })
    })
  }

  onShow () {
    this.onProgramUpdate()
  }

  getUserInfo () {
    const token = new TokenManagement().getToken()
    if (token) {
      this.getUser()
    }
  }

  onProgramUpdate () {
    const updateManager = uni.getUpdateManager()
    updateManager.onCheckForUpdate((result) => {
      if (result.hasUpdate) {
        updateManager.onUpdateReady(() => {
          this.onUpdateApplication()
        })
        updateManager.onUpdateFailed(() => {
          this.showUpdateFailedModal()
        })
      }
    })
  }

  showUpdateFailedModal () {
    uni.showModal({
      title: '更新提示',
      content: '新的版本下载失败，请检查网络连接',
      showCancel: false
    })
  }

  onUpdateApplication () {
    const that = this
    uni.showModal({
      title: '更新提示',
      content: '新版本已经准备好，是否重启应用？',
      success (res: ShowModalRes) {
        if (res.confirm) {
          that.restartApplication()
        }
      }
    })
  }

  restartApplication () {
    uni.getUpdateManager().applyUpdate()
  }
}
</script>

<style>
/* @import url("@/components/feng-parse/parse.css"); */
@import url("@/components/feng-parse/parse.css");

/*每个页面公共css */
/* @import "/wxcomponents/@vant/weapp/common/index.wxss"; */
/* @import "/wxcomponents/vant/common/index.wxss";

@font-face {
  font-weight: normal;
  font-family: "vant-icon-temp";
  font-style: normal;
  font-display: auto;
  src: url("https://img01.yzcdn.cn/vant/vant-icon-84f687.woff2") format("woff2"),
    url("https://img01.yzcdn.cn/vant/vant-icon-84f687.woff") format("woff"),
    url("https://img01.yzcdn.cn/vant/vant-icon-84f687.ttf") format("truetype");
}

.van-icon {
  font-family: "vant-icon-temp" !important;
} */
page {
  box-sizing: border-box;
  color: #273433;
  height: 100% !important;
  background-color: #f4eee3;
  font-family: "PingFang SC", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
}
</style>
