<style lang="scss" scoped>
.page {
  min-height: 100%;
  background-color: #f2f2f6;
  padding-top: 40rpx;

  .all-activity-card {
    width: 80%;
    margin: 0 auto;
    padding: 40rpx;
    border-radius: 20rpx;
    background-color: #ffffff;
    color: #808080;
    position: relative;

    .title {
      color: #808080;
      opacity: .8;
      font-size: 36rpx;
    }

    .original-price {
      font-size: 24rpx;
      padding-top: 20rpx;
      text-decoration: line-through;
      opacity: .8;
      padding-bottom: 20rpx;
    }

    .concessional-rate {
      .rmb {
        position: relative;
        bottom: 18rpx;
        font-size: 28rpx;
      }

      font-weight: bold;
      font-size: 50rpx;
      color: #FF3B3B;
    }

    .explain {
      display: flex;
      justify-content: space-between;
      font-size: 24rpx;
      padding-top: 30rpx;

      .include-learning-card {
        opacity: .8;
      }
    }

    .choose-icon {
      position: absolute;
      top: 15%;
      right: 5%;
    }
  }

  .alone-card {
    width: 80%;
    margin: 40rpx auto 0;
    padding: 40rpx;
    border-radius: 20rpx;
    background-color: #ffffff;
    color: #808080;
    position: relative;

    .title {
      color: #808080;
      opacity: .8;
      font-size: 36rpx;
    }

    .original-price {
      font-size: 24rpx;
      padding-top: 20rpx;
      text-decoration: line-through;
      opacity: .8;
      padding-bottom: 20rpx;
    }

    .concessional-rate {
      .rmb {
        position: relative;
        bottom: 18rpx;
        font-size: 28rpx;
      }

      font-weight: bold;
      font-size: 50rpx;
      color: #FF3B3B;
    }

    .explain {
      display: flex;
      justify-content: space-between;
      font-size: 24rpx;
      padding-top: 30rpx;

      .include-learning-card {
        opacity: .8;
        text-align: right;
      }

      .term-of-validity {
        display: flex;
        align-items: flex-end;
      }
    }

    .choose-icon {
      position: absolute;
      top: 15%;
      right: 5%;
    }
  }

  .place-order {
    position: fixed;
    bottom: 2%;
    left: 5%;
    width: 80%;
    padding: 30rpx 40rpx;
    font-size: 42rpx;
    color: #FFFFFF;
    background-color: #3646a5;
    border-radius: 80rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .left {
      display: flex;
      align-items: center;

      .icon {
        margin-left: 20rpx;
        margin-right: 30rpx;
      }
    }

    .submit-order {
      font-size: 40rpx;
    }
  }

  .seat-reservation {
    width: 80%;
    margin: 30rpx auto 0;
    padding: 24rpx 40rpx;
    border-radius: 16rpx;
    background-color: #fff7e6;
    color: #ad6800;
    font-size: 26rpx;
    text-align: center;

    .countdown {
      margin-top: 8rpx;
      color: #dc3638;
      font-size: 34rpx;
      font-weight: 600;
    }
  }
}

.total-count {
  color: #333333;
  font-weight: 600;
  margin: 0 4rpx;
}

.order-remark{
  width: 90%;
  height: 80rpx;
  margin: 40rpx auto 0;
  padding: 0rpx 0rpx;
  border-radius: 20rpx;
  background-color: #ffffff;
  color: #808080;
  position: relative;
}

</style>

