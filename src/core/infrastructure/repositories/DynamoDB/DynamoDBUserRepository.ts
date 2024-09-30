import { User } from '@domain/models/User'
import { UserRepository } from '@domain/services/repositories/UserRepository'
import { CreateUserType } from 'src/core/app/schemas/UserSchema'
import { UserDynamoDB } from './schema/User'

export class DynamoDBUserRepository implements UserRepository {

  async createUser (userData: CreateUserType): Promise<string> {

    const res = await UserDynamoDB.createUserInfo(userData)
    return res!
  }

  async getUserData (username: string): Promise<User> {
    const user = await UserDynamoDB.getUser(username)

    return user
  }
}