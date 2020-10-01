import axios from "axios";
export const userClient = {
  async getUser(id: string) {
    const { status, data } = await axios.get(
      "http://jsonplaceholder.typicode.com/users/" + id
    );
    return { status, data };
  },
  async getUsers() {
    const { status, data } = await axios.get(
      "http://jsonplaceholder.typicode.com/users"
    );
    return { status, data };
  },
};
