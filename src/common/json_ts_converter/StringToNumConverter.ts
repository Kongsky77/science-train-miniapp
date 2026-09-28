import {
  JsonConverter,
  JsonCustomConvert,
  JsonConvert,
  ValueCheckingMode
} from 'json2typescript'
@JsonConverter
export class StringToNumConverter implements JsonCustomConvert<number> {
  serialize (data: number): any {
    return null
  }
  deserialize (data: string): number {
    let value = parseInt(data, 10)
    return value
  }
}
