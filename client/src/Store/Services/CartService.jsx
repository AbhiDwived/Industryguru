import { apiLink } from "../../utils/utils";

export async function addCartAPI(data) {
  var response = await fetch(`${apiLink}/api/cart`, {
    method: "post",
    headers: {
      "content-type": "application/json",
      authorization: localStorage.getItem("token"),
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}
export async function getCartAPI(data) {
  const userid = localStorage.getItem("userid");
  const token = localStorage.getItem("token");
  
  if (!userid || !token) {
    return { result: "Fail", message: "User not logged in" };
  }
  
  var response = await fetch(
    `${apiLink}/api/cart/` + userid,
    {
      method: "get",
      headers: {
        "content-type": "application/json",
        authorization: token,
      },
    }
  );
  return await response.json();
}
export async function deleteCartAPI(data) {
  var response = await fetch(`${apiLink}/api/cart/` + data._id, {
    method: "delete",
    headers: {
      "content-type": "application/json",
      authorization: localStorage.getItem("token"),
    },
  });
  return await response.json();
}
export async function updateCartAPI(data) {
  var response = await fetch(`${apiLink}/api/cart/` + data._id, {
    method: "put",
    headers: {
      "content-type": "application/json",
      authorization: localStorage.getItem("token"),
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}
