import joi from "joi";
export const updateProfile = {
  body: joi
    .object()
    .required()
    .keys({
      phone: joi.string().pattern(new RegExp(/^01[0125][0-9]{8}$/)),
      age: joi.number().min(16).max(100),
      adress: joi
        .string()
        .pattern(new RegExp(/d{1,5}\s\w.\s(\b\w*\b\s){1,2}\w*/)),
    }),
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};
export const getUserById = {
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
export const sendCode = {
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};
export const updatePassword = {
  body: joi
    .object()
    .required()
    .keys({
      oldPassword: joi
        .string()
        .pattern(
          new RegExp(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
          )
        )
        .required(),
      newPassword: joi
        .string()
        .pattern(
          new RegExp(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
          )
        )
        .required(),
      cPassword: joi.string().valid(joi.ref("newPassword")).required(),
      code: joi.string().required(),
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
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};
export const blockUser = {
  params : joi.object().required().keys({
      adminId : joi
      .string()
      .pattern(new RegExp(/^[a-fA-F0-9]{24}$/))
      .required(),
      userId : joi
      .string()
      .pattern(new RegExp(/^[a-fA-F0-9]{24}$/))
      .required(),
  }),
}
export const unBlockUser = {
  params : joi.object().required().keys({
      adminId : joi
      .string()
      .pattern(new RegExp(/^[a-fA-F0-9]{24}$/))
      .required(),
      userId : joi
      .string()
      .pattern(new RegExp(/^[a-fA-F0-9]{24}$/))
      .required(),
  }),
}
export const signout = {
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};
