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
  var response = await fetch(
    `${apiLink}/api/wishlist/` + localStorage.getItem("userid"),
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
