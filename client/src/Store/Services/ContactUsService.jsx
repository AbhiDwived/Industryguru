import { apiLink } from "../../utils/utils";

export async function addContactUsAPI(data) {
  var response = await fetch(`${apiLink}/api/contact`, {
    method: "post",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}
export async function getContactUsAPI(data) {
  var response = await fetch(`${apiLink}/api/contact`, {
    method: "get",
    headers: {
      "content-type": "application/json",
      authorization: localStorage.getItem("token"),
    },
  });
  return await response.json();
}
export async function deleteContactUsAPI(data) {
  var response = await fetch(`${apiLink}/api/contact/` + data._id, {
    method: "delete",
    headers: {
      "content-type": "application/json",
      authorization: localStorage.getItem("token"),
    },
  });
  return await response.json();
}
export async function updateContactUsAPI(data) {
  var response = await fetch(`${apiLink}/api/contact/` + data._id, {
    method: "put",
    headers: {
      "content-type": "application/json",
      authorization: localStorage.getItem("token"),
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}
