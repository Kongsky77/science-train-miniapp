<template>
  <view class="page">
    <scroll-view :scroll-y="true" class="list">
      <view
          v-for="user of list"
          :key="user.id"
          class="item"
          @click="toggleChild(user)"
      >
        <image :src="user.avatar" class="avatar"></image>
        <view class="info">
          <view class="name">{{ user.name }}</view>
          <view class="school">{{ user.school }}</view>
        </view>
        <view
            v-if="isAble(user)"
            :class="{ active: user.active }"
            class="radio-item"
        >
          <van-icon color="#fff" name="success"/>
        </view>
        <!--不在活动范围-->
        <view
            v-if="
            (!user.inActivityRange || !user.inActivityAgeRange) && !user.isEntry
          "
            class="radio-item disable"
        >
          <van-icon color="#fff" name="cross"/>
        </view>

        <!--不在已经报名范围-->
        <view v-if="user.isEntry" class="entry-ok"> 已报名</view>
        <!-- <view class="radio-item joined" v-if="user.isEntry && user.team">
          <van-icon name="success" color="#fff" />
        </view> -->
      </view>
      <view class="item" @click="onAddChild">
        <view class="add-user-item-box">
          <view class="add-user-item">
            <van-icon name="plus"/>
          </view>
        </view>
        <view class="info">
          <view class="school"> 添加用户</view>
        </view>
      </view>
    </scroll-view>
    <van-empty v-if="!list.length" description="还未添加子账号哦"/>
    <view class="action-btn-row">
      <van-button block type="default" @click="onEnterClick">确定</van-button>
    </view>
    <van-toast id="van-toast"/>

    <view class="model-box">
      <view class="container" v-if="isModelShow">
        <view class="box">
          <view class="close-icon" @click="onClickCloseIcon">
            <van-icon name="cross" size="40rpx"/>
          </view>
          <view class="title">参赛协议与原创说明</view>
          <view class="protocol">{{ lang.ACTIVITY_DETAIL_NOTICE }}</view>
          <view class="read-btn" @click="onReadNotice">我同意该协议</view>
        </view>
      </view>
    </view>
  </view>
</template>
<script lang="ts">
import { Component,Vue,Prop,Watch } from 'vue-property-decorator'
import ChildrenService from '@/service/ChildrenService'
import LoginManagement from '@/management/login/LoginManagement'
import ActivityService from '@/service/ActivityService'
import SubmitActivityFormRequest from '@/beans/activity/req/SubmitActivityFormRequest'
import ShowMsgEnum from '@/definition/lang/ShowMsgEnum'
import LangEnum from '@/definition/lang/LangEnum'

class Child {
  id = ''
  avatar = ''
  name = ''
  school = ''
  inActivityRange = false
  inActivityAgeRange = false
  isEntry = false
  active?: boolean = false
  team?: Object
}

class ChildIsRead {
  id: string = ''
  isRead: boolean = false
}

@Component({
  name: 'ChildrenInfo',
  components: {},
})
export default class ChildrenInfo extends Vue {
  @Prop({
    default: '',
  })
  activityId!: string
  @Prop({
    default: false
  })
  isRefresh: boolean
  @Prop({
    default: false
  })
  teamEnabled: boolean
  @Prop({
    default: false
  })
  isRead: boolean
  childrenService = new ChildrenService()
  activityService = new ActivityService()
  list: Array<Child> = []
  activeChildId: string = ''
  isModelShow: boolean = false
  clickCount: number = 0
  activeChild: Child = new Child()
  lang = LangEnum
  currentChildStates: ChildIsRead[] = []

  // infoForms: Array<FormResponse> = [];
  enrollInfoLength: number = 0

  @Watch('isRefresh')
  onActivityDetailRefresh (isRefresh: boolean) {
    if (isRefresh) {
      this.getChildrenList(this.activityId)
    }
  }

  onReadNotice () {
    this.isModelShow = false
    this.doReadAction()
  }

  mounted () {
    const isLogin = new LoginManagement().isLogin()
    if (isLogin) {
      this.getChildrenList(this.activityId)
    }
    this.getForms(this.activityId)
    uni.$on('backToactive',() => {
      this.activeChild = {
        id: '',
        avatar: '',
        name: '',
        school: '',
        inActivityRange: false,
        inActivityAgeRange: false,
        isEntry: false,
      }
      this.getChildrenList(this.activityId)
    })
  }

  onClickCloseIcon () {
    this.isModelShow = false
  }

  // 添加孩子
  onAddChild () {
    uni.navigateTo({
      url: '/pages/writeChildInfo/index',
    })
  }

  // 获取孩子列表
  getChildrenList (activityId: string) {
    this.childrenService.getActivityChildren(activityId).then((res) => {
      if (res.success && res.data) {
        const data = res.data
        const list = data.map((child) => ({
          id: child.userId,
          avatar: child.avatar,
          name: child.realName,
          school: child.orgName,
          inActivityRange: !!child.inActivityRange,
          inActivityAgeRange: !!child.inActivityAgeRange,
          isEntry: !!child.isEntry,
          team: child.team,
        }))

        this.list = list
      }
    })
  }

  toggleChild (child: Child) {
    if (!child.isEntry) {

      if (!child.inActivityRange) {
        uni.showToast({
          title: '很抱歉，您选择的孩子不在参与范围内！',
          duration: 2000,
          icon: 'none',
        })
      }
      if (!child.inActivityAgeRange) {
        uni.showToast({
          title: '很抱歉，您选择的孩子不在活动年龄内！',
          duration: 2000,
          icon: 'none',
        })
      }
    }

    if (
        (child.isEntry && child.team) ||
        !child.inActivityRange ||
        !child.inActivityAgeRange
    ) {
      return
    }
    const mapActive = (item: Child) => ({
      ...item,
      active: item.id === child.id,
    })

    const childs = this.list.map(mapActive)

    this.list = childs
    this.activeChildId = child.id
    this.activeChild = child
  }

