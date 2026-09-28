<template>
  <web-view :src="url"></web-view>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ActivityService from "@/service/ActivityService";

@Component({
  name: "cert"
})
export default class OfficialCert extends Vue {
  url = "";
  activityService = new ActivityService();

  onLoad(options: any) {
    const certId = options.id;

    this.getCertInfo(certId);
  }

  getCertInfo(certId: string) {
    this.activityService.getCertInfo(certId).then(res => {
      if (res.success && res.data) {
        let data = res.data;
        const src = encodeURIComponent(data.certSrc);
        this.url = `${process.env.VUE_APP_CARMELA_APP_URL}/official-cert-share?id=${data.id}&src=${src}`;
        // this.url =
        //   "http://192.168.2.156:8080/official-cert-share?id=239694929854533&src=https%3A%2F%2Fcontentdevsa-blob.ai121.net%2Ftestcontainer%2Factivity%2Fcert%2F182814111633477%2F2%2F239694929854533.jpg";
      }
    });
  }
}
</script>
