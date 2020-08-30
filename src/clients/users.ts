import axios from "axios";

export class UsersClient {
  getUser(userId: string) {
    return axios.get("http://jsonplaceholder.typicode.com/users/" + userId);
  }

  getUsers() {
    return axios.get("http://jsonplaceholder.typicode.com/users");
  }
}
