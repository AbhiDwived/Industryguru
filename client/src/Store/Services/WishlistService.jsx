import { apiLink } from "../../utils/utils";

export async function addWishlistAPI(data) {
  var response = await fetch(`${apiLink}/api/wishlist`, {
    method: "post",
    headers: {
      "content-type": "application/json",
      authorization: localStorage.getItem("token"),
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}
export async function getWishlistAPI(data) {
  const userid = localStorage.getItem("userid");
  const token = localStorage.getItem("token");
  
  if (!userid || !token) {
    return { result: "Fail", message: "User not logged in" };
  }
  
  var response = await fetch(
    `${apiLink}/api/wishlist/` + userid,
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
export async function deleteWishlistAPI(data) {
  var response = await fetch(`${apiLink}/api/wishlist/` + data._id, {
    method: "delete",
    headers: {
      "content-type": "application/json",
      authorization: localStorage.getItem("token"),
    },
  });
  return await response.json();
}