  onEnterClick () {
    if (this.activityId !== '265651612790853') {
      this.doReadAction()
    }else {
      this.isModelShow = true
    }
  }

  doReadAction () {
      this.clickCount = 0
      const isEntry = !!this.activeChild.isEntry
      if (
          this.activeChild.inActivityRange &&
          this.activeChild.inActivityAgeRange
      ) {
        if (isEntry) {
          this.onTeamEnabled()
        }
        if (this.enrollInfoLength >= 1) {
          this.moveToFillInfoPage()
        } else {
          this.onTeamEnabled()
        }
        uni.$emit('closeT')
      }
  }

  onTeamEnabled () {
    if (this.teamEnabled) {
      this.moveToTeamPage()
    } else {
      this.signUpTeam()
    }
  }

  moveToTeamPage () {
    uni.navigateTo({
      url: `/pages/internalpages/team/index?childId=${ this.activeChildId }&activityId=${ this.activityId }&isEntry=${ !!this.activeChild.isEntry }`,
    })
  }

  moveToFillInfoPage () {
    uni.navigateTo({
      url: `/pages/internalpages/fillInfo/index?teamEnabled=${ this.teamEnabled }&childId=${ this.activeChildId }&activityId=${ this.activityId }&isEntry=${ !!this.activeChild.isEntry }`,
    })
  }

  signUpTeam () {
    const activityService = new ActivityService()
    const entryActivityRequest = new SubmitActivityFormRequest()
    entryActivityRequest.subUserId = this.activeChildId
    entryActivityRequest.preview = '1'
    entryActivityRequest.entryWay = '4'
    activityService.submitActivityForm(this.activityId,entryActivityRequest,'').then((res) => {
      if (res.success && res.data) {
        this.showSignUpSuccessNotice()
        this.moveToGuidePage()
      } else {
        this.showSignUpErrorNotice(res.error)
      }
    })
  }

  showSignUpErrorNotice (errorMsg: string) {
    uni.showToast({
      title: errorMsg,
      duration: 2000,
      icon: 'none',
    })
  }

  showSignUpSuccessNotice () {
    uni.showToast({
      title: '报名成功',
      duration: ShowMsgEnum.SHOW_SUBMIT_DURATION_SUCCESS,
      icon: 'none',
    })
  }

  moveToGuidePage () {
    uni.navigateTo({
      url: `/pages/guide/index?activityId=${ this.activityId }&childId=${ this.activeChildId }`,
    })
  }


  getForms (activityId: string) {
    this.activityService.getActivityForm(activityId).then((res) => {
      if (res.success && res.data) {
        // let item: FormResponse = {
        //   id: "",
        //   name: "",
        //   required: BooleanEnum.NO,
        // };
        // for (let i = 0; i < res.data.length; i++) {
        //   item = {
        //     id: res.data[i].id,
        //     name: res.data[i].name,
        //     required: res.data[i].required,
        //   };
        //   this.infoForms.push(item);
        // }
        this.enrollInfoLength = res.data.length
      }
    })
  }

  isAble (child: Child) {
    return child.inActivityRange && child.inActivityAgeRange && !child.isEntry
  }
}
</script>
<style lang="scss" scoped>
.list {
  /* box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16); */
  border-radius: 20rpx;
  max-height: 650rpx;
}

.avatar {
  border-radius: 50%;
  height: 120rpx;
  margin-right: 20rpx;
  width: 120rpx;
}

.item {
  align-items: center;
  background: #fff;
  border-bottom: 1px solid #e5e5e5;
  color: #888888;
  display: flex;

  padding: 30rpx;
}

.info {
  flex: 1;
}

.name {
  margin-bottom: 10rpx;
}

.school {
  font-size: 30rpx;
  padding-right: 10rpx;
}

.btn {
  background: #7563f0;
  border-radius: 10rpx;
  color: #fff;
  font-size: 30rpx;
  padding: 10rpx;
}

.radio-item {
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 50%;
  display: flex;
  height: 40rpx;
  justify-content: center;
  width: 40rpx;
}

.radio-item.active {
  background: #416fff;
}

.radio-item.joined {
  background: #8ac252;
}

.radio-item.disable {
  background: #ccc;
}

.action-btn-row {
  height: 100rpx;
}

.add-user-item-box {
  align-items: center;
  display: flex;
  height: 120rpx;
  justify-content: center;
  margin-right: 20rpx;
  width: 120rpx;
}

.add-user-item {
  align-items: center;
  border-radius: 50%;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  display: flex;
  flex-shrink: 0;
  height: 100rpx;
  justify-content: center;
  width: 100rpx;
}

.entry-ok {
  background: rgb(0, 199, 10);
  border-radius: 10rpx;
  color: #fff;
  font-size: 24rpx;
  padding: 10rpx 16rpx;
}

.model-box {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
}

.container {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);

  .box {
    width: 80%;
    height: 50%;
    background-color: #fff;
    border-radius: 25rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;

    .close-icon {
      position: absolute;
      right: 30rpx;
      top: 30rpx;
    }

    .title {
      font-size: 45rpx;
      text-align: center;
      margin-bottom: 50rpx;
    }

    .protocol {
      width: 80%;
      height: 60%;
      margin: 0 auto;
      overflow-y: auto;
      opacity: 0.6;
    }

    .read-btn {
      margin-top: 50rpx;
      background: $ai121-theme-color;
      color: white;
      padding: 20rpx 50rpx 20rpx 50rpx;
      border-radius: 35rpx;
    }
  }
}
</style>
