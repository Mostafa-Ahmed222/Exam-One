import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: String,
  age: Number,
  address: String,
  gender: {
    type: String,
    enum: ["male", "fmale"],
    default: "male",
  },
  confirmEmail: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  code: {
    type : Boolean,
    default : false
  },
  otpcode : String,
  isBlocked: {
    type: Boolean,
    default: false,
  },
  isOnline: {
    type: Boolean,
    default: false,
  },
  lastSeen : Date,
  role : {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  }, 
  products : [{product : {type : mongoose.Schema.Types.ObjectId, ref : 'Product'}}]
}, {
    timestamps : true
});
const userModel = mongoose.model('User', userSchema)
export default userModel