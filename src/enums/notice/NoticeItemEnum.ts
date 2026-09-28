export enum Action {
  NOTICE,
  PRIVATE,
  LIKE
}

export enum SenderType {
  SYSTEM = 1,
  USER,
  ADMIN
}

export enum TargetType {
  GROUP = 1,
  USER,
  ACTIVITY,
  CERT,
  BADGE,
  SUB_USER_MESSAGE
}

export enum LikeType {
  ACTIVITY = 1,
  USER = 2
}
