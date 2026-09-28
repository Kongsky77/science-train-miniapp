class JoinTeamDTO {
  private subUserId: string = ''
  private teamId: string = ''


  constructor (subUserId: string,teamId: string) {
    this.subUserId = subUserId
    this.teamId = teamId
  }
}

export default JoinTeamDTO
