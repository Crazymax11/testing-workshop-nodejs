import { UsersClient } from "../clients/users";
import { AxiosError } from "axios";

export class UserService {
  private apiClient: UsersClient;
  constructor() {
    this.apiClient = new UsersClient();
  }

  async getUser(
    userId: string,
    isShort: boolean = false
  ): Promise<{ status: number; data: any }> {
    const res = await this.apiClient.getUser(userId).then(
      (res) => ({
        status: 200,
        data: isShort ? convertToShortUser(res.data) : convertUser(res.data),
      }),
      (error: AxiosError | Error) => {
        if ("response" in error) {
          return {
            status: error.response?.status || 500,
            data: error.response?.data,
          };
        }

        return { status: 500, data: null };
      }
    );
    return res;
  }

  async getUsers(isShort: boolean) {
    const res = await this.apiClient.getUsers().then(
      (res) => ({
        status: 200,
        data: isShort
          ? res.data.map(convertToShortUser)
          : res.data.map(convertUser),
      }),
      (error: AxiosError | Error) => {
        if ("response" in error) {
          return {
            status: error.response?.status || 500,
            data: error.response?.data,
          };
        }

        return { status: 500, data: null };
      }
    );
    return res;
  }
}

interface ShortUser {
  id: number;
  name: string;
  email: string;
}
interface User extends ShortUser {
  username: string;
  phone: string;
  website: string;
}

function convertToShortUser(data: any): ShortUser {
  return {
    id: data.id,
    name: data.name,
    email: data.email,
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
