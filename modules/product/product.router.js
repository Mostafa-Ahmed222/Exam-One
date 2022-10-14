import { Router } from "express";
import * as productController from "./controller/product.js";
import { auth } from "./../../middleware/Auth.js";
import validation from "./../../middleware/Validation.js";
import * as validators from "./product.validator.js";
const router = Router();

router.post(
  "/",
  validation(validators.addProduct),
  auth(),
  productController.addProduct
);
router.patch(
  "/update/:id",
  validation(validators.updateProduct),
  auth(),
  productController.updateProduct
);
router.delete(
  "/delete/:id",
  validation(validators.deleteProduct),
  auth(),
  productController.deleteProduct
);
router.patch(
  "/softDelete/:id",
  validation(validators.softDelete),
  auth(),
  productController.softDelete
);
router.get('/title', validation(validators.searchTitle), productController.searchTitle)
router.get('/:id',validation(validators.getProductById), productController.getProductById)
router.post('/like/:id', validation(validators.likeProduct),productController.likeProduct)
router.post('/unLike/:id', validation(validators.unLikeProduct),productController.unLikeProduct)
router.get('/', productController.getAllProduct)





export default router;