<template>
  <view class="page">
    <view class="all-activity-card" @click="onCardClick(paymentCard.ALL_ACTIVITY)"
          v-if="currentModel === placeAnOrderModel.ALL_ACTIVITY || currentModel === placeAnOrderModel.ANY">
      <view class="title">整个活动/课程</view>
      <view class="original-price">￥{{ activityPriceVO.originalPrice }}</view>
      <view class="concessional-rate">
        <span class="rmb">￥</span> {{ activityPriceVO.salePrice }}
      </view>
      <view class="explain">
        <view class="term-of-validity">有效期：{{ activityPriceVO.useExpireTime }}</view>
        <view class="include-learning-card" v-if="isShowTotalCardArea">
          该价格包含：<span class="total-count">{{ activityTotalCardCount }}</span>个学习卡片
        </view>
      </view>
      <van-icon class='choose-icon'
                slot="right-icon"
                color="#01AF0E" name="checked"
                v-if="isCanChoose && currentChoosePaymentCard === paymentCard.ALL_ACTIVITY"/>
      <van-icon class='choose-icon'
                name="circle"
                v-if="isCanChoose && currentChoosePaymentCard !== paymentCard.ALL_ACTIVITY"/>
    </view>

    <view class="alone-card"
          @click="onCardClick(paymentCard.ALONE_CARD)"
          v-if="(currentModel === placeAnOrderModel.ONLY_CARD || currentModel === placeAnOrderModel.ANY)&&(cardPriceVO.salePrice>0)&&(cardPriceVO.originalPrice>0)">
      <view class="title">当前学习卡片：{{ cardPriceVO.name }}</view>
      <view class="original-price">￥{{ cardPriceVO.originalPrice }}</view>
      <view class="concessional-rate">
        <span class="rmb">￥</span> {{ cardPriceVO.salePrice }}
      </view>
      <view class="explain">
        <view class="term-of-validity">有效期：{{ cardPriceVO.useExpireTime }}</view>
        <view class="include-learning-card">
          <view v-if="isShowTotalCardArea">该活动共有<span class="total-count">{{ activityTotalCardCount }}</span>个学习卡片</view>
          <view>还需<span class="total-count">{{ surplusTotalPrice }}</span>元才能学完</view>
        </view>
      </view>
      <van-icon class='choose-icon'
                slot="right-icon"
                color="#01AF0E" name="checked"
                v-if="isCanChoose && currentChoosePaymentCard === paymentCard.ALONE_CARD"/>
      <van-icon class='choose-icon'
                name="circle"
                v-if="isCanChoose && currentChoosePaymentCard !== paymentCard.ALONE_CARD"/>
    </view>

    <view class="order-remark">
      <van-field
        v-model="orderRemark"
        @input="onOrderRemarkChange"
        type="textarea"
        maxlength='220'
        show-word-limit
        border='false'
        placeholder="可给我们留言，包括邮寄地址、联系人、联系电话等信息"
        :autosize="textareaAutosize"
      />
    </view>

    <view class="seat-reservation" v-if="orderItem.entryReserved">
      <view v-if="remainingTime > 0">报名名额保留 10 分钟，请在倒计时内完成支付</view>
      <view v-else>名额预留已到期，请返回活动页重新报名</view>
      <view class="countdown">{{ reservationCountdown }}</view>
    </view>

    <view class="place-order" @click="OnSubmitOrderBtnClick">
      <view class="left">
        <view class="icon">
          <van-image
              width="40"
              height="40"
              src="https://contentdevsa-blob.ai121.net/testcontainer/activity/image/395c9a77-5032-4f46-80a5-653fb7e78dac.svg"/>
        </view>
        <view class="submit-price">
          ￥{{ submitPrice }}
        </view>
      </view>
      <view class="submit-order">
        {{ submitText }}
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import PlaceAnOrderModel from '@/definition/order/PlaceAnOrderModel'
import PaymentCard from '@/definition/order/PaymentCard'
import PageLinkEnum from '@/definition/lang/PageLinkEnum'
import ActivityService from '@/service/ActivityService'
import ActivityPriceVO from '@/beans/activity/res/ActivityPriceVO'
import OrderService from '@/service/OrderService'
import CreateOrderDTO from '@/beans/order/dto/CreateOrderDTO'
import OrderItemVO from '@/beans/order/vo/OrderItemVO'
import PaymentService from '@/service/PaymentService'
import DoPaymentDTO from '@/beans/order/dto/DoPaymentDTO'
import DoPaymentCallbackVO from '@/beans/order/vo/DoPaymentCallbackVO'
import PaymentManagement from '@/management/payment/PaymentManagement'
import ShowNoticeManagement from '@/management/common/ShowNoticeManagement'
import LangEnum from '@/definition/lang/LangEnum'
import LessonCardPriceVO from '@/beans/activity/res/LessonCardPriceVO'
import LoginManagement from '@/management/login/LoginManagement'
import UpExpiredOrderDTO from '@/beans/order/dto/UpExpiredOrderDTO'
import WeAnalysisEventManagement from '@/management/wx/WeAnalysisEventManagement'
import EventNameEnum from '@/definition/common/EventNameEnum'
import VisitOrderPageDTO from '@/definition/common/event/VisitOrderPageDTO'
import ClickPayDTO from '@/definition/common/event/ClickPayDTO'
import CountdownCounter from '@/common/utils/CountdownCounter'
import { Utils } from '@/common/utils/Utils'

