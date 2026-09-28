import EventDTO from '@/definition/common/EventDTO'
import TabEnum from '@/enums/common/TabEnum'

class VisitBottomColumnDTO extends EventDTO{
  bottom_column: TabEnum = TabEnum.INDEX


  constructor(bottom_column: TabEnum) {
    super()
    this.bottom_column = bottom_column
  }
}

export default VisitBottomColumnDTO
