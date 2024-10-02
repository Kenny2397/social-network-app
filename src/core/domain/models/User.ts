
export interface User {
  count: UserCount,
  info: UserInfo
}

export interface UserCount {
  follower: number
  following: number
  post: number
}
export interface UserInfo {
  username: string
  email: string
  firstName: string
  lastName: string
  phone: string,
  birthDate: string,
}