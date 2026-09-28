import PaymentStatus from '@/definition/order/PaymentStatus'
import PaymentStatusText from '@/definition/order/PaymentStatusText'

const PaymentStatusMap: Map<PaymentStatus,string> = new Map([
      [ PaymentStatus.TO_BE_PAID,PaymentStatusText.TO_BE_PAID ],
      [ PaymentStatus.CANCEL_PAYMENT,PaymentStatusText.CANCEL_PAYMENT ],
      [ PaymentStatus.PAYMENT_FAIL,PaymentStatusText.PAYMENT_FAIL ],
      [ PaymentStatus.PAYMENT_TIMEOUT,PaymentStatusText.PAYMENT_TIMEOUT ],
      [ PaymentStatus.PAID,PaymentStatusText.PAID ]
    ]
)

export default PaymentStatusMap
