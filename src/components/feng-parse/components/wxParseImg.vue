<template>
  <image
    mode="widthFix"
    :lazy-load="node.attr.lazyLoad"
    :class="node.classStr"
    :style="newStyleStr || node.styleStr"
    :data-src="node.attr.src"
    :src="node.attr.src"
    @tap="wxParseImgTap"
    @load="wxParseImgLoad"
  />
</template>

<script>
export default {
  name: "wxParseImg",
  data () {
    return {
      newStyleStr: "",
      preview: true,
    };
  },
  inject: ["parseWidth"],
  mounted () {
    console.log(this.node);
    this.node.attr["data-no-preview"] === "true" && (this.preview = false);
  },
  props: {
    node: {
      type: Object,
      default () {
        return {};
      },
    },
    style: {
      type: Object,
      default () {
        return {};
      },
    },
  },

  methods: {
    wxParseImgTap (e) {
      if (!this.preview) return;
      const { src } = e.currentTarget.dataset;
      if (!src) return;
      let parent = this.$parent;
      while (!parent.preview || typeof parent.preview !== "function") {
        parent = parent.$parent;
      }
      parent.preview(src, e);
    },
    // 图片视觉宽高计算函数区
    wxParseImgLoad (e) {
      const { src } = e.currentTarget.dataset;
      if (!src) return;
      let { width, height } = e.mp.detail;

      const recal = this.wxAutoImageCal(width, height);

      const { imageheight, imageWidth } = recal;
      if (!imageWidth) return;

      const attrs = this.node.attr || {};
      const { padding, mode } = attrs; //删除padding
      const { styleStr } = this.node;
      const imageHeightStyle =
        mode === "widthFix" ? "" : `height: ${imageheight}px;`;

      const paddingValue = Number(padding) || 0;
      const baseStyle = styleStr ? `${styleStr};` : "";
      this.newStyleStr = `${baseStyle} ${imageHeightStyle} width: ${imageWidth}px; padding: 0 ${paddingValue}px;`.trim(); //删除padding
    },
    // 计算视觉优先的图片宽高
    wxAutoImageCal (originalWidth, originalHeight) {
      // 获取图片的原始长宽
      let windowWidth = this.parseWidth.value;
      const results = {};

      if (originalWidth < 60 || originalHeight < 60) {
        const { src } = this.node.attr;
        let parent = this.$parent;

        while (!parent.preview || typeof parent.preview !== "function") {
          parent = parent.$parent;
        }
        parent.removeImageUrl(src);

        this.preview = false;
      }

      if (!windowWidth) {
        try {
          const systemInfo =
            typeof uni !== "undefined" && uni.getSystemInfoSync
              ? uni.getSystemInfoSync()
              : null;
          windowWidth = systemInfo && systemInfo.windowWidth ? systemInfo.windowWidth : 0;
        } catch (error) {
          windowWidth = 0;
        }
      }

      if (windowWidth && !this.parseWidth.value) {
        this.parseWidth.value = windowWidth;
      }

      let width = originalWidth;
      let height = originalHeight;
      if (this.node.attr.width) {
        const parsedWidth = Number(this.node.attr.width);
        width = Number.isNaN(parsedWidth) ? width : parsedWidth;
      }
      if (this.node.attr.height) {
        const parsedHeight = Number(this.node.attr.height);
        height = Number.isNaN(parsedHeight) ? height : parsedHeight;
      }

      // 判断按照那种方式进行缩放
      if (windowWidth && width > windowWidth) {
        // 在图片width大于手机屏幕width时候
        results.imageWidth = windowWidth;
        results.imageheight = windowWidth * (height / width);
      } else {
        // 否则展示原来的数据
        results.imageWidth = width;
        results.imageheight = height;
      }
      return results;
    },
  },
};
</script>
