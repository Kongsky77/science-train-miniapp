<template>
  <main class="column-icon-container" :style="{borderBottom: border ? '1px solid #e5e5e5' : ''}">
    <view v-for="item of columnList" :key="item.id" v-if="item.icon">
        <image :src="item.icon" @click="click(item)"></image>
        <text>{{item.name}}</text>
    </view>
  </main>
</template>

<script lang="ts">
import { Vue,Component,Prop } from 'vue-property-decorator'
import ColumnEnum from '@/definition/common/ColumnEnum'
import ActivityService from '@/service/ActivityService'
import ColumnItemVO from '@/beans/activity/res/ColumnItemVO'
import ColumnTypeEnum from '@/enums/activity/ColumnTypeEnum'

@Component({
  name: 'ColumnIcon'
})

export default class ColumnIcon extends Vue {
  @Prop({
    default: false
  })
  border: boolean
  column = ColumnEnum
  columnList: Array<ColumnItemVO> = []

  mounted () {
    this.fetchColumnList()
  }

  fetchColumnList () {
    const activityService = new ActivityService()
    activityService.receiveColumnList(this.fetchColumnListCallback)
  }

  fetchColumnListCallback (success: boolean, columnList: Array<ColumnItemVO>) {
    this.columnList = columnList
  }

  click (item: ColumnItemVO) {
    switch (item.type) {
      case ColumnTypeEnum.ACTIVITY:
        uni.navigateTo({
          url: `/pages/activity-category/ActivityCategoryPage?title=${item?.name}&id=${item?.id}`
        })
        break;
      case ColumnTypeEnum.MINI_PROGRAM:
        uni.navigateToMiniProgram({
          appId: item.appId,
          path: item.path
        })
        break;
      default:
        break;
    }

  }
}

</script>

<style lang="scss" scoped>
.column-icon-container {
  width: 90%;
  margin: 20rpx auto;
  display: flex;
  color: #AAAAAA;
  font-size: 25rpx;
  padding-bottom: 20rpx;

  & > view {
    width: 200rpx;
    height: 200rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    & > image {
      width: 100rpx;
      height: 100rpx;
      margin-bottom: 10rpx;
    }
  }
}
</style>
