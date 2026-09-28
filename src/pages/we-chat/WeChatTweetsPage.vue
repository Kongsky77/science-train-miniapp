<template>
  <web-view :src="url"></web-view>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  name: "WeChatTweetsPage",
  components: {}
})
export default class WeChatTweetsPage extends Vue {
  url: string = "";
  onLoad(options) {
    if (options.weChatTweetsUrl) {
      this.url = decodeURIComponent(options.weChatTweetsUrl);
    }
  }
}
</script>

<style scoped>
</style>
