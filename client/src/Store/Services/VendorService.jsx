import axios from "axios";
import { apiLink } from "../../utils/utils";

export const getVendorDashboardData = async (vendorId) => {
  const response = await axios.get(`/api/vendor/dashboard/${vendorId}`);
  return response.data;
};

export const getVendorSlugs = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${apiLink}/api/vendor/slugs`, {
      headers: {
        Authorization: token
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getVendorSubSlugs = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${apiLink}/api/vendor/sub-slugs`, {
      headers: {
        Authorization: token
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getVendorSubSlugsByParent = async (slugId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${apiLink}/api/vendor/sub-slugs/by-parent/${slugId}`, {
      headers: {
        Authorization: token
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

class VendorService {
  // Vendor Slug Methods
  async addVendorSlug(data) {
    try {
      const response = await fetch(`${apiLink}/api/vendor/slugs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      return { result: "Fail", message: error.message };
    }
  }

  async getVendorSlugs() {
    try {
      const response = await fetch(`${apiLink}/api/vendor/slugs`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token"),
        },
      });
      return await response.json();
    } catch (error) {
      return { result: "Fail", message: error.message };
    }
  }

  async updateVendorSlug(data) {
    try {
      const response = await fetch(`${apiLink}/api/vendor/slugs/${data._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      return { result: "Fail", message: error.message };
    }
  }

  async deleteVendorSlug(data) {
    try {
      const response = await fetch(`${apiLink}/api/vendor/slugs/${data._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token"),
        },
      });
      return await response.json();
    } catch (error) {
      return { result: "Fail", message: error.message };
    }
  }

  // Vendor Sub Slug Methods
  async addVendorSubSlug(data) {
    try {
      const response = await fetch(`${apiLink}/api/vendor/sub-slugs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      return { result: "Fail", message: error.message };
    }
  }

  async getVendorSubSlugs() {
    try {
      const response = await fetch(`${apiLink}/api/vendor/sub-slugs`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token"),
        },
      });
      return await response.json();
    } catch (error) {
      return { result: "Fail", message: error.message };
    }
  }

  async getVendorSubSlugsByParent(data) {
    try {
      const response = await fetch(`${apiLink}/api/vendor/sub-slugs/by-parent/${data.parentSlugId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token"),
        },
      });
      return await response.json();
    } catch (error) {
      return { result: "Fail", message: error.message };
    }
  }

  async updateVendorSubSlug(data) {
    try {
      const response = await fetch(`${apiLink}/api/vendor/sub-slugs/${data._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      return { result: "Fail", message: error.message };
    }
  }

  async deleteVendorSubSlug(data) {
    try {
      const response = await fetch(`${apiLink}/api/vendor/sub-slugs/${data._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token"),
        },
      });
      return await response.json();
    } catch (error) {
      return { result: "Fail", message: error.message };
    }
  }
}

const vendorServiceInstance = new VendorService();
export default vendorServiceInstance;
