import { JsonConverter,JsonCustomConvert } from 'json2typescript'
import { Utils } from '@/common/utils/Utils'

@JsonConverter
export class StringToLocalTimeConverter implements JsonCustomConvert<string> {
  serialize (data: string): any {
    return null
  }
  deserialize (data: string): string {
    return Utils.localTime(Number(data))
  }
}
