import { Router } from "express";
import * as authController from "./controller/auth.js";
import validation from './../../middleware/Validation.js';
import * as validators from "./auth.validator.js";
const router = Router()

router.post('/signup', validation(validators.signup),authController.signup)
router.get('/confirmEmail/:token', authController.confirmEmail)
router.get('/requestEmailToken/:token', authController.refreshToken)
router.post('/signin', validation(validators.signin), authController.signin)
router.post('/sendAccessLink', validation(validators.sendAccessLink), authController.sendAccessLink)
router.post('/forgetPassword/:token', validation(validators.forgetPassword), authController.forgetPassword)

export default router