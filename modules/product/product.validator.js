import joi from "joi";
export const addProduct = {
  body: joi
    .object()
    .required()
    .keys({
      title: joi
        .string()
        .pattern(new RegExp(/[A-Z][a-zA-Z][^#&<>\"~;$^%{}?]{1,20}$/))
        .required(),
      description: joi.string().required(),
      price: joi.number().required(),
    }),
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};
export const updateProduct = {
  params: joi
    .object()
    .required()
    .keys({
      id: joi
        .string()
        .pattern(new RegExp(/^[a-fA-F0-9]{24}$/))
        .required(),
    }),
  body: joi
    .object()
    .required()
    .keys({
      title: joi
        .string()
        .pattern(new RegExp(/[A-Z][a-zA-Z][^#&<>\"~;$^%{}?]{1,20}$/)),
      description: joi.string(),
      price: joi.number(),
    }),
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};
export const deleteProduct = {
  params: joi
    .object()
    .required()
    .keys({
      id: joi
        .string()
        .pattern(new RegExp(/^[a-fA-F0-9]{24}$/))
        .required(),
    }),
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};
export const softDelete = {
  params: joi
    .object()
    .required()
    .keys({
      id: joi
        .string()
        .pattern(new RegExp(/^[a-fA-F0-9]{24}$/))
        .required(),
    }),
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};
export const getProductById = {
  params: joi
    .object()
    .required()
    .keys({
      id: joi
        .string()
        .pattern(new RegExp(/^[a-fA-F0-9]{24}$/))
        .required(),
    }),
};
export const likeProduct = {
  params: joi
    .object()
    .required()
    .keys({
      id: joi
        .string()
        .pattern(new RegExp(/^[a-fA-F0-9]{24}$/))
        .required(),
    }),
  body : joi.object().required().keys({
    likeBy : joi
    .string()
    .pattern(new RegExp(/^[a-fA-F0-9]{24}$/))
    .required(),
  })
}
export const unLikeProduct = {
  params: joi
    .object()
    .required()
    .keys({
      id: joi
        .string()
        .pattern(new RegExp(/^[a-fA-F0-9]{24}$/))
        .required(),
    }),
  body : joi.object().required().keys({
    likeBy : joi
    .string()
    .pattern(new RegExp(/^[a-fA-F0-9]{24}$/))
    .required(),
  })
}
export const searchTitle = {
  query : joi.object().required().keys({
    key : joi.string().required()
  })
}