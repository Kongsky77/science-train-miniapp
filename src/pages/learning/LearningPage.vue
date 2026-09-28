<style lang="scss" scoped>
</style>
<template>
  <web-view :src="url"></web-view>
</template>

<script lang="ts">
import ActivityFullItem from "@/beans/activity/ActivityFullItem";
import ActivityService from "@/service/ActivityService";
import UserService from "@/service/UserService";
import { Component, Vue } from "vue-property-decorator";

@Component({
  name: "LearningPage"
})
export default class LearningPage extends Vue {
  url: string = "";

  onLoad(options: any) {
    console.log("options.guideStudyUrl",options.guideStudyUrl);
    
    if (options.activityId && options.childId) {
      let subUsertoken: string = "";
      let activityDetail: ActivityFullItem = new ActivityFullItem();

      let BASEAPI = decodeURIComponent(options.guideStudyUrl);
    
      const activityService = new ActivityService();
      const userService = new UserService();

      userService.subUserLogin(options.childId).then(res => {
        const { success, data, errorDesc } = res;
        if (success && data) {
          subUsertoken = data.accessToken;
          this.url = `https://${BASEAPI}/transit-page.html?activityId=${activityDetail.id}&contentId=${activityDetail.contentId}&subUsertoken=${subUsertoken}`;
        }
      });

      activityService.getDetail(options.activityId).then(res => {
        if (res.success && res.data) {
          activityDetail = res.data;
          this.url = `https://${BASEAPI}/transit-page.html?activityId=${activityDetail.id}&contentId=${activityDetail.contentId}&subUsertoken=${subUsertoken}`;
        }
      });
    }
  }
}
</script>