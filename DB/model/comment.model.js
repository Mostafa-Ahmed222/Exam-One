import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    commentBody: {
    type: String,
    required: true,
  },
  createdBy : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'User',
    required: true,
  },
  productId : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'Product',
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  deletedBy : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'User'
  }
}, {
    timestamps : true
});
const commentModel = mongoose.model('Comment', commentSchema)
export default commentModel