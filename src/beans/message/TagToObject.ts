import ThemeTypeEnum from '@/enums/theme/ThemeTypeEnum'

const themeType: string = process.env.VUE_APP_THEME_TYPE
export default class TagToObject {
  getStringText (text: string) {
    let str: Array<string> = []
    if (themeType === ThemeTypeEnum.GF) {
      str = text
        .replace(/<span[^]*<\/span>/gi, '&')
        .replace(/<modal/gi, '<a style="color: #707d3d;')
        .replace(/<\/modal>/gi, '</a>')
        .replace(/<a/gi, '<a style="font-size: 60rpx;color: #707d3d;"')
        .split('&')
    } else {
      str = text
        .replace(/<span[^]*<\/span>/gi, '&')
        .replace(/<modal/gi, '<a style="color: #7191e3;')
        .replace(/<\/modal>/gi, '</a>')
        .replace(/<a/gi, '<a style="font-size: 60rpx;color: #7191e3;"')
        .split('&')
    }

    // let string1 = text.match(
    // 	/([\u4e00-\u9fa5][0-9]{2}[\x00-\xff])/g || /[\u4e00-\u9fa5]/g || /[\u4e00-\u9fa5][0-9]{2}/g
    // );
    // string1.splice(1, 0, '~');
    return str
  }
  tagToArray (tag: string) {
    let tagArray = tag.match(/<[^]*">/).toString().split(' ')
    // const tagArray = tag.match(/<[^]*">/gi);
    const text = tag.match(/>[^]*</gi).toString().slice(1, -1)
    // const text = tag.match(/>[^]*</gi);
    // console.log('这打印tagArry', tag);
    // console.log('这打印tagArry', tagArray);
    // console.log('这打印text', text);
    tagArray.push('text=' + text)
    return tagArray
  }

  tagToObject (tagArray: Array<string>) {
    const tagObj: any = {}
    for (let i = 1; i < tagArray.length; i++) {
      const tagA = tagArray[i].split('=')
      const key = tagA[0]
      const value = tagA[1].replace(/"/gi, '')
      tagObj[key] = value
    }
    return tagObj
  }
}
