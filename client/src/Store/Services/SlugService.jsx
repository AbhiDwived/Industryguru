import { apiLink } from "../../utils/utils";

export default class SlugService {
  static async addSlug(data) {
    var response = await fetch(`${apiLink}/api/vendor/slugs`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  }

  static async getSlug() {
    var response = await fetch(`${apiLink}/api/vendor/slugs`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        authorization: localStorage.getItem("token"),
      },
    });
    return await response.json();
  }

  static async updateSlug(data) {
    var response = await fetch(`${apiLink}/api/vendor/slugs/${data._id}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  }

  static async deleteSlug(data) {
    var response = await fetch(`${apiLink}/api/vendor/slugs/${data._id}`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        authorization: localStorage.getItem("token"),
      },
    });
    return await response.json();
  }
} 