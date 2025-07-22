import { apiLink } from "../../utils/utils";

export default class SubSlugService {
  static async addSubSlug(data) {
    var response = await fetch(`${apiLink}/api/vendor/sub-slugs`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  }

  static async getSubSlug() {
    var response = await fetch(`${apiLink}/api/vendor/sub-slugs`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        authorization: localStorage.getItem("token"),
      },
    });
    return await response.json();
  }

  static async getSubSlugByParent(data) {
    var response = await fetch(`${apiLink}/api/vendor/sub-slugs/by-parent/${data.parentSlugId}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        authorization: localStorage.getItem("token"),
      },
    });
    return await response.json();
  }

  static async updateSubSlug(data) {
    var response = await fetch(`${apiLink}/api/vendor/sub-slugs/${data._id}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  }

  static async deleteSubSlug(data) {
    var response = await fetch(`${apiLink}/api/vendor/sub-slugs/${data._id}`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        authorization: localStorage.getItem("token"),
      },
    });
    return await response.json();
  }
} 