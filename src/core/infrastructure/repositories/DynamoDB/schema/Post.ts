import { ulid } from 'ulid'
import { Item } from './Item'

export class PostDynamoDB extends Item {
  username: string
  id: string

  constructor (username: string) {
    super()
    this.username = username
    this.id = ulid()
  }

  get pk () {
    return `USER#${this.username}#POST`
  }
  get sk () {
    return `POST#${this.id}`
  }

  static async createPost () {
    
  }
}