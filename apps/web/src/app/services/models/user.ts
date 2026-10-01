export interface User {
  id: string;
  name: string;
  email: string;
}

export interface UsersResponse {
  users: User[]
}
