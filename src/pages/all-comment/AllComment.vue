<style lang="scss" scoped>
@import "AllComment.scss";
</style>
<template>
  <main class="page">
    <view class="comment-container">
      <view class="expert-star">
        <star-rate
            :theme="themeEnum.LIGHT"
            :title-padding-bottom="40"
            :star-height-percent="'auto'"
            :star-margin-top="10"
            :title-font-size="lang.TITLE_FONT_SIZE"
            :rate-area-width="lang.ALL_COMMENT_RATE_AREA"
            :star-evaluation-v-o="starEvaluationVO"
            :is-show-border="true"
            :is-show-percent="true"
            :is-total-score-align-center="false"
        />
      </view>
      <view class="all-comment">
        <view class="title">
          <view class="text">{{ lang.EXPERT_RIGHT_TITLE }}</view>
        </view>
        <view class="comment-container">
          <comment-list
              v-for="(item, index) in commentList"
              v-if="item.comment!==''"
              :key="item.id"
              :theme="themeEnum.LIGHT"
              :is-show-border="(index + 1) === commentList.length"
              :comment-padding-top="20"
              :comment-padding-bottom="0"
              :avatar-padding-top="'30rpx'"
              :user-info-padding-top="'20rpx'"
              @on-avatar-click="onAvatarClick"
              :work-comment-item-v-o="item"/>
        </view>
      </view>
    </view>

      <div class="activity-bg" v-if="isExpertInfoShow">
        <div class="container">
          <div class="avatar-container" style="padding-top: 20rpx">
            <van-image
                round
                :src="modelUserInfo.avatar"
                width="160rpx"
                height="160rpx"
            />
          </div>
          <div class="close-icon" @click="isExpertInfoShow = false">
            <van-icon name="cross" />
          </div>
          <div class="info">
            <p style="font-size: 40rpx;font-weight: 800">{{modelUserInfo.realName}}</p>
          </div>
          <div class="tag">
            <div v-for="item in tagList" @click="onTagClick(item)">
              {{item}}
            </div>
          </div>
          <div class="intro">
            <p style="font-size: 30rpx;font-weight: 500">个人简介</p>
            <div class="detail">{{modelUserInfo.intro}}</div>
          </div>
        </div>
      </div>
  </main>
</template>

<script lang="ts">
// System
import { Vue,Component } from 'vue-property-decorator'

//Components
import StarRate from '@/components/rate/StarRate.vue'
import CommentList from '@/components/expert/CommentList.vue'
import StarEvaluationVO from '@/beans/rate/StarEvaluationVO'
import WorkCommentListVO from '@/beans/rate/WorkCommentListVO'
import RateService from '@/service/RateService'
import EntityTypeEnum from '@/definition/rate/EntityTypeEnum'
import ListRequest from '@/beans/activity/req/ListRequest'
import ThemeEnum from '@/definition/common/ThemeEnum'
import LangEnum from '@/definition/lang/LangEnum'
import WorkCommentItemVO from '@/beans/rate/simple/WorkCommentItemVO'
import SimpleUserInfoVO from '@/beans/rate/simple/SimpleUserInfoVO'

class OptionScene {
  productId: string = ''
}

@Component({
  name: 'AllComment',
  components: {
    StarRate,
    CommentList
  }
})

export default class AllComment extends Vue {

  lang = LangEnum
  themeEnum = ThemeEnum

  tagList: string[] = []

  productId: string = ''

  isExpertInfoShow: boolean = false

  modelUserInfo: SimpleUserInfoVO = new SimpleUserInfoVO()

  starEvaluationVO: StarEvaluationVO = new StarEvaluationVO()
  workCommentListVO: WorkCommentListVO = new WorkCommentListVO()

  onLoad (option: OptionScene) {
    this.productId = option.productId
    this.fetchStarEvaluation()
    this.fetchCommentList()
  }

  onTagClick (item: string) {
    if (item === '...') {
      this.tagList = this.modelUserInfo.tagList
    }
  }

  getTagList () {
    let tags: string[] = []
    if (this.modelUserInfo.tagList.length > 2) {
      this.modelUserInfo.tagList.map(item => {
        tags.push(item)
      })
      tags.pop()
      tags.push('...')
      return tags
    }else {
      tags = this.modelUserInfo.tagList
      return tags
    }
  }

  onAvatarClick (simpleUserInfoVO: SimpleUserInfoVO) {
    this.modelUserInfo = simpleUserInfoVO
    this.tagList = this.getTagList()
    this.isExpertInfoShow = true
  }

  get commentList (): Array<WorkCommentItemVO> {
    return this.workCommentListVO.records
  }

  fetchStarEvaluation () {
    const rateService = new RateService()
    const entityType = EntityTypeEnum.PERSONAL_WORKS
    rateService.receiveStarSystemEvaluation(entityType,this.productId,this.receiveStarSystemEvaluationCallback)
  }

  onPullDownRefresh () {
    let that = this
    setTimeout(function() {
      that.fetchStarEvaluation()
      that.fetchCommentList()
      uni.stopPullDownRefresh()
    }, 1000)
  }

  receiveStarSystemEvaluationCallback (success: boolean,result: StarEvaluationVO) {
    if (success) this.starEvaluationVO = result
  }

  fetchCommentList () {
    const rateService = new RateService()
    const entityType = EntityTypeEnum.PERSONAL_WORKS
    const listDTO = new ListRequest()
    listDTO.pageNo = 1
    listDTO.pageSize = 100
    rateService.receiveCommentList(entityType,this.productId,listDTO,this.fetchCommitListCallback)
  }

  fetchCommitListCallback (success: boolean,result: WorkCommentListVO) {
    if (success) this.workCommentListVO = result
  }

}

</script>
