<template>
  <div class="message-detail">
    <div class="date-picker">
      <div class="date-picker-inner-box">
        <div class="colume-line"></div>
        <div class="middle-line"></div>

        <div class="date-picker-header">
          <span v-if="dailyMessage[current].totalCount > 0" class="times">{{
            dailyMessage[current].totalCount
          }}</span>
          <span v-else class="times">{{ 0 }}</span>
          <span class="picker-header-text">次</span>
        </div>

        <swiper
          :autoplay="false"
          :current="current"
          :display-multiple-items="1"
          :duration="200"
          :indicator-dots="false"
          :next-margin="280 + 'rpx'"
          :previous-margin="280 + 'rpx'"
          class="swiper-box"
          @animationfinish="changeCurrent"
        >
          <swiper-item
            v-for="(item, index) in dailyMessageS"
            :key="index"
            class="swiper-item"
            @click="changeDay(item.time, index)"
          >
            <div
              :class="{ active: current === index }"
              :style="{ height: getHeight(item.totalCount) }"
              class="daily-box"
            ></div>
            <span
              :class="{ fontactive: current === index }"
              style="height: 50rpx"
              >{{ timeToDate(Number(item.time)).day }}</span
            >
          </swiper-item>
        </swiper>

        <div class="date-picker-notice">
          <div class="notice"></div>
          <span>孩子每日动态</span>
        </div>
      </div>
    </div>
    <div class="message-list">
      <div class="message-list-date">{{ currentDay }}</div>
      <div
        v-for="(msg, index) in messages"
        v-show="!notime"
        :key="index"
        class="massage-list-text"
        @click="onMessageClick(msg)"
      >
        <div class="message-list-left">
          <div class="cicle">
            <div v-if="index === 0" class="cicle-border">
              <div class="cicle-soild"></div>
            </div>
            <div v-else class="cicle-border1"></div>
          </div>
          <div v-if="index !== messages.length - 1" class="dash-line"></div>
        </div>
        <div class="message-list-right">
          <div class="message-list-text-time">
            <span>{{ timeToDate(msg.createTime).messageTime }}</span>
          </div>
          <div class="message-list-text-text">
            <span class="text-pre" v-html="msg.textPre"></span>
            <span class="text-pre-text">{{ msg.textBack }}</span>
          </div>
        </div>
      </div>
      <div v-show="notime" class="no-massage-list-text">暂无任何消息</div>

      <div class="message-list-footer"></div>
    </div>

    <div class="message-footer">
      <button class="back-button" @click="backToMessagePage">返回</button>
    </div>

    <view v-if="isBadgeToast" class="fetch-badge-box">
      <FetchBadge
        :activityId="isBadgeActivityId"
        :activityName="isBadgeActivityName"
        :currentUserName="childName"
        :award-position="awardPosition"
        :list="badges"
        @ViewBadgeByMessage="ViewBadgeByMessage"
        @closeFetchBadge="closeFetchBadge"
      />
    </view>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import MessageService from "@/service/MessageService";
import DailyMessage from "@/beans/message/DailyMessage";
import Message from "@/beans/message/Messages";
import Steps from "@/beans/message/Steps";
import TagToObject from "@/beans/message/TagToObject";
import Messages from "@/beans/message/Messages";
import FetchBadge from "@/components/common/FetchBadge.vue";
import BadgeListItem from "@/beans/badge/BadgeListItem";
import BadgeService from "@/service/BadgeService";
import dayjs from "dayjs";
import { log } from "console";

import store from "@/store/index";
import MessageTypeEnum from "@/definition/common/MessageTypeEnum";
import UserService from "@/service/UserService";
import ChildrenService from "@/service/ChildrenService";

@Component({
  name: "MessageDetail",
  components: {
    FetchBadge,
  },
})
export default class MessageDetail extends Vue {
  childId: string = "";
  childName: string = "";

  messageService = new MessageService();
  tagToObject = new TagToObject();
  isBadgeToast = false;
  activityId = "";
  certId = "";
  badgeId = "";
  dataReportId = "";
  currentMessageDay = "";
  isread = "1";
  time = "";
  // 没有数据返回日期为零是控制显示的变量
  notime: boolean = false;
  currentDay = "";
  current = 0;
  // 设置未读消息
  unreadyNews: number = 100;
  //名字，用于高亮
  userName = "";
  steps: Array<Steps> = [];
  //   steps = [{text:"1",desc:"11"},{text:"2",desc:"11",}]
  //高亮内容
  hightLigtText = "";
  dailyMessage: Array<DailyMessage> = [];
  dailyMessageS: Array<DailyMessage> = [];
  messages: Array<Message> = [];
  badgeService = new BadgeService();
  isBadgeActivityId = "";
  isBadgeActivityName = "";
  badges: BadgeListItem[] = [];
  currentId = "";
  awardPosition: number = 0;

