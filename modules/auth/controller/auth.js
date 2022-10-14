import userModel from "./../../../DB/model/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendMail from "./../../../services/sendEmail.js";
export const signup = async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (user) {
      res.json({ message: "Email Exist" });
    } else {
      const hashPassword = await bcrypt.hash(
        password,
        parseInt(process.env.saltRound)
      );
      const encryptPhone = await bcrypt.hash(
        phone,
        parseInt(process.env.saltRound)
      );
      const newUser = new userModel({
        firstName,
        lastName,
        email,
        password: hashPassword,
        phone: encryptPhone,
      });
      const savedUser = await newUser.save();
      const token = jwt.sign(
        { id: savedUser._id },
        process.env.tokenEmailSignature,
        { expiresIn: 60 * 5 }
      );
      const refToken = jwt.sign(
        { id: savedUser._id },
        process.env.tokenEmailSignature,
        { expiresIn: 60 * 60 * 6 }
      );
      const link = `${req.protocol}://${req.headers.host}${process.env.BasedUrl}/auth/confirmEmail/${token}`;
      const link2 = `${req.protocol}://${req.headers.host}${process.env.BasedUrl}/auth/requestEmailToken/${refToken}`;
      const message = `
      <a href='${link}'> follow link to confirm your account</a>
      <br>
      <br>
      <a href='${link2}'> follow link to Rerequest confirm your account</a>
      `;
      sendMail(savedUser.email, message);
      res.json({ message: "Done please check your email to confirm it" });
    }
  } catch (error) {
    res.json({ message: "catch error", error });
  }
};
export const confirmEmail = async (req, res) => {
  const { token } = req.params;
  try {
    const decoded = jwt.verify(token, process.env.tokenEmailSignature);
    if (!decoded || !decoded.id) {
      res.json({ message: "In-Valid Token" });
    } else {
      const user = await userModel
        .findById(decoded.id)
        .select("email confirmEmail");
      if (!user) {
        res.json({ message: "In-Valid account id" });
      } else {
        if (user.confirmEmail) {
          res.json({ message: "email already confirmed" });
        } else {
          await userModel.updateOne(
            { email: user.email },
            { confirmEmail: true }
          );
          res.json({ message: "Done Please Signin" });
        }
      }
    }
  } catch (error) {
    res.json({ message: "catch error", error });
  }
};
export const refreshToken = async (req, res) => {
  const { token } = req.params;
  try {
    const decoded = jwt.verify(token, process.env.tokenEmailSignature);
    if (!decoded || !decoded.id) {
      res.json({ message: "In-Valid Token" });
    } else {
      const user = await userModel
        .findById(decoded.id)
        .select("email confirmEmail");
      if (!user) {
        res.json({ message: "In-Valid account id" });
      } else {
        if (user.confirmEmail) {
          res.json({ message: "email already confirmed" });
        } else {
          const token = jwt.sign(
            { id: user._id },
            process.env.tokenEmailSignature,
            { expiresIn: 60 * 60 }
          );
          const link = `${req.protocol}://${req.headers.host}${process.env.BasedUrl}/auth/confirmEmail/${token}`;
          const message = `
      <a href='${link}'> follow link to confirm your account</a>
      `;
          sendMail(user.email, message);
          res.json({ message: "Done please check your email to confirm it" });
        }
      }
    }
  } catch (error) {
    res.json({ message: "catch error", error });
  }
};
export const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      res.json({ message: "In-Valid account data" });
    } else {
      if (!user.confirmEmail) {
        res.json({ message: "please confirm your email first" });
      } else {
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          res.json({ message: "In-Valid account data" });
        } else {
          if (user.isDeleted || user.isBlocked) {
            res.json({ message: "Email may Be Deleted or Blocked by Admin" });
          } else {
            if (user.isOnline) {
              res.json({ message: "email already signin" });
            } else {
              await userModel.updateOne({ email }, { isOnline: true });
              const token = jwt.sign(
                { id: user._id, role: user.role },
                process.env.tokenSignature,
                { expiresIn: 60 * 60 * 24 }
              );
              res.json({ message: "Done", token });
            }
          }
        }
      }
    }
  } catch (error) {
    res.json({ message: "catch error", error });
  }
};
export const sendAccessLink = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await userModel.findOneAndUpdate({ email }, {code : false}).select("email");
    if (!user) {
      res.json({ message: "email not found" });
    } else {
      const token = jwt.sign(
        { id: user._id },
        process.env.forgetTokenSignature,
        { expiresIn: 60 * 60 }
      );
      const link = `${req.protocol}://${req.headers.host}${process.env.BasedUrl}/auth/forgetPassword/${token}`;
      const message = `
      <a href='${link}'> follow this link to set a new password</a>
      <br>
      <br>
      <p>Note: this link access for one time</p>
      `;
      sendMail(user.email, message);
      res.json({ message: "Done please check your email" });
    }
  } catch (error) {
    res.json({ message: "catch error", error });
  }
};
export const forgetPassword = async (req, res) => {
  const { token } = req.params;
  const { email, newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.forgetTokenSignature);
    if (!decoded || !decoded.id) {
      res.json({ message: "In-Valid token" });
    } else {
      const user = await userModel
        .findOne({ email, _id: decoded.id })
        .select("email");
      if (!user) {
        res.json({ message: "In-Valid account" });
      } else {
        if (user.code) {
          res.json({ message: "can not use this link more than one" });
        } else {
          const hashPassword = await bcrypt.hash(newPassword, parseInt(process.env.saltRound))
          await userModel.updateOne(
            { email, _id: decoded.id },
            { password: hashPassword, isOnline: false }
          );
          res.json({ message: "Done please signin with new password" });
        }
      }
    }
  } catch (error) {
    res.json({ message: "catch error", error });
  }
};
