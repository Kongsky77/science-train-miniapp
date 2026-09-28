import EventDTO from '@/definition/common/EventDTO'

class ClickApplicationLabelDTO extends EventDTO {
  filter_application: string = ''


  constructor(filter_application: string) {
    super()
    this.filter_application = filter_application
  }
}

export default ClickApplicationLabelDTO
