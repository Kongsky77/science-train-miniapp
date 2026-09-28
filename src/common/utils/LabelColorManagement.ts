// 颜色值
const COLORS = [
  '#E67701',
  '#D84C6F',
  '#794AEF',
  '#1967D2',
  '#07c160',
  '#1989fa',
  '#4169E1',
  '#FF4500',
  '#B22222',
  '#FF69B4'
]

/**
 * 标签颜色管理对象
 * - 标签关联颜色
 */
export default class LabelColorManagement {

  private static _instance = new LabelColorManagement()

  // 标签颜色对照map
  private colorMap: Map<string, string> = new Map()

  static reset (): void {
    const instance = this._instance
    instance.colorMap = new Map()
  }

  /**
   * 获取颜色
   * @param label
   * @return 颜色
   */
  static get (label: string): string {
    const instance = this._instance
    if (instance.colorMap.has(label)) {
      return instance.colorMap.get(label)
    }
    // 生成color
    const index = instance.colorMap.size % COLORS.length
    let color = COLORS[index]
    // 保存
    instance.colorMap.set(label, color)
    return color
  }

}


