import EventDTO from '@/definition/common/EventDTO'

class ClickAgeDTO extends EventDTO {
  filter_age: string = ''


  constructor(filter_age: string) {
    super()
    this.filter_age = filter_age
  }
}

export default ClickAgeDTO
