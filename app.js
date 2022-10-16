import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./DB/connection.js";
import * as indexRouter from "./modules/index.router.js";
import userModel from "./DB/model/User.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sendMail from './services/sendEmail.js';
const fires = () => {
  return async (req, res, next) => {
    try {
      const admin = await userModel.findOne({
        email: process.env.webSiteAdminEmail,
        role: "admin",
      });
      if (admin) {
        if (admin.confirmEmail) {
          next();
        } else {
          res.status(401).json({message : 'Admin please check your email to confirm it'})
        }
      } else {
        const hashPassword = await bcrypt.hash(
          process.env.webSiteAdminPassword,
          parseInt(process.env.saltRound)
        );
        const encryptPhone = await bcrypt.hash(
          process.env.webSiteAdminPhone,
          parseInt(process.env.saltRound)
          );
        const newAdmin = new userModel({
          firstName: "Mostafa",
          lastName: "Ahmed",
          email: process.env.webSiteAdminEmail,
          password: hashPassword,
          phone: encryptPhone,
          role : 'admin'
        });
        const savedAdmin = await newAdmin.save();
        const token = jwt.sign(
          { id: savedAdmin._id },
          process.env.tokenEmailSignature,
          { expiresIn: 60 * 5 }
        );
        const refToken =jwt.sign(
          { id: savedAdmin._id },
          process.env.tokenEmailSignature,
          { expiresIn: 60 * 60 * 24 }
        );
        const link = `${req.protocol}://${req.headers.host}${process.env.BasedUrl}/auth/confirmEmail/${token}`;
        const link2 = `${req.protocol}://${req.headers.host}${process.env.BasedUrl}/auth/requestEmailToken/${refToken}`;
        const message = `
    <a href='${link}'> follow link to confirm admin account</a>
    <br>
    <br>
    <a href='${link2}'> follow link to Rerequest confirm admin account</a>
    `;
        sendMail(savedAdmin.email, message);
        res.json({message : 'for Admin please check your email to confirm it'})
      }
    } catch (error) {
      res.status(500).json({ message: "catch error", error });
    }
  };
};
const app = express();
const port = 3000;
app.use(express.json());
app.use(`${process.env.BasedUrl}/auth`, fires(),indexRouter.authRouter);
app.use(`${process.env.BasedUrl}/user`, fires(), indexRouter.userRouter);
app.use(`${process.env.BasedUrl}/product`, fires(), indexRouter.productRouter);
app.use(`${process.env.BasedUrl}/comment`, fires(), indexRouter.commentRouter);
app.use("*", (req, res) => {
  res.status(404).json({ message: "404 Not Found" });
});
connectDB();
app.listen(port, () => {
  console.log(`server is running..........at port ${port}`);
});
