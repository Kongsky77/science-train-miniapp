<template>
  <view class="museum-intro-page">
    <view v-if="loading" class="page-state">
      <view class="state-title">正在读取场馆介绍</view>
      <view class="state-copy">列车正在同步最新内容…</view>
    </view>

    <view v-else-if="museum" class="museum-intro">
      <view
        v-for="(copy, index) in copies"
        :key="index"
        class="intro-section"
      >
        <view v-if="copy.title" class="section-title">{{ copy.title }}</view>
        <u-parse
          class="section-content"
          :content="copy.content"
          :img-options="false"
        />
      </view>

      <view v-if="!copies.length" class="intro-section">
        <view class="section-title">场馆介绍</view>
        <view class="section-empty">场馆介绍内容正在完善中。</view>
      </view>
    </view>

    <view v-else class="page-state">
      <view class="state-title">暂未读取到场馆介绍</view>
      <view class="state-copy">请返回上一页后稍后再试。</view>
    </view>
  </view>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ActivityFullItem from "@/beans/activity/ActivityFullItem";
import ActivityCopy from "@/beans/activity/res/ActivityCopy";
import ActivityService from "@/service/ActivityService";
import uParse from "@/components/feng-parse/parse.vue";

@Component({
  name: "KjgMuseumDetailPage",
  components: {
    uParse,
  },
})
export default class KjgMuseumDetailPage extends Vue {
  activityService = new ActivityService();
  museum: ActivityFullItem | null = null;
  copies: ActivityCopy[] = [];
  loading = true;

  onLoad(options: { id?: string }) {
    const id = options && options.id ? decodeURIComponent(options.id) : "";
    if (!id) {
      this.loading = false;
      return;
    }
    this.loadMuseumIntroduction(id);
  }

  loadMuseumIntroduction(id: string) {
    this.loading = true;
    Promise.all([
      this.activityService.getPublicDetail(id),
      this.activityService.getPublicDetailCopy(id).catch(() => null),
    ])
      .then(([detailResponse, copyResponse]) => {
        if (!detailResponse.success || !detailResponse.data) {
          this.museum = null;
          return;
        }
        this.museum = detailResponse.data;
        this.copies =
          copyResponse && copyResponse.success && Array.isArray(copyResponse.data)
            ? copyResponse.data
            : [];
      })
      .catch(() => {
        this.museum = null;
        this.copies = [];
      })
      .then(() => {
        this.loading = false;
      });
  }
}
</script>

<style lang="scss" scoped>
$navy: #103873;
$ink: #17233c;
$muted: #667085;

.museum-intro-page {
  box-sizing: border-box;
  min-height: 100vh;
  padding: 24rpx 24rpx calc(44rpx + env(safe-area-inset-bottom));
  background: linear-gradient(180deg, #eef8fb 0, #fff 180rpx, #fffde9 100%);
  color: $ink;
  font-family: "PingFang SC", "Microsoft YaHei", Arial, sans-serif;
}

.museum-intro {
  overflow: hidden;
  border: 2rpx solid rgba(185, 220, 232, 0.76);
  border-radius: 28rpx;
  background: rgba(255, 253, 250, 0.94);
  box-shadow: 0 10rpx 30rpx rgba(31, 70, 112, 0.07);
}

.intro-section {
  padding: 30rpx;
  border-bottom: 2rpx dashed rgba(100, 191, 255, 0.62);
}

.intro-section:last-child {
  border-bottom: 0;
}

.section-title {
  color: $navy;
  font-size: 31rpx;
  font-weight: 800;
  line-height: 1.45;
}

.section-content {
  margin-top: 18rpx;
  color: $ink;
  font-size: 25rpx;
  line-height: 1.8;
}

.section-empty {
  margin-top: 16rpx;
  color: $muted;
  font-size: 24rpx;
  line-height: 1.7;
}

.page-state {
  box-sizing: border-box;
  margin-top: 24rpx;
  padding: 80rpx 34rpx;
  border: 2rpx dashed rgba(100, 191, 255, 0.62);
  border-radius: 24rpx;
  background: rgba(255, 253, 250, 0.86);
  text-align: center;
}

.state-title {
  color: $navy;
  font-size: 30rpx;
  font-weight: 800;
}

.state-copy {
  margin-top: 14rpx;
  color: $muted;
  font-size: 22rpx;
  line-height: 1.6;
}

/deep/ .section-content image,
/deep/ .section-content img {
  max-width: 100% !important;
}
</style>
