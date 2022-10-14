import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  likes: [{ likeBy : {type : mongoose.Schema.Types.ObjectId, ref : 'User'}}],
  createdBy : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'User',
    required: true,
  },
  comments: [{comment : {type : mongoose.Schema.Types.ObjectId, ref : 'Comment'}}],
  isDeleted: {
    type: Boolean,
    default: false,
  }
}, {
    timestamps : true
});
const productModel = mongoose.model('Product', productSchema)
export default productModel