<template>
  <view class="page">
    <view class="header">
      <view><span class="payment-status"> {{ paymentStatusText }}</span></view>
      <view class="icon" @click="moveToFeedback">
        <van-image width="20" height="20" :src="staticFile.PAYMENT_CUSTOMER_SERVICE_ICON"/>
      </view>
    </view>
    <view class="container">
      <view class="pay-card">
        <view class="content" :style="{paddingBottom: isCanPayment ? '25rpx' : '50rpx'}">
          <view class="payment-notice">
            {{ paymentNotice }}
          </view>
          <view class="tip">
            {{ tipText }}
          </view>
        </view>
        <view class="payment-area" v-if="isCanPayment">
          <view @click="onPaymentClick">
            <view class="icon">
              <van-image width="15" height="15" :src="staticFile.IMMEDIATE_PAYMENT_ICON"/>
            </view>
            <view style="color: #DC3638;">
              立即支付
            </view>
          </view>
          <view @click="onCancelOrderClick">
            <view class="icon">
              <van-image width="15" height="15" :src="staticFile.CANCEL_ORDER_ICON"/>
            </view>
            <view>
              取消订单
            </view>
          </view>
        </view>
        <view class="countdown" v-if="isCanPayment">
          <view>{{ countdownFormat }}</view>
        </view>
      </view>

      <view class="payment-content">
        <title-bar title="购买内容" :is-show-arrow="false"></title-bar>
        <view class="content">
          <view class="content-item">
            <view class="content-tip">孩子姓名</view>
            <view class="content-data">{{ orderItem.subUserRealName }}</view>
          </view>
          <view class="content-item">
            <view class="content-tip content-activity-name">活动名称</view>
            <view class="content-data content-activity-name">{{ orderItem.activityName }}</view>
          </view>
          <view class="content-item" v-if="currentGoods.goodsType === payment.ALONE_CARD">
            <view class="content-tip content-activity-name">学习内容</view>
            <view class="content-data content-activity-name">{{ currentGoods.goodsTitle }}</view>
          </view>
          <view class="content-item">
            <view class="content-tip content-activity-name">有效期</view>
            <view class="content-data content-activity-name">{{ userExpireTime }}</view>
          </view>
        </view>
      </view>

      <view class="payment-content">
        <title-bar title="订单信息" :is-show-arrow="false"></title-bar>
        <view class="content">
          <view class="content-item">
            <view class="content-tip">订单编号</view>
            <view class="content-data copy-btn">
              <view class="order-id">{{ orderItem.id }}</view>
              <view class="btn" @click="copyOrderId">复制</view>
            </view>
          </view>
          <view class="content-item">
            <view class="content-tip content-activity-name">下单时间</view>
            <view class="content-data content-activity-name">{{ orderTime }}</view>
          </view>
          <view class="content-item">
            <view class="content-tip content-activity-name">订单金额</view>
            <view class="content-data content-activity-name">￥{{ orderItem.totalAmount }}</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { Component,Vue } from 'vue-property-decorator'
import OrderItemVO from '@/beans/order/vo/OrderItemVO'
import PaymentStatusMap from '@/definition/order/PaymentStatusMap'
import PaymentStatus from '@/definition/order/PaymentStatus'
import TitleBar from '@/components/common/TitleBar.vue'
import CountdownCounter from '@/common/utils/CountdownCounter'
import { Utils } from '@/common/utils/Utils'
import StaticFileEnum from '@/definition/lang/StaticFileEnum'
import OrderService from '@/service/OrderService'
import PaymentCard from '@/definition/order/PaymentCard'
import PageLinkEnum from '@/definition/lang/PageLinkEnum'
import OrderStatus from '@/definition/order/OrderStatus'
import LangEnum from '@/definition/lang/LangEnum'
import ShowModalRes = UniApp.ShowModalRes
import ShowNoticeManagement from '@/management/common/ShowNoticeManagement'

class OrderDetailOption {
  orderNo: string = ''
}

@Component({
  name: 'OrderDetailPage',
  components: {
    TitleBar
  }
})

export default class OrderDetailPage extends Vue {
  orderNo: string = ''
  payment = PaymentCard
  staticFile = StaticFileEnum
  orderItem: OrderItemVO = new OrderItemVO()
  remainingTime: number = 0
  countdownCounter?: CountdownCounter

  onLoad (option: OrderDetailOption) {
    this.orderNo = option.orderNo
    this.fetchOrderInfo()
  }

  onPullDownRefresh () {
    if (this.countdownCounter) {
      this.countdownCounter.pauseCountdown()
    }
    this.fetchOrderInfo()
    setTimeout(() => {
      uni.stopPullDownRefresh()
    },1500)
  }

  get currentGoods () {
    return this.orderItem.goods[0]
  }

  get orderTime () {
    return Utils.localTime(this.orderItem.createTime)
  }

  get userExpireTime () {
    if (this.currentGoods) {
      return Utils.localTimeYMDByCenterLine(this.currentGoods.useExpireTime)
    } else {
      return Utils.localTimeYMDByCenterLine(0)
    }

  }

