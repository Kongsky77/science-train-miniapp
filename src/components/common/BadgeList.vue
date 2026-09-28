<template>
  <!--  -->
  <view class="badge-box">
    <view class="badge-list">
      <view
        class="badge-item"
        @click="clickBadge(item)"
        v-for="item of list"
        :key="item.id"
      >
        <image class="badge-image" mode="aspectFit" :src="item.image"></image>
        <view class="text-box">
          <view class="badge-text">{{ item.name }}</view>
          <view class="badge-text">{{ item.date }}</view>
        </view>
      </view>
    </view>
  </view>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import BadgeListItem from "@/beans/badge/BadgeListItem";

@Component({
  name: "BadgeList",
  components: {}
})
export default class BadgeList extends Vue {
  @Prop()
  list!: BadgeListItem[];

  clickBadge(item: BadgeListItem) {
    if (item.date.indexOf("尚未获取") === -1) {
      this.$emit('onClickBadge', item)
      this.$emit("onBadgeChange", item.activityId, item.name);
      this.$emit("closeFetchBadge", true);
    }
  }
}
</script>
<style scoped>
.badge-list {
  display: flex;
  flex-wrap: wrap;
  padding: 20rpx;
}

.badge-item {
  width: 33.33%;
  height: 300rpx;
  padding: 20rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.badge-image {
  flex: 1;
  width: 100%;
  /* height: 180rpx; */
}

.text-box {
  width: 100%;
  height: 100rpx;
  margin-top: 10rpx;
  display: flex;
  flex-direction: column;
}

.badge-text {
  font-size: 24rpx;
  height: 40rpx;
  line-height: 40rpx;
  width: 100%;
  color: #adadad;
  text-align: center;
  margin-bottom: 10rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
