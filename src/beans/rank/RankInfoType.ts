import RankTypeEnum from '@/definition/rank/RankTypeEnum'
export default interface RankInfoType {
  avatar: string // 头像
  teamName: string // 战队名称
  schoolName: string // 学校名称
  rank: number // 排名
  projectId: string
  teamId: string
  showBth: boolean
  type: RankTypeEnum,
  modelId: string
}

