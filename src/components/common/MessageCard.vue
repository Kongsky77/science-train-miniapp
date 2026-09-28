<template>
  <div class="card-box">
    <div class="card-inner-box">
      <div class="card-avatar">
        <image :src="card.avatar" mode="widthFix" class="avatar"></image>
      </div>
      <div class="card-content">
        <div class="content-tip-row">
          <div class="content-name">
            <span class="content-name-span">{{ card.realName }}</span>
          </div>
        </div>
        <div class="content-footer">
          <div class="content-footer-left">
            <!-- <div class="daily-count">
              <image
                src="@/static/icon/message_card_dailyCount.svg"
                class="icon"
              ></image>
              <span class="text-title">孩子动态：</span>
              <span class="text">{{ card.dailyCount }}</span>
            </div> -->
            <div class="daily-count">
              <image
                src="@/static/icon/message_card_lastLoginTime.svg"
                class="icon"
              ></image>
              <span class="text-title">最近上线时间：</span>
              <span class="text" v-if="card.lastLoginTime === '0'">暂无</span>
              <span class="text" v-else>{{ card.lastLoginTime }}</span>
            </div>
            <div class="daily-count">
              <image
                src="@/static/icon/message_card_lastEntryActvity.svg"
                class="icon"
              ></image>
              <span class="text-title">最近参加活动：</span>
              <span class="text" v-if="card.lastEntryActivityName.length === 0"
                >暂无</span
              >
              <span
                class="text"
                v-else-if="card.lastEntryActivityName.length > 11"
                >{{ card.lastEntryActivityName.slice(0, 10) + "..." }}</span
              >
              <span class="text" v-else>{{ card.lastEntryActivityName }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- :class="{ fontactive: current === index }" -->
      <!-- v-if="card.unreadCount > 0" -->
      <div class="card-right">
        <div class="card-message-click">
          <div
            class="content-message-cicle"
            v-if="UnreadMessageList[unReadyIndex] > 0"
          >
            <span>{{ UnreadMessageList[unReadyIndex] }}</span>
          </div>
          <image
            src="@/static/icon/message_card_click.svg"
            mode="widthFix"
            class="click"
          ></image>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import ChildMessageCard from "@/beans/message/ChildMessageCard";

import { State, Mutation } from "vuex-class";

@Component({
  name: "MessageCard"
})
export default class MessageCard extends Vue {
  @Prop()
  card!: ChildMessageCard;
  @Prop()
  unReadyIndex;
  @State(state => state.UnreadMessageList) private UnreadMessageList!: Array<
    number
  >;

  unshow() {
    console.log("我不好了");
  }
}
</script>
<style lang="scss" scoped>
.card-box {
  box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.08);
  border-radius: 30rpx;
  height: 300rpx;
  width: 100%;
  background-color: #fff;
}

.card-inner-box {
  box-sizing: border-box;
  padding: 20rpx;
  width: 100%;
  height: 100%;
  border-radius: 30rpx;
  color: #fff;
  position: relative;
  display: flex;
  flex-direction: row;
}

.card-avatar {
  width: 25%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 20rpx;
}

.avatar {
  width: 85%;
  height: 85%;
  border-radius: 50%;
}

.card-content {
  width: 70%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.card-right {
  width: 40rpx;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding-right: 10rpx;
}

.content-tip-row {
  height: 35%;
  width: 100%;
  display: flex;
  flex-direction: row;
}

.content-name {
  width: 75%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
}

.content-name-span {
  color: #888888;
  font-weight: bold;
  font-size: 40rpx;
}

.card-message-num {
  width: 100%;
  height: 15%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 24rpx;
}

.card-message-click {
  width: 100%;
  height: 100%;
  position: relative;
  //   display: flex;
  //   flex-direction: column;
  //   justify-content: center;
  //   align-items: center;
}

.content-message-cicle {
  position: absolute;
  top: 10rpx;
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background-color: #ff0000;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24rpx;
}

.click {
  width: 20rpx;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.content-footer {
  margin-top: 10rpx;
  height: 50%;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

.content-footer-left {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-start;
}

.daily-count {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

.icon {
  width: 20rpx;
  height: 20rpx;
  margin-right: 10rpx;
}

.text-title {
  font-size: 20rpx;
  color: #888888;
  font-weight: bold;
}
.text {
  font-size: 25rpx;
  color: #f2a563;
  font-weight: bold;
}
</style>