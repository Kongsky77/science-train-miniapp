<template>
  <view class="avatar-select">
    <!-- 一个 -->
    <view class="swiper-view" v-if="childs.length < 3">
      <swiper
        class="swiper swiper-box"
        :indicator-dots="false"
        :autoplay="false"
        :duration="500"
        :display-multiple-items="1"
        :previous-margin="240 + 'rpx'"
        :next-margin="240 + 'rpx'"
        :current="current"
        ><!-- @change="swiperChange()" -->
        <swiper-item
          v-for="(child, index) of childs"
          :key="child.userId"
          @click="switchUser(child, index)"
          class="swiper-item"
          @touchmove.stop="stopTouchMove"
        >
          <view class="swiper-item uni-bg-red avatar-item"
            ><image
              class="avatar"
              :src="child.avatar"
              :class="{ active: activeId === child.userId }"
            ></image
          ></view>
        </swiper-item>
        <swiper-item class="swiper-item" @touchmove.stop="stopTouchMove">
          <view class="swiper-item uni-bg-green avatar-item add-item">
            <view class="add-user-item-box" v-if="showAddBtn">
              <view class="add-user-item" @click="add">
                <van-icon name="plus" />
              </view>
            </view>
            <view class="add-info" v-if="childs.length < 1">
              添加孩子
            </view></view
          >
        </swiper-item>
      </swiper>
    </view>
    <!-- 多个 -->
    <view class="swiper-view" v-if="childs.length >= 3">
      <swiper
        class="swiper swiper-box"
        :indicator-dots="false"
        :autoplay="false"
        :duration="500"
        :display-multiple-items="1"
        :previous-margin="240 + 'rpx'"
        :next-margin="240 + 'rpx'"
        :current="current"
        @change="swiperChange()"
        ><!-- @change="swiperChange()" -->
        <swiper-item
          v-for="(child, index) of childs"
          :key="child.userId"
          @click="switchUser(child, index)"
          class="swiper-item"
        >
          <view class="swiper-item uni-bg-red avatar-item"
            ><image
              class="avatar"
              :src="child.avatar"
              :class="{ active: activeId === child.userId }"
            ></image
          ></view>
        </swiper-item>
        <swiper-item class="swiper-item">
          <view class="swiper-item uni-bg-green avatar-item add-item"
            ><view class="add-user-item-box" v-if="showAddBtn">
              <view class="add-user-item" @click="add">
                <van-icon name="plus" />
              </view>
            </view>
            <view class="add-info" v-if="childs.length < 1">
              添加孩子
            </view></view
          >
        </swiper-item>
      </swiper>
    </view>
  </view>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "UserSelect",
  components: {}
})
export default class UserSelect extends Vue {
  @Prop({
    default: false
  })
  showAddBtn!: boolean;

  @Prop({ default: () => [] })
  childs!: Array<any>;

  @Prop({ default: 0 })
  currentItem: number;

  checkedId = "";
  current = 0;

  mounted() {
    this.initCurrent(this.currentItem);
  }

  initCurrent(current: number) {
    if (!Array.isArray(this.childs) || this.childs.length === 0) {
      this.checkedId = "";
      this.current = 0;
      return;
    }
    const safeCurrent = Number.isInteger(current) && current >= 0 && current < this.childs.length
      ? current
      : 0;
    this.current = safeCurrent;
    this.switchUser(this.childs[safeCurrent], safeCurrent);
  }

  get activeId() {
    return this.checkedId
      ? this.checkedId
      : this.childs.length
      ? this.childs[0].userId
      : "";
  }

  stopTouchMove() {
    return false;
  }
  switchUser(child: any, index: number) {
    if (!child || !child.userId) {
      return;
    }
    this.checkedId = child.userId;
    this.$emit("change", child);
    this.current = index;
    console.log("switchUser");
  }

  // 滑动切换-还未实现
  swiperChange() {
    // const child = this.childs[this.current];
    // this.checkedId = child.userId;
    // this.$emit("change", child);
    console.log("swiperChange");
  }

  add() {
    this.$emit("add");
  }
}
</script>
<style scoped>
.avatar {
  width: 150rpx;
  height: 150rpx;
  border-radius: 50%;
  background-color: #fff;
  border: 3rpx solid #fff;
}

/* .avatar  */
.active {
  width: 200rpx;
  height: 200rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  /* box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16); */
  /* transform: scale(1.2); */
}

.avatar-row {
  display: flex;
  flex: 1;
  /* justify-content: center; */
  align-items: center;
  overflow-x: auto;
}

.avatar-row::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
}

.avatar-item {
  /* margin: 0 20rpx; */
  width: 200rpx;
  height: 200rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}
.add-item {
  flex-wrap: wrap;
}

.add-user-item-box {
  width: 200rpx;
  display: flex;
  justify-content: center;
}

.add-user-item {
  flex-shrink: 0;
  width: 120rpx;
  height: 120rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  border-radius: 50%;
}

.swiper-view {
  width: 710rpx;
  margin: 0 auto;
}
.swiper-box {
  /* width: 710rpx; */
  width: 100%;
  height: 300rpx;
}

.swiper-item {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* .avatar-select,
.avatar-row {
  width: 100vw;
} */

.add-box {
  /* width: 200rpx; */
  width: 120rpx;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin: 0 20rpx;
}
.add-info {
  width: 100%;
  font-size: 24rpx;
  text-align: center;
  padding: 16rpx 0;
}
</style>
