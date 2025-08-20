import { apiLink } from "../../utils/utils";

export async function addProductAPI(data) {
  const link = localStorage.getItem("role") == "Vendor" ? `${apiLink}/api/vendor-product` : `${apiLink}/api/product`;
  var response = await fetch(link, {
    method: "post",
    headers: {
      authorization: localStorage.getItem("token"),
    },
    body: data,
  });
  return await response.json();
}

export async function getProductAPI() {
    console.log("Fetching products from API...");
    const link = `${apiLink}/api/product`;
    var response = await fetch(link, {
        method: "get",
        headers: {
            authorization: localStorage.getItem("token"),
            "content-type": "application/json",
        },
    });
    const productData = await response.json();
    console.log("Products fetched:", productData);
    return productData;
}

export async function getVendorProductAPI(page, search) {
  const link = `${apiLink}/api/vendor-product?page=${page}&search=${search}`;
  var response = await fetch(link, {
    method: "get",
    headers: {
      authorization: localStorage.getItem("token"),
      "content-type": "application/json",
    },
  });
  return await response.json();
}

export async function getVendorOrdersAPI(page, search, paymentstatus, orderStatus) {
  const link = `${apiLink}/api/vendor-checkout?page=${page}&search=${search}&paymentstatus=${paymentstatus}&orderStatus=${orderStatus}`;
  var response = await fetch(link, {
    method: "get",
    headers: {
      authorization: localStorage.getItem("token"),
      "content-type": "application/json",
    },
  });
  return await response.json();
}

export async function getVendorPayment(page, search, paymentstatus = "", orderStatus = "") {
  const link = `${apiLink}/api/vendor-payment?page=${page}&search=${search}&paymentstatus=${paymentstatus}&orderStatus=${orderStatus}`;
  var response = await fetch(link, {
    method: "get",
    headers: {
      authorization: localStorage.getItem("token"),
      "content-type": "application/json",
    },
  });
  return await response.json();
}

export async function addVendorPaymentAPI(data) {
  const link = `${apiLink}/api/vendor-payment`;
  var response = await fetch(link, {
    method: "post",
    headers: {
      authorization: localStorage.getItem("token"),
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function getAdminPayment(page, search, user, paymentstatus = "", orderStatus = "") {
  const link = `${apiLink}/api/admin-vendor-payment?page=${page}&search=${search}&paymentstatus=${paymentstatus}&orderStatus=${orderStatus}&user=${user}`;
  var response = await fetch(link, {
    method: "get",
    headers: {
      authorization: localStorage.getItem("token"),
      "content-type": "application/json",
    },
  });
  return await response.json();
}

export async function getAdminVendorList() {
  const link = `${apiLink}/api/admin-vendor-list`;
  var response = await fetch(link, {
    method: "get",
    headers: {
      authorization: localStorage.getItem("token"),
      "content-type": "application/json",
    },
  });
  return await response.json();
}

export async function getProductByMainCategoryAPI(id) {
  var response = await fetch(`${apiLink}/api/productByMainCategory/${id}`, {
    method: "get",
    headers: {
      "content-type": "application/json",
    },
  });
  return await response.json();
}

export async function getProductBySubCategoryAPI(id) {
  var response = await fetch(`${apiLink}/api/productBySubCategory/${id}`, {
    method: "get",
    headers: {
      "content-type": "application/json",
    },
  });
  return await response.json();
}

export async function getProductByBrandAPI(id) {
  var response = await fetch(`${apiLink}/api/productByBrand/${id}`, {
    method: "get",
    headers: {
      "content-type": "application/json",
    },
  });
  return await response.json();
}

export async function deleteProductAPI(data) {
  var response = await fetch(`${apiLink}/api/product/` + data._id, {
    method: "delete",
    headers: {
      "content-type": "application/json",
      authorization: localStorage.getItem("token"),
    },
  });
  return await response.json();
}

export async function updateProductAPI(data) {
  const link = `${apiLink}/api/product/`;
  var response = await fetch(link + data.get("_id"), {
    method: "put",
    headers: {
      authorization: localStorage.getItem("token"),
    },
    body: data,
  });
  return await response.json();
}

export async function updateVendorProductAPI(id, data) {
  const link = `${apiLink}/api/vendor-product/`;
  return fetch(link + id, {
    method: "put",
    headers: {
      authorization: localStorage.getItem("token"),
    },
    body: data,
  });
}

export async function addVendorProductAPI(id, data) {
  const link = `${apiLink}/api/vendor-product/`;
  return fetch(link, {
    method: "post",
    headers: {
      authorization: localStorage.getItem("token"),
    },
    body: data,
  });
}

export async function deleteVendorProductAPI(data) {
  var response = await fetch(`${apiLink}/api/vendor-product/` + data._id, {
    method: "delete",
    headers: {
      "content-type": "application/json",
      authorization: localStorage.getItem("token"),
    },
  });
  return await response.json();
}

export async function getProductAPIById(id) {
  // Check for valid ID
  if (!id || id === 'undefined') {
    console.error('Invalid product ID provided:', id);
    return Promise.reject(new Error('Invalid product ID'));
  }

  // Use vendor-product endpoint for vendor users, product for others
  const link = localStorage.getItem("role") === "Vendor" 
    ? `${apiLink}/api/vendor-product/${id}`
    : `${apiLink}/api/product/${id}`;
    
  console.log(`Fetching product from: ${link}`);
    
  return fetch(link, {
    method: "get",
    headers: {
      authorization: localStorage.getItem("token"),
      "content-type": "application/json",
    },
  });
}
