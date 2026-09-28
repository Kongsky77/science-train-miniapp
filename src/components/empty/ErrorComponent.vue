<template>
  <view class="content">
    <view class="img-box">
      <image class="img" src="@/static/empty-image-error.png"></image>
    </view>
    <view class="txt">{{ text }}</view>
  </view>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

/**
 * 空白页 - 错误/失败
 */
@Component({
  name: 'NetworkErrorComponent'
})
export default class NetworkErrorComponent extends Vue {

  @Prop()
  text: string = ''

}
</script>

<style>
.img-box {
  display: flex;
  justify-content: center;
  align-items: center;
}
.img {
  width: 160px;
  height: 160px;
}
.txt {
  text-align: center;
  color: #969799;
  font-size: 14px;
  margin-top: 16px;
  line-height: 20px;
}
</style>
