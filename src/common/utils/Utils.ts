import BadgeRankAchievement from '@/definition/badge/BadgeRankAchievement'
import LangEnum from '@/definition/lang/LangEnum'

let getPrototypeOf: any = Object.getPrototypeOf
let toString = Object.prototype.toString
let slice = [].slice
let splice = [].splice
let push = [].push
let hasOwnProperty = {}.hasOwnProperty
let TYPED_ARRAY_REGEXP = /^\[object (?:Uint8|Uint8Clamped|Uint16|Uint32|Int8|Int16|Int32|Float32|Float64)Array]$/

export class Utils {
  public static pathConvert (path: string): string {
    return process.env.VUE_APP_STORAGE_URI + path
  }

  public static getRandom (): string {
    let chars = [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z'
    ]
    let res = ''
    for (let i = 0; i < 10; i++) {
      let id = Math.ceil(Math.random() * 35)
      res += chars[id]
    }
    return res
  }
  public static getDomainName (level: number): string {
    let parts = location.hostname.split('.')
    let length = parts.length
    let name = parts[length - level - 1]
    return name
  }
  // 指定位置插入字符
  public static insertStr (soure: string, start: number, newStr: string) {
    return soure.slice(0, start) + newStr + soure.slice(start)
  }
  // 将时间戳转换为时间
  public static localTime (nS: number): string {
    if (!nS) {
      return ''
    } else {
      let date = new Date(nS)
      let Y = date.getFullYear() + '-'
      let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
      let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
      let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
      let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      return Y + M + D + h + m + s
    }
  }

  public static timeSecondHMS (second: number): string {
    let h = Math.floor(second / 3600)
    let m = Math.floor((second % 3600) / 60)
    let s = Math.floor((second % 3600) % 60)
    let strH = h < 10 ? '0' + h : h
    let strM = m < 10 ? '0' + m : m
    let strS = s < 10 ? '0' + s : s

    return strH + '小时' + strM + '分' + strS + '秒'
  }

