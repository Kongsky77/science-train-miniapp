<template>
  <div class="title-bar">
    <div class="title" :style="{fontWeight: isLeftFontBold ? 'bold' : 'normal',fontSize: leftFontSize,color: leftFontColor}">
      {{ title }}
      <text class="slogan">{{ slogan }}</text>
    </div>
    <div class="right-title" :style="{paddingTop: rightFontPaddingTop}" v-if="rightTitle !== ''" @click="onClick">
      {{ rightTitle }}
      <image v-if="isShowArrow" class="arrow-icon" src="https://contentdevsa-blob.ai121.net/testcontainer/activity/image/6ae649f8-371f-4c73-b11b-8a6d5897e35c.svg"/>
    </div>
  </div>
</template>
<script lang="ts">
import { Component,Vue,Prop } from 'vue-property-decorator'

@Component({
  name: 'TitleBar',
})
export default class TitleBar extends Vue {
  @Prop({
    default: '',
  })
  title: string
  @Prop({
    default: '',
  })
  slogan: string
  @Prop({
    default: true
  })
  isLeftFontBold: boolean

  @Prop({
    default: '34rpx'
  })
  leftFontSize: string

  @Prop({
    default: '#00000'
  })
  leftFontColor: string

  @Prop({
    default: '',
  })
  rightTitle: string

  @Prop({
    default: '12rpx'
  })
  rightFontPaddingTop: string

  @Prop({
    default: true
  })
  isShowArrow: boolean

  onClick () {
    this.$emit('click')
  }
}
</script>
<style lang="scss" scoped>
.title-bar {
  width: 88%;
  margin: 0 auto;
  display: flex;
  flex-direction:row;
  justify-content: space-between;
  .title {
    font-size: 34rpx;
    font-weight: bold;
    font-family: PingFang SC;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    .slogan {
      width: 60%;
      margin-left: 20rpx;
      color: #939393;
      font-weight: 500;
      padding-top: 5rpx;
      font-size: 24rpx;
    }
  }
  .right-title {
    color: #939393;
    font-size: 24rpx;
    padding-top: 12rpx;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    .arrow-icon {
      margin-left: 5rpx;
      width: 20rpx;
      height: 20rpx;
    }
  }
}
</style>
