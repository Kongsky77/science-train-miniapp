<template>
  <!-- 这个模板用来解决原生video总是浮在最上层的问题，使用view替换video，播放是再替换回，监听一个事件，用来被遮盖时做替换video -->
  <!--增加video标签支持，并循环添加-->
  <view>
    <video
      :autoplay="false"
      :class="node.classStr"
      :style="node.styleStr"
      class="video-video"
      :src="node.attr.src"
      :custom-cache="false"
    ></video>
  </view>
</template>

<script>
export default {
  name: "wxParseVideo",
  props: {
    node: {},
  },
  data() {
    return {
      videoStyle: "width: 100%;",
    };
  },
  methods: {},
  mounted() {
    //捕获侧滑菜单的遮盖行为，隐藏video
    uni.$on("slideMenuShow", (e) => {
      console.log("捕获事件：" + e);
      if (e == "show" && this.playState) {
        //正在播放则停止
        this.playState = false;
      }
    });
  },
};
</script>
<style>
.video-video {
  background: #000000;
}
</style>
