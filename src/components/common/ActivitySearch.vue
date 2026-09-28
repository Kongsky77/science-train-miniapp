<template>
  <main @click="onSearchClick" style="visibility: hidden" class="search-index-box" :style="{marginTop: marginTop + 'rpx'}">
    <van-search
        shape="round"
        field-class="field-search"
        background="transparent"
        disabled
        :value="keyword"
        :placeholder="placeholder" />
  </main>
</template>

<script lang="ts">
import { Vue,Component,Prop } from 'vue-property-decorator'
import ColumnIcon from '@/components/common/ColumnIcon.vue'

@Component({
  name: 'ActivitySearch'
})

export default class ActivitySearch extends Vue {
  @Prop({
    default: 0
  })
  marginTop: number

  @Prop({
    default: ''
  })
  placeholder: string

  keyword: string = ''


  onSearchClick () {
    this.goToSearchPage()
  }

  goToSearchPage () {
    uni.navigateTo({
      url: '/pages/search/Search'
    })
  }
}

</script>

<style lang="scss">
.search-index-box {
  width: 94%;
  margin: 0 auto;
}

.van-search__content {
  padding-left: 0 !important;
}

.field-search {
  border-radius: 34rpx;
  background-color: white;
  padding-left: 20rpx;
  box-shadow: 0 5rpx 18rpx rgba(0, 0, 0, 0.16);
}
</style>
