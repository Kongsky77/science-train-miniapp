import Vue from 'vue'
export class EventBusService {
  static _instance: EventBusService | undefined

  private bus: Vue

  constructor () {
    this.bus = new Vue()
  }

  static getInstance () {
    if (!EventBusService._instance) {
      EventBusService._instance = new EventBusService()
    }
    return EventBusService._instance
  }

  emit (event: string,...params: any) {
    this.bus.$emit(event, params)
  }

  on (event: string,callback: any) {
    this.bus.$on(event,callback)
  }

  off (event: string) {
    this.bus.$off(event)
  }

}
