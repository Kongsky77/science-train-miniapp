<template>
  <view class="content" @longpress="saveImg()">
    <image
      class="content-img"
      mode="widthFix"
      :src="childReportUrl"
    >
    </image>
    <view class="content-text">温馨提示：长按图片自动保存</view>
  </view>
</template>

<script lang="ts">
import { log } from "console";
import { Component, Vue } from "vue-property-decorator";
import ActivityService from "@/service/ActivityService";
import ActivityFullItem from "@/beans/activity/ActivityFullItem";

@Component({
  name: "webview"
})
export default class Webview extends Vue {
  activityService = new ActivityService();
  activityDetail = new ActivityFullItem();
  childId = ''

  onLoad(options: any) {
    if (options.activityId) {
      const activityId = options.activityId;
      this.getBasicInfo(activityId);
    }
    if (options.childId) {
      this.childId = options.childId;
    }
  }
  getBasicInfo(id: string) {
    this.activityService.getDetail(id).then(res => {
      if (res.success && res.data) {
        const data = res.data;
        this.activityDetail = res.data;
      }
    });
  }
  // 保存图片
  saveImg(w) {
    console.log(w);
    uni.downloadFile({
      //下载图片
      url: this.childReportUrl,
      success: res => {
        console.log("你好啊，下载了图片哦", res.tempFilePath);
        uni.saveImageToPhotosAlbum({
          //将图片保存在手机
          filePath: res.tempFilePath, //保存的位置
          success: res => {
            uni.showToast({
              title: "保存成功",
              duration: 2000,
              icon: "success"
            });
            console.log(res);
            console.log("长按保存图片，毁掉啦，", res);
          },
          fail() {
            uni.showToast({
              title: "保存失败，请稍后重试",
              duration: 2000,
              icon: "none"
            });
          }
        });
      }
    });
  }

  get childReportUrl(){
    return this.activityDetail.userReportUrl+'/'+this.childId+'.png'
  }
}
</script>

<style>
.content {
  position: relative;
  width: 100%;
  height: 100%;
}
.content-img {
  /* position: absolute;
  left: 50%;
  transform: translate(-50%, 0); */
  width: 100%;
}
.content-text {
  /* position: absolute;
  left: 50%;
  transform: translate(-50%, 0); */
  text-align: center;
  width: 100%;
  color: #888888;
  font-size: 24rpx;
  text-align: center;
  margin-top: 20rpx;
  margin-bottom: 40rpx;
}
</style>