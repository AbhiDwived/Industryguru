import { apiLink } from "../../utils/utils";

export async function addCheckoutAPI(data) {
  var response = await fetch(`${apiLink}/api/checkout`, {
    method: "post",
    headers: {
      "content-type": "application/json",
      authorization: localStorage.getItem("token"),
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}
export async function getCheckoutAPI(data) {
  var response = await fetch(`${apiLink}/api/checkout`, {
    method: "get",
    headers: {
      "content-type": "application/json",
      authorization: localStorage.getItem("token"),
    },
  });
  const result = await response.json();
  return result;
}
export async function getCheckoutUserAPI(data) {
  var response = await fetch(
    `${apiLink}/api/checkout/` + localStorage.getItem("userid"),
    {
      method: "get",
      headers: {
        "content-type": "application/json",
        authorization: localStorage.getItem("token"),
      },
    }
  );
  return await response.json();
}
export async function deleteCheckoutAPI(data) {
  var response = await fetch(`${apiLink}/api/checkout/` + data._id, {
    method: "delete",
    headers: {
      "content-type": "application/json",
      authorization: localStorage.getItem("token"),
    },
  });
  return await response.json();
}
export async function updateCheckoutAPI(data) {
  var response = await fetch(`${apiLink}/api/checkout/` + data._id, {
    method: "put",
    headers: {
      "content-type": "application/json",
      authorization: localStorage.getItem("token"),
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}
