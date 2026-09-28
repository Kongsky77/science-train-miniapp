import EventDTO from '@/definition/common/EventDTO'

class VisitActivityDetailDTO extends EventDTO {
  activity_name: string = ''


  constructor(activity_name: string) {
    super()
    this.activity_name = activity_name
  }
}

export default VisitActivityDetailDTO
