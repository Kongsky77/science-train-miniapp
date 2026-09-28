<style lang="scss" scoped>
@import "OrderCard";
</style>

<style lang="scss">
:root {
  --van-button-mini-padding: 20rpx;
}


.image-cover {
  border-radius: 20rpx;

}
</style>
<template>
  <main class="card-item">
    <title-bar :is-left-font-bold="false"
               left-font-size="26rpx"
               left-font-color="#808080"
               right-font-padding-top="0"
               :title="`订单编号：${orderItem.id}`"
               :right-title="paymentStatusText"></title-bar>
    <view class="order-card">
      <view class="container" @click="onCardItemClick">
        <view class="cover" :style="{
        background: `url(${currentGoods.goodsImg}) no-repeat` ,
        backgroundPosition: 'center center',
        backgroundSize: 'cover'}">
        </view>
        <view class="intro">
          <view class="activity-name">{{ orderItem.activityName }}</view>
          <view class="card-name" v-if="currentGoods.goodsType === paymentCard.ALONE_CARD">{{ currentGoods.goodsTitle }}
          </view>
          <view class="money"><span class="rmb">￥</span> {{ orderItem.totalAmount }}</view>
          <view class="time-or-btn-area">
            <view class="time">有效期：{{ useExpireTime }}</view>

          </view>
        </view>
      </view>

      <view class="pay-btn" v-if="isShowBtn">
        <van-button @click="onImmediatePaymentBtnClick" type="primary" size="mini" color="#EE6E0C">立即支付
        </van-button>
      </view>
    </view>
  </main>
</template>

<script lang="ts">
import { Component,Emit,Prop,Vue } from 'vue-property-decorator'
import OrderItemVO from '@/beans/order/vo/OrderItemVO'
import TitleBar from '@/components/common/TitleBar.vue'
import PaymentStatus from '@/definition/order/PaymentStatus'
import OrderDetailVO from '@/beans/order/vo/OrderDetailVO'
import PaymentCard from '@/definition/order/PaymentCard'
import { Utils } from '@/common/utils/Utils'
import LessonPlaceAnOrderOption from '@/beans/activity/res/LessonPlaceAnOrderOption'

@Component({
  name: 'OrderCard',
  components: {
    TitleBar
  }
})

export default class OrderCard extends Vue {
  @Prop({
    default: new OrderItemVO(),
    type: Object,
    required: true
  })
  orderItem: OrderItemVO

  paymentCard = PaymentCard

  get currentGoods (): OrderDetailVO {
    return this.orderItem.goods[0]
  }

  get useExpireTime (): string {
    return Utils.localTimeYMDByCenterLine(this.currentGoods.useExpireTime)
  }

  get isShowBtn (): boolean {
    return this.orderItem.payStatus === PaymentStatus.TO_BE_PAID
  }


  get paymentStatusText () {
    let paymentStatusText: string
    switch (this.orderItem.payStatus) {
      case PaymentStatus.CANCEL_PAYMENT:
        paymentStatusText = '已取消'
        break
      case PaymentStatus.PAID:
        paymentStatusText = '已支付'
        break
      case PaymentStatus.PAYMENT_FAIL:
        paymentStatusText = '支付失败'
        break
      case PaymentStatus.PAYMENT_TIMEOUT:
        paymentStatusText = '已过期'
        break
      case PaymentStatus.TO_BE_PAID:
        paymentStatusText = '待支付'
        break
      default:
        paymentStatusText = '待支付'
        break
    }
    return paymentStatusText
  }

  onCardItemClick () {
    this.emitCardItemClick()
  }

  onImmediatePaymentBtnClick () {
    this.emitImmediatePaymentBtnClick()
  }

  @Emit('on-card-item-click')
  emitCardItemClick () {
    return this.orderItem.id
  }

  @Emit('on-immediate-payment-btn-click')
  emitImmediatePaymentBtnClick () {
    let option: LessonPlaceAnOrderOption
    switch (this.currentGoods.goodsType) {
      case PaymentCard.ALL_ACTIVITY:
        option = new LessonPlaceAnOrderOption()
        option.orderId = this.orderItem.id
        option.goodsType = PaymentCard.ALL_ACTIVITY
        break
      case PaymentCard.ALONE_CARD:
        option = new LessonPlaceAnOrderOption()
        option.orderId = this.orderItem.id
        option.sectionId = this.currentGoods.sectionCardId
        option.goodsType = PaymentCard.ALONE_CARD
        option.activityId = this.orderItem.activityId
        option.subUserId = this.orderItem.subUserId
        option.lessonCardId = this.currentGoods.goodsId
        break
      default:
        option = new LessonPlaceAnOrderOption()
        option.orderId = this.orderItem.id
        option.goodsType = PaymentCard.ALL_ACTIVITY
        break
    }
    return option
  }
}

</script>
