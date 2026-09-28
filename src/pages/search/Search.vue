<template>
  <main class="search-container">
    <van-search
      shape="round"
      show-action
      field-class="field-search"
      input-class="field-input-search"
      :value="keyword"
      autofocus
      placeholder="请输入搜索关键词"
      @search="onSearch"
      @cancel="onCancel"
    />
    <column-icon :border="false" />
    <main class="search-history">
      <title-bar
        :title="title"
        :right-title="deleteSlogan"
        :is-show-arrow="false"
        @click="clearHistory"
      />
      <main class="history-container">
        <div
          v-for="(item) of historyRecords"
          :key="item.id"
          @click="onClickContent(item.id)"
        >
          <van-tag
            v-if="themeType === themeTypeEnum.NORMAL||themeType === themeTypeEnum.ZHONG_GUO_XIN"
            color="#3646A5"
            style="margin-right: 30rpx"
            type="primary"
            size="large"
            round
            >{{ item.content }}
          </van-tag>
          <van-tag
            v-if="themeType === themeTypeEnum.GF"
            color="#707d3d"
            style="margin-right: 30rpx"
            type="primary"
            size="large"
            round
            >{{ item.content }}
          </van-tag>
        </div>
      </main>
    </main>
  </main>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import ColumnIcon from "@/components/common/ColumnIcon.vue";
import TitleBar from "@/components/common/TitleBar.vue";
import SearchHistoryManagement from "@/management/search/SearchHistoryManagement";
import HistoryRecordVO from "@/beans/activity/res/HistoryRecordVO";
import { Utils } from "@/common/utils/Utils";
import ThemeTypeEnum from "@/enums/theme/ThemeTypeEnum";

@Component({
  name: "Search",
  components: {
    TitleBar,
    ColumnIcon
  }
})
export default class Search extends Vue {
  title: string = "历史记录";
  deleteSlogan: string = "删除";
  historyRecords: HistoryRecordVO[] = [];
  keyword: string =''

  themeType: string = process.env.VUE_APP_THEME_TYPE;
  themeTypeEnum = ThemeTypeEnum;
  
  onLoad() {
    this.loadHistoryRecords();
  }

  onClickContent(id: string) {
    this.moveToActivityCategoryPage(
      SearchHistoryManagement.getInstance().getHistoryById(id).content
    );
  }

  onPullDownRefresh() {
    this.loadHistoryRecords();
    setTimeout(() => {
      uni.stopPullDownRefresh();
    }, 1000);
  }

  loadHistoryRecords() {
    this.historyRecords = SearchHistoryManagement.getInstance().getSearchHistory();
  }

  calSaveHistoryRecords(keyWords: string): HistoryRecordVO[] {
    const randomId = Utils.getRandom();
    let saveHistoryRecords = this.historyRecords;
    if (typeof saveHistoryRecords !== "string") {
      if (saveHistoryRecords.length >= 5) {
        saveHistoryRecords.pop();
        saveHistoryRecords.unshift({
          id: randomId,
          content: keyWords
        });
      } else if (saveHistoryRecords.length === 0) {
        saveHistoryRecords.push({
          id: randomId,
          content: keyWords
        });
      } else {
        saveHistoryRecords.unshift({
          id: randomId,
          content: keyWords
        });
      }
    } else {
      saveHistoryRecords = [];
      saveHistoryRecords.push({
        id: randomId,
        content: keyWords
      });
    }
    return saveHistoryRecords;
  }

  onSearch(keyWords: any) {
    const historyRecords = this.calSaveHistoryRecords(keyWords.detail);
    this.saveHistory(historyRecords);
    this.moveToActivityCategoryPage(keyWords.detail);
  }

  moveToActivityCategoryPage(keyWords: string) {
    uni.navigateTo({
      url: `/pages/activity-category/ActivityCategoryPage?title=搜索结果&keyWords=${keyWords}`
    });
  }

  saveHistory(historyRecords: HistoryRecordVO[]) {
    SearchHistoryManagement.getInstance().saveSearchHistory(historyRecords);
  }

  clearHistory() {
    SearchHistoryManagement.getInstance().removeSearchHistory();
    this.loadHistoryRecords();
  }

  onCancel() {
    uni.redirectTo({
      url: "/pages/copetitionList/AllActivity"
    });
  }

}
</script>

<style lang="scss">
.search-container {
  width: 100%;
}

.van-search__content {
  padding-left: 0 !important;
}

.field-search {
  border-radius: 34rpx;
  background-color: white;
  padding-left: 20rpx;
  box-shadow: 0px 5rpx 18rpx rgba(0, 0, 0, 0.16);
}

.search-history {
  margin-top: 40rpx;
  .history-container {
    width: 88%;
    margin: 40rpx auto;
    display: flex;
  }
}
</style>
