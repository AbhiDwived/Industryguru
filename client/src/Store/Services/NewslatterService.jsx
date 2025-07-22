import { apiLink } from "../../utils/utils";

export async function addNewslatterAPI(data) {
  var response = await fetch(`${apiLink}/api/newslatter`, {
    method: "post",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}
export async function getNewslatterAPI(data) {
  var response = await fetch(`${apiLink}/api/newslatter`, {
    method: "get",
    headers: {
      "content-type": "application/json",
      authorization: localStorage.getItem("token"),
    },
  });
  return await response.json();
}
export async function deleteNewslatterAPI(data) {
  var response = await fetch(`${apiLink}/api/newslatter/` + data._id, {
    method: "delete",
    headers: {
      "content-type": "application/json",
      authorization: localStorage.getItem("token"),
    },
  });
  return await response.json();
}
