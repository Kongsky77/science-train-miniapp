import EventDTO from '@/definition/common/EventDTO'

class SignActivitySuccessDTO extends EventDTO{
  activity_name: string = ''
  child_id: string = ''


  constructor(activity_name: string,child_id: string) {
    super()
    this.child_id = child_id
    this.activity_name = activity_name
  }
}

export default SignActivitySuccessDTO
