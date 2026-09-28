import { JsonObject , JsonProperty } from 'json2typescript'
import ChildActivityItem from '@/beans/activity/ChildActivityItem'
import ActivityFullItem from '@/beans/activity/ActivityFullItem'

@JsonObject
export default class ChildrenActivityResponse {
  @JsonProperty('activity', ActivityFullItem, true)
  activity: ActivityFullItem = new ActivityFullItem()
}