<template>
  <view class="museum-list-page">
    <view class="page-heading">
      <view class="heading-meta">
        <text>川 · 渝 · 黔</text>
        <text>{{ museums.length }} 家场馆</text>
      </view>
      <view class="page-title">探索科技馆</view>
      <view class="page-subtitle">从城市出发，发现值得亲自走近的科学空间</view>
      <image
        class="heading-train"
        src="/static/image/kjg-home/museum-list.png"
        mode="aspectFit"
        aria-hidden="true"
      />
    </view>

    <view class="region-filter">
      <view
        v-for="region in regionOptions"
        :key="region"
        :class="['region-filter-item', activeRegion === region ? 'is-active' : '']"
        @click="selectRegion(region)"
      >
        <text>{{ region }}</text>
        <text class="region-filter-count">{{ region === "全部" ? museums.length : regionCount(region) }}</text>
      </view>
    </view>

    <view v-if="loading" class="museum-state">
      <view class="museum-state-title">正在读取场馆</view>
      <view class="museum-state-copy">列车正在同步最新场馆信息…</view>
    </view>

    <view v-else-if="loadError" class="museum-state">
      <view class="museum-state-title">场馆列表暂时未到站</view>
      <view class="museum-state-copy">{{ loadError }}</view>
      <view class="museum-retry" @click="loadMuseums">重新加载</view>
    </view>

    <view v-else-if="!filteredMuseums.length" class="museum-state">
      <view class="museum-state-title">暂无场馆</view>
      <view class="museum-state-copy">该地区暂时没有已发布的场馆介绍。</view>
    </view>

    <view v-else class="museum-list">
      <view
        v-for="(museum, index) in filteredMuseums"
        :key="museum.id"
        class="museum-card"
        @click="goToDetail(museum.id)"
      >
        <view class="card-visual-slot" aria-hidden="true">
          <image
            v-if="museum.imgCover"
            class="card-cover"
            :src="museum.imgCover"
            mode="aspectFill"
          />
          <view class="card-sequence">{{ sequence(index) }}</view>
        </view>
        <view class="card-content">
          <view class="card-region">{{ museumRegion(museum) || "地区待确认" }} · 科普场馆</view>
          <view class="card-name">{{ museumDisplayName(museum.name) }}</view>
          <view class="card-arrow" aria-hidden="true">›</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ActivityFullItem from "@/beans/activity/ActivityFullItem";
import ActivityFullList from "@/beans/activity/res/ActivityFullList";
import FilterActivityDTO from "@/beans/activity/req/FilterActivityDTO";
import ActivityService from "@/service/ActivityService";
import {
  SICHUAN_SCIENCE_MUSEUM_ACTIVITY_ID,
} from "@/definition/scienceTrain/ScienceTrainConfig";
import { resolveCheckInRegion } from "@/utils/check-in/CheckInRegion";

const MUSEUM_COLUMN_ID = "847745989091397";
const FENGJIE_SCIENCE_MUSEUM_ACTIVITY_ID = "847747001024581";
const SICHUAN_MUSEUM_ACTIVITY_ID_WHITELIST = new Set([
  "849518550028357", // 袁隆平杂交水稻科技馆
  "849558344605765", // 宁南县科技馆
  "849559649062981", // 江安县科技馆
  "849560697475141", // 生命奥秘博物馆
]);
type MuseumRegion = "重庆" | "四川" | "贵州";
const MUSEUM_REGION_ORDER: MuseumRegion[] = ["四川", "重庆", "贵州"];

@Component({
  name: "KjgMuseumListPage",
})
export default class KjgMuseumListPage extends Vue {
  activityService = new ActivityService();
  museums: ActivityFullItem[] = [];
  regionOptions: Array<"全部" | MuseumRegion> = ["全部", "四川", "重庆", "贵州"];
  activeRegion: "全部" | MuseumRegion = "全部";
  loading = true;
  loadError = "";

  onLoad() {
    this.loadMuseums();
  }

  get filteredMuseums(): ActivityFullItem[] {
    if (this.activeRegion === "全部") {
      const orderedMuseums = MUSEUM_REGION_ORDER.reduce<ActivityFullItem[]>(
        (orderedMuseums, region) =>
          orderedMuseums.concat(
            this.museums.filter(
              (museum) => this.museumRegion(museum) === region
            )
        ),
        []
      );
      return orderedMuseums.concat(
        this.museums.filter((museum) => !this.museumRegion(museum))
      );
    }
    return this.museums.filter(
      (museum) => this.museumRegion(museum) === this.activeRegion
    );
  }

