<style lang="scss" scoped>
@import "CommentList.scss";
</style>
<template>
  <main class="comment-list" :style="{borderBottom: borderBottom }">
    <view class="header" @click="onAvatarClick">
      <view class="avatar-container" >
        <view class="avatar" :style="{paddingTop: avatarPaddingTop}">
          <van-image
              round
              width="60rpx"
              height="60rpx"
              :src="userInfo.avatar"
          />
        </view>
      </view>
      <view class="user-info">
        <view class="name" :style="{color: color, paddingTop: userInfoPaddingTop}">
          <view>{{ userInfo.realName }}</view>
          <view  v-for="(item, index) in userInfo.tagList.slice(0,2)"
                 :key="index">
           <van-tag color="#f19e38">
             {{item}}
           </van-tag>
          </view>
        </view>
        <view class="score">
          <van-rate
              :value="workCommentItemVO.star"
              size="10"
              color="#F19E38"
              void-icon="star"
              readonly
              void-color="#eee"
          />
          <span class="time"> {{ firstPeopleTime }}</span>
        </view>
      </view>
    </view>
    <view class="content"
          :style="{
      color: color,
      paddingTop: commentPaddingTop + 'rpx',
      paddingBottom: commentPaddingBottom + 'rpx'}">{{ workCommentItemVO.comment }}
    </view>
  </main>
</template>

<script lang="ts">
import { Vue,Component,Prop } from 'vue-property-decorator'
import WorkCommentItemVO from '@/beans/rate/simple/WorkCommentItemVO'
import SimpleUserInfoVO from '@/beans/rate/simple/SimpleUserInfoVO'
import { Utils } from '@/common/utils/Utils'
import ThemeEnum from '@/definition/common/ThemeEnum'

@Component({
  name: 'CommentList'
})

export default class CommentList extends Vue {
  @Prop({
    default: new WorkCommentItemVO()
  })
  workCommentItemVO: WorkCommentItemVO

  @Prop({default: ThemeEnum.DARK})
  theme: ThemeEnum

  @Prop({default: '0'})
  userInfoPaddingTop: string

  @Prop({default: '20rpx'})
  avatarPaddingTop: string

  @Prop({default: '0'})
  commentPaddingTop: string

  @Prop({default: '0'})
  commentPaddingBottom: string

  @Prop({default: true})
  isShowBorder: string

  get userInfo (): SimpleUserInfoVO {
    return this.workCommentItemVO.user
  }

  get borderBottom (): string {
    let borderBottom: string
    if (!this.isShowBorder) {
      borderBottom = '1rpx solid rgba(112, 112, 112,0.41);'
    } else {
      borderBottom = ''
    }
    return borderBottom
  }

  onAvatarClick () {
    this.$emit('on-avatar-click',this.workCommentItemVO.user)
  }

  get color (): string {
    let color: string
    switch (this.theme) {
      case ThemeEnum.DARK:
        color = 'rgba(255, 255, 255, 0.95)'
        break
      case ThemeEnum.LIGHT:
        color = '#5B5B5B'
        break
      default:
        color = 'rgba(255, 255, 255, 0.95)'
        break
    }
    return color
  }

  get firstPeopleTime () {
    return Utils.getAgoAt(this.workCommentItemVO.time)
  }
}

</script>
