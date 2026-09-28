import EventDTO from '@/definition/common/EventDTO'

class VisitFromDTO extends EventDTO{
  scenes_app_id: string = ''


  constructor(scenes_app_id: string) {
    super()
    this.scenes_app_id = scenes_app_id
  }
}

export default VisitFromDTO
