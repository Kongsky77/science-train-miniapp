import ColumnEnum from '@/definition/common/ColumnEnum'
import ColumnIdEnum from '@/definition/common/ColumnIdEnum'

const ColumnIdMap: Map<ColumnEnum,ColumnIdEnum> = new Map<ColumnEnum,ColumnIdEnum>([
  [ ColumnEnum.POPULAR,ColumnIdEnum.POPULAR ],
  [ ColumnEnum.OFFICIAL_COOPERATION,ColumnIdEnum.OFFICIAL_COOPERATION ],
  [ ColumnEnum.THINKING_TRAINING,ColumnIdEnum.THINKING_TRAINING ],
  [ ColumnEnum.OFFLINE_CREATIVITY,ColumnIdEnum.OFFLINE_CREATIVITY ],
  [ ColumnEnum.HUMANITY_HISTORY,ColumnIdEnum.HUMANITY_HISTORY ]
])


export default ColumnIdMap
