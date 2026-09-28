<style lang="scss" scoped>
.page {
  height: 100%;
  background: #F2F2F6;

  .success-area {
    height: 35%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .text-area {
      display: flex;
      align-items: center;

      .icon {
        margin-right: 20rpx;
      }
    }

    .text {
      color: #ffffff;

      view:first-child {
        font-size: 45rpx;
      }

      view:last-child {
        font-size: 30rpx;
        opacity: 0.6;
      }
    }
  }

  .shadow-area {
    width: 90%;
    height: 20rpx;
    position: relative;
    top: 40rpx;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 30rpx;
    padding-top: 15rpx;

    .bill {
      width: 95%;
      padding-bottom: 30rpx;
      box-shadow: 0 -5px 10px rgba(0, 0, 0, 0.3);
      background-color: #ffffff;
      margin: 0 auto;

      .price {
        text-align: center;
        font-size: 50rpx;
        padding-top: 40rpx;
        padding-bottom: 40rpx;
        border-bottom: 1rpx dashed #DCDCDC;

        .rmb {
          position: relative;
          bottom: 18rpx;
          font-size: 28rpx;
        }

      }

      .info {
        color: #808080;
        padding-top: 60rpx;
        padding-left: 30rpx;

        view {
          margin-bottom: 40rpx;
        }
      }
    }
  }

  .btn-group {
    width: 100%;
    position: absolute;
    bottom: 5%;

    .btn-container {
      width: 90%;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      text-align: center;

      view {
        width: 45%;
        padding-top: 20rpx;
        padding-bottom: 20rpx;
        border-radius: 50rpx;
      }

      .move-to-learning {
        color: #3646A5;
        border: 1px solid #3646A5;

      }

      .look-activity-detail {
        background: #3646A5;
        color: #ffffff;
      }
    }
  }
}
</style>

<template>
  <view class="page" v-if="isMounted">
    <view class="success-area" :style="{backgroundColor: currentColor}">
      <view class="text-area">
        <view class="icon">
          <van-image width="80" height="80" :src="successIcon"/>
        </view>
        <view class="text">
          <view>{{ isSuccess ? '支付成功' : '支付失败' }}</view>
          <view>{{ isSuccess ? '感谢您的购买' : '很抱歉，未能完成' }}</view>
        </view>
      </view>
      <view class="shadow-area">
        <view class="bill">
          <view class="price">
            <span class="rmb">￥</span> <span
              :style="{textDecoration: isSuccess ? 'none' : 'line-through'}">{{ orderItemVO.totalAmount }}</span>
          </view>
          <view class="info">
            <view>订单编号：{{ orderItemVO.id }}</view>
            <view>下单时间：{{ time }}</view>
            <view>支付方式：{{ payWay }}</view>
          </view>
        </view>
      </view>
    </view>
    <view class="btn-group">
      <view class="btn-container">
        <view class="move-to-learning" v-if="isSuccess" @click="moveToGuidePage">
          前往学习
        </view>
        <view class="look-activity-detail" v-if="isSuccess" @click="moveToActivityDetailPage">
          查看活动详情
        </view>

        <view class="move-to-learning" v-if="!isSuccess" @click="moveToActivityDetailPage">
          返回活动详情
        </view>
        <view class="look-activity-detail" v-if="!isSuccess" @click="moveToOrderEnterPage">
          重新支付
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { Vue,Component } from 'vue-property-decorator'
import StaticFileEnum from '@/definition/lang/StaticFileEnum'
import OrderService from '@/service/OrderService'
import OrderItemVO from '@/beans/order/vo/OrderItemVO'
import OrderStatus from '@/definition/order/OrderStatus'
import PaymentStatus from '@/definition/order/PaymentStatus'
import PayType from '@/definition/order/PayType'
import LangEnum from '@/definition/lang/LangEnum'
import PageLinkEnum from '@/definition/lang/PageLinkEnum'
import { Utils } from '@/common/utils/Utils'
import ShowNoticeManagement from '@/management/common/ShowNoticeManagement'

interface OrderResultOption {
  orderId: string
}

@Component({
  name: 'OrderResult'
})

export default class OrderResult extends Vue {
  orderId: string = ''
  isMounted: boolean = false
  activeChildId: string = ''
  orderItemVO: OrderItemVO = new OrderItemVO()

  onLoad (option: OrderResultOption) {
    this.orderId = option.orderId
    this.fetchOrderBasicInfo()
  }

  get time () {
    return Utils.localTime(this.orderItemVO.createTime)
  }

  get isSuccess () {
    let isSuccess
    switch (this.orderItemVO.payStatus) {
      case PaymentStatus.PAID:
        isSuccess = true
        break
      default:
        isSuccess = false
        break
    }
    return isSuccess
  }

  get payWay () {
    let payWay: string
    switch (this.orderItemVO.payType) {
      case PayType.WX:
        payWay = LangEnum.WX_PAY
        break
      case PayType.ALIPAY:
        payWay = LangEnum.ALI_PAY
        break
      default:
        payWay = LangEnum.WX_PAY
        break
    }
    return payWay
  }

  fetchOrderBasicInfo () {
    OrderService.fetchOrderInfo(this.orderId,true,this.fetchOrderBasicInfoCallback)
  }

  fetchOrderBasicInfoCallback (success: boolean,orderItemVO: OrderItemVO) {
    if (success) {
      this.orderItemVO = orderItemVO
      this.setCurrentNavigationBarColor()
    }else {
      ShowNoticeManagement.ShowErrorNotice(LangEnum.PLEASE_CHECK_NETWORK_OR_DO_REFRESH)
    }
  }

  setCurrentNavigationBarColor () {
    uni.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: this.currentColor,
      success: () => {
        this.isMounted = true
      }
    })
  }

  get successIcon () {
    let successIcon
    if (this.isSuccess) {
      successIcon = StaticFileEnum.PAY_SUCCESS_ICON
    } else {
      successIcon = StaticFileEnum.PAY_FAILED_ICON
    }
    return successIcon
  }

  moveToGuidePage () {
    uni.reLaunch({
      url: `/pages/guide/index?activityId=${ this.orderItemVO.activityId }&childId=${ this.orderItemVO.subUserId }`
    })
  }

  moveToActivityDetailPage () {
    uni.reLaunch({
      url: `/pages/activityDetail/index?id=${ this.orderItemVO.activityId }`
    })
  }

  moveToOrderEnterPage () {
    uni.reLaunch({
      url: `${ PageLinkEnum.PLACE_AN_ORDER }?orderId=${ this.orderItemVO.id }`
    })
  }

  get currentColor (): string {
    return this.isSuccess ? '#47c276': '#c24747'
  }
}

</script>
