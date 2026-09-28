<template>
    <view class="page">
        <view class="tab-content-box">
            <view class="rich-box">
              <!-- <rich-text :nodes="copy.content"></rich-text> -->
              <u-parse :content="content" @navigate="navigate"></u-parse>
            </view>
          </view>
    </view>
</template>

<script lang="ts">
import { Component, Vue,Prop } from "vue-property-decorator";
import uParse from "@/components/feng-parse/parse.vue";

@Component({
  name: "RankRules",
  components: {
      uParse
  },
})
export default class RankRule extends Vue{
@Prop()
content:string = ''

onLoad(options: any){
    this.content =decodeURIComponent(options.content)
    // this.content = options.content
    console.log('这里打印穿过来的content',typeof this.content,this.content);
}

mounted(){
    uni.$on('toRank',function(data){
        console.log('这里测试data',data);
        
    })
}

// 富文本渲染
  navigate(src) {
    const url = encodeURIComponent(src);
    console.log("跳转链接");
    console.log(url);
    uni.navigateTo({
      url: `/pages/webview/index?url=${url}`,
    });
  }
}
</script>
<style >
.page {
  background: #fff;
  height: 100%;
}
</style>
<style scoped lang="scss">
.tab-content-box {
  min-height: 500rpx;
  padding: 20rpx;
  font-size: 30rpx;
}

.rich-box {
  padding: 20rpx;
  // width: 100%;
  box-sizing: border-box;
  // height: 500rpx;
}
</style>