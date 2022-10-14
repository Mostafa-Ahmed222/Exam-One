import userModel from "./../../../DB/model/User.model.js";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import sendMail from "./../../../services/sendEmail.js";
export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userModel.findById(id).select("-password");
    if (!user) {
      res.status(400).json({ message: "In-Valid user id" });
    } else {
      if (!user.confirmEmail) {
        res.status(401).json({ message: "user email not confirmed yet" });
      } else {
        if (user.isDeleted || user.isBlocked) {
          res.status(401).json({ message: "Email may Be Deleted or Blocked by Admin" });
        } else {
          res.status(200).json({ message: "Done", user });
        }
      }
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};
export const updateProfile = async (req, res) => {
  const { firstName, lastname, phone, age, address } = req.body;
  try {
    const encryptPhone = await bcrypt.hash(
      phone,
      parseInt(process.env.saltRound)
    );
    const user = await userModel
      .findByIdAndUpdate(
        req.authUser._id,
        { firstName, lastname, phone: encryptPhone, age, address },
        { new: true }
      )
      .select("-password -email");
    if (!user) {
      res.json({ message: "In-Valid user id" });
    } else {
      res.json({ message: "Done", user });
    }
  } catch (error) {
    res.json({ message: "catch error", error });
  }
};
export const sendCode = async (req, res) => {
  try {
    const user = await userModel.findById(req.authUser._id).select("email");
    if (!user) {
      res.json({ message: "In-Valid User account" });
    } else {
      const accessCode = nanoid();
      await userModel.updateOne({ email: user.email }, { otpCode: accessCode });
      sendMail(user.email, `<h1>${accessCode}</h1>`);
      res.json({ message: "Done check your email" });
    }
  } catch (error) {
    res.json({ message: "catch error", error });
  }
};
export const updatePassword = async (req, res) => {
  const { oldPassword, newPassword, code } = req.body;
  try {
    const user = await userModel.findOne({ _id: req.authUser._id, otpCode: code });
    if (!user) {
      res.json({ message: "In-valid account or In-valid OTP code" });
    } else {
      const match = await bcrypt.compare(oldPassword, user.password);
      if (!match) {
        res.json({
          message: "old password not match with the current password",
        });
      } else {
        const hashPassword = await bcrypt.hash(
          newPassword,
          parseInt(process.env.saltRound)
        );
        await userModel.updateOne(
          { _id: req.authUser._id },
          {
            password: hashPassword,
            otpCode: "",
            isOnline: false,
          }
        );
        res.json({ message: "Done please signin with new password" });
      }
    }
  } catch (error) {
    res.json({ message: "catch error", error });
  }
};
export const softDelete = async (req, res) => {
  try {
    const user = await userModel.updateOne(
      { _id: req.authUser._id, isDeleted: false },
      { isDeleted: true, isOnline: false }
    );
    if (!user) {
      res.json({ message: "In-Valid account or already deleted" });
    } else {
      res.json({ message: "Done" });
    }
  } catch (error) {
    res.json({ message: "catch error", error });
  }
};
export const signout = async (req, res) => {
  try {
    const user = await userModel.updateOne(
      { _id: req.authUser._id, isOnline: true },
      { isOnline: false, lastSeen: new Date() }
    );
    if (!user) {
      res.json({ message: "In-Valid account or already loggedout" });
    } else {
      res.json({ message: "Done" });
    }
  } catch (error) {
    res.json({ message: "catch error", error });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({
      isBlocked: false,
      isDeleted: false,
      confirmEmail: true,
    }).populate([{
      path : 'products.product',
      match : {
        isDeleted : false
      },
      populate : [{
        path : `comments.comment`,
        select : 'commentBody',
        match : {
          isDeleted : false
        }
      },{
        path: "likes.likeBy",
        select: "_id firstName",
      },
      {
        path: "createdBy",
        select: "_id firstName",
        match: {
          isDeleted : false,
          isBlocked : false
        }
      },
    ]
    }])
    if (!users.length) {
      res.json({message : 'users Not fount yet'})
    } else {
      res.json({message : 'Done', users})
    }
  } catch (error) {
    res.json({ message: "catch error", error });
  }
};