  onLoad(options) {
    this.childId = options.id;
    if (!options.name) {
      new ChildrenService().getChildInfo(options.id).then((res) => {
        if (res.success) {
          this.childId = res.data.realName;
        }
      });
    } else {
      this.childName = options.name;
    }

    this.getMessageDay(this.childId);
    // this.setUnreadyNews();
    // this.getMessages(this.childId,this.isread,this.time)
  }

  getHeight(totalCount: number) {
    let height = totalCount * 20;
    if (height >= 280) {
      height = 280;
    }
    return height + "rpx";
  }

  getMessages(childId: string, read: string, time?: string) {
    this.messageService.getMessage(read, childId, time).then((res) => {
      if (res.success && res.data) {
        const data = res.data;
        const messages: Array<Message> = data.map((item) => {
          const content = this.doMessageContent(item.content);
          return {
            textPre: content.textPre,
            hightLight: content.hightLigtText,
            textBack: content.textBck,
            createTime: item.createTime,
            id: item.id,
            read: item.read,
            productionId: content.productionId,
            activityId: content.activityId,
            certId: content.certId === undefined ? "" : content.certId,
            badgeId: content.badgeId === undefined ? "" : content.badgeId,
            type: content.type === undefined ? "" : content.type,
          };
        });
        this.messages = messages;
      }
    });
  }

  doMessageContent(content: string) {
    let message: any = {};
    let childName = "";
    const text = this.tagToObject.getStringText(content);

    const text1 = text.slice(0, 2);
    const tagSpan = content.match(/>[^]*<\/span>/gi);
    if (!!tagSpan) {
      childName = tagSpan.join("").slice(1, 3);
    }
    text1.splice(1, 0, childName);
    const textPre = text1.join("");
    const textBck = text.slice(2, text.length).join("");
    const tagA = content.match(/<a[^]*<\/a>/gi);
    const tagModal = content.match(/<modal[^]*<\/modal>/gi);
    if (!!tagA) {
      message = this.doTagA(tagA.toString());
    }
    if (!!tagModal) {
      message = this.doTagModal(tagModal.toString());
    }
    return {
      textPre: textPre,
      textBck: textBck,
      ...message,
    };
  }

  doTagModal(modal: string) {
    const modaArray = this.tagToObject.tagToArray(modal);
    const modalObj = this.tagToObject.tagToObject(modaArray);
    return {
      badgeId: modalObj.badgeId,
      childrenUserId: modalObj.childrenUserId,
      type: modalObj.type,
      activityId: modalObj.activityId,
      hightLigtText: modalObj.text,
    };
  }

  doTagA(a: string) {
    const aArray = this.tagToObject.tagToArray(a);
    const aObj = this.tagToObject.tagToObject(aArray);

    return {
      activityId: aObj.activityId,
      certId: aObj.certId,
      type: aObj.type,
      hightLigtText: aObj.text,
      productionId: aObj.productionId,
    };
  }

  // 有数据时候的日期格式化
  timeToDate(time: number) {
    var d = new Date(time);
    let hour = d.getHours();
    let minute = d.getMinutes();
    let hour1 = "";
    let minute1 = "";
    if (hour < 10) {
      hour1 = "0" + hour;
    } else {
      hour1 = "" + hour;
    }
    if (minute < 10) {
      minute1 = "0" + minute;
    } else {
      minute1 = "" + minute;
    }
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const date = month + "月" + day + "日";
    const messageTime = hour1 + ":" + minute1;
    return {
      date: date,
      messageTime: messageTime,
      day: day,
    };
  }

  //没有数据的时候设置默认返回日期
  getCurrentDay() {
    const date = new Date();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let rq = month + "月" + day + "日";
    return rq;
  }

  //得到有消息的日期，此方法不一定有
  getMessageDay(childId: string) {
    this.messageService.getMessageDay(childId).then((res) => {
      if (res.success && res.data) {
        const data = res.data;
        const dailyMessage = data.filter((item) => item.totalCount);
        this.dailyMessage = dailyMessage;

        this.dailyMessageS = this.dailyMessage.reverse();
        if (this.dailyMessageS.length >= 1) {
          this.notime = false;
          this.current = this.dailyMessageS.length - 1;
          this.time = dailyMessage[dailyMessage.length - 1].time;
          this.getMessages(childId, this.isread, this.time);
          this.currentDay = this.timeToDate(Number(this.time)).date;
        } else {
          this.currentDay = this.getCurrentDay();
          this.notime = true;
        }
      }
    });
  }

