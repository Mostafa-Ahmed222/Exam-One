import userModel from "./../../../DB/model/User.model.js";
import productModel from "./../../../DB/model/product.model.js";
import commentModel from "./../../../DB/model/comment.model.js";
export const addComment = async (req, res) => {
  const { commentBody } = req.body;
  const { userId, productId } = req.params;
  try {
    const user = await userModel.findOne({
      _id: userId,
      isDeleted: false,
      isBlocked: false,
      confirmEmail: true,
    });
    if (!user) {
      res.json({
        message: "In-Valid User Id or may Be Deleted or Blocked by Admin",
      });
    } else {
      const product = await productModel.findOne({
        _id: productId,
        isDeleted: false,
      });
      const comments = product.comments
      if (!product) {
        res.json({ message: "In-Valid Product Id or may Be Deleted" });
      } else {
        const comment = new commentModel({
          commentBody,
          createdBy: userId,
          productId,
        });
        await comment.save();
        const commentsArr = [...comments, {comment : comment._id} ]
        await productModel.updateOne({_id: productId}, {comments : commentsArr})
        res.json({message : 'Done'})
      }
    }
  } catch (error) {
    res.json({ message: "catch error", error });
  }
};
export const updateComment = async (req, res) => {
  const { userId, commentId } = req.params;
  const { commentBody } = req.body;
  try {
    const comment = await commentModel
      .findOneAndUpdate(
        {
          _id: commentId,
          createdBy: userId,
        },
        { commentBody },
        { new: true }
      )
      .populate([
        {
          path: "createdBy",
          select: "firstName",
          match: {
            isDeleted : false,
            isBlocked : false
          }
        },
        {
          path: "productId",
          populate: [
            {
              path: "likes.likeBy",
              select: "firstName",
              match: {
                isDeleted : false,
                isBlocked : false
              }
            },
            {
              path: "createdBy",
              select: "firstName",
              match: {
                isDeleted : false,
                isBlocked : false
              }
            },
          ],
        },
      ]);
    if (!comment) {
      res.json({ message: "In-Valid Owner Id or Comment Id" });
    } else {
      res.json({ message: "Done", comment });
    }
  } catch (error) {
    res.json({ message: "catch error", error });
  }
};
export const softDelete = async (req, res) => {
  const { id, deletedBy } = req.params;
  try {
    const comment = await commentModel.findOne({_id : id, isDeleted : false}).populate([
      {
        path: "createdBy",
        select: "firstName",
      },
      {
        path: "productId",
        populate: [
          {
            path: "likes.likeBy",
            select: "firstName",
          },
          {
            path: "createdBy",
            select: "firstName",
          },
        ],
      },
    ]);
    if (!comment) {
      res.json({ message: "In-valid Comment Id or already deleted" });
    } else {
      if (deletedBy == comment.createdBy._id) {
        await commentModel.updateOne(
          { id },
          { deletedBy: comment.createdBy._id , isDeleted : true}
        );
        res.json({
          message: "Done deleted by comment owner",
          deleatedBy: comment.createdBy.firstName,
        });
      } else if (deletedBy == comment.productId._id) {
        await commentModel.updateOne(
            { id },
            { deletedBy: comment.productId._id , isDeleted : true}
          );
          res.json({
            message: "Done deleted by Ptoduct owner",
            deleatedBy: comment.productId.createdBy.firstName,
          });
      } else {
        res.json({ message: "In-Valid id or user can not access" });
      }
    }
  } catch (error) {
    res.json({ message: "catch error", error });
  }
};
