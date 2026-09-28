<style lang="scss" scoped>
@import "ImgPreviewOrSelect.scss";
</style>
<template>
  <main class="container">
    <view class="title">
      {{ currentIndex }}/{{ imgLength }}
      <span class="choose-img-btn" v-if="isChooseModel" @click="moveToSharePage">选择图片</span>
    </view>
    <swiper
        :autoplay="false"
        :interval="3000"
        style="height: 90%"
        class="swiper"
        @change="onImgChange"
        indicator-active-color="#ffffff"
    >
      <view v-for="(swiperItem, index) of productList" :key="index">
        <swiper-item :item-id="swiperItem.id" class="swiper-item-box">
          <image mode="widthFix" :src="swiperItem.url"></image>
        </swiper-item>
      </view>
    </swiper>
  </main>
</template>

<script lang="ts">
import { Component,Vue } from 'vue-property-decorator'
import ImgComponentModelEnum from '@/definition/common/ImgComponentModelEnum'
import WorkFileVO from '@/beans/rate/simple/WorkFileVO'
import RateService from '@/service/RateService'
import WorkContentVO from '@/beans/rate/WorkContentVO'
import PageLinkEnum from '@/definition/lang/PageLinkEnum'
import ShareWorkModelEnum from '@/definition/common/ShareWorkModelEnum'

class OptionScene {
  productId: string = ''
  activityId: string = ''
  childrenId: string = ''
  shareWorkModel: string = ''
  imgComponentModel: string = ''
}

@Component({
  name: 'ImgPreviewOrSelect'
})
export default class ImgPreviewOrSelect extends Vue {

  imgComponentModel: ImgComponentModelEnum = ImgComponentModelEnum.PREVIEW

  productList: Array<WorkFileVO> = []

  currentIndex: number = 1

  currentFileId: string = ''

  productId: string = ''

  activityId: string = ''

  childrenId: string = ''

  shareWorkModel: ShareWorkModelEnum  = ShareWorkModelEnum.WORK

  onLoad (option: OptionScene) {
    this.productId = option.productId
    this.activityId = option.activityId
    this.childrenId = option.childrenId
    if (option.shareWorkModel) {
      this.shareWorkModel = Number(option.shareWorkModel)
    }

    this.imgComponentModel = Number(option.imgComponentModel)
    this.fetchMyWorkDetail()
  }

  onPullDownRefresh () {
    let that = this
    setTimeout(function() {
      that.fetchMyWorkDetail()
      uni.stopPullDownRefresh()
    }, 1000);
  }

  fetchMyWorkDetail () {
    const rateService = new RateService()
    rateService.receiveWorkDetail(this.productId,this.receiveWorkDetailCallback)
  }

  receiveWorkDetailCallback (success: boolean,result: WorkContentVO) {
    if (success) {
      this.productList = result.files
      this.currentFileId = result.files[0].id
    }
  }

  get imgLength (): number {
    return this.productList.length
  }

  get isChooseModel (): boolean {
    let isChooseModel: boolean
    switch (this.imgComponentModel) {
      case ImgComponentModelEnum.PREVIEW:
        isChooseModel = false
        break
      case ImgComponentModelEnum.SELECT:
        isChooseModel = true
        break
      default:
        isChooseModel = false
        break
    }
    return isChooseModel
  }

  get currentFileUrl (): string {
    let currentFile: WorkFileVO
    if (this.productList.length > 0 && this.currentFileId !== '') {
        currentFile = this.productList.find(item => {
          return item.id === this.currentFileId
        })
      return currentFile.url
    } else {
      return ''
    }
  }

  onImgChange (event: any) {
    this.currentFileId = event.detail.currentItemId
    this.currentIndex = event.detail.current + 1
  }

  moveToSharePage () {
      uni.navigateTo({
        url: `${PageLinkEnum.SHARE_WORK}?childrenId=${this.childrenId}&shareWorkModel=${this.shareWorkModel}&productId=${this.productId}&activityId=${this.activityId}&currentFileUrl=${this.currentFileUrl}`
      })
  }
}

</script>
