<template>
  <view class="content">
    <web-view :src="url"></web-view>
  </view>
</template>

<script lang="ts">
import { log } from "console";
import { Component, Vue } from "vue-property-decorator";
import PageLinkEnum from "@/definition/lang/PageLinkEnum";
import TeamService from "@/service/TeamService";
import TeamResultResponse from "@/beans/team/res/TeamResultResponse";
import TokenManagement from "@/management/token/TokenManagement";
import { Utils } from "@/common/utils/Utils";

/**
 * WEB VIEW
 */
@Component({
  name: "webview"
})
export default class Webview extends Vue {
  // web view 加载地址
  url: string = "";

  onLoad(options: any) {
    if (options.scene) {
      const teamId = decodeURIComponent(options.scene);
      let url = `${process.env.VUE_APP_CARMELA_APP_URL}/team-share?teamId=${teamId}`;
      this.url = url + `&token=${TokenManagement.getInstance().getToken()}`;
      uni.setNavigationBarTitle({
        title: "分享战队"
      });
    } else {
      if (options.url) {
        this.setTitle(decodeURIComponent(options.url));
        this.url = decodeURIComponent(options.url)
        this.url = Utils.changeURLArg(this.url,'token',TokenManagement.getInstance().getToken())
      }
    }
  }

  setTitle(url: string) {
    let title;
    const str = url.split("/")[3];
    const needsStr = str.split("?")[0];

    switch (needsStr) {
      case PageLinkEnum.TEAM_CENTER:
        title = "战队中心";
        this.setCenterTeamTitle(str);
        break;
      case PageLinkEnum.SHARE_TEAM:
        title = "分享战队";
        break;
      case PageLinkEnum.CREATED_TEAM_TIPS_PAGE:
        title = "创建战队";
        break;
      case PageLinkEnum.CREATED_TEAM_PAGE:
        title = "完善信息";
        break;
      default:
        title = "";
        break;
    }
    uni.setNavigationBarTitle({
      title: title
    });
  }

  setCenterTeamTitle(str: string) {
    const teamId = str
      .split("?")[1]
      .split("=")[1]
      .split("&")[0];
    TeamService.reviveTeamInfo(teamId, this.reviveTeamInfoCallback);
  }

  reviveTeamInfoCallback(success: boolean, teamResult: TeamResultResponse) {
    if (success) {
      uni.setNavigationBarTitle({
        title: teamResult.name + "战队"
      });
    }
  }
}
</script>

<style>
.content {
}
</style>
