import { UsersApiClient } from "../apiClients/users";

export class UsersService {
  private client: UsersApiClient;
  constructor() {
    this.client = new UsersApiClient();
  }
  async getUser(id: string, isShort: boolean = false) {
    const { status, data } = await this.client.getUser(id).then(
      (res) => ({
        status: 200,
        data: isShort ? convertShortUser(res.data) : convertUser(res.data),
      }),
      (err) => ({
        status: err.response.status,
        data: err.response.data,
      })
    );

    return { status, body: data };
  }

  async getUsers(isShort: boolean = false) {
    const { status, data } = await this.client.getUsers().then(
      (res) => ({
        status: 200,
        data: res.data.map((user: any) =>
          isShort ? convertShortUser(user) : convertUser(user)
        ),
      }),
      (err) => ({
        status: err.response.status,
        data: err.response.data,
      })
    );

    return { status, body: data };
  }
}

interface ShortUser {
  id: number;
  name: string;
}
interface User extends ShortUser {
  email: string;
  username: string;
  phone: string;
  website: string;
}

function convertShortUser(data: any): ShortUser {
  return {
    id: data.id,
    name: data.name,
  };
}

function convertUser(data: any): User {
  return {
    id: data.id,
    name: data.name,
    username: data.username,
    email: data.email,
    phone: data.phone,
    website: data.website,
  };
}
