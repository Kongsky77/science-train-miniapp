import EventDTO from '@/definition/common/EventDTO'

class VisitActivityColumnDTO extends EventDTO  {
  activity_column: string = ''


  constructor(activity_column: string) {
    super()
    this.activity_column = activity_column
  }
}

export default VisitActivityColumnDTO
