<template>
  <view class="page">
    <image class="logo" mode="widthFix" src="@/static/icon/logo.svg"></image>
    <span class="title">平台介绍</span>
    <view class="rich-box">
      <rich-text :nodes="strings"></rich-text>
    </view>
  </view>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  name: "AboutUs",
  components: {},
})
export default class AboutUs extends Vue {
  strings = `&emsp;&emsp;Ai121课外活动平台包含了趣味丰富的科技创新、人文艺术主题的跨学科项目课程和科普活动，通过“内容+学习+数据”的三核驱动助力认知研究、学习兴趣激发、自主学习能力引导和高阶思维提升，目前开发有“少年AI”、“少年Steam”、“少年优德”系列素质课程。`;
}
</script>
<style>
.page {
  align-items: center;
  background: #fff;
  color: #979797;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: flex-start;
  width: 100%;
}
</style>
<style scoped>
.rich-box {
  font-size: 35rpx;
  line-height: 60rpx;
  padding: 20rpx;
}
.logo {
  margin-bottom: 45rpx;
  margin-top: 45rpx;
  width: 20%;
}
.title {
  font-size: 45rpx;
  margin-bottom: 4rpx;
}
</style>