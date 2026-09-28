<template>
  <main class="activity-filter" :style="{ paddingTop: paddingTop + 'rpx' }">
    <main v-if="isShowAge"
      class="filter"
      :style="{ overflow: isOpenScroll ? 'visible' : 'hidden' }"
    >
      <div>年龄：</div>
      <div
        :style="{
          flexWrap: isOpenScroll ? 'nowrap' : 'wrap',
          overflowY: isOpenScroll ? 'auto' : 'visible'
        }"
      >
        <div
          v-for="item in ageList"
          :style="{ marginTop: '10rpx' }"
          @click="onAgeTagClick(item.id, item.startAge, item.endAge)"
          :key="item.id"
        >
          <van-tag
            v-if="themeType === themeTypeEnum.NORMAL||themeType === themeTypeEnum.ZHONG_GUO_XIN"
            color="#3646A5"
            custom-class="activity-know-tag"
            :plain="!item.isActive"
            style="margin-right: 30rpx"
            type="primary"
            size="large"
            round
            >{{
              item.text
            }}</van-tag
          >
          <van-tag
            v-if="themeType === themeTypeEnum.GF"
            color="#707d3d"
            custom-class="activity-know-tag"
            :plain="!item.isActive"
            style="margin-right: 30rpx"
            type="primary"
            size="large"
            round
            >{{
              item.endAge === -1 && item.startAge === -1
                ? "不限"
                : item.startAge + "-" + item.endAge + "岁"
            }}</van-tag
          >
        </div>
      </div>
    </main>
    <main class="filter" v-if="isShowTag">
      <div>标签：</div>
      <div
        :style="{
          flexWrap: isOpenScroll ? 'nowrap' : 'wrap',
          overflowY: isOpenScroll ? 'auto' : 'visible'
        }"
        class="tag-container"
      >
        <div
          v-for="item of tagList"
          :style="{ marginTop: '10rpx' }"
          :key="item.id"
          @click="onTagClick(item.id)"
        >
          <van-tag
            v-if="themeType === themeTypeEnum.NORMAL||themeType === themeTypeEnum.ZHONG_GUO_XIN"
            color="#3646A5"
            custom-class="activity-know-tag"
            style="margin-right: 20rpx"
            :plain="!item.isActive"
            type="primary"
            size="large"
            round
            >{{ item.name }}</van-tag
          >
          <van-tag
            v-if="themeType === themeTypeEnum.GF"
            color="#707d3d"
            custom-class="activity-know-tag"
            style="margin-right: 20rpx"
            :plain="!item.isActive"
            type="primary"
            size="large"
            round
            >{{ item.name }}</van-tag
          >
        </div>
      </div>
    </main>
  </main>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import ActivityService from '@/service/ActivityService'
import ActivityTagVO from '@/beans/activity/res/ActivityTagVO'
import ThemeTypeEnum from '@/enums/theme/ThemeTypeEnum'
import WeAnalysisEventManagement from '@/management/wx/WeAnalysisEventManagement'
import EventNameEnum from '@/definition/common/EventNameEnum'
import ClickApplicationLabelDTO from '@/definition/common/event/ClickApplicationLabelDTO'
import ClickAgeDTO from '@/definition/common/event/ClickAgeDTO'

@Component({
  name: "ActivityFilter"
})
export default class ActivityFilter extends Vue {
  @Prop()
  paddingTop: number;

  @Prop({
    default: false
  })
  isOpenScroll: boolean;

  @Prop({
    default: 'black'
  })
  color: string

  @Prop({
    default: true
  })
  isShowTag: boolean

  @Prop({
    default: true
  })
  isShowAge: boolean

  @Prop()
  columnId: string

  @Prop()
  initActiveTagIds: string

  tagList: Array<ActivityTagVO> = [];

  themeType: string = process.env.VUE_APP_THEME_TYPE;
  themeTypeEnum = ThemeTypeEnum;

  ageList = [
    {
      id: 0,
      startAge: -1,
      endAge: -1,
      isActive: true,
      text: '不限'
    },
    {
      id: 1,
      startAge: 5,
      endAge: 6,
      text: '5-6岁',
      isActive: false
    },
    {
      id: 2,
      startAge: 7,
      endAge: 9,
      text: '7-9岁',
      isActive: false
    },
    {
      id: 3,
      startAge: 10,
      endAge: 100,
      text: '10岁+',
      isActive: false
    }
  ];

  mounted() {
    this.fetchTagList();
  }

  get currentScreenWidth() {
    return uni.getSystemInfoSync().screenWidth;
  }

  // isAgeShow(index: number) {
  //   if (this.isOpenScroll === false) {
  //     return this.currentScreenWidth < 390 && index >= 3;
  //   }
  // }

  // isTagShow(index: number) {
  //   if (this.isOpenScroll === false) {
  //     if (this.currentScreenWidth < 390 && index >= 4) {
  //       return true;
  //     } else return this.currentScreenWidth >= 390 && index >= 5;
  //   }
  // }

  fetchTagList() {
    const activityService = new ActivityService();
    activityService.receiveTagList(this.columnId, this.fetchTagListCallback);
  }

  onTagClick(id: string) {
    this.tagList.map(item => {
      item.isActive = item.id === id;
    })
    const item = this.tagList.find((self) => {
      return self.id === id
    })
    WeAnalysisEventManagement.reportEvent(EventNameEnum.CLICK_APPLICATION_LABEL,new ClickApplicationLabelDTO(item.name))
    this.$emit("onTagClick", id);
  }

  onAgeTagClick(id: number, startAge: number, endAge: number) {
    this.ageList.map(item => {
      item.isActive = item.id === id;
    })
    const item = this.ageList.find((self) => {
      return self.id === id
    })
    WeAnalysisEventManagement.reportEvent(EventNameEnum.CLICK_AGE, new ClickAgeDTO(item.text))
    this.$emit("onAgeTagClick", startAge, endAge);
  }

  fetchTagListCallback(success: boolean, tagList: Array<ActivityTagVO>) {
    this.tagList = tagList;

    if (this.initActiveTagIds === "") {
      this.tagList.unshift({
        id: "",
        name: "不限",
        isActive: true
      });
    } else {
      this.tagList.unshift({
        id: "",
        name: "不限",
        isActive: false
      });
    }
    const initActiveTagIds = this.initActiveTagIds.split(",");
    this.tagList.map(item => {
      initActiveTagIds.map(id => {
        if (item.id === id) {
          item.isActive = true;
        }
      });
    });    
  }
}
</script>

<style lang="scss">
.activity-filter {
  width: 88%;
  margin: 20rpx auto;
  border-bottom: 1px solid #e5e5e5;
  padding-bottom: 20rpx;
  .filter {
    display: flex;
    flex-wrap: wrap;
    margin-top: 30rpx;
    margin-bottom: 20rpx;
    overflow: hidden;
    .activity-know-tag {
      font-size: 24rpx;
    }
    & > div:first-child {
      width: 15%;
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      margin-top: 10rpx;
      white-space: nowrap;
    }
    & > div:last-child {
      width: 85%;
      display: flex;
      align-items: flex-start;
      &::-webkit-scrollbar {
        display: none;
      }
      & > div {
        flex-shrink: 0;
        margin-top: 0rpx;
      }
    }
  }
}
</style>
