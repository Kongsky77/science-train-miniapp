<template>
    <main @click="onClickSwiperCard"
          :style="{
      width: '88%',
      height: currentHeight,
      background: backgroundUrl,
      backgroundPosition: 'center center',
      backgroundSize: 'cover'}"
          class="swiper-item-container">
      <div class="card-content" v-if="height >= 500">
        <div class="card-tip-row">
          <div class="card-tip">
            {{ currentMode }}
            <image
                class="card-tip-icon"
                mode="widthFix"
                src="https://contentdevsa-blob.ai121.net/testcontainer/activity/image/b5d3d72b-8bdd-40ce-b752-11e493db8367.svg"
            ></image>
          </div>
        </div>

        <div class="card-footer">
          <div class="card-footer-left">
            <div class="card-title">{{ swiperItem.title }}</div>
            <div class="card-text">{{ swiperItem.slogan }}</div>
          </div>
        </div>
      </div>
      <div class="card-content small-card" v-else>
        <div class="card-footer">
          <div class="card-footer-left">
            <div class="card-title">
              <view class="card-mode">
                {{ currentMode }}
                <image
                    class="card-mode-img"
                    mode="widthFix"
                    src="https://contentdevsa-blob.ai121.net/testcontainer/activity/image/b5d3d72b-8bdd-40ce-b752-11e493db8367.svg"
                ></image>
              </view>
              <view class="title">
                {{ swiperItem.title }}
              </view>
            </div>
          </div>
        </div>
      </div>
    </main>

</template>

<script lang="ts">
import { Vue,Component,Prop } from 'vue-property-decorator'
import SwiperVO from '@/beans/activity/res/SwiperVO'
import SwiperModeEnum from '@/definition/common/SwiperModeEnum'

@Component({
  name: 'ActivitySwiperItem'
})

export default class ActivitySwiperItem extends Vue {
  @Prop()
  swiperItem: SwiperVO
  @Prop()
  height: number

  get currentMode () {
    return this.swiperItem.mode === SwiperModeEnum.ONLINE ? '线上活动' : '线下活动'
  }

  get currentHeight () {
    return `${this.height}rpx`
  }

  get backgroundUrl () {
    return `linear-gradient(360deg, #222222c7 0%, rgba(84, 84, 84, 0.1) 50%),url("${this.swiperItem.img}") no-repeat`
  }

  onClickSwiperCard () {
    this.$emit('on-click-swiper-card',this.swiperItem)
  }

}

</script>

<style lang="scss" scoped>

.swiper-item-container {
  box-sizing: border-box;
  padding: 20rpx;
  border-radius: 30rpx;
  color: #fff;
  position: relative;
  margin: 0 auto;
  .card-tip-row {
    margin-left: 20rpx;
    display: flex;
    justify-content: flex-start;
  }

  .card-tip {
    margin-bottom: 10rpx;
    background: #ffffff;
    color: #3B3B3B;
    border-radius: 10px;
    font-size: 24rpx;
    padding: 10rpx 20rpx;
    display: flex;
  }

  .card-tip-icon {
    width: 15rpx;
    height: 15rpx;
    margin-left: 10rpx;
    margin-top: 7rpx;
  }

  .card-footer {
    margin-left: 20rpx;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }

  .card-footer-left {
    flex: 1;
    overflow: hidden;
  }

  .card-title {
    margin-bottom: 10rpx;
    font-size: 40rpx;
    width: 95%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .card-text {
    margin-bottom: 30rpx;
    width: 95%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .card-mode {
    flex-shrink: 0;
    background: #ffffff;
    color: #3B3B3B;;
    border-radius: 10px;
    font-size: 24rpx;
    display: inline-block;
    margin-right: 20rpx;
    padding: 10rpx 20rpx;
  }
  .card-mode-img {
    width: 15rpx;
    height: 15rpx;
    margin-left: 10rpx;
    margin-top: 7rpx;
  }
}

.card-content {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 20px;
  font-size: 30rpx;
  box-sizing: border-box;
}

.small-card {
  .card-title {
    width: 100%;
    display: flex;
    margin-bottom: 30rpx;
    .title {
      width: 60%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
