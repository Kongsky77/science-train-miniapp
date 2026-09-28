import ThemeEnum from '@/definition/common/ThemeEnum'
import ThemeTypeEnum from '@/enums/theme/ThemeTypeEnum'
import StaticFileEnum from '@/definition/lang/StaticFileEnum'

class ThemeTypeItem {
  indexBackground: string = ''
  indexBackgroundText: string = ''


  constructor(indexBackground: string, indexBackgroundText: string) {
    this.indexBackground = indexBackground
    this.indexBackgroundText = indexBackgroundText
  }
}

const ThemeMap: Map<ThemeTypeEnum, ThemeTypeItem> = new Map<ThemeTypeEnum, ThemeTypeItem>([
  [ThemeTypeEnum.NORMAL, new ThemeTypeItem(
      StaticFileEnum.AI121_INDEX_BACKGROUND,
      StaticFileEnum.AI121_INDEX_BACKGROUND_TEXT
  )],
  [ThemeTypeEnum.GF, new ThemeTypeItem(
      StaticFileEnum.GF_INDEX_BACKGROUND,
      StaticFileEnum.GF_INDEX_BACKGROUND_TEXT)],
  [ThemeTypeEnum.ZHONG_GUO_XIN, new ThemeTypeItem(
    StaticFileEnum.ZGX_INDEX_BACKGROUND,
    StaticFileEnum.ZGX_INDEX_BACKGROUND_TEXT
)]
])

export {
  ThemeTypeItem,
  ThemeMap
}
