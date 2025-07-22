import React, { useState } from "react";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Cart from "./Cart";
import Checkout from "./Checkout";
import Order from "./Order";
import Contact from "./Contact";
import Footer from "./Footer";
import Home from "./Home";
import Navbar from "./Navbar";
import Shop from "./Shop";
import SingleProduct from "./SingleProduct";

import AdminHome from "./Admin/AdminHome";
import Maincategory from "./Admin/Maincategory";
import AddMaincategory from "./Admin/AddMaincategory";
import UpdateMaincategory from "./Admin/UpdateMaincategory";
import Subcategory from "./Admin/Subcategory";
import AddSubcategory from "./Admin/AddSubcategory";
import UpdateSubcategory from "./Admin/UpdateSubcategory";
import Brand from "./Admin/Brand";
import AddBrand from "./Admin/AddBrand";
import UpdateBrand from "./Admin/UpdateBrand";
import Product from "./Admin/Product";
import AddProduct from "./Admin/AddProduct";
import UpdateProduct from "./Admin/UpdateProduct";
import Login from "./Login";

import Signup from "./Signup";
import Profile from "./Profile";
import UpdateProfile from "./UpdateProfile";
import Confirmation from "./Confirmation";
import ConfirmationBank from "./ConfirmationBank";
import Newslatter from "./Admin/Newslatter";
import Users from "./Admin/Users";
import AdminContact from "./Admin/AdminContact";
import AdminSingleContact from "./Admin/AdminSingleContact";
import AdminCheckout from "./Admin/AdminCheckout";
import AdminSinglecheckout from "./Admin/AdminSingleCheckout";
import AdminDashboard from "./Admin/AdminDashboard";
import ForgetPassword1 from "./ForgetPassword1";
import ForgetPassword2 from "./ForgetPassword2";
import ForgetPassword3 from "./ForgetPassword3";
import Payment from "./Payment";
import About from "./About";
import CreateAccount from "./CreateAccount";
import Wishlist from "./Wishlist";
import ShippingPolicy from "./ShippingPolicy";
import ReturnRefundPolicy from "./ReturnRefundPolicy";
import PrivacyPolicy from "./PrivacyPolicy";
import TermsOfUse from "./TermsOfUse";
// import RatingPage from "./Rating";

//////////////////// Vendor /////////////////////

import VendorRegistation from "./Vendor/VendorRegistation";
import VendorLogin from "./Vendor/VendorLogin";
import VendorHome from "./Vendor/VendorHome";
import VendorProfile from "./Vendor/VendorProfile";
import VendorCheckout from "./Vendor/VendorCheckout"; // Ensure the path is correct
import VendorSingleCheckout from "./Vendor/VendorSingleCheckout"; // Correct import path
import VendorMaincategory from "./Vendor/VendorMaincategory";
import VendorSubcategory from "./Vendor/VendorSubcategory";
import VendorBrand from "./Vendor/VendorBrand";
import VendorProduct from "./Vendor/VendorProduct";

import VendorAddProduct from "./Vendor/VendorAddProduct";
import VendorUpdateProduct from "./Vendor/VendorUpdateProduct";
import VendorOrders from "./Vendor/VendorOrders";
import EarningReports from "./Vendor/EarningReports";
import SalesReport from "./Vendor/SalesReport";

import Rating from "./Rating";
import VendorPayment from "./Vendor/VendorPayment";
import Payments from "./Admin/Payments";
import VendorPage from "./Admin/VendorPage";

import Slugs from "./Admin/Slugs";
import SubSlugs from "./Admin/SubSlugs";
import VendorApprovalPending from "./Vendor/VendorApprovalPending";
import VendorApproval from "./Admin/VendorApproval";
import ProtectedVendorRoute from './Vendor/ProtectedVendorRoute';
import VendorSlug from "./Vendor/VendorSlug";
import VendorSubSlug from "./Vendor/VendorSubSlug";