interface PlaceAnOrderOption {
  activityId: string
  childId: string
  scene?: string
  orderId?: string
  cardId?: string
  sectionId?: string

}

@Component({
  name: 'PlaceAnOrder'
})

export default class PlaceAnOrder extends Vue {
  paymentCard = PaymentCard
  placeAnOrderModel = PlaceAnOrderModel
  currentModel: PlaceAnOrderModel = PlaceAnOrderModel.ALL_ACTIVITY
  currentChoosePaymentCard: PaymentCard = PaymentCard.ALL_ACTIVITY

  activityId: string = ''
  childId: string = ''
  lessonCardId: string = ''
  orderId: string = ''
  sectionId: string = ''
  scene: string = ''
  surplusTotalPrice: number = 0
  activityTotalCardCount: number = 0


  activityPriceVO: ActivityPriceVO = new ActivityPriceVO()
  cardPriceVO: LessonCardPriceVO = new LessonCardPriceVO()
  doPaymentCallbackVO: DoPaymentCallbackVO = new DoPaymentCallbackVO()
  orderItem: OrderItemVO = new OrderItemVO()
  remainingTime: number = 0
  countdownCounter?: CountdownCounter
  orderRemark: string = ''
  textareaAutosize = {maxHeight: 60, minHeight: 30}


  onLoad(option: PlaceAnOrderOption) {
    if (option.orderId) {
      this.orderId = option.orderId
      if (option.cardId && option.sectionId && option.activityId && option.childId) {
        this.lessonCardId = option.cardId
        this.sectionId = option.sectionId
        this.activityId = option.activityId
        this.childId = option.childId
        this.currentChoosePaymentCard = PaymentCard.ALONE_CARD
        this.currentModel = PlaceAnOrderModel.ONLY_CARD
        this.fetchCardPriceAndCardSurplusTotalPrice()
      } else {
        this.currentModel = PlaceAnOrderModel.ALL_ACTIVITY
        this.fetchOrderDetail()
      }
    } else if (option.scene) {
      this.scene = option.scene
      this.currentModel = PlaceAnOrderModel.ANY
      this.fetchLessonCardInfo()
    } else {
      this.currentModel = PlaceAnOrderModel.ALL_ACTIVITY
      this.activityId = option.activityId
      this.childId = option.childId
      this.fetchActivityPriceAndCardCount()
    }
  }

  onShow() {
    if (!new LoginManagement().isLogin()) {
      this.moveToLoginPage()
    }
  }

  get isShowTotalCardArea (): boolean {
    return this.activityTotalCardCount && this.activityTotalCardCount !== 0 && this.currentModel !== PlaceAnOrderModel.ALL_ACTIVITY
  }

  fetchNotExpiredOrder() {
    OrderService.fetchUpExpiredOrder(this.upExpiredOrderDTO, this.fetchUpExpiredOrderCallback)
  }

  fetchUpExpiredOrderCallback(success: boolean, orderItem: OrderItemVO) {
    if (success) {
      this.orderId = orderItem.id
      this.setActiveOrder(orderItem)
    } else {
      this.orderId = ''
    }
    this.doCreateOrder()
  }

  get upExpiredOrderDTO(): UpExpiredOrderDTO {
    let upExpiredOrderDTO: UpExpiredOrderDTO
    switch (this.currentChoosePaymentCard) {
      case PaymentCard.ALONE_CARD:
        upExpiredOrderDTO = new UpExpiredOrderDTO(this.lessonCardId, this.childId, PaymentCard.ALONE_CARD, this.sectionId, this.activityId)
        break
      case PaymentCard.ALL_ACTIVITY:
        upExpiredOrderDTO = new UpExpiredOrderDTO(this.activityId, this.childId, PaymentCard.ALL_ACTIVITY)
        break
      default:
        upExpiredOrderDTO = new UpExpiredOrderDTO(this.activityId, this.childId, PaymentCard.ALL_ACTIVITY)
        break
    }
    return upExpiredOrderDTO
  }

  get isCanChoose() {
    return this.currentModel === PlaceAnOrderModel.ANY
  }

  fetchActivityPriceAndCardCount() {
    this.fetchActivityPrice()
    if (new LoginManagement().isLogin()) {
      this.fetchActivityCardCount()
    }
  }

  fetchCardPriceAndCardSurplusTotalPrice() {
    this.fetchLearningCardPriceInfo()
    if (new LoginManagement().isLogin()) {
      this.fetchCardSurplusTotalPrice()
    }
  }

