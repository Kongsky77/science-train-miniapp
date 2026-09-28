import {
  JsonConverter,
  JsonCustomConvert
} from 'json2typescript'
@JsonConverter
export class StringToYuanConverter implements JsonCustomConvert<number> {
  serialize (data: number): any {
    return null
  }
  deserialize (data: string): number {
    let value = parseInt(data, 10)
    return value / 100
  }
}
