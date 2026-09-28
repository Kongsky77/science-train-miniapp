<template>
  <div class="notice-card" @click="onClick(card)">
    <div class="notice-card-icon-box" v-if="isLogin && noticeCardsLength">
      <image
        class="notice-card-icon"
        mode="widthFix"
        :src="card.img || defaultIcon"
      ></image>
    </div>
    <div class="notice-card-content" v-if="noticeCardsLength">
      <div class="notice-card-title">{{ card.title }}</div>
      <div class="notice-card-text">
        {{ card.text }}
      </div>
    </div>

    <div class="notice-card-icon-box" v-if="noticeCardsLength < 1">
      <image
        class="notice-card-icon"
        mode="widthFix"
        :src="defaultIcon"
      ></image>
    </div>

    <div
      class="notice-card-content"
      v-if="isLogin && noticeCardsLength < 1 && activityId"
    >
      <div class="notice-card-title">最近参与的活动</div>
      <div class="notice-card-text">
        您最近正在参与《 {{ activityName }} 》活动！
      </div>
    </div>

    <div
      class="notice-card-content"
      v-if="
        isLogin && noticeCardsLength < 1 && activityId === '' && hotActivityId
      "
    >
      <div class="notice-card-title">热门活动</div>
      <div class="notice-card-text">
        最近大家都在参与《 {{ hotActivityName }} 》活动，快来加入吧！
      </div>
    </div>

    <div
      class="notice-card-content"
      v-if="isLogin && noticeCardsLength < 1 && flat === 2"
    >
      <div class="notice-card-title">系统消息</div>
      <div class="notice-card-text">
        你可以在这里收到最新的消息!所有的精彩不容错过哦！
      </div>
    </div>

    <div class="notice-card-content" v-if="!isLogin">
      <div class="notice-card-title">立即登录</div>
      <div class="notice-card-text">登录后，您能在这里查看更多系统消息！</div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import NoticeCardItem from "@/beans/notice/NoticeCardItem";
import ActivityService from "@/service/ActivityService";
import { TargetType } from "@/enums/notice/NoticeItemEnum";

@Component({
  name: "NoticeCard",
})
export default class NoticeCard extends Vue {
  @Prop()
  card!: NoticeCardItem;

  @Prop()
  noticeCardsLength: string;

  @Prop()
  isLogin: boolean;

  @Prop()
  noticeActivitySrc: string;

  activityService = new ActivityService();
  activityId = "";
  activityName = "";
  hotActivityId = "";
  hotActivityName = "";
  noticeText = "";
  flat = 0;

  defaultIcon = "https://contentdevsa-blob.ai121.net/testcontainer/activity/image/9bdc6669-bf6b-4803-852f-02f87b47ec1d.png"

  @Watch("noticeActivitySrc")
  fet(noticeActivitySrc: string) {
    this.getBasicInfo(noticeActivitySrc);
  }

  mounted() {
    if (this.isLogin) {
      this.fetchLastEntry();
      // this.doNoticeText(this.card);
    }
  }

  onClick(card: NoticeCardItem) {
    if (this.isLogin) {
      if (Number(this.noticeCardsLength) < 1) {
        if (this.activityId) {
          this.$emit("click", this.activityId);
        } else if (this.hotActivityId) {
          this.$emit("click", this.hotActivityId);
        } else {
          uni.showToast({
            icon: "none",
            title: "暂无消息！",
            duration: 2000,
          });
        }
      } else {
        this.$emit("click", card);
      }
    } else {
      this.$emit("click", card);
    }
  }

  // 得到基本信息
  getBasicInfo(id: string) {
    console.log("getBasicInfo");

    // const that = this;
    this.activityService.getDetail(id).then((res) => {
      if (res.success && res.data) {
        const data = res.data;
        this.hotActivityId = data.id;
        this.hotActivityName = data.name;
        if (this.hotActivityId === "") {
          this.flat++;
          console.log("这里是为了测试flat", this.flat);
        }
      } else {
        this.flat++;
        console.log("这里是为了测试flat", this.flat);
      }
    });
  }

  // //处理消息文本
  // doNoticeText(card: NoticeCardItem) {
  //   this.activityService.getDetail(card.targetActivityId).then((res) => {
  //     if (res.success && res.data) {
  //       if (card.targetType === TargetType.BADGE) {
  //         this.noticeText =
  //           "您的孩子在《" + res.data.name + "》活动中获得了一枚新徽章";
  //       } else if (card.targetType === TargetType.CERT) {
  //         this.noticeText =
  //           "您的孩子在《" + res.data.name + "》活动中获得了一份证书";
  //       } else {
  //         this.noticeText = card.text;
  //       }
  //     }
  //   });
  // }

  // 获取账号最后一次参加的活动
  fetchLastEntry() {
    this.activityService.getLastEntry().then((res) => {
      if (res.success && res.data) {
        const data = res.data;
        this.activityId = data.activity.id;
        this.activityName = data.activity.name;
        if (this.activityId === "") {
          this.flat++;
        }
      } else {
        /**
         * 这里的代码是我第一次修改时创建的，因为如果用户是新用户的话，数据应该为空，故而上方的if判断应该执行不了
         * 同理上方getBasicInfo的这段代码，目前是否会有其他隐藏bug暂不知道，做个标记方便日后修改
         */
        this.flat++;
      }
    });
  }
}
</script>
<style scoped>
.notice-card {
  width: 88%;
  background: #fff;
  margin: 30rpx auto 0;
  box-shadow:0 6px 10px rgba(0, 0, 0, 0.14);
  border-radius: 30rpx;
  display: flex;
}

.notice-card-icon-box {
  width: 160rpx;
  height: 200rpx;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.notice-card-icon {
  width: 120rpx;
}

.notice-card-content {
  padding: 0 20rpx;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #888888;
}

.notice-card-title {
  font-size: 32rpx;
  margin-bottom: 20rpx;
}

.notice-card-text {
  font-size: 24rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  word-break: break-all;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}
</style>
