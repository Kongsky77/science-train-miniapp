<template>
  <main>
    <div style="overflow-x: hidden">
      <div class="search-box" @click="goToSearchPage">
        <span>请输入活动名称</span>
        <image :src="imgUrl + '/search-icon.png'" mode="widthFix" role="img" />
      </div>
      <activity-card
        v-if="activityList.length > 0"
        :activities-list="activityList"
        @on-activity-item-click="onActivityItemClick"
      />
      <van-empty
        v-else
        class="custom-image"
        :image="staticFileEnum.NO_TAG_CONTENT_NOTICE_IMG"
        :description="langEnum.NO_TAG_CONTENT_NOTICE"
      />
    </div>
  </main>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
// import ActivitySwiper from "@/components/common/ActivitySwiper.vue";
// import ColumnIcon from "@/components/common/ColumnIcon.vue";
// import ActivityFilter from "@/components/common/ActivityFilter.vue";
import ColumnItemVO from "@/beans/activity/res/ColumnItemVO";
// import TitleBar from "@/components/common/TitleBar.vue";
import SwiperChannelEnum from "@/enums/activity/SwiperChannelEnum";
import ColumnIdEnum from "@/definition/common/ColumnIdEnum";
import StaticFileEnum from "@/definition/lang/StaticFileEnum";
import LangEnum from "@/definition/lang/LangEnum";
import ActivityCard from "@/components/common/ActivityCard.vue";
import ActivityService from "@/service/ActivityService";
import FilterActivityDTO from "@/beans/activity/req/FilterActivityDTO";
import ActivityFullItem from "@/beans/activity/ActivityFullItem";
// import { Utils } from "@/common/utils/Utils";
import ShowNoticeManagement from "@/management/common/ShowNoticeManagement";
import ActivityFullList from "@/beans/activity/res/ActivityFullList";
// import SwiperVO from "@/beans/activity/res/SwiperVO";
import ThemeTypeEnum from "@/enums/theme/ThemeTypeEnum";

@Component({
  name: "AllActivity",
  components: {
    // ColumnIcon,
    // ActivitySwiper,
    ActivityCard,
    // ActivityFilter,
    // TitleBar,
  },
})
export default class AllActivity extends Vue {
  @Prop({
    default: [],
  })
  columnList: Array<ColumnItemVO>;

  columnIdEnum = ColumnIdEnum;

  moreTitle = "更多";

  swiperChannelEnum = SwiperChannelEnum;

  startAge: number = -1;

  endAge: number = -1;

  tagId: string = "";

  // swiperVO: SwiperVO[] = [];

  activityList: ActivityFullItem[] = [];

  isEmpty: boolean = false;

  staticFileEnum = StaticFileEnum;

  langEnum = LangEnum;

  page = 1;

  maxPageNo = 1;

  isRank: boolean = false;

  // 筛选参数
  filterType: string = "";

  onLoad(option) {
    if (option.id === "rank") {
      this.isRank = true;
    } else {
      this.filterType = option.id || "";
      this.isRank = false;
    }

    uni.setNavigationBarTitle({
      title: option.title,
    });

    this.fetchAllActivity();
    // uni.$on(LangEnum.INDEX_REACH_BOTTOM_EVENT_NAME, () => {
    //   this.onReachAllActivityBottom();
    // });
  }
  get imgUrl() {
    return `${process.env.VUE_APP_BLOB_IMAGE_URL_NEW}/competition-list`;
  }

  onReachBottom() {
    console.log(333);
    
    if (this.page < this.maxPageNo) {
      this.page++;
      this.fetchAllActivity();
    } else {
      ShowNoticeManagement.ShowErrorNotice(LangEnum.NO_MORE_DATA);
    }
  }

  get isTfgf() {
    let isTfgf: boolean;
    if (process.env.VUE_APP_THEME_TYPE === ThemeTypeEnum.GF) {
      isTfgf = true;
    } else {
      isTfgf = false;
    }
    return isTfgf;
  }

  goToSearchPage() {
    uni.navigateTo({
      url: "/pages/search/Search",
    });
  }

  fetchAllActivity() {
    const activityService = new ActivityService();
    const filterActivityDTO = new FilterActivityDTO();
    if (this.filterType != "") {
      filterActivityDTO.columnId = this.filterType;
    }
    filterActivityDTO.isLoadEntryUserCount = 1;
    filterActivityDTO.pageNo = this.page;
    filterActivityDTO.ageStart = this.startAge;
    filterActivityDTO.ageEnd = this.endAge;
    filterActivityDTO.tagIds = this.tagId;
    filterActivityDTO.hasRank = this.isRank?1: 0;
    activityService.receiveActivityList(
      filterActivityDTO,
      this.fetchAllActivityCallback,
      true
    );
  }

  fetchAllActivityCallback(success: boolean, activityList: ActivityFullList) {
    if (success) {
      this.maxPageNo = activityList.pages;
      if (activityList.pageNo === 1) {
        this.activityList = activityList.records;
      } else {
        for (let i = 0; i < activityList.records.length; i++) {
          this.activityList.push(activityList.records[i]);
        }
      }
      for (let i = 0; i < this.activityList.length; i++) {
        const item = this.activityList[i];
        this.getMembers(item.id);
      }
    }
  }

  onActivityItemClick(id: string) {
    if (this.isRank) {
      uni.navigateTo({
        url: `/pages/rank/index?activityId=${id}`,
      });
      return;
    }
    uni.navigateTo({
      url: `/pages/activityDetail/index?id=${id}`,
    });
  }

  // async fetchAllActivitySwiperList() {
  //   const activityService = new ActivityService();
  //   const {
  //     success: success,
  //     data: data,
  //   } = await activityService.receiveAllActivitySwiper();
  //   if (success) this.swiperVO = data;
  // }

  getMembers(id: string) {
    const activityService = new ActivityService();
    activityService.getMembers(id).then((res) => {
      if (res.success && res.data) {
        const data = res.data;
        const totalMembers = data.total; // 最多显示 999 个人数
        const avatars = data.records.map((item) => item.avatar).slice(0, 3);
        this.activityList.map((item) => {
          if (item.id === id) {
            item.avatar = avatars;
            item.totalMember = totalMembers;
          }
        });
      }
    });
  }

  onTagClick(id: string): void {
    this.page = 1;
    this.tagId = id;
    this.fetchAllActivity();
  }

  onAgeTagClick(startAge: number, endAge: number) {
    this.page = 1;
    this.startAge = startAge;
    this.endAge = endAge;
    this.fetchAllActivity();
  }
}
</script>

<style lang="scss" scoped>
.content-box {
  margin-top: 50rpx;
}
.search-box {
  width: 95%;
  margin: 16rpx auto;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 68rpx;
  line-height: 68rpx;
  background: #ffffff;
  border-radius: 16rpx;
  border: 2rpx solid #4e83e6;

  span {
    flex: 1;
    margin: 0 20rpx;
    font-size: 28rpx;
    font-family: PingFang SC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(78, 131, 230, 0.5);
    line-height: 52rpx;
  }
  image {
    width: 40rpx;
    margin-right: 20rpx;
  }
}
</style>

