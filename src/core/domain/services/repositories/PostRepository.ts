
export interface PostRepository {
  createPost(postData: object): Promise<string>
  getAllPost(username: string): Promise<string>
}