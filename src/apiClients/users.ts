import axios from "axios";

export class UsersApiClient {
  getUser(id: string) {
    return axios.get("http://jsonplaceholder.typicode.com/users/" + id);
  }
  getUsers() {
    return axios.get("http://jsonplaceholder.typicode.com/users");
  }
}