  public static hmsTime (nS: number): string {
    if (!nS) {
      return ''
    } else {
      let date = new Date(nS)
      let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + '小时'
      let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + '分'
      let s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()) + '秒'
      return h + m + s
    }
  }
  // 将时间戳转换为时间（只保留年月日时分）时间可是为2020-05-19 00:00
  public static localTimeYMDhm (nS: number): string {
    let date = new Date(nS)
    let Y = date.getFullYear() + '-'
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
    let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
    let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    return Y + M + D + h + m
  }

  public static localTimeYMDByCenterLine (nS: number): string {
    let date = new Date(nS)
    let Y = date.getFullYear() + '-'
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    return Y + M + D
  }

  public static localTimeYMDh (nS: number): string {
    let date = new Date(nS)
    let Y = date.getFullYear() + '年'
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月'
    let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '日'
    let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + '点'
    return Y + M + D + h
  }

  public static startTimeYMDh (nS: number): string {
    let date = new Date(nS)
    let Y = date.getFullYear() + '/'
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/'
    let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    return Y + M + D
  }

  public static getAgoAt (needParseStamp: number) {
    let result
    const minute = 1000 * 60
    const hour = minute * 60
    const day = hour * 24
    const month = day * 30
    const now = new Date().getTime()
    const diffValue = now - needParseStamp
    if (diffValue < 0) {
      return
    }
    const monthC = diffValue / month
    const weekC = diffValue / (7 * day)
    const dayC = diffValue / day
    const hourC = diffValue / hour
    const minC = diffValue / minute
    if (monthC >= 1) {
      if (monthC <= 12) result = '' + parseInt(String(monthC)) + '月前'
      else {
        result = '' + parseInt(String(monthC / 12)) + '年前'
      }
    } else if (weekC >= 1) {
      result = '' + parseInt(String(weekC)) + '周前'
    } else if (dayC >= 1) {
      result = '' + parseInt(String(dayC)) + '天前'
    } else if (hourC >= 1) {
      result = '' + parseInt(String(hourC)) + '小时前'
    } else if (minC >= 1) {
      result = '' + parseInt(String(minC)) + '分钟前'
    } else {
      result = '刚刚'
    }
    return result
  }

  public static getLocalTimeYMD (nS: number): string {
    let date = new Date(nS)
    let Y = date.getFullYear() + '年'
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月'
    let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '日'
    return Y + M + D
  }

  public static svgToPng (svgPath: string): string {
    const reg = /\.\w+$/
    return svgPath.replace(reg, '') + '.png'
  }

  // 将时间戳转换为时间（只保留年、月、日）
  public static localTimeYMD (nS: number, joinBy: string = '/'): string {
    let date = new Date(nS)
    let Y = date.getFullYear() + joinBy
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + joinBy
    let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    return Y + M + D
  }
  // 将秒数转换成天数
  public static secondsToDay (nS: number): number {
    return Math.ceil(nS / (24 * 3600))
  }
  // 将秒数转换成分钟
  public static secondsToMins (nS: number): string {
    return Math.floor(nS / 60) + ':' + nS % 60
  }
  // 补位
  public static foo (str: string) {
    str = '0' + str
    return str.substring(str.length - 5, str.length)
  }
  // 获取当前时间戳
  public static getNowTimeStamp (): number {
    let myDate = new Date()
    return myDate.getTime() / 1000
  }
  // 将时间转换为时间戳
  public static localTimestamp (date: any): number {
    date = new Date(Date.parse(date.replace(/-/g, '/')))
    return date.getTime() / 1000
  }

  /**
   * 进行时间戳的比较(为true时)
   * @param dateStamp
   */
  public static compareWithNowTimeStamp (dateStamp: number): boolean {
    let nowTime = new Date().getTime()
    if (dateStamp - nowTime > 0) {
      return true
    } else if (dateStamp - nowTime <= 0) {
      return false
    }
  }
  /**
   * 将天数转为年，保留1位小数
   */
  public static toYears (days: number): number {
    let years = Math.floor(days / 365 * 10) / 10
    return years
  }
  // 判断客户端是ios或者是Android
  public static isIos (): boolean {
    let u = navigator.userAgent
    let app = navigator.appVersion
    let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1 // g
    let isIOS = !!u.match(/\(i[^]+( U)? CPU.+Mac OS X/) // ios终端
    if (isAndroid) {
      return false
    } else if (isIOS) {
      return true
    }
    return false
  }

  // 判断是否为pc端或移动端
  public static isPhone (): boolean {
    return /(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)
  }

  // 判断是否为pc端或移动端
  public static isPC (): boolean {
    let [userAgentInfo, Agents] = [
      navigator.userAgent,
      ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod']
    ]
    let flag = true
    for (let v = 0; v < Agents.length; v++) {
      if (userAgentInfo.indexOf(Agents[v]) > 0) {
        flag = false
        break
      }
    }
    return flag
  }

  // 判断用户名是否规范   可以是汉字、字母、数字、下划线，长度为1-10
  public static testName (str: string): boolean {
    return /^[\u4e00-\u9fff\w]{2,10}$/.test(str)
  }

  // 判断是否在微信里面打开
  public static isWeiXn (): boolean {
    return navigator.userAgent.indexOf('MicroMessenger') > -1
  }

  // 验证手机号码
  public static verifyPhoneNumber (phoneNumber: string): boolean {
    phoneNumber = this.removeTheExtraSpace(phoneNumber)
    return /^1(3|4|5|6|7|8|9)\d{9}$/.test(phoneNumber)
  }
  // 去掉多余的空格
  public static removeTheExtraSpace (str: string): string {
    let arr = []
    for (let i = 0; i < str.length; i++) {
      if (str.charCodeAt(i) === 32 || str.charCodeAt(i) === 12288) {
        continue
      } else {
        arr.push(str[i])
      }
    }
    return arr.join('')
  }

  public static formatBadgePosition (position: number) {
    let interval
    if (position >= 1 && position <= 3) {
      interval = 1
    } else if (position >= 4 && position <= 10) {
      interval = 2
    } else if (position >= 11 && position <= 50) {
      interval = 3
    } else if (position >= 51 && position <= 100) {
      interval = 4
    } else {
      interval = 5
    }
    return interval
  }

  public static sortByTimestamp (property, isRise) {
    return function (currentArray, changeArray) {
      const currentArrayProperty = currentArray[property]
      const changeArrayProperty = changeArray[property]
      if (isRise === true) {
        return currentArrayProperty - changeArrayProperty
      } else {
        return changeArrayProperty - currentArrayProperty
      }
    }
  }

  public static formatLastFourPhone (title: string): string {
    return title.substring(title.length - 4)
  }

  public static formatShareTitle (prefix: string, position: number) {
    if (
      position === BadgeRankAchievement.CURRENT_BADGE_RANK_FIRST ||
      position === BadgeRankAchievement.CURRENT_BADGE_RANK_SECOND ||
      position === BadgeRankAchievement.CURRENT_BADGE_RANK_THIRD
    ) {
      return `
      ${prefix}TOP${position}`
    } else if (
      BadgeRankAchievement.CURRENT_BADGE_RANK_THIRD < position &&
      position <= BadgeRankAchievement.CURRENT_BADGE_RANK_TOP_TEN
    ) {
      return `${prefix}前${BadgeRankAchievement.CURRENT_BADGE_RANK_TOP_TEN}强`
    } else if (
      BadgeRankAchievement.CURRENT_BADGE_RANK_TOP_TEN < position &&
      position <= BadgeRankAchievement.CURRENT_BADGE_RANK_HALF
    ) {
      return `${prefix}前${BadgeRankAchievement.CURRENT_BADGE_RANK_HALF}强`
    } else if (
      BadgeRankAchievement.CURRENT_BADGE_RANK_HALF < position &&
      position <= BadgeRankAchievement.CURRENT_BADGE_RANK_MAX
    ) {
      return `${prefix}前${BadgeRankAchievement.CURRENT_BADGE_RANK_MAX}强`
    } else {
      return LangEnum.NO_DATA
    }
  }

  // 四舍五入保留有效数字
  public static formatting (src: number, pos: number): number {
    return Math.round(src * Math.pow(10, pos)) / Math.pow(10, pos)
  }
  // 不四舍五入保留有效数字
  public static noFormatting (src: number, pos: number): number {
    let [bb, result, decimal] = [src + '', 0, '']
    let integer = bb.split('.')[0]
    if (bb.split('.').length > 1) {
      decimal = bb.split('.')[1].substring(0, pos)
      result = Number(integer + '.' + decimal)
    } else {
      result = Number(integer)
    }
    return result
  }
  // 获取&param=的参数
  public static getUrlParams (param: string): string {
    let [FINAD_VAL, url] = ['', document.location.href.split('?')]
    for (let i in url) {
      let urlParam = url[i].split('&')
      for (let s in urlParam) {
        if (urlParam[s].indexOf('=') !== -1) {
          if (urlParam[s].split('=')[0] === param) {
            FINAD_VAL = urlParam[s].split('=')[1]
            break
          }
        }
      }
    }
    return decodeURI(FINAD_VAL)
  }
  // 判断是否为数值
  public static isRealNum (val: any): boolean {
    if (val === '' || val === null) {
      return false
    }
    return !isNaN(val)
  }
  // 获取url地址键值对对应的值
  public static getQueryString (str: string): string | boolean {
    let getUrl = document.location.href
    let getPos = getUrl.indexOf(str + '=')
    if (getPos === -1) {
      return false
    }
    let getPar = getUrl.slice(str.length + getPos + 1)
    let getParAfter = getPar.indexOf('&')
    if (getParAfter !== -1) {
      getPar = getPar.slice(0, getParAfter)
    }
    return getPar
  }
  // 格式化url占位符
  public static urlFormat (url: string, param: any): string {
    if (param === undefined || param === null || Object.keys(param).length === 0) {
      return url
    }
    let keys = Object.keys(param)
    for (let key of keys) {
      url = url.replace(new RegExp('\\{' + key + '\\}', 'g'), param[key])
    }
    return url
  }

  public static getImageSize (src: string) {
    let image = new Image()
    let promise = new Promise(function (resolve, reject) {
      image.onload = function () {
        resolve(image)
      }
      image.onerror = function () {
        reject(image)
      }
    })
    image.src = src
    return promise
  }

  /**
   * 根据请求的地址和参数获取完整的请求地址
   */
  // public static getRequestPath (url: string, params: any = {}) {
  //   let paramArray: Array<string>
  //   paramArray = Object.keys(params).map(function (key) {
  //     if (params[key] !== undefined) {
  //       return `${key}=${params[key]}`
  //     }
  //   })
  //   return paramArray.length === 0 ? url : `${url}?${paramArray.join('&')}`
  // }

  /**
   * 下载文件重命名
   */
  // public static fileNameConvert (filePath: string, fileName: string) {
  //   FileSaver.saveAs(filePath, fileName)
  // }

  /**
   * 对象转为url参数
   * @param obj
   * @param question 是否在参数前面加上'？'，默认：true
   * @return  例：a=1&b=2&c=3
   */
  public static objToUrlParam (obj: any, question: boolean = true): string {
    let queryParam = ''
    if (obj) {
      for (const key of Object.keys(obj)) {
        if (obj.hasOwnProperty(key)) {
          let value = obj[key]
          if (value) {
            queryParam += '&' + key + '=' + value
          }
        }
      }
    }
    if (queryParam.length > 0) {
      queryParam = queryParam.substring(1, queryParam.length)
      if (question) {
        queryParam = '?' + queryParam
      }
    }
    return queryParam
  }

  /**
   * 这是一段非常有意思的提示，你觉得呢
   */
  public static codingTips (): void {
    alert('表急，程序猿正在赶去加班的路上')
  }

  /**
   * 弹幕条数处理
   */
  public static handleBulletCount (bulletCount: number): string {
    let bulletNum = bulletCount.toString()
    if (bulletCount >= 1000) {
      bulletNum = bulletNum.slice(0, bulletNum.length - 3) + 'k+'
    }
    return bulletNum
  }

  /**
   * 获取文件扩展名
   * @param fileName 文件名
   * @param prefix 开头是否包含句号
   */
  public static getFileExtension (fileName: string, prefix?: boolean): string {
    let ext = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length)
    return prefix ? '.' + ext : ext
  }

  // 计算时间差
  public static formatTimes (startTime: number, endTime: number) {
    let diff = endTime - startTime
    let str = ''
    // 毫秒化天
    let d = Math.floor(diff / (24 * 3600 * 1000))
    if (d > 0) {
      str += d + '天'
    }
    // 毫秒化小时
    let rh = diff % (24 * 3600 * 1000)
    let h: any = Math.floor(rh / (3600 * 1000))
    h = h < 10 ? '0' + h : h
    if (h > 0 || d > 0) {
      str += h + ':'
    } else {
      str += '00:'
    }
    // 毫秒化分钟
    let rm = rh % (3600 * 1000)
    let m: any = Math.floor(rm / (60 * 1000))
    m = m < 10 ? '0' + m : m
    if (m > 0 || d > 0 || h > 0) {
      str += m + ':'
    } else {
      str += '00:'
    }

    // 毫秒化秒
    let rs = rm % (60 * 1000)
    let s: any = Math.round(rs / 1000)
    s = s < 10 ? '0' + s : s
    if (s > 0 || d > 0 || h > 0 || m > 0) {
      str += s
    } else {
      str += '00'
    }
    return str
  }

  public static noRoundingNumberOfOrders (member: string, numberOfDigits: number) {
    // num为原数字，numberOfDigits是保留的小数位数
    let result = '0'
    if (Number(member) && numberOfDigits > 0) {
      // 简单的做个判断
      numberOfDigits = +numberOfDigits || 2
      member = member + ''
      if (/e/.test(member)) {
        // 如果是包含e字符的数字直接返回
        result = member
      } else if (!/\./.test(member)) {
        // 如果没有小数点
        result = member + `.${Array(numberOfDigits + 1).join('0')}`
      } else {
        // 如果有小数点
        member = member + `${Array(numberOfDigits + 1).join('0')}`
        let reg = new RegExp(`-?\\d*.\\d{0,${numberOfDigits}}`)
        result = reg.exec(member)[0]
      }
    }
    return result
  }

  public static changeURLArg (url: string, arg: string, argVal: string): string {
    const pattern = arg + '=([^&]*)'
    const replaceText = arg + '=' + argVal
    if (url.match(pattern)) {
      const reg = new RegExp('(' + arg + '=)([^&]*)', 'gi')
      const tmp = url.replace(reg, replaceText)
      return tmp
    } else {
      if (url.match('[?]')) {
        return url + '&' + replaceText
      } else {
        return url + '?' + replaceText
      }
    }
  }

  public static timeSecondToHMS (second: number): string {
    let h = Math.floor(second / 3600)
    let m = Math.floor((second % 3600) / 60)
    let s = Math.floor((second % 3600) % 60)
    let strH = h < 10 ? '0' + h : h
    let strM = m < 10 ? '0' + m : m
    let strS = s < 10 ? '0' + s : s

    return strH + ':' + strM + ':' + strS
  }

  public static getReachBottomPagingList<T> (page: number, totalPage: number, oldPageList: T[], newPageList: T[]) {
    let pagingList: T[]
    if (page === 1) {
      pagingList = newPageList
    } else {
      pagingList = [...oldPageList, ...newPageList]
    }
    return pagingList
  }

  static mergeObjects (
    obj1: Record<string, any>,
    obj2: Record<string, any>
  ): Record<string, any> {
    for (const key in obj1) {
      if (Object.prototype.hasOwnProperty.call(obj2, key)) {
        obj1[key] = obj2[key];
      }
    }
    return obj1;
  }
}