  fetchCardSurplusTotalPrice() {
    ActivityService.fetchSurplusCardTotalPrice(this.activityId, this.childId, this.fetchCardSurplusTotalPriceCallback)
  }

  fetchCardSurplusTotalPriceCallback(success: boolean, surplusTotalPrice: number) {
    if (success) {
      this.surplusTotalPrice = surplusTotalPrice
    } else {
      this.surplusTotalPrice = 0
    }
  }

  async fetchLessonCardInfo() {
    await PaymentManagement.getPaymentScene(this.scene)
    this.activityId = PaymentManagement.getLessonInfo().activityId
    this.sectionId = PaymentManagement.getLessonInfo().sectionId
    this.lessonCardId = PaymentManagement.getLessonInfo().lessonCardId
    this.childId = PaymentManagement.getLessonInfo().childId
    this.fetchCardPriceAndCardSurplusTotalPrice()

  }

  fetchLearningCardPriceInfo() {
    ActivityService.fetchLearningCardPriceInfo(this.activityId, this.sectionId, this.lessonCardId, this.receiveLearningCardPriceInfoCallback)
  }

  receiveLearningCardPriceInfoCallback(success: boolean, cardPriceInfo: LessonCardPriceVO) {
    if (success) {
      this.cardPriceVO = cardPriceInfo
      this.fetchActivityPriceAndCardCount()
    }
  }

  fetchOrderDetail() {
    OrderService.fetchOrderInfo(this.orderId, true, this.fetchOrderDetailCallback)
  }

  get submitText() {
    let text
    if (!new LoginManagement().isLogin()) {
      text = '前往登录'
    } else {
      text = '确认购买'
    }
    return text
  }

  fetchOrderDetailCallback(success: boolean, orderItemVO: OrderItemVO) {
    if (success) {
      this.setActiveOrder(orderItemVO)
      this.activityId = orderItemVO.activityId
      this.childId = orderItemVO.subUserId
      this.fetchActivityPriceAndCardCount()
    } else {
      ShowNoticeManagement.ShowErrorNotice(LangEnum.PLEASE_CHECK_NETWORK_OR_DO_REFRESH)
    }
  }

  get submitPrice() {
    let submitPrice: number
    switch (this.currentChoosePaymentCard) {
      case PaymentCard.ALL_ACTIVITY:
        submitPrice = this.activityPriceVO.salePrice
        break
      case PaymentCard.ALONE_CARD:
        submitPrice = this.cardPriceVO.salePrice
        break
      default:
        submitPrice = this.activityPriceVO.salePrice
        break
    }
    return submitPrice
  }

  onCardClick(placeAnOrderModel: PaymentCard) {
    if (this.isCanChoose) {
      this.currentChoosePaymentCard = placeAnOrderModel
    }
  }

  OnSubmitOrderBtnClick() {
    WeAnalysisEventManagement.reportEvent(EventNameEnum.CLICK_PAY,new ClickPayDTO(this.activityPriceVO.name,this.submitPrice,this.currentChoosePaymentCard))
    if (new LoginManagement().isLogin()) {
      this.fetchNotExpiredOrder()
    } else {
      this.moveToLoginPage()
    }
  }

  moveToLoginPage() {
    const currentPath = encodeURIComponent(JSON.stringify(`/order-pages/place-an-order/PlaceAnOrder?scene=${ this.scene }`))
    uni.navigateTo({
      url: `/pages/login/index?pathKey=${ currentPath }`,
    })
  }

  moveToOrderResultPage() {
    uni.reLaunch({
      url: `${ PageLinkEnum.ORDER_RESULT }?orderId=${ this.orderId }`
    })
  }

  showPlaceAnOrderNotice() {
    ShowNoticeManagement.ShowErrorNotice(LangEnum.PLACE_FAIL_NOTICE)
  }

  fetchActivityPrice() {
    ActivityService.receiveActivityPrice(this.activityId, this.fetchActivityPriceCallback)
  }

  fetchActivityPriceCallback(success: boolean, activityPriceVO: ActivityPriceVO) {
    if (success) {
      this.activityPriceVO = activityPriceVO
      WeAnalysisEventManagement.reportEvent(EventNameEnum.VISIT_ORDER_PAGE, new VisitOrderPageDTO(this.activityPriceVO.name,activityPriceVO.salePrice,this.cardPriceVO.salePrice))
    }
  }

