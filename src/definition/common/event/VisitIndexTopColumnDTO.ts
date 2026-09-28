import EventDTO from '@/definition/common/EventDTO'

class VisitIndexTopColumnDTO extends EventDTO{
  index_column: number = 0


  constructor(index_column: number) {
    super()
    this.index_column = index_column
  }
}

export default VisitIndexTopColumnDTO
