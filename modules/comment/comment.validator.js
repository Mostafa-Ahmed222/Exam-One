import  joi  from 'joi';
export const addComment = {
    params : joi.object().required().keys({
        userId : joi
        .string()
        .pattern(new RegExp(/^[a-fA-F0-9]{24}$/))
        .required(),
        productId : joi
        .string()
        .pattern(new RegExp(/^[a-fA-F0-9]{24}$/))
        .required(),
    }),
    body : joi.object().required().keys({
        commentBody : joi.string().required()
    })
}
export const updateComment = {
    params : joi.object().required().keys({
        userId : joi
        .string()
        .pattern(new RegExp(/^[a-fA-F0-9]{24}$/))
        .required(),
        commentId : joi
        .string()
        .pattern(new RegExp(/^[a-fA-F0-9]{24}$/))
        .required(),
    }),
    body : joi.object().required().keys({
        commentBody : joi.string().required()
    })
}
export const softDelete = {
    params : joi.object().required().keys({
        id : joi
        .string()
        .pattern(new RegExp(/^[a-fA-F0-9]{24}$/))
        .required(),
        deletedBy : joi
        .string()
        .pattern(new RegExp(/^[a-fA-F0-9]{24}$/))
        .required(),
    }),
}