  changeDay(time: string, current: number) {
    this.time = time;
    this.current = current;
    this.currentDay = this.timeToDate(Number(time)).date;
    this.getMessages(this.childId, this.isread, this.time);
  }

  changeCurrent(event) {
    let index = event.detail.current;
    let i: string = this.dailyMessageS[index].time;
    this.time = i;
    this.currentDay = this.timeToDate(Number(i)).date;
    this.getMessages(this.childId, this.isread, this.time);
    this.current = event.detail.current;
  }

  onActivityClick(activityId: string) {
    uni.navigateTo({
      url: `/pages/activityDetail/index?id=${activityId}`,
    });
  }

  onCertClick(certId: string) {
    uni.navigateTo({
      url: `/pages/cert/index?id=${certId}`,
    });
  }

  onBadgeClick(badgeId: string) {
    this.badgeService.getBadge(badgeId).then((res) => {
      if (res.success && res.data) {
        const data = res.data;
        const badge = {
          id: data.id,
          activityId: data.activityId,
          name: data.title,
          date: dayjs(data.awardedTime).format("YYYY-MM-DD"),
          awardedTime: data.awardedTime,
          image: data.imgLit,
          awardPosition: data.awardPosition,
        };
        this.awardPosition = res.data.awardPosition;
        this.badges.push(badge);
        this.isBadgeActivityId = data.activityId;
        this.currentId = data.userId;
        this.isBadgeActivityName = data.title;
        this.isBadgeToast = true;
      }
    });
  }

  onDataReportClick(dataReportId: string) {}

  onMessageClick(msg: Messages) {
    if (msg.type === "activity-detail") {
      uni.navigateTo({
        url: `/pages/activityDetail/index?id=${msg.activityId}`,
      });
    } else if (msg.type === "user-badge") {
      this.onBadgeClick(msg.badgeId);
    } else if (msg.type === "user-cert") {
      this.onCertClick(msg.certId);
    } else if (msg.type === MessageTypeEnum.PRODUCTION_DETAIL) {
      this.onProductClick(msg.productionId, msg.activityId);
    } else if (this.clear(msg.type) === MessageTypeEnum.HELP_FEEDBACK) {
      this.onHelpFeedbackClick();
    }
  }

  onHelpFeedbackClick() {
    this.goFeedback();
  }

  goFeedback() {
    uni.navigateTo({
      url: "/pages/feedback/index",
    });
  }

  clear(str): string {
    str = str.replace(/>/g, ""); //取消字符串中出现的所有逗号
    return str;
  }

  onProductClick(productId: string, activityId: string) {
    const productionId = this.clear(productId);
    uni.navigateTo({
      url: `/pages/my-works/MyWorks?productId=${productionId}&activityId=${activityId}&childrenId=${this.childId}`,
    });
  }

  backToMessagePage() {
    uni.$emit("backToMessagePage");
    uni.navigateBack({
      delta: 1,
    });
  }

  onNavigationBarButtonTap() {
    uni.$emit("backToMessagePage");
  }

  navigateBack() {
    uni.$emit("backToMessagePage");
  }

  onBackPress() {}

  closeFetchBadge(isBadge: boolean) {
    this.isBadgeToast = isBadge;
  }

  ViewBadgeByMessage(e) {
    uni.navigateTo({
      url:
        "/pages/profile/BadgeList?childId=" +
        encodeURIComponent(this.currentId) +
        "&childName=" +
        encodeURIComponent(this.childName),
    });
    this.currentId = "";
  }
}
</script>

<style lang="scss" scoped>
.message-detail {
  padding: 40rpx 20rpx;
}

.date-picker {
  background-color: #ffffff;
  background-image: url("https://contentdevsa-blob.ai121.net/testcontainer/static/activity/img/message_card_bg.png");
  background-position: top left;
  background-repeat: no-repeat;
  background-size: contain;
  border-radius: 30rpx;
  box-shadow: 10rpx 10rpx 10rpx 10rpx rgba(84, 84, 84, 0.1);
  margin-bottom: 40rpx;
  width: 100%;
}

.date-picker-inner-box {
  border-radius: 30rpx;
  box-sizing: border-box;
  /* background-color: #ffffff; */
  /* background: url("../../static/icon/message_date_card_bg.png") no-repeat top
    left/contain; */

  /* background: linear-gradient(360deg, #c4c2c2c7 0%, rgba(84, 84, 84, 0.1) 0%);
  width: 100%; */
  padding: 20rpx;
  position: relative;
}

