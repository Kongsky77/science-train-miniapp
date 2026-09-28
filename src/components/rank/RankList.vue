<style lang="scss" scoped>
@import "./RankList.scss";
</style>
<template>
  <view class="rank-list">
    <view v-if="!list.length" class="empty-box">
      <image
        class="empty-icon"
        mode="widthFix"
        src="https://contentdevsa-blob.ai121.net/testcontainer/activity/image/5379198d-61b8-4a3d-9441-04f62cd322cb.png"
      ></image>
    </view>
    <view
      class="list-row"
      v-for="item of list"
      :key="item.id"
    >
      <view class="rank-item">
        <text class="rank-text" v-if="!item.icon">{{ item.rank }}</text>
        <view class="rank-icon-box" v-if="item.icon">
          <image class="rank-icon" mode="aspectFit" :src="item.icon"></image>
        </view>
      </view>
      <view class="team-box">
        <view class="team-item">
          <image
            class="team-avatar"
            :mode="aspectFill"
            :src="item.avatar"
          ></image>
        </view>
        <view
          class="team-item"
          :class="{ 'is-name-only': !showSecondary }"
        >
          <view class="team-name">{{ item.teamName }}</view>
          <view v-if="showSecondary && item.schoolName" class="team-school">
            {{ item.schoolName }}
          </view>
        </view>
      </view>
      <view class="rank-type">{{ item.score }}</view>
      <!-- <view class="rank-wx-btn" v-if="item.type === 2">
        <view class="rank-btn" @click.stop="goMiniapp(item)">
          <wx-open-launch-weapp
            id="rank-btn"
            username="gh_b32233dbf5e5"
            :path="`pages/index/index?id=${item.projectId}&modelId=${item.modelId}`"
          >
            <script type="text/wxtag-template">
              <view style="font-size:14px; color: #fff">打榜</view>
            </script>
          </wx-open-launch-weapp>
        </view>
      </view>

      <view class="rank-btn disable" v-if="item.type === 3">打榜</view> -->
      <!-- <image
        class="arrow-right"
        mode="aspectFill"
        src="../../static/rank/arrow-right.png"
      ></image> -->
    </view>
  </view>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "RankList",
})
export default class RankList extends Vue {
  @Prop() list?: any;

  @Prop({ default: true }) showSecondary!: boolean;
}
</script>
