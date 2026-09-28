<style lang="scss" scoped>
@import "StarRate.scss";
</style>

<template>
  <main class="star-rate-container">
    <view class="star-rate-box">
      <view class="title" :style="{paddingBottom: `${titlePaddingBottom}rpx`}">
        <view class="text" :style="{color: color,fontSize: titleFontSize}">{{ lang.EXPERT_SCORE }}</view>
        <view class="more-btn" v-if="isMoreBtnShow && starEvaluationVO.rateVal !== '0.0'">
          <image class="more" :src="staticFileEnum.MORE_KNOWLEDGE_ICON" @click="onMoreClick"/>
        </view>
      </view>
      <view class="rate" :style="{width: rateAreaWidth}">
        <view class="total-score" :style="{alignItems: isTotalScoreAlignCenter ? 'center' : 'flex-start'}">
          <view class="text" :style="{color: color,fontSize: starEvaluationVO.rateVal === '0.0' ? '40rpx' : '76rpx'}">{{ starEvaluationVO.rateVal === '0.0' ? lang.NO_RATE_TEXT : starEvaluationVO.rateVal }}</view>
          <view class="star" :style="{marginTop: `${starMarginTop}rpx`}">
           <view>
             <van-rate
                 :value="starEvaluationVO.rateStar"
                 size="10"
                 color="#F19E38"
                 void-icon="star"
                 readonly
                 :void-color="starEvaluationVO.rateVal === '0.0' ? '#F19E38' : '#eee'"
                 bind:change="onChange"
             />
           </view>
          </view>
        </view>
        <view class="five-star-evaluation" :style="{height: starHeightPercent}">
          <view>
            <view>
              <van-rate
                  size="10"
                  color="#9A9A9A"
                  void-icon="star"
                  count="5"
                  :gutter="0"
                  readonly
                  void-color="#9A9A9A"
              />
            </view>
            <view class="progress-box">
              <view class="progress-out" :style="{background: processBackgroundColor}">
                <view
                    :style="{
                     width: `${starEvaluationVO.starFiveRatio}%`
              }"
                    class="progress-bar"
                ></view>
              </view>
            </view>

            <view class="percent" v-if="isShowPercent">{{starEvaluationVO.starFiveRatio + '%'}}</view>
          </view>
          <view>
            <view>
              <van-rate
                  size="10"
                  color="#9A9A9A"
                  void-icon="star"
                  count="4"
                  readonly
                  void-color="#9A9A9A"
              />
            </view>
            <view class="progress-box">
              <view class="progress-out" :style="{background: processBackgroundColor}">
                <view
                    :style="{
                     width: `${starEvaluationVO.starFourRatio}%`
              }"
                    class="progress-bar"
                ></view>
              </view>
            </view>
            <view class="percent" v-if="isShowPercent">{{starEvaluationVO.starFourRatio + '%'}}</view>
          </view>
          <view>
            <view>
              <van-rate
                  size="10"
                  color="#9A9A9A"
                  void-icon="star"
                  count="3"
                  readonly
                  void-color="#9A9A9A"
              />
            </view>
            <view class="progress-box">
              <view class="progress-out" :style="{background: processBackgroundColor}">
                <view
                    :style="{
                     width: `${starEvaluationVO.starThreeRatio}%`
              }"
                    class="progress-bar"
                ></view>
              </view>
            </view>
            <view class="percent" v-if="isShowPercent">{{starEvaluationVO.starThreeRatio + '%'}}</view>
          </view>
          <view>
            <view>
              <van-rate
                  size="10"
                  color="#9A9A9A"
                  void-icon="star"
                  count="2"
                  readonly
                  void-color="#9A9A9A"
              />
            </view>
            <view class="progress-box">
              <view class="progress-out" :style="{background: processBackgroundColor}">
                <view
                    :style="{
                     width: `${starEvaluationVO.starTwoRatio}%`
              }"
                    class="progress-bar"
                ></view>
              </view>
            </view>
            <view class="percent" v-if="isShowPercent">{{starEvaluationVO.starTwoRatio + '%'}}</view>
          </view>
          <view>
            <view>
              <van-rate
                  size="10"
                  color="#9A9A9A"
                  void-icon="star"
                  count="1"
                  readonly
                  void-color="#9A9A9A"
              />
            </view>
            <view class="progress-box">
              <view class="progress-out" :style="{background: processBackgroundColor}">
                <view
                    :style="{
                     width: `${starEvaluationVO.starOneRatio}%`
              }"
                    class="progress-bar"
                ></view>
              </view>
            </view>
            <view class="percent" v-if="isShowPercent">{{starEvaluationVO.starOneRatio + '%'}}</view>
          </view>
        </view>
      </view>
    </view>
  </main>
</template>

<script lang="ts">
import { Component,Prop,Vue } from 'vue-property-decorator'
import StaticFileEnum from '@/definition/lang/StaticFileEnum'
import StarEvaluationVO from '@/beans/rate/StarEvaluationVO'
import LangEnum from '@/definition/lang/LangEnum'
import ThemeEnum from '@/definition/common/ThemeEnum'

@Component({
  name: 'StarRate'
})

export default class StarRate extends Vue {
  lang = LangEnum
  staticFileEnum = StaticFileEnum

  @Prop({default: ThemeEnum.DARK})
  theme: ThemeEnum

  @Prop({default: '22rpx'})
  titleFontSize: string

  @Prop({default: 0})
  starMarginTop: number

  @Prop({default: ''})
  starHeightPercent: string

  @Prop({default: false})
  isShowBorder: boolean

  @Prop({default: true})
  isTotalScoreAlignCenter: boolean

  @Prop({default: false})
  isMoreBtnShow: boolean

  @Prop({default: '85%'})
  rateAreaWidth: string

  @Prop({default: 0})
  titlePaddingBottom: number

  @Prop({default: new StarEvaluationVO()})
  starEvaluationVO: StarEvaluationVO

  @Prop({default: false})
  isShowPercent: boolean

  get color (): string {
    let color: string
    switch (this.theme) {
      case ThemeEnum.DARK:
        color = '#ffffff'
        break
      case ThemeEnum.LIGHT:
        color = '#5B5B5B'
        break
      default:
        color = '#ffffff'
        break
    }
    return color
  }

  get processBackgroundColor (): string {
    let backgroundColor: string
    switch (this.theme) {
      case ThemeEnum.LIGHT:
        backgroundColor = '#EDEBEC'
        break
      case ThemeEnum.DARK:
        backgroundColor = '#404040'
        break
      default:
        backgroundColor = '#404040'
        break
    }
    return backgroundColor
  }

  get borderBottom () {
    let borderBottom: string
    if (this.isShowBorder) {
      borderBottom = '1rpx solid rgba(112, 112, 112,0.41)'
    } else {
      borderBottom = ''
    }
    return borderBottom
  }

  onMoreClick () {
    this.$emit('click')
  }
}

</script>
