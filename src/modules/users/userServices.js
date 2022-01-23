import axiosApp from "../config/axios";

class UserServices {

  list() {
    return axiosApp.get("users");
  }

  get(id) {
    return axiosApp.get(`users/${id}`);
  }

  create(data) {
    return axiosApp.post("users", data);
  }

  update(id, data) {
    return axiosApp.put(`users/${id}`, data);
  }

  delete(id) {
    return axiosApp.delete(`users/${id}`);
  }

}
export default new UserServices();

