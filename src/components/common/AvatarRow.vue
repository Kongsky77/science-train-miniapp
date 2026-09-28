<template>
  <div class="avatar-row">
    <image
      v-for="(avatar, index) of avatars"
      :key="index"
      class="avators"
      :style="{width: width + 'rpx',height: height + 'rpx' }"
      :src="avatar"
    />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  name: 'AvatarRow',
  components: {}
})
export default class AvatarRow extends Vue {
  @Prop()
  avatars: Array<string> = []
  @Prop({
    default: 80
  })
  width: number
  @Prop({
    default: 80
  })
  height: number
}
</script>
<style scoped>
.avators {
  width: 70rpx;
  height: 70rpx;
  border-radius: 50%;
  margin-left: -50rpx;
}

.avators:first-child {
  /* margin-left: 0; */
}
</style>
