interface AnyObject {
  [key: string]: any
}

interface IdObject {
  id: string
}

// 生成一个UUID
export const getUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// 比较两个对象中是否有相同的 id
export const hasEqualId = (item1: IdObject, item2: IdObject) => item1.id === item2.id

// 将一个对象中的属性值取反
export const toggleProp = (item: any, key: string) => ({
  ...item,
  [key]: !item[key]
})

// 检测一个元素是否为真值
export const isTruthyValue = (value: any) => !!value

// 用于校验对象中的值
// 默认检测对象中每个值是否是真值
export const validateObject = (validator: Function = isTruthyValue) => (anyObject: AnyObject) => {
  return Object.keys(anyObject).every((key) => validator(anyObject[key], key, anyObject))
}

export default Object.freeze({
  getUUID,
  hasEqualId,
  toggleProp,
  isTruthyValue,
  validateObject
})