  fetchOrderInfo () {
    OrderService.fetchOrderInfo(this.orderNo,false,this.fetchOrderInfoCallback)
  }

  fetchOrderInfoCallback (success: boolean,orderItemVO: OrderItemVO) {
    if (success) {
      this.orderItem = orderItemVO
      this.remainingTime = Math.max(0, Math.ceil((this.orderItem.expireTime - Date.now()) / 1000))
      this.initCountdown()
    }else {
      ShowNoticeManagement.ShowErrorNotice(LangEnum.PLEASE_CHECK_NETWORK_OR_DO_REFRESH)
    }
  }

  initCountdown () {
    if (this.countdownCounter) {
      this.countdownCounter.pauseCountdown()
    }
    this.countdownCounter = new CountdownCounter(this.remainingTime,this.countdownCallback)
    this.startCountDown()
  }

  countdownCallback (residueDegree: number) {
    if (residueDegree >= 0) {
      this.remainingTime = residueDegree
      if (residueDegree === 0) {
        this.onCountDownTimeOut()
      }
    }
  }

  onPaymentClick () {
    let url: string
    switch (this.currentGoods.goodsType) {
      case PaymentCard.ALONE_CARD:
        url = `${ PageLinkEnum.PLACE_AN_ORDER }?orderId=${ this.orderItem.id }&cardId=${this.currentGoods.goodsId}&sectionId=${this.currentGoods.sectionCardId}&activityId=${this.orderItem.activityId}&childId=${this.orderItem.subUserId}`
        break
      case PaymentCard.ALL_ACTIVITY:
        url = `${ PageLinkEnum.PLACE_AN_ORDER }?orderId=${ this.orderItem.id }`
        break
      default:
        url = `${ PageLinkEnum.PLACE_AN_ORDER }?orderId=${ this.orderItem.id }`
        break
    }

    uni.navigateTo({
      url: url
    })
  }

  onCancelOrderClick () {
    uni.showModal({
      title: LangEnum.TIPS,
      cancelText: LangEnum.MAKE_ME_THINK,
      cancelColor: '#808080',
      content: LangEnum.SURE_CANCEL_ORDER,
      confirmText: LangEnum.IMMEDIATELY_CANCEL,
      success: (result: ShowModalRes) => {
        if (result.confirm) {
          OrderService.cancelOrder(this.orderItem.id,this.CancelOrderCallback)
        }
      }
    })

  }

  CancelOrderCallback (success: boolean) {
    if (success) {
      this.fetchOrderInfo()
    }
  }

  moveToFeedback () {
    uni.navigateTo({
      url: '/pages/feedback/index',
    })
  }

  startCountDown () {
    if (this.countdownCounter && this.remainingTime > 0) {
      this.countdownCounter.startCountdown()
    }
  }

  copyOrderId () {
    wx.setClipboardData({
      data: this.orderItem.id, //复制的数据
      success: function (res) {
        uni.showToast({
          title: '复制成功',
          icon: 'none'
        })
      }
    })
  }

  onCountDownTimeOut () {
    this.countdownCounter.pauseCountdown()
  }

  destroyed () {
    if (this.countdownCounter) {
      this.countdownCounter.pauseCountdown()
    }
  }

  get countdownFormat () {
    return Utils.timeSecondHMS(this.remainingTime)
  }

  get paymentStatusText () {
    return PaymentStatusMap.get(this.orderItem.payStatus)
  }

  get isCanPayment (): boolean {
    let isCanPayment
    switch (this.orderItem.status) {
      case OrderStatus.OPEN:
        isCanPayment = !this.orderItem.entryReserved || this.remainingTime > 0
        break
      default:
        isCanPayment = false
        break
    }
    return isCanPayment
  }

  get tipText () {
    let tipText: string
    if (this.orderItem.entryReserved) {
      return this.remainingTime > 0
        ? '报名名额保留 10 分钟，请在倒计时内完成支付'
        : '名额预留已到期，请返回活动页重新报名'
    }
    if (this.isCanPayment) {
      tipText = '若超时未付款，订单将自动取消'
    } else {
      tipText = '期待您的再次光临！'
    }
    return tipText
  }

  get paymentNotice () {
    let paymentNotice: string
    switch (this.orderItem.payStatus) {
      case PaymentStatus.TO_BE_PAID:
        paymentNotice = '请尽快支付'
        break
      case PaymentStatus.PAYMENT_FAIL:
        paymentNotice = '请尽快支付'
        break
      case PaymentStatus.PAYMENT_TIMEOUT:
        paymentNotice = '订单已超时'
        break
      case PaymentStatus.PAID:
        paymentNotice = '订单已支付'
        break
      case PaymentStatus.CANCEL_PAYMENT:
        paymentNotice = '订单已取消'
        break
      default:
        paymentNotice = '订单已取消'
        break
    }
    return paymentNotice
  }
}

</script>

<style lang="scss" scoped>
@import "OrderDetailPage";
</style>
