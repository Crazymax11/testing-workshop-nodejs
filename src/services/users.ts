import { userClient } from "../clients/users";

export const userService = {
  getUser(id: string, isShort = false) {
    return userClient.getUser(id).then(
      (res) => {
        return {
          status: 200,
          data: isShort ? convertShortUser(res.data) : convertUser(res.data),
        };
      },
      (err) => {
        return {
          status: err.response.status,
          data: err.response.data,
        };
      }
    );
  },

  getUsers(isShort = false) {
    return userClient.getUsers().then(
      (res) => {
        const mapper = isShort ? convertShortUser : convertUser;
        return {
          status: 200,
          data: res.data.map(mapper),
        };
      },
      (err) => {
        return {
          status: err.response.status,
          data: err.response.data,
        };
      }
    );
  },
};

interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  phone: string;
  website: string;
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

interface ShortUser {
  id: number;
  name: string;
}
function convertShortUser(data: any): ShortUser {
  return {
    id: data.id,
    name: data.name,
  };
}