  loadMuseums() {
    this.loading = true;
    this.loadError = "";
    const filter = new FilterActivityDTO();
    filter.columnId = MUSEUM_COLUMN_ID;
    filter.pageNo = 1;
    filter.pageSize = 100;
    this.activityService
      .receiveActivityList(
        filter,
        (success, result) => {
          const page = result as ActivityFullList;
          if (success && page && Array.isArray(page.records)) {
            this.ensureSichuanMuseum(page.records)
              .then((museums) => this.ensureFengjieMuseum(museums))
              .then((museums) => {
                this.museums = museums;
                this.loading = false;
              });
            return;
          }
          this.loading = false;
          this.loadError = "没有读取到场馆数据，请稍后再试。";
        },
        true
      )
      .catch(() => {
        this.loading = false;
        this.loadError = "网络连接异常，请检查网络后重试。";
      });
  }

  ensureSichuanMuseum(museums: ActivityFullItem[]): Promise<ActivityFullItem[]> {
    if (
      museums.some(
        (museum) => String(museum.id) === SICHUAN_SCIENCE_MUSEUM_ACTIVITY_ID
      )
    ) {
      return Promise.resolve(museums);
    }
    return this.activityService
      .getPublicDetail(SICHUAN_SCIENCE_MUSEUM_ACTIVITY_ID)
      .then((response) => {
        if (response.success && response.data) {
          return [response.data, ...museums];
        }
        return museums;
      })
      .catch(() => museums);
  }

  ensureFengjieMuseum(museums: ActivityFullItem[]): Promise<ActivityFullItem[]> {
    if (
      museums.some(
        (museum) => String(museum.id) === FENGJIE_SCIENCE_MUSEUM_ACTIVITY_ID
      )
    ) {
      return Promise.resolve(museums);
    }
    return this.activityService
      .getPublicDetail(FENGJIE_SCIENCE_MUSEUM_ACTIVITY_ID)
      .then((response) => {
        if (response.success && response.data) {
          return [...museums, response.data];
        }
        return museums;
      })
      .catch(() => museums);
  }

  regionCount(region: "全部" | MuseumRegion): number {
    if (region === "全部") {
      return this.museums.length;
    }
    return this.museums.filter(
      (museum) => this.museumRegion(museum) === region
    ).length;
  }

  sequence(index: number): string {
    return String(index + 1).padStart(2, "0");
  }

  selectRegion(region: "全部" | MuseumRegion) {
    this.activeRegion = region;
  }

  museumRegion(museum: ActivityFullItem): MuseumRegion | null {
    const resolvedRegion = resolveCheckInRegion({
      name: museum.name,
      address: museum.operateLocation,
    }) as MuseumRegion | null;
    if (resolvedRegion) {
      return resolvedRegion;
    }
    return SICHUAN_MUSEUM_ACTIVITY_ID_WHITELIST.has(String(museum.id))
      ? "四川"
      : null;
  }

  museumDisplayName(name: string): string {
    return String(name || "未命名场馆").replace(/场馆介绍$/, "");
  }

  goToDetail(id: string) {
    uni.navigateTo({
      url: `/pages/kjgMuseum/detail?id=${encodeURIComponent(id)}`,
    });
  }
}
</script>

<style lang="scss" scoped>
$blue: #165ddb;
$navy: #103873;
$teal: #078c83;
$paper: #fffdfa;
$mist: #edf5f7;
$line: #b9dce8;
$ink: #17233c;
$muted: #667085;

.museum-list-page {
  box-sizing: border-box;
  min-height: 100vh;
  padding: 24rpx 24rpx calc(42rpx + env(safe-area-inset-bottom));
  background: linear-gradient(180deg, #eef8fb 0, #fff 180rpx, #fffde9 100%);
  color: $ink;
  font-family: "PingFang SC", "Microsoft YaHei", Arial, sans-serif;
}

.page-heading {
  position: relative;
  min-height: 164rpx;
  padding: 12rpx 4rpx 24rpx;
  border-bottom: 2rpx dashed #64bfff;
  color: $ink;
}

.heading-meta,
.page-subtitle,
.page-title {
  position: relative;
  z-index: 2;
}

.heading-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #FAC12A;
  font-size: 21rpx;
  font-weight: 700;
  letter-spacing: 2rpx;
}

.heading-meta text:last-child {
  padding: 6rpx 12rpx;
  border: 2rpx solid rgba(22, 93, 219, 0.18);
  border-radius: 22rpx;
  background: rgba(22, 93, 219, 0.055);
  color: $navy;
  font-size: 19rpx;
  letter-spacing: 0;
}

.page-title {
  position: relative;
  z-index: 1;
  margin-top: 18rpx;
  color: $navy;
  font-size: 42rpx;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: 1rpx;
}

.page-subtitle {
  box-sizing: border-box;
  width: 100%;
  margin-top: 12rpx;
  padding-right: 154rpx;
  color: $muted;
  font-size: 22rpx;
  line-height: 1.55;
}

.heading-train {
  position: absolute;
  z-index: 1;
  right: 0;
  bottom: 18rpx;
  width: 164rpx;
  height: 66rpx;
}

