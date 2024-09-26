export type ModLog = {
    type: "mute",
    targetId: string,
    moderatorId: string,
    length: string,
    reason?: string
  }