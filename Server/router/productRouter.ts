import { Router } from "express";
import { authenticate_token } from "../middleware/Authentication/userAuthentication";
import { isAdmin } from "../middleware/Authentication/adminAuth";
import multer from "multer";
import {
  CreateProduct,
  DeleteProduct,
  FindProductBySearch,
  GetAllProduct,
  getOneProduct,
  getProductByCategory,
  updateProduct,
  updateProductImage,
} from "../controller/productController";
const storage = multer.memoryStorage(); // Store in memory for Cloudinary
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file limit
});

const ProductRoute = Router();

ProductRoute.route("/product").post(
  authenticate_token,
  isAdmin,
  upload.single("profileImage"),
  CreateProduct
);
ProductRoute.route("/get/:category").get(getProductByCategory);
ProductRoute.route("/getone/:productId").get(getOneProduct);
ProductRoute.route("/get").get(GetAllProduct);
ProductRoute.route("/search").get(FindProductBySearch);
ProductRoute.route("/update_product").patch(updateProduct);
ProductRoute.route("/update_productImage").patch(updateProductImage);
ProductRoute.route("/delete_product").delete(DeleteProduct);

export default ProductRoute;