export default function App() {
  const [routes] = useState([
    { path: "", Component: Home },
    { path: "/shop/:maincat/:subcat/:brnd", Component: Shop },
    { path: "/single-product/:_id", Component: SingleProduct },
  ]);
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {routes.map((item, index) => (
          <Route key={index} path={item.path} element={<item.Component />} />
        ))}
        {/* <Route path="/rate-product" element={<ProductRatingForm />} /> */}
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/vendor-login" element={<VendorLogin />} />
        <Route path="/vendor_registation" element={<VendorRegistation />} />
        <Route path="/forget-password-1" element={<ForgetPassword1 />} />
        <Route path="/forget-password-2" element={<ForgetPassword2 />} />
        <Route path="/forget-password-3" element={<ForgetPassword3 />} />
        <Route path="/createaccount" element={<CreateAccount />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/return-refund" element={<ReturnRefundPolicy />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-use" element={<TermsOfUse />} />
        <Route path="/ratings/:_id" element={<Rating />} />
        <Route
          path="/confirmation"
          element={localStorage.getItem("login") ? <Confirmation /> : <Login />}
        />
        <Route
          path="/confirmation/:_id"
          element={
            localStorage.getItem("login") ? <ConfirmationBank /> : <Login />
          }
        />
        <Route
          path="/payment/:_id"
          element={localStorage.getItem("login") ? <Payment /> : <Login />}
        />
        <Route
          path="/profile"
          element={localStorage.getItem("login") ? <Profile /> : <Login />}
        />
        <Route
          path="/update-profile"
          element={
            localStorage.getItem("login") ? <UpdateProfile /> : <Login />
          }
        />
        <Route
          path="/cart"
          element={localStorage.getItem("login") ? <Cart /> : <Login />}
        />
        <Route
          path="/checkout"
          element={localStorage.getItem("login") ? <Checkout /> : <Login />}
        />
        <Route
          path="/order"
          element={localStorage.getItem("login") ? <Order /> : <Login />}
        />
        <Route path="/about" element={<About />} />

        {/* Admin */}

        <Route
          path="/admin"
          element={
            localStorage.getItem("login") ? (
              localStorage.getItem("role") === "Admin" ? (
                <AdminHome />
              ) : (
                <Profile />
              )
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/admin-maincategories"
          element={
            localStorage.getItem("login") ? (
              localStorage.getItem("role") === "Admin" ? (
                <Maincategory />
              ) : (
                <Profile />
              )
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/admin-add-maincategory"
          element={
            localStorage.getItem("login") ? (
              localStorage.getItem("role") === "Admin" ? (
                <AddMaincategory />
              ) : (
                <Profile />
              )
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/admin-update-maincategory/:_id"
          element={
            localStorage.getItem("login") ? (
              localStorage.getItem("role") === "Admin" ? (
                <UpdateMaincategory />
              ) : (
                <Profile />
              )
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/admin-subcategories"
          element={
            localStorage.getItem("login") ? (
              localStorage.getItem("role") === "Admin" ? (
                <Subcategory />
              ) : (
                <Profile />
              )
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/admin-add-subcategory"
          element={
            localStorage.getItem("login") ? (
              localStorage.getItem("role") === "Admin" ? (
                <AddSubcategory />
              ) : (
                <Profile />
              )
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/admin-update-subcategory/:_id"
          element={
            localStorage.getItem("login") ? (
              localStorage.getItem("role") === "Admin" ? (
                <UpdateSubcategory />
              ) : (
                <Profile />
              )
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/admin-brands"
          element={
            localStorage.getItem("login") ? (
              localStorage.getItem("role") === "Admin" ? (
                <Brand />
              ) : (
                <Profile />
              )
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/admin-add-brand"
          element={
            localStorage.getItem("login") ? (
              localStorage.getItem("role") === "Admin" ? (
                <AddBrand />
              ) : (
                <Profile />
              )
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/admin-update-brand/:_id"
          element={
            localStorage.getItem("login") ? (
              localStorage.getItem("role") === "Admin" ? (
                <UpdateBrand />
              ) : (
                <Profile />
              )
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/admin-products"
          element={
            localStorage.getItem("login") ? (
              localStorage.getItem("role") === "Admin" ? (
                <Product />
              ) : (
                <Profile />
              )
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/admin-payments"
          element={
            localStorage.getItem("login") ? (
              localStorage.getItem("role") === "Admin" ? (
                <Payments />
              ) : (
                <Profile />
              )
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/admin-add-product"
          element={
            localStorage.getItem("login") ? (
              localStorage.getItem("role") === "Admin" ? (
                <AddProduct />
              ) : (
                <Profile />
              )
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/admin-update-product/:_id"
          element={
            localStorage.getItem("login") ? (
              localStorage.getItem("role") === "Admin" ? (
                <UpdateProduct />
              ) : (
                <Profile />
              )
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/admin-newslatters"
          element={
            localStorage.getItem("login") ? (
              localStorage.getItem("role") === "Admin" ? (
                <Newslatter />
              ) : (
                <Profile />
              )
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/admin-users"
          element={
            localStorage.getItem("login") ? (
              localStorage.getItem("role") === "Admin" ? (
                <Users />
              ) : (
                <Profile />
              )
            ) : (
              <Login />
            )
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            localStorage.getItem("login") ? (
              localStorage.getItem("role") === "Admin" ? (
                <AdminDashboard />
              ) : (
                <Profile />
              )
            ) : (
              <Login />
            )
          }
        />

        <Route
          path="/admin-vendor-list"
          element={
            localStorage.getItem("login") ? (
              localStorage.getItem("role") === "Admin" ? (
                <VendorPage />
              ) : (
                <Profile />
              )
            ) : (
              <Login />
            )
          }
        />



        <Route
          path="/admin-contacts"
          element={
            localStorage.getItem("login") ? (
              localStorage.getItem("role") === "Admin" ? (
                <AdminContact />
              ) : (
                <Profile />
              )
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/admin-single-contact/:_id"
          element={
            localStorage.getItem("login") ? (
              localStorage.getItem("role") === "Admin" ? (
                <AdminSingleContact />
              ) : (
                <Profile />
              )
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/admin-checkouts"
          element={
            localStorage.getItem("login") ? (
              localStorage.getItem("role") === "Admin" ? (
                <AdminCheckout />
              ) : (
                <Profile />
              )
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/admin-single-checkout/:_id"
          element={
            localStorage.getItem("login") ? (
              localStorage.getItem("role") === "Admin" ? (
                <AdminSinglecheckout />
              ) : (
                <Profile />
              )
            ) : (
              <Login />
            )
          }
        />










        {/* \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\           Vendor           ////////////////////////////////// */}

        <Route path="/vendor-login" element={<VendorLogin />} />
        <Route path="/vendor_registation" element={<VendorRegistation />} />
        <Route path="/vendor-approval-pending" element={<VendorApprovalPending />} />
        
        <Route path="/vendor" element={
          <ProtectedVendorRoute>
            <VendorHome />
          </ProtectedVendorRoute>
        } />
        <Route path="/vendor/profile" element={
          <ProtectedVendorRoute>
            <VendorProfile />
          </ProtectedVendorRoute>
        } />
        <Route path="/vendor/products" element={
          <ProtectedVendorRoute>
            <VendorProduct />
          </ProtectedVendorRoute>
        } />
        <Route 
          path="/vendor/add-product" 
          element={
            <ProtectedVendorRoute>
              <VendorAddProduct />
            </ProtectedVendorRoute>
          } 
        />
        <Route path="/vendor/update-product/:_id" element={
          <ProtectedVendorRoute>
            <VendorUpdateProduct />
          </ProtectedVendorRoute>
        } />
        <Route path="/vendor/maincategories" element={
          <ProtectedVendorRoute>
            <VendorMaincategory />
          </ProtectedVendorRoute>
        } />
        <Route path="/vendor/subcategories" element={
          <ProtectedVendorRoute>
            <VendorSubcategory />
          </ProtectedVendorRoute>
        } />
        <Route path="/vendor/brands" element={
          <ProtectedVendorRoute>
            <VendorBrand />
          </ProtectedVendorRoute>
        } />
        <Route path="/vendor/orders" element={
          <ProtectedVendorRoute>
            <VendorOrders />
          </ProtectedVendorRoute>
        } />
        <Route path="/vendor/checkouts" element={
          <ProtectedVendorRoute>
            <VendorCheckout />
          </ProtectedVendorRoute>
        } />
        <Route path="/vendor/checkout/:id" element={
          <ProtectedVendorRoute>
            <VendorSingleCheckout />
          </ProtectedVendorRoute>
        } />
        <Route path="/vendor/earning-report" element={
          <ProtectedVendorRoute>
            <EarningReports />
          </ProtectedVendorRoute>
        } />
        <Route path="/vendor/sales-report" element={
          <ProtectedVendorRoute>
            <SalesReport />
          </ProtectedVendorRoute>
        } />
        <Route path="/vendor/slugs" element={
          <ProtectedVendorRoute>
            <VendorSlug />
          </ProtectedVendorRoute>
        } />
        <Route path="/vendor/sub-slugs" element={
          <ProtectedVendorRoute>
            <VendorSubSlug />
          </ProtectedVendorRoute>
        } />
        <Route path="/vendor/payment" element={
          <ProtectedVendorRoute>
            <VendorPayment />
          </ProtectedVendorRoute>
        } />
        
        {/* Admin Routes */}
        <Route
          path="/admin-slugs"
          element={
            localStorage.getItem("login") ? (
              localStorage.getItem("role") === "Admin" ? (
                <Slugs />
              ) : (
                <Profile />
              )
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/admin-subslugs"
          element={
            localStorage.getItem("login") ? (
              localStorage.getItem("role") === "Admin" ? (
                <SubSlugs />
              ) : (
                <Profile />
              )
            ) : (
              <Login />
            )
          }
        />

        <Route
          path="/admin/vendor-approval"
          element={
            localStorage.getItem("login") ? (
              localStorage.getItem("role") === "Admin" ? (
                <VendorApproval />
              ) : (
                <Profile />
              )
            ) : (
              <Login />
            )
          }
        />

      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
