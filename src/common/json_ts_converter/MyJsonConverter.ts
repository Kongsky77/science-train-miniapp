import { JsonConvert, ValueCheckingMode } from 'json2typescript'

export default class MyJsonConverter {

  static _instance: MyJsonConverter

  static jsonConvert: JsonConvert

  static getInstance () {
    if (!MyJsonConverter._instance) {
      MyJsonConverter._instance = new MyJsonConverter()

      this.jsonConvert = new JsonConvert()
      this.jsonConvert.ignorePrimitiveChecks = false
      this.jsonConvert.valueCheckingMode = ValueCheckingMode.DISALLOW_NULL
    }
    return MyJsonConverter._instance
  }

  deserializeObject<T> (jsonObject: any, classReference: {
    new(): T;
  }): T {
    let result = MyJsonConverter.jsonConvert.deserializeObject(jsonObject, classReference)
    return result
  }

  deserialize<T> (json: any, classReference: {
    new (): T;
  }): T | T[] {
    let result = MyJsonConverter.jsonConvert.deserialize(json, classReference)
    return result
  }

  deserializeArray<T> (jsonArray: any[], classReference: {
    new (): T;
  }): T[] {
    let result = MyJsonConverter.jsonConvert.deserializeArray(jsonArray, classReference)
    return result
  }
}
