<template>
  <van-action-sheet
      :close-on-click-overlay="true"
      :show="showChooseChildren"
      title="选择用户"
      @close="closeChooseChildren"
      @click-overlay="closeChooseChildren"
  >
    <view class="action-box" style="z-index: 9999">
      <view class="children-box">
        <view class="page">
          <scroll-view :scroll-y="true" class="list">
            <view
                v-for="user of list"
                :key="user.userId"
                class="item"
                @click="toggleChild(user)"
            >
              <image :src="user.avatar" class="avatar"></image>
              <view class="info">
                <view class="name">{{ user.realName }}</view>
                <view class="school">{{ user.orgName }}</view>
              </view>
              <view
                  v-if="isAble(user)  && !hasTeam(user)"
                  :class="{ active: user.active }"
                  class="radio-item"
              >
                <van-icon color="#fff" name="success"/>
              </view>
              <!--不在活动范围-->
              <view
                  v-else
                  class="radio-item disable"
              >
                <van-icon color="#fff" name="cross"/>
              </view>

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
        </view>
      </view>
    </view>
  </van-action-sheet>
</template>

<script lang="ts">
import { Component,Prop,Vue } from 'vue-property-decorator'
import ChildrenService from '@/service/ChildrenService'
import ActivityChild from '@/beans/common/ActivityChild'
import BooleanEnum from '@/enums/common/BooleanEnum'
import LoginManagement from '@/management/login/LoginManagement'

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

@Component({
  name: 'ChooseChildren'
})

export default class ChooseChildren extends Vue {
  @Prop({
    default: '',
    type: String
  })
  activityId: string

  @Prop({
    default: false,
    type: Boolean
  })
  showChooseChildren: boolean

  booleanEnum = BooleanEnum

  activeChild: ActivityChild = new ActivityChild()

  list: Array<ActivityChild> = []

  get isLogin (): boolean {
    return new LoginManagement().isLogin()
  }

  mounted () {
    uni.$on('backToactive',() => {
      this.fetchChildList()
    })
    if (this.isLogin) {
      this.fetchChildList()
    }
  }

  closeChooseChildren () {
    this.$emit('close-model')
  }

  hasTeam (user: ActivityChild) {
    return user.team !== undefined
  }

  fetchChildList () {
    new ChildrenService().getActivityChildren(this.activityId).then((res) => {
      if (res.success && res.data) {
        this.list = res.data
      }
    })
  }

  toggleChild (child: ActivityChild) {
    if (child.isEntry === BooleanEnum.NO) {
      if (child.inActivityRange === BooleanEnum.NO) {
        uni.showToast({
          title: '很抱歉，您选择的孩子不在参与范围内！',
          duration: 2000,
          icon: 'none',
        })
      }
      if (child.inActivityAgeRange === BooleanEnum.NO) {
        uni.showToast({
          title: '很抱歉，您选择的孩子不在活动年龄内！',
          duration: 2000,
          icon: 'none',
        })
      }
    }

    if (child.inActivityRange === BooleanEnum.NO || child.inActivityAgeRange === BooleanEnum.NO) {
      return
    }

    const mapActive = (item: ActivityChild) => ({
      ...item,
      active: item.userId === child.userId,
    })
    this.activeChild = child
    this.list = this.list.map(mapActive)
  }

  onEnterClick () {
    this.$emit('on-enter-click',this.activeChild)
  }

  isAble (child: ActivityChild) {
    return child.inActivityRange === BooleanEnum.YES  && child.inActivityAgeRange === BooleanEnum.YES
  }

  onAddChild () {
    uni.navigateTo({
      url: '/pages/writeChildInfo/index',
    })
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
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  margin-right: 20rpx;
}

.item {
  background: #fff;
  display: flex;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1px solid #e5e5e5;

  color: #888888;
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
  font-size: 30rpx;
  color: #fff;
  background: #7563f0;
  padding: 10rpx;
  border-radius: 10rpx;
}

.radio-item {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #ccc;
}

.radio-item.active {
  background: #416fff;
}

.radio-item.joined {
  background: #8ac252;
}

.radio-item.disable {
  cursor: not-allowed;
  pointer-events:none;
  background: #ccc;
}

.action-btn-row {
  height: 100rpx;
}

.add-user-item-box {
  width: 120rpx;
  height: 120rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 20rpx;
}

.add-user-item {
  flex-shrink: 0;
  width: 100rpx;
  height: 100rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  border-radius: 50%;
}

.entry-ok {
  font-size: 24rpx;
  padding: 10rpx 16rpx;
  border-radius: 10rpx;
  background: rgb(0, 199, 10);
  color: #fff;
}

.model-box {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);

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
}
</style>
