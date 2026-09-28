class FilterActivityDTO {
  columnId: string = ''
  activityName: string = ''
  tagName: string = ''
  tagIds: string = ''
  ageStart: number = -1
  free: number = 0
  hasRank: number = 0
  ageEnd: number = -1
  isLoadEntryUserCount: number = 0
  pageNo: number = 1
  pageSize: number = 10
}

export default FilterActivityDTO
