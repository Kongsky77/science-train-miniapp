<template>
  <div class="nav-box">
    <div class="nav-row" :class="{ shadow: shadow }">
      <!-- <div
        class="nav-active-bar"
        :style="`transform: translateX(${transformX}%);`"
      ></div> -->
      <!-- getNaveItemClassName(index)
                ? require('@/static/icon/' + nav.activityIcon)
                : require('@/static/icon/' + nav.icon) -->
      <div
        class="nav-item"
        v-for="(nav, index) of navs"
        :key="nav.id"
        :class="{ active: getNaveItemClassName(index) }"
        @click="clickNav(nav, index)"
      >
        <!-- getNaveItemClassName(index)
              ? require('../../static/icon/' + nav.activityIcon)
              : require('../../static/icon/' + nav.icon) -->
        <!-- <div v-show="nav.activityIcon">
          <image
            class="see-more-activity-icon"
            mode="widthFix"
            :src="setIcon(nav, index)"
          ></image>
        </div> -->
        <div
          class="nav-icon"
          v-show="nav.icon"
          :style="{
            background: getNaveItemClassName(index)
              ? makeBackground(nav.activityIcon)
              : makeBackground(nav.icon)
          }"
        ></div>
        <div class="nav-text">{{ nav.text }}</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

class NavItem {
  id = "";
  text = "";
  activityIcon = "";
  icon = "";
}

@Component({
  name: "Nav"
})
export default class ActivityCard extends Vue {
  @Prop()
  navs!: Array<NavItem>;

  @Prop()
  shadow: boolean = true;

  activeTabIndex = 0;

  mounted() {
    uni.$on("shiftNav", index => {
      console.log(1);
      this.clickNav(this.navs[index], index);
    });
  }

  makeBackground(url: string) {
    return `url("${url}") no-repeat center center/cover;`;
  }

  getNaveItemClassName(index: number) {
    return this.activeTabIndex === index ? true : false;
  }
  // setIcon(nav: NavItem, index: number) {
  //   if(nav.id === index){
  //     return
  //   }
  //   let active = this.activeTabIndex === index ? true : false;
  //   console.log("我获得图标地址了", nav.icon);
  // }

  clickNav(item: NavItem, index: number) {
    // 激活当前tab
    this.activeTabIndex = index;
    this.$emit("change", item);
  }
}
</script>
<style lang="scss" scoped>
.nav-row {
  display: flex;
  background: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  position: relative;
}

.nav-row.shadow {
  box-shadow: 0px 1px 7px rgba(106, 106, 106, 0.16);
}
// .see-more-activity-icon {
//   width: 33rpx;
//   height: 40rpx;
//   margin-right: 18rpx;
//   margin-top: 1rpx;
// }

.nav-item {
  flex: 1;
  padding: 20rpx;
  font-size: 30rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 10;

  &.active {
    background: $ai121-theme-color;
    color: #fff;
    border-radius: 20rpx;
  }
}

.nav-icon {
  width: 33rpx;
  height: 33rpx;
  margin-right: 18rpx;
  margin-top: 1rpx;
}

.nav-active-bar {
  position: absolute;
  width: 50%;
  height: 100%;
  top: 0;
  left: 0;
  background: #5181D9;
  z-index: 5;
  transition: all 0.5s;
  border-radius: 20rpx;
}
</style>
