import { all } from "redux-saga/effects";

import { maincategorySaga } from "./MaincategorySagas";
import { subcategorySaga } from "./SubcategorySagas";
import { brandSaga } from "./BrandSagas";
import { productSaga } from "./ProductSagas";
import { cartSaga } from "./CartSagas";
import { wishlistSaga } from "./WishlistSagas";
import { checkoutSaga } from "./CheckoutSagas";
import { contactUsSaga } from "./ContactUsSagas";
import { newslatterSaga } from "./NewslatterSagas";
import { vendorCheckoutSaga } from "./VendorCheckoutSagas";
import { slugSaga } from "./SlugSagas";
import { subSlugSaga } from "./SubSlugSagas";
import { vendorSlugSaga } from "./VendorSlugSagas";
import { vendorSubSlugSaga } from "./VendorSubSlugSagas";
import { adminSlugSaga } from "./AdminSlugSagas";

export default function* RootSaga() {
  yield all([
    maincategorySaga(),
    subcategorySaga(),
    brandSaga(),
    productSaga(),
    cartSaga(),
    wishlistSaga(),
    checkoutSaga(),
    contactUsSaga(),
    newslatterSaga(),
    vendorCheckoutSaga(),
    slugSaga(),
    subSlugSaga(),
    vendorSlugSaga(),
    vendorSubSlugSaga(),
    adminSlugSaga(),
  ]);
}
