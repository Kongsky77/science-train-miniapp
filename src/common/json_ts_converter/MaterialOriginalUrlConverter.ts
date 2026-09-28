import {
  JsonConverter,
  JsonCustomConvert,
  JsonConvert,
  ValueCheckingMode
} from 'json2typescript'
@JsonConverter
export class MaterialOriginalUrlConverter implements JsonCustomConvert<string> {
  serialize (data: string): any {
    return null
  }
  deserialize (data: string): string {
    let value = data
    if (data.toLowerCase().indexOf('http') === -1) {
      value = process.env.VUE_APP_STORAGE_URI + data
    }
    return value
  }
}
