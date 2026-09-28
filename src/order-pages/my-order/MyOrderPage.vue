<style lang="scss">
/deep/ .van-tabs__scroll {
  height: 120rpx;
  background: #000000 !important;
}

/deep/ .van-tab {
  font-size: 30rpx !important;
}

/deep/ .van-tab--active {
  font-size: 32rpx !important;
}

/deep/ .van-tabs__wrap {
  width: 100% !important;

}

/deep/ .van-tabs__nav {
  background-color: white !important;
  padding-bottom: 30rpx;
}

/deep/ .van-tabs__line {
  bottom: 30% !important;
}
</style>

<template>
  <main style="background-color: #f2f2f6;min-height: 100%">
    <van-tabs @change="onTabChange" line-width="60rpx" color="#3646A5">
      <van-tab title="未支付">
        <view v-for="item in orderList" :key="item.id">
          <order-card :order-item="item"
                      @on-card-item-click="onCardItemClick"
                      @on-immediate-payment-btn-click="onImmediatePaymentBtnClick"/>
        </view>
      </van-tab>
      <van-tab title="已支付">
        <view v-for="item in orderList" :key="item.id">
          <order-card :order-item="item"
                      @on-card-item-click="onCardItemClick"/>
        </view>
      </van-tab>
    </van-tabs>
  </main>
</template>

<script lang="ts">
import { Vue,Component } from 'vue-property-decorator'
import OrderItemVO from '@/beans/order/vo/OrderItemVO'
import MyOrderTab from '@/definition/order/MyOrderTab'
import PageLinkEnum from '@/definition/lang/PageLinkEnum'
import OrderService from '@/service/OrderService'
import OrderPageVO from '@/beans/order/vo/OrderPageVO'
import OrderPageDTO from '@/beans/order/dto/OrderPageDTO'
import LangEnum from '@/definition/lang/LangEnum'
import ShowNoticeManagement from '@/management/common/ShowNoticeManagement'
import stopPullDownRefresh = my.stopPullDownRefresh
import OrderCard from '@/order-pages/components/order/OrderCard.vue'
import LessonPlaceAnOrderOption from '@/beans/activity/res/LessonPlaceAnOrderOption'
import PaymentCard from '@/definition/order/PaymentCard'

@Component({
  name: 'MyOrderPage',
  components: {
    OrderCard
  }
})

export default class MyOrderPage extends Vue {
  page: number = 1
  pages: number = 0
  currentModel = MyOrderTab.UNPAID
  orderList: OrderItemVO[] = []

  mounted () {
    this.fetchOderList()
  }

  onTabChange (event: any) {
    const currentTab = event.detail.index as MyOrderTab
    this.page = 1
    this.orderList = []
    this.currentModel = currentTab
    this.fetchOderList()
  }

  onPullDownRefresh () {
    this.page = 1
    this.fetchOderList(true)
  }

  fetchOderList (isRefresh?: boolean) {
    OrderService.fetchOrderList(new OrderPageDTO(this.page,this.currentModel),(success,orderPageVO) => {
      this.fetchOderListCallback(success,orderPageVO,isRefresh)
    })
  }

  onReachBottom () {
    if (this.page < this.pages) {
      this.page++
      this.fetchOderList()
    } else {
      ShowNoticeManagement.ShowErrorNotice(LangEnum.ALREADY_REACH_THE_END)
    }
  }

  fetchOderListCallback (success: boolean,orderPageVO: OrderPageVO,isRefresh?: boolean) {
    if (success) {
      this.pages = orderPageVO.pages
      if (isRefresh) {
        this.orderList = orderPageVO.records
        setTimeout(() => {
          uni.stopPullDownRefresh()
        },1500)
      } else {
        for (let i = 0; i < orderPageVO.records.length; i++) {
          const item = orderPageVO.records[i]
          this.orderList.push(item)
        }
      }
    }
  }

  onCardItemClick (orderNo: string) {
    uni.navigateTo({
      url: PageLinkEnum.ORDER_DETAIL + `?orderNo=${ orderNo }`
    })
  }

  onImmediatePaymentBtnClick (lessonPlaceAnOrderOption: LessonPlaceAnOrderOption) {
    let url: string
    const goodsType = lessonPlaceAnOrderOption.goodsType
    const orderId = lessonPlaceAnOrderOption.orderId
    const subUserId = lessonPlaceAnOrderOption.subUserId
    switch (goodsType) {
      case PaymentCard.ALONE_CARD:
        const cardId = lessonPlaceAnOrderOption.lessonCardId
        const activityId = lessonPlaceAnOrderOption.activityId
        const sectionId = lessonPlaceAnOrderOption.sectionId
        url = `${ PageLinkEnum.PLACE_AN_ORDER }?orderId=${ orderId }&cardId=${ cardId }&sectionId=${ sectionId }&activityId=${ activityId }&childId=${subUserId}`
        break
      case PaymentCard.ALL_ACTIVITY:
        url = `${ PageLinkEnum.PLACE_AN_ORDER }?orderId=${ orderId }`
        break
      default:
        url = `${ PageLinkEnum.PLACE_AN_ORDER }?orderId=${ orderId }`
        break
    }
    uni.navigateTo({
      url: url
    })
  }
}

</script>

<style lang="scss" scoped>
</style>
