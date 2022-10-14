import { Router } from "express";
import { auth } from "./../../middleware/Auth.js";
import * as userController from "./controller/user.js";
import validation from "./../../middleware/Validation.js";
import * as validators from "./user.validator.js";
const router = Router();
router.get('/', userController.getAllUsers)
router.get(
  "/:id",
  validation(validators.getUserById),
  userController.getUserById
);
router.put(
  "/profile",
  auth(),
  validation(validators.updateProfile),
  userController.updateProfile
);
router.patch("/updateProfile", auth(), userController.updatePassword);
router.post(
  "/sendCode",
  validation(validators.sendCode),
  auth(),
  userController.sendCode
);
router.post(
  "/password",
  validation(validators.updatePassword),
  auth(),
  userController.updatePassword
);
router.patch(
  "/softDelete",
  validation(validators.softDelete),
  auth(),
  userController.softDelete
);
router.patch(
  "/signout",
  validation(validators.signout),
  auth(),
  userController.signout
);



export default router;
