import { apiLink } from "../../utils/utils";

export default class AdminSlugService {
  static async addSlug(data) {
    var response = await fetch(`${apiLink}/api/admin/slugs`, {
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
    var response = await fetch(`${apiLink}/api/admin/slugs`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        authorization: localStorage.getItem("token"),
      },
    });
    return await response.json();
  }

  static async updateSlug(data) {
    var response = await fetch(`${apiLink}/api/admin/slugs/${data._id}`, {
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
    var response = await fetch(`${apiLink}/api/admin/slugs/${data._id}`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        authorization: localStorage.getItem("token"),
      },
    });
    return await response.json();
  }

  // Sub-slug methods
  static async getSubSlug() {
    var response = await fetch(`${apiLink}/api/admin/sub-slugs`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        authorization: localStorage.getItem("token"),
      },
    });
    return await response.json();
  }

  static async getSubSlugByParent(slugId) {
    var response = await fetch(`${apiLink}/api/admin/sub-slugs/by-parent/${slugId}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        authorization: localStorage.getItem("token"),
      },
    });
    return await response.json();
  }

  static async addSubSlug(data) {
    var response = await fetch(`${apiLink}/api/admin/sub-slugs`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  }

  static async updateSubSlug(data) {
    var response = await fetch(`${apiLink}/api/admin/sub-slugs/${data._id}`, {
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
    var response = await fetch(`${apiLink}/api/admin/sub-slugs/${data._id}`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        authorization: localStorage.getItem("token"),
      },
    });
    return await response.json();
  }
} 