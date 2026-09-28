<style lang="scss" scoped>
@import "./RankPost.scss";
</style>
<template>
  <view id="share-post">
    <!-- <view id="generated-img" v-if="generatedUrl"> -->
    <view class="close-box">
      <icon type="cancel" size="26" color="#fff" class="close-icon" />
    </view>
    <image
      class="generated-img"
      mode="aspectFill"
      :src="generatedUrl"
      v-if="true"
      :style="`height: ${generatedImageHeight}px`"
      @click.stop="copyImage"
    ></image>
    <!-- </view> -->
    <view id="post-image-box" v-if="true" :class="{ blur: !generateDone }">
      <view class="post-title">——— AI环保少年 ———</view>
      <image class="post-avatar" mode="aspectFill" :src="user.avatar"></image>
      <view class="post-name">{{ user.teamName }}小队</view>
      <view class="post-team">{{ user.schoolName }}</view>
      <view class="rank-row">
        <view class="rank-item">
          <view class="rank-title">当前得分排名</view>
          <view class="rank-text">{{ user.modelRankPosition || "-" }}</view>
        </view>
        <view class="rank-item">
          <view class="rank-title">当前热度排名</view>
          <view class="rank-text">{{ user.hotRankPosition || "-" }}</view>
        </view>
      </view>
      <view>
        <image class="logos-img" mode="widthFix" src="../../static/rank/logos.png"></image>
      </view>
      <!-- <image
        class="share-text-img"
        mode="widthFix"
        src="../../static/rank/share-text.png"
      ></image> -->
      <view class="qrcode-box">
        <image
          class="qrcode-image"
          mode="aspectFill"
          :src="qrCodeImageUrl"
        ></image>
      </view>
      <view class="post-bar"> 长按识别二维码，为我打Call吧! </view>
      <!-- <image
        class="post-image"
        mode="aspectFill"
        src="../../static/share/c3uhsgo1vx541.jpg"
      ></image> -->
    </view>
    <view class="post-btn-box" :class="{ blur: !generateDone }">
      <view class="share-post-btn">
        <image
          class="share-post-icon"
          mode="aspectFill"
          src="https://contentdevsa-blob.ai121.net/testcontainer/activity/image/c96ff4cd-2054-466a-baa8-b66febde0e27.png"
        ></image>
        {{ btnText }}</view
      >
      <view class="share-text">保存图片并分享到朋友圈，让好友为你打call</view>
    </view>
  </view>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import weapon from '@/common/utils/weapon'
import QRCode from 'qrcode'

@Component({
  name: 'RankPost',
  components: {
    RankPost
  }
})
export default class RankPost extends Vue {
  @Prop() user: any
  showMask = false
  generatedUrl = ''
  generatedImageHeight = 0
  qrCodeImageUrl = ''
  generatedImageDone = false
  btnText = '请长按图片保存'
  generateDone = false

  mounted () {
    console.log(this.user)
    uni.showLoading({
      title: '正在生成海报',
      mask: true
    })
    QRCode.toDataURL(this.user.shareUrl)
      .then(url => {
        console.log(url)
        this.qrCodeImageUrl = url
        setTimeout(() => {
          this.savePost()
        }, 1000)
      })
      .catch(err => {
        console.error(err)
      })
  }

  toggleMask () {
    this.showMask = !this.showMask
  }

  savePost () {
    console.log('开始生成图片')
    const boxHeright = document.getElementById('post-image-box').clientHeight
    this.generatedImageHeight = boxHeright
    weapon.generateImageUrl('#post-image-box').then(generatedUrl => {
      this.generatedUrl = generatedUrl
      console.log('生成海报图片成功')
      setTimeout(() => {
        console.log('隐藏loading')
        uni.hideLoading()
        this.generatedImageDone = true
        this.generateDone = true
      }, 1000)
    })
    .catch(err => {
      console.log('生成海报失败')
      console.log(err)
    })
  }

  copyImage () {}
}
</script>