  doCreateOrder() {
    if (!this.orderId) {
      let createOrderDTO: CreateOrderDTO
      switch (this.currentChoosePaymentCard) {
        case PaymentCard.ALONE_CARD:
          createOrderDTO = new CreateOrderDTO(this.lessonCardId, this.childId, PaymentCard.ALONE_CARD, this.sectionId, this.activityId)
          break
        case PaymentCard.ALL_ACTIVITY:
          createOrderDTO = new CreateOrderDTO(this.activityId, this.childId, PaymentCard.ALL_ACTIVITY)
          break
        default:
          createOrderDTO = new CreateOrderDTO(this.activityId, this.childId, PaymentCard.ALL_ACTIVITY)
          break
      }
      console.log('doCreateOrder orderRemark:'+this.orderRemark)
      if (this.orderRemark !== '') {
        createOrderDTO.remark = this.orderRemark
      }

      if (this.activityPriceVO && this.activityPriceVO.includeRealGoods && this.orderRemark === '') {
        ShowNoticeManagement.ShowErrorNotice(LangEnum.FILL_IN_YOUR_ADDRESS)
      } else {
        OrderService.createOrder(createOrderDTO, this.createOrderCallback)
      }
    } else {
      this.doLaunchPayment()
    }
  }

  async doLaunchPayment() {
    if (this.orderItem.entryReserved && this.remainingTime <= 0) {
      ShowNoticeManagement.ShowErrorNotice('名额预留已到期，请返回活动页重新报名')
      return
    }
    await PaymentService.doPayment(this.orderId, new DoPaymentDTO(await this.getWxLoginCode()), this.doLaunchPaymentCallback)
  }

  doLaunchPaymentCallback(success: boolean,
                          doPaymentCallbackVO: DoPaymentCallbackVO
  ) {
    if (success) {
      this.doPaymentCallbackVO = doPaymentCallbackVO
      const jsapiPayment = this.doPaymentCallbackVO.jsapiPayment
      PaymentManagement.doWxRequestPayment(jsapiPayment, this.doWxRequestPayCallback)
    } else {
      this.showPlaceAnOrderNotice()
    }
  }

  doWxRequestPayCallback(result: string) {
    if (result === 'requestPayment:ok') {
      this.moveToOrderResultPage()
    } else if (result === 'requestPayment:fail cancel') {
     this.moveToOrderDetailPage()
    } else {
      this.showPlaceAnOrderNotice()
    }
  }

  moveToOrderDetailPage() {
    uni.reLaunch({
      url: `${ PageLinkEnum.ORDER_DETAIL }?orderNo=${ this.orderId }`
    })
  }

  createOrderCallback(success: boolean, orderItem: OrderItemVO) {
    if (success) {
      this.orderId = orderItem.id
      this.setActiveOrder(orderItem)
      this.doLaunchPayment()
    } else {
      this.showPlaceAnOrderNotice()
    }
  }

  getWxLoginCode(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      wx.login({
        success: res => {
          if (res.errMsg === 'login:ok') {
            resolve(res.code)
          } else {
            reject(res.errMsg)
          }
        },
        fail: res => reject(res.errMsg)
      })
    })
  }

  fetchActivityCardCount() {
    ActivityService.receiveActivityCardCount(this.activityId, this.fetchActivityCardCountCallback)
  }

  fetchActivityCardCountCallback(success: boolean, total: number) {
    this.activityTotalCardCount = total
  }

  setActiveOrder(orderItem: OrderItemVO) {
    this.orderItem = orderItem
    if (!orderItem.entryReserved) {
      return
    }

    this.remainingTime = Math.max(0, Math.ceil((orderItem.expireTime - Date.now()) / 1000))
    if (this.countdownCounter) {
      this.countdownCounter.pauseCountdown()
    }
    this.countdownCounter = new CountdownCounter(this.remainingTime, this.countdownCallback)
    if (this.remainingTime > 0) {
      this.countdownCounter.startCountdown()
    }
  }

  countdownCallback(residueDegree: number) {
    this.remainingTime = Math.max(0, residueDegree)
  }

  get reservationCountdown() {
    return Utils.timeSecondHMS(this.remainingTime)
  }

  destroyed() {
    if (this.countdownCounter) {
      this.countdownCounter.pauseCountdown()
    }
    uni.$emit('backToactive')
  }

  onOrderRemarkChange(value: any){
    this.orderRemark = value.detail
  }
}

</script>
