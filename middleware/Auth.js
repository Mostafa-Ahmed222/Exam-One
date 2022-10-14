import jwt from "jsonwebtoken";
import userModel from "../DB/model/User.model.js";
export const auth = () => {
  return async (req, res, next) => {
    const { authorization } = req.headers;
    try {
      if (!authorization.startsWith(process.env.BearerKey)) {
        res.status(400).json({ message: "In-Valid Bearer Key" });
      } else {
        const token = authorization.split(process.env.BearerKey)[1];
        const decoded = jwt.verify(token, process.env.tokenSignature);
        if (!decoded || !decoded.id || !decoded.role) {
          res.status(400).json({ message: "In-Valid token payload" });
        } else {
          const user = await userModel
            .findById(decoded.id)
            .select("isBlocked isDeleted isOnline role");
          if (!user) {
            res.status(400).json({ message: "In-Valid token id" });
          } else {
            if (!user.isOnline) {
                res.status(401).json({ message: "please signin first" });
              } else {
                if (user.isDeleted || user.isBlocked) {
                    res.status(501).json({ message: "Email may Be Deleted or Blocked by Admin" });
                  } else {
                    req.authUser = user;
                    next();
                  }
              }
          }
        }
      }
    } catch (error) {
      res.status(500).json({ message: "catch error", error });
    }
  };
};
