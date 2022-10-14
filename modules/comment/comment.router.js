import { Router } from "express";
import * as commentController from "./controller/comment.js";
import validation from "./../../middleware/Validation.js";
import * as validators from "./comment.validator.js";
const router = Router();

router.post(
  "/addComment/:userId/:productId",
  validation(validators.addComment),
  commentController.addComment
);
router.patch(
  "/update/:userId/:commentId",
  validation(validators.updateComment),
  commentController.updateComment
);
router.patch(
  "/softDelete/:id/:deletedBy", validation(validators.softDelete),
  commentController.softDelete
);

export default router;
