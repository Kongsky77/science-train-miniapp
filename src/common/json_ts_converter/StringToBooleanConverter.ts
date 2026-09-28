import {
  JsonConverter,
  JsonCustomConvert
} from 'json2typescript'
@JsonConverter
export class StringToBooleanConverter implements JsonCustomConvert<boolean> {
  serialize (data: boolean): any {
    return null
  }
  deserialize (data: string): boolean {
    let value = data === '1' ? true : false
    return value
  }
}
