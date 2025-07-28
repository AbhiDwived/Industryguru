import { combineReducers } from "@reduxjs/toolkit";

import MaincategoryReducer from "./MaincategoryReducer";
import SubcategoryReducer from "./SubcategoryReducer";
import BrandReducer from "./BrandReducer";
import ProductReducer from "./ProductReducer";
import CartReducer from "./CartReducer";
import WishlistReducer from "./WishlistReducer";
import CheckoutReducer from "./CheckoutReducer";
import ContactUsReducer from "./ContactUsReducer";
import NewslatterReducer from "./NewslatterReducer";
import VendorCheckoutReducer from "./VendorCheckoutReducer";
import { SlugReducer } from "./SlugReducer";
import { SubSlugReducer } from "./SubSlugReducer";
import VendorSlugReducer from "./VendorSlugReducer";
import VendorSubSlugReducer from "./VendorSubSlugReducer";
import AdminSlugReducer from "./AdminSlugReducer";
import AdminSubSlugReducer from "./AdminSubSlugReducer";
import toastReducer from "../Slices/toastSlice";

export default combineReducers({
  MaincategoryStateData: MaincategoryReducer,
  SubcategoryStateData: SubcategoryReducer,
  BrandStateData: BrandReducer,
  ProductStateData: ProductReducer,
  CartStateData: CartReducer,
  WishlistStateData: WishlistReducer,
  CheckoutStateData: CheckoutReducer,
  ContactUsStateData: ContactUsReducer,
  NewslatterStateData: NewslatterReducer,
  VendorCheckoutStateData: VendorCheckoutReducer,
  SlugStateData: SlugReducer,
  SubSlugStateData: SubSlugReducer,
  VendorSlugStateData: VendorSlugReducer,
  VendorSubSlugStateData: VendorSubSlugReducer,
  AdminSlugStateData: AdminSlugReducer,
  AdminSubSlugStateData: AdminSubSlugReducer,
  toast: toastReducer,
});
