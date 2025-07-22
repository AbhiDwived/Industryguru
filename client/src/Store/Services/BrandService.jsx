import { apiLink } from "../../utils/utils";

export async function addBrandAPI(data) {
  var response = await fetch(`${apiLink}/api/brand`, {
    method: "post",
    headers: {
      "content-type": "application/json",
      authorization: localStorage.getItem("token"),
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}
export async function getBrandAPI(data) {
  var response = await fetch(`${apiLink}/api/brand`, {
    method: "get",
    headers: {
      "content-type": "application/json",
    },
  });
  return await response.json();
}
export async function getBrandBySubCategoryIdAPI(id) {
  var response = await fetch(`${apiLink}/api/brandBySubCategoryId/${id}`, {
    method: "get",
    headers: {
      "content-type": "application/json",
    },
  });
  return await response.json();
}
export async function deleteBrandAPI(data) {
  var response = await fetch(`${apiLink}/api/brand/` + data._id, {
    method: "delete",
    headers: {
      "content-type": "application/json",
      authorization: localStorage.getItem("token"),
    },
  });
  return await response.json();
}
export async function updateBrandAPI(data) {
  var response = await fetch(`${apiLink}/api/brand/` + data._id, {
    method: "put",
    headers: {
      "content-type": "application/json",
      authorization: localStorage.getItem("token"),
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}
