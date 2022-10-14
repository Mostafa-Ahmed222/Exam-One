import productModel from "./../../../DB/model/product.model.js";
import userModel from './../../../DB/model/User.model.js';
export const addProduct = async (req, res) => {
  const { title, description, price } = req.body;
  try {
    const product = new productModel({
      title,
      description,
      price,
      createdBy: req.authUser._id,
    });
    const saveProduct = await product.save();
    const user = await userModel.findById(req.authUser._id)
    const products = user.products
    const productsArr = [...products, {product : product._id} ]
        await userModel.updateOne({_id: req.authUser._id}, {products : productsArr})
    res.json({ message: "Done", saveProduct });
  } catch (error) {
    res.json({ message: "catch error", error });
  }
};
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { title, description, price } = req.body;
  try {
    const product = await productModel.findOneAndUpdate(
      { _id: id, createdBy: req.authUser._id, isDeleted: false },
      { title, description, price },
      { new: true }
    );
    if (!product) {
      res.json({ message: "In-Valid product id or may be deleted" });
    } else {
      res.json({ message: "Done" });
    }
  } catch (error) {
    res.json({ message: "catch error", error });
  }
};
export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await productModel.findOneAndDelete({
      _id: id,
      createdBy: req.authUser._id,
      isDeleted: false,
    });
    if (!product) {
      res.json({
        message: "In-Valid prouduct id product id or may be deleted",
      });
    } else {
      res.json({ message: "Done" });
    }
  } catch (error) {
    res.json({ message: "catch error", error });
  }
};
export const softDelete = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await productModel.findOneAndUpdate(
      {
        _id: id,
        createdBy: req.authUser._id,
        isDeleted: false,
      },
      { isDeleted: true }
    );
    if (!product) {
      res.json({ message: "In-Valid prouduct id or may be deleted" });
    } else {
      res.json({ message: "Done" });
    }
  } catch (error) {
    res.json({ message: "catch error", error });
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await productModel
      .findOne({ _id: id, isDeleted: false })
      .populate([
        {
          path: "createdBy",
          select: "-_id firstName lastName email",
          match: {
            isDeleted : false,
            isBlocked : false
          }
        },
      ]);
    if (!product) {
      res.json({ message: "In-Valid prouduct id or may be deleted" });
    } else {
      res.json({ message: "Done", product });
    }
  } catch (error) {
    res.json({ message: "catch error", error });
  }
};
export const likeProduct = async (req, res) => {
  const { id } = req.params;
  const { likeBy } = req.body;
  try {
    const product = await productModel.findById(id);
    if (!product) {
      res.json({ message: "In-Valid product Id" });
    } else {
      if (likeBy == product.createdBy) {
        res.json({ message: "not allow this product created by this user" });
      } else {
        const usersId = product.likes;
        let flag = false;
        for (let i = 0; i < usersId.length; i++) {
          if (likeBy == usersId[i]["likeBy"]) {
            flag = true;
            break;
          }
        }
        if (flag) {
          res.json({ message: "user already like product" });
        } else {
          const usersArr = [...usersId, { likeBy: likeBy }];
          const usersLike = await productModel
            .findOneAndUpdate({ _id: id }, { likes: usersArr }, { new: true })
            .populate([
              {
                path: "likes.likeBy",
                select: "_id firstName",
                match: {
                  isDeleted : false,
                  isBlocked : false
                }
              },
              {
                path: "createdBy",
                select: "_id firstName",
                match: {
                  isDeleted : false,
                  isBlocked : false
                }
              },
            ]);
          res.json({ message: "Done", usersLike });
        }
      }
    }
  } catch (error) {
    res.json({ message: "catch error", error });
  }
};
export const unLikeProduct = async (req, res) => {
  const { id } = req.params;
  const { likeBy } = req.body;
  try {
    const product = await productModel.findById(id);
    if (!product) {
      res.json({ message: "In-Valid product Id" });
    } else {
      const usersId = product.likes;
      let flag = false;
      for (let i = 0; i < usersId.length; i++) {
        if (likeBy == usersId[i]["likeBy"]) {
          flag = true;
          break;
        }
      }
      if (!flag) {
        res.json({ message: "user not like product" });
      } else {
        const usersArr = usersId.filter((user) => {
          return user.likeBy != likeBy;
        });
        const usersLike = await productModel
          .findOneAndUpdate({ _id: id }, { likes: usersArr }, { new: true })
          .populate([
            {
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
          ]);
        res.json({ message: "Done", usersLike });
      }
    }
  } catch (error) {
    res.json({ message: "catch error", error });
  }
};
export const searchTitle = async (req, res) => {
  const { key } = req.query;
  try {
    const searchKey = new RegExp(`^${key}`, "i");
    const product = await productModel.find({ title: searchKey }).populate([
      {
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
    ]);
    if (!product.length) {
      res.json({ message: `Product starts with (${key}) Not found` });
    } else {
      res.json({ message: "Done", product });
    }
  } catch (error) {
    res.json({ message: "catch error", error });
  }
};
export const getAllProduct = async (req, res) => {
  try {
    const products = await productModel.find().populate([{
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
  ])
   if (!products.length) {
    res.json({message : 'products Not found'})
   } else {
    res.json({message : 'Done', products})
   }
  } catch (error) {
    res.json({ message: "catch error", error });
  }
};