.middle-line {
  border-right: 5rpx dashed #d6d6d6;
  height: 300rpx;
  left: 49.5%;
  position: absolute;
  top: 66rpx;
  z-index: 100;
}

.colume-line {
  border-top: 5rpx solid #f1f1f1;
  height: 2rpx;
  position: absolute;
  top: 366rpx;
  /* left: 49.5%; */
  width: 675rpx;
  z-index: 100;
}

.date-picker-header {
  align-items: flex-end;
  color: $ai121-theme-color;
  display: flex;
  flex-direction: row;
  height: 50rpx;
  justify-content: center;
  margin-bottom: 20rpx;
}

.times {
  font-size: 50rpx;
}

.picker-header-text {
  font-size: 40rpx;
}

.swiper-box {
  height: 330rpx;
  width: 100%;
}

.swiper-dashed {
  border-right: 1rpx dashed #d6d6d6;
  height: 300rpx;
  margin: 0 auto;
}

.swiper-item {
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 100% !important;
}

.daily-box {
  background-color: #f1f1f1;
  border-radius: 25rpx 25rpx 0 0;
  width: 50rpx;
}

.daily-line {
  border-bottom: 1rpx solid #f1f1f1;
  height: 1rpx;
  width: 100%;
}

.daily-day {
  text-align: center;
}

.active {
  background-color: $ai121-theme-color;
}

.fontactive {
  color: $ai121-theme-color;
}

.date-picker-notice {
  align-items: center;
  display: flex;
  flex-direction: row;
  height: 50rpx;
  justify-content: center;
}

.notice {
  background-color: $ai121-theme-color;
  height: 20rpx;
  margin-right: 10rpx;
  width: 20rpx;
}

.message-list {
  background-color: #fff;
  border-radius: 30rpx;
  color: #fff;
  margin-bottom: 40rpx;
  width: 100%;
}

.message-list-date {
  align-items: center;
  color: #757575;
  display: flex;
  flex-direction: row;
  font-size: 40rpx;
  justify-content: flex-start;
  margin: 20rpx;
  margin-bottom: 40rpx;
  padding-top: 20rpx;
  width: 100%;
}

.massage-list-text {
  align-items: center;
  color: #000;
  display: flex;
  flex-direction: row;
  height: 240rpx;
  justify-content: flex-start;
  width: 100%;
}

.no-massage-list-text {
  color: #757575;
  height: calc(100vh - 880rpx);
  padding-top: 20rpx;
  text-align: center;
  width: 100%;
}

.message-list-left {
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: flex-start;
  width: 10%;
}

.cicle {
  align-items: center;
  display: flex;
  height: 30rpx;
  justify-content: center;
  width: 30rpx;
}

.dash-line {
  border-right: 1rpx solid #d8d8d8;
  height: 215rpx;
}

.cicle-border {
  align-items: center;
  border: 5rpx solid $ai121-theme-color;
  border-radius: 50%;
  display: flex;
  height: 20rpx;
  justify-content: center;
  width: 20rpx;
}

.cicle-soild {
  background-color: $ai121-theme-color;
  border-radius: 50%;
  height: 10rpx;
  width: 10rpx;
}

.cicle-border1 {
  align-items: center;
  border: 5rpx solid $ai121-theme-color;
  border-radius: 50%;
  display: flex;
  height: 10rpx;
  justify-content: center;
  width: 10rpx;
}

.message-list-right {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  padding-bottom: 40rpx;
  width: 90%;
  /* border-bottom: 1rpx solid gray; */
}

.message-list-text-time {
  align-items: center;
  display: flex;
  flex-direction: row;
  height: 30%;
  justify-content: flex-start;
  margin-bottom: 15rpx;
  width: 100%;
}

.message-list-text-text {
  height: 70%;
  line-height: 1.5em;
  text-align: left;
  width: 100%;
}

.text-pre {
  color: #757575;
  font-size: 30rpx;
}
.text-pre a {
  color: $ai121-theme-color !important;
}

.text-light {
  border-bottom: 1rpx solid $ai121-theme-color;
  color: $ai121-theme-color;
  font-size: 30rpx;
}

.message-list-footer {
  height: 20rpx;
  width: 100%;
}

.message-footer {
  background-color: #fff;
  border-radius: 30rpx;
  bottom: 0;
  left: 0;
  padding: 0 20rpx 20rpx;
  position: fixed;
  right: 0;
}

.back-button {
  background-color: $ai121-theme-color;
  border-radius: 30rpx;
  color: #fff;
}
</style>

