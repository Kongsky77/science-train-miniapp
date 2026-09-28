import ListEnum from '@/definition/rank/ListEnum'

export default interface RankListItemType {
  id: string
  rank: number // 排名
  icon: string // 头像
  avatar: string // 头像
  teamName: string // 战队名称
  schoolName: string // 学校名称
  score: string
  // type: ListEnum // 列表项类型，用于控制是否可以打榜按钮，是否显示文字等等。
}
