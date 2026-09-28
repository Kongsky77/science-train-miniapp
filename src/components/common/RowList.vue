<template>
  <view class="row-list">
    <!-- <div v-show="list.length" class="row-item"> -->
    <div v-for="item of list" :key="item.id" class="row-item">
      <image
          :src="item.icon"
          class="item-icon"
          @click="onIconClick(item)"
      ></image>

      <view class="item-title">{{ item.title }}</view>
      <div>
        <view class="item-text" v-if="item.id != '3'">{{ item.text }}</view>
        <view class="item-text" v-else @click="onRankHelpClick(item)"
        >{{ item.text }}
          <image
              class="rank-help"
              src="https://contentdevsa-blob.ai121.net/testcontainer/static/activity/img/ma_icon_question.svg"
              alt=""
          ></image>
        </view>
      </div>
    </div>
    <van-overlay
        :lock-scroll="true"
        :show="isShareBadgeShow"
        :z-index="9999"
        @click="isShareBadgeShow = false"
    >
      <div class="wrapper" @click.stop>
        <share-badge-rank
            v-if="isShareBadgeShow"
            :currentUserName="currentUserName"
            :iconUrl="iconUrl"
            :shareBadgeTitle="shareBadgeTitle"
            :topCount="topCount"
            :topLastTime="topLastTime"
            @closeShareBadge="closeShareBadge"
        />
      </div>
    </van-overlay>

    <!-- </div> -->
    <div v-if="list.length < 1" class="row-item">
      <image class="item-icon" src="https://contentdevsa-blob.ai121.net/testcontainer/activity/image/c6b7800a-d44c-4b05-9059-0d4a43fc7ccf.svg"></image>
      <view v-if="isLogin" class="none-data">暂无数据</view>
      <view v-else class="item-title">****</view>
      <view class="item-text">活动次数</view>
    </div>
    <div v-if="list.length < 1" class="row-item">
      <image class="item-icon" src="https://contentdevsa-blob.ai121.net/testcontainer/activity/image/7c361513-198b-4ee7-9c3a-e954d4e6a957.svg"></image>
      <view v-if="isLogin" class="none-data">暂无数据</view>
      <view v-else class="item-title">****</view>
      <view class="item-text">活动徽章</view>
    </div>
    <div v-if="list.length < 1" class="row-item">
      <image
          class="item-badge-icon"
          :src="defaultIcon"
      ></image>
      <view v-if="isLogin" class="none-data">暂无数据</view>
      <view v-else class="item-title">****</view>
      <view class="item-text">超越了同龄人</view>
    </div>
  </view>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import RowListItem from "@/beans/common/RowListItem";
import ShareBadgeRank from "@/components/common/ShareBadgeRank.vue";
import LangEnum from "@/definition/lang/LangEnum";
import BadgeIconMap from '@/definition/badge/BadgeIconMap'
import { log } from "console";
import BadgeRankLevelEnum from '@/definition/badge/BadgeRankLevelEnum'
import BadgeRankPositionEnum from '@/definition/badge/BadgeRankPositionEnum'

@Component({
  name: "RowList",
  components: {
    ShareBadgeRank
  }
})
export default class RowList extends Vue {
  @Prop()
  list!: RowListItem[];

  @Prop()
  isLogin: boolean;

  @Prop()
  shareBadgeTitle: string;

  @Prop()
  topCount: number;

  @Prop()
  topLastTime: number;

  @Prop()
  currentUserName: string;

  isShareBadgeShow: boolean = false;

  iconUrl: string = "";

  mounted() {}

  onIconClick(item: RowListItem) {
    if (item.id === "3") {
      this.iconUrl = item.icon;

      if (item.title === LangEnum.NO_DATA) {
        this.showNoData();
      } else {
        this.isShareBadgeShow = true;
      }
    }
  }

  get defaultIcon () {
   return BadgeIconMap.get(BadgeRankLevelEnum.NONE).get(BadgeRankPositionEnum.NONE)
  }

  onRankHelpClick() {
    let imageSrc = "";
    let title = "";
    this.list.forEach(item => {
      if (item.id === "3") {
        imageSrc = item.icon;
        title = item.title;
      }
    });
    uni.navigateTo({
      url: `/pages/introduceBadgeRank/index?imageSrc=${imageSrc}&title=${title}`
    });
  }

  showNoData() {
    uni.showToast({
      title: "没有数据",
      icon: "none"
    });
  }

  closeShareBadge() {
    this.isShareBadgeShow = false;
  }
}
</script>

<style scoped>
.row-list {
  display: flex;
  justify-content: center;
}

.row-item {
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 20rpx;
}

.row-item:nth-child(-n + 2) > .item-icon {
  margin-top: 25rpx;
  height: 70rpx;
  /* height: 60rpx; */
  margin-bottom: 25rpx;
  width: 70rpx;
}

.row-item:nth-child(3) > .item-icon {
  height: 100rpx;
  /* height: 60rpx; */
  margin-bottom: 20rpx;
  width: 100rpx;
}

.item-badge-icon {
  height: 100rpx;
  /* height: 60rpx; */
  margin-bottom: 20rpx;
  width: 100rpx;
}

.item-title {
  font-size: 28rpx;
  margin-bottom: 20rpx;
}

.item-text {
  font-size: 25rpx;
  margin-bottom: 20rpx;
  position: relative;
}

.none-data {
  font-size: 24rpx;
  margin-bottom: 22rpx;
}

.share {
  background: white;
  height: 300rpx;
}
.rank-help {
  position: absolute;
  top: 50%;
  right: -25%;
  transform: translate(0, -50%);
  width: 25rpx;
  height: 25rpx;
}
</style>
