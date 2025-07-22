import { apiLink } from "../../utils/utils"; // Assuming this is where the API base URL is stored

// Add a vendor checkout
export async function addVendorCheckoutAPI(data) {
  var response = await fetch(`${apiLink}/api/vendor/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}

// Get all vendor checkouts
export async function getVendorCheckoutAPI(data) {
  // var response = await fetch(`${apiLink}/api/vendor/checkout/${data}`, {
  var response = await fetch(`${apiLink}/api/vendor-checkout/single/${data}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
  });
  return await response.json();
}

// Get vendor checkout for a specific user
export async function getVendorCheckoutUserAPI() {
  var response = await fetch(
    `${apiLink}/api/vendor/checkout/` + localStorage.getItem("userid"),
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    }
  );
  return await response.json();
}

// Delete a vendor checkout
export async function deleteVendorCheckoutAPI(data) {
  var response = await fetch(`${apiLink}/api/vendor/checkout/` + data._id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
  });
  return await response.json();
}

// Update a vendor checkout
export async function updateVendorCheckoutAPI(data) {
  var response = await fetch(`${apiLink}/api/vendor-checkout/` + data._id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}
