import joi from "joi";

export const signup = {
  body: joi
    .object()
    .required()
    .keys({
      firstName: joi
        .string()
        .pattern(new RegExp(/[A-Z][a-zA-Z][^#&<>\"~;$^%{}?]{1,20}$/))
        .required(),
      lastName: joi
        .string()
        .pattern(new RegExp(/[A-Z][a-zA-Z][^#&<>\"~;$^%{}?]{1,20}$/))
        .required(),
        email: joi
        .string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required()
        .messages({
          "any.required": "please enter your email",
          "string.empty": "email can not be empty",
          "string.base": "please enter valid string email",
        }),
      password: joi
        .string()
        .pattern(
          new RegExp(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
          )
        )
        .required(),
      cPassword: joi.string().valid(joi.ref("password")).required(),
      phone: joi.string().pattern(new RegExp(/^01[0125][0-9]{8}$/)),
      age : joi.number().min(16).max(100),
      adress : joi.string().pattern(new RegExp(/d{1,5}\s\w.\s(\b\w*\b\s){1,2}\w*/)),

    }),
};
export const signin = {
  body: joi
    .object()
    .required().keys({
      email: joi
        .string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required()
        .messages({
          "any.required": "please enter your email",
          "string.empty": "email can not be empty",
          "string.base": "please enter valid string email",
        }),
      password: joi
        .string()
        .pattern(
          new RegExp(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
          )
        )
        .required(),
    })
}
export const sendAccessLink = {
  body: joi
  .object()
  .required().keys({
    email: joi
        .string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required()
        .messages({
          "any.required": "please enter your email",
          "string.empty": "email can not be empty",
          "string.base": "please enter valid string email",
        }),
  })
}
export const forgetPassword = {
  params: joi
    .object()
    .required()
    .keys({
      token: joi
        .string()
        .required(),
    }),
    body: joi
    .object()
    .required().keys({
      email: joi
        .string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required()
        .messages({
          "any.required": "please enter your email",
          "string.empty": "email can not be empty",
          "string.base": "please enter valid string email",
        }),
        newPassword: joi
        .string()
        .pattern(
          new RegExp(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
          )
        )
        .required(),
        cPassword: joi.string().valid(joi.ref("newPassword")).required(),
    })
}