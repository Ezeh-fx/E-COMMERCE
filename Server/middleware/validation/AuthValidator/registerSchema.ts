import joi from "joi";


export const userSchemaValidator = {
    register: joi.object({
        firstname: joi.string().required(),  // ✅ Lowercase "f" to match frontend
        lastname: joi.string().required(),   // ✅ Lowercase "l"
        username: joi.string().required(),   // ✅ Lowercase "u"
        email: joi.string().email().required(),
        password: joi.string().min(6).required(),
        confirmPassword: joi.string().required().valid(joi.ref("password")),
    }),
    login: joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(6).required(),
      }),
}