.region-filter {
  display: flex;
  margin-top: 16rpx;
  padding: 6rpx;
  border: 2rpx solid rgba(185, 220, 232, 0.76);
  border-radius: 40rpx;
  background: rgba(255, 253, 250, 0.9);
  box-shadow: 0 6rpx 18rpx rgba(31, 70, 112, 0.05);
}

.region-filter-item {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  min-width: 0;
  min-height: 62rpx;
  border-radius: 32rpx;
  color: $muted;
  font-size: 23rpx;
  font-weight: 700;
}

.region-filter-item.is-active {
  background: $blue;
  color: $paper;
}

.region-filter-count {
  margin-left: 6rpx;
  font-size: 18rpx;
  opacity: 0.74;
}

.museum-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 24rpx;
}

.museum-state {
  box-sizing: border-box;
  margin-top: 24rpx;
  padding: 72rpx 32rpx;
  border: 2rpx dashed rgba(100, 191, 255, 0.62);
  border-radius: 24rpx;
  background: rgba(255, 253, 250, 0.82);
  text-align: center;
}

.museum-state-title {
  color: $navy;
  font-size: 30rpx;
  font-weight: 800;
}

.museum-state-copy {
  margin-top: 12rpx;
  color: $muted;
  font-size: 22rpx;
  line-height: 1.6;
}

.museum-retry {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 168rpx;
  min-height: 58rpx;
  margin-top: 24rpx;
  border: 2rpx solid rgba(22, 93, 219, 0.35);
  border-radius: 32rpx;
  color: $blue;
  font-size: 23rpx;
  font-weight: 700;
}

.museum-card {
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex: 0 0 calc(50% - 10rpx);
  flex-direction: column;
  width: calc(50% - 10rpx);
  min-width: 0;
  margin-bottom: 20rpx;
  overflow: hidden;
  border: 2rpx solid rgba(185, 220, 232, 0.76);
  border-radius: 20rpx;
  background: rgba(255, 253, 250, 0.88);
  box-shadow: 0 8rpx 24rpx rgba(31, 70, 112, 0.06);
}

.museum-card:active {
  border-color: $blue;
  box-shadow: 0 5rpx 14rpx rgba(22, 93, 219, 0.12);
  transform: translateY(2rpx);
}

.card-visual-slot {
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 226rpx;
  overflow: hidden;
  border-bottom: 2rpx solid rgba(185, 220, 232, 0.62);
  background:
    linear-gradient(rgba(185, 220, 232, 0.22) 2rpx, transparent 2rpx),
    linear-gradient(90deg, rgba(185, 220, 232, 0.22) 2rpx, transparent 2rpx),
    linear-gradient(145deg, rgba(248, 252, 253, 0.92) 0%, rgba(230, 238, 226, 0.92) 100%);
  background-size: 28rpx 28rpx, 28rpx 28rpx, 100% 100%;
  color: #7e9baa;
  font-size: 19rpx;
  text-align: center;
}

.card-visual-slot::after {
  position: absolute;
  right: -54rpx;
  bottom: -68rpx;
  width: 210rpx;
  height: 150rpx;
  border-radius: 50% 50% 0 0;
  background: rgba(81, 176, 177, 0.1);
  content: "";
  transform: rotate(-8deg);
}

.card-visual-slot::before {
  position: absolute;
  left: -32rpx;
  bottom: -76rpx;
  width: 238rpx;
  height: 156rpx;
  border-radius: 50% 50% 0 0;
  background: rgba(22, 93, 219, 0.055);
  content: "";
  transform: rotate(7deg);
}

.card-cover {
  position: absolute;
  z-index: 1;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: block;
  width: 100%;
  height: 100%;
}

.card-sequence {
  position: absolute;
  top: 14rpx;
  left: 14rpx;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 42rpx;
  height: 38rpx;
  padding: 0 8rpx;
  border: 2rpx solid rgba(22, 93, 219, 0.18);
  border-radius: 20rpx;
  background: rgba(255, 253, 250, 0.94);
  color: $blue;
  font-size: 17rpx;
  font-weight: 800;
}

.card-content {
  position: relative;
  box-sizing: border-box;
  flex: 1 1 auto;
  min-width: 0;
  min-height: 126rpx;
  padding: 16rpx 46rpx 18rpx 18rpx;
}

.card-region {
  color: #FAC12A;
  font-size: 19rpx;
  font-weight: 700;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-name {
  display: -webkit-box;
  margin-top: 7rpx;
  overflow: hidden;
  color: $navy;
  font-size: 27rpx;
  font-weight: 800;
  line-height: 1.38;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.card-arrow {
  position: absolute;
  right: 14rpx;
  bottom: 17rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34rpx;
  height: 34rpx;
  border-radius: 50%;
  background: rgba(22, 93, 219, 0.08);
  color: $navy;
  font-family: Arial, sans-serif;
  font-size: 30rpx;
  line-height: 1;
}
</style>
