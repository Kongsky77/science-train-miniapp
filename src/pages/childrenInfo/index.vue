<template>
  <view class="page">
    <view class="list">
      <view class="item" v-for="user of list" :key="user.id">
        <image class="avatar" :src="user.avatar"></image>
        <view class="info">
          <view class="name">{{ user.name }}</view>
          <view class="school">{{ user.school }}</view>
        </view>
        <view class="btn" @click="goChildDetail(user)">查看信息</view>
      </view>

      <view class="item">
        <view class="add-user-item-box">
            <view class="add-user-item" @click="onAddChild">
            <van-icon name="plus" />
          </view>
        </view>

        <view class="info">
          <view class="school"> 添加用户 </view>
        </view>
      </view>
    </view>

    <van-empty description="还未添加子账号哦" v-if="!list.length" />
  </view>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ChildrenService from "@/service/ChildrenService";
import LangEnum from '@/definition/lang/LangEnum'

class Child {
  id = "";
  avatar = "";
  name = "";
  school = "";
}

@Component({
  name: "ChildrenInfo",
  components: {},
})
export default class ChildrenInfo extends Vue {
  childrenService = new ChildrenService();
  list: Array<Child> = [
    // {
    //   id: '1',
    //   avatar: require('@/static/picture/boy_1@3x.png'),
    //   name: '姓名',
    //   school: '学校'
    // },
  ];

  onLoad() {
    this.getData();
    this.watchEvents();
  }

  // 下拉刷新
  onPullDownRefresh() {
    setTimeout(function () {
      this.getData();
      uni.stopPullDownRefresh();
    }, 3000);
  }

  watchEvents() {
    uni.$on("editChild", () => {
      this.getData();
    });
  }

  // 添加孩子
  onAddChild() {
      uni.navigateTo({
        url: "/pages/writeChildInfo/index",
      })
  }

  getData() {
    this.childrenService.getChildrens().then((res) => {
      if (res.success && res.data) {
        const data = res.data;
        const list = data.map((child) => ({
          id: child.userId,
          avatar: child.avatar,
          name: child.realName,
          school: child.orgName,
        }));
        this.list = list;
      }
    });
  }

  goChildDetail(user: Child) {
    console.log(user);
    uni.navigateTo({
      url: `/pages/childrenSetting/index?id=${user.id}`,
    });
  }
}
</script>
<style lang="scss" scoped>
.page {
  margin: 40rpx;
}

.list {
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  border-radius: 20rpx;
  overflow: hidden;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  margin-right: 20rpx;
}

.item {
  background: #fff;
  display: flex;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1px solid #e5e5e5;

  color: #888888;
}

.info {
  flex: 1;
}

.name {
  margin-bottom: 10rpx;
}

.school {
  font-size: 30rpx;
  padding-right: 10rpx;
}

.btn {
  font-size: 30rpx;
  color: #fff;
  background: $ai121-theme-color;
  padding: 10rpx;
  border-radius: 10rpx;
}

.add-user-item-box {
  width: 120rpx;
  height: 120rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 20rpx;
}

.add-user-item {
  flex-shrink: 0;
  width: 100rpx;
  height: 100rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  border-radius: 50%;
}
</style>
