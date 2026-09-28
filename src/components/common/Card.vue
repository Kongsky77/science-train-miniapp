<template>
  <div
    class="card-box"
    :style="{
      background: card.img
        ? makeBackground(card.img)
        : makeBackground(card.image)
    }"
  >
    <div class="card-inner-box" @click="onClick(card)">
      <!-- 爱心图标 -->
      <view class="horizontal-card-right" v-show="isShow(card)">
        <image
          class="horizontal-card-icon"
          mode="widthFix"
          :src="getLikeIcon(card.liked)"
          @click.stop="onLikeStateChange(card)"
        ></image>
      </view>

      <div class="card-content">
        <div class="card-tip-row">
          <div class="card-tip">
            {{ card.type }}
            <image
              class="card-tip-icon"
              mode="widthFix"
              src="https://contentdevsa-blob.ai121.net/testcontainer/activity/image/31b932d3-09b4-4b4a-813f-e5565e70ac50.svg"
            ></image>
          </div>
        </div>

        <div class="card-footer">
          <div class="card-footer-left">
            <div class="card-title">{{ card.title }}</div>
            <div class="card-text">{{ card.text }}</div>
          </div>
          <!-- 右下角头像 -->
          <!-- <div class="card-footer-right">
            <image
              v-for="(avatar, index) of card.avatars"
              :key="index"
              class="card-footer-avator"
              :src="avatar"
            ></image>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import HorizontalCardType from "@/beans/common/HorizontalCardType";

@Component({
  name: "Card"
})
export default class Card extends Vue {
  @Prop()
  card!: HorizontalCardType;

  onClick(card: HorizontalCardType) {
    this.$emit("click", card);
  }
  isShow(card: any) {
    return card.hasOwnProperty("liked");
  }

  onLikeStateChange(cardItem) {
    this.$emit("onLikeStateChange", cardItem);
  }

  makeBackground(url: string) {
    return `url("${url}") no-repeat center center/cover;`;
  }

  // 收藏爱心图标的切换
  getLikeIcon(active: boolean) {
    return active
      ? "https://contentdevsa-blob.ai121.net/testcontainer/activity/image/d8ebf70d-dc3e-4fab-a6c8-a6ca571db1ef.png"
      : require("@/static/icon/not-like.png");
  }
}
</script>
<style scoped>
.card-box {
  box-shadow: 0 4px 24px 0 rgb(0, 0, 0, 0, 0.08);
  border-radius: 30rpx;
  height: 600rpx;
  width: 100%;
}

.horizontal-card-right {
  position: absolute;
  top: 50rpx;
  right: 20rpx;
  /* flex: 1; */
  /* display: flex; */
  /* flex-direction: column; */
  /* justify-content: flex-end; */
  /* align-items: flex-end; */
  /* padding-top: 40rpx; */
}

.horizontal-card-icon {
  width: 40rpx;
  height: 40rpx;
  margin-right: 60rpx;
}

.card-inner-box {
  box-sizing: border-box;
  padding: 20rpx;
  background: linear-gradient(360deg, #222222c7 0%, rgba(84, 84, 84, 0.1) 100%);
  width: 100%;
  height: 100%;
  border-radius: 30rpx;
  color: #fff;
  position: relative;
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

.card-tip-row {
  margin-left: 20rpx;
  display: flex;
  justify-content: flex-start;
}

.card-tip {
  margin-bottom: 10rpx;
  background: #7660f0;
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

/* .card-footer-avator {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  margin-left: -40rpx;
} */

/* .card-footer-avator:first-child {
  margin-left: 20rpx;
} */

.card-footer {
  margin-left: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.card-footer-left {
  flex: 1;
  flex-shrink: 1;
  overflow: hidden;
}

/* .card-footer-right {
  display: flex;
  flex-shrink: 0;
} */

.card-title {
  margin-bottom: 10rpx;
  font-size: 40rpx;
}

.card-text {
  margin-bottom: 10rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
