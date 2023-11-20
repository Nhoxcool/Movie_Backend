const {check, validationResult} = require('express-validator');

exports.userValidator = [
    check('name').trim().not().isEmpty().withMessage('Name is missing! '),
    check('email').normalizeEmail().isEmail().withMessage('Email is invalid! '),
    check('password').trim().not().isEmpty().withMessage('Password is missing! ').isLength({min: 8, max: 20}).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i").withMessage('Password should be combination of one uppercase , one lower case, one special char, one digit and min 8 , max 20 char long'),
];

exports.validatePassword = [
   check('newPassword').trim().not().isEmpty().withMessage('Password is missing! ').isLength({min: 8, max: 20}).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i").withMessage('Password should be combination of one uppercase , one lower case, one special char, one digit and min 8 , max 20 char long'),
]

exports.signinValidator = [
   check('email').normalizeEmail().isEmail().withMessage('Email is invalid! '),
   check('password').trim().not().isEmpty().withMessage('Password is missing! '),
]

exports.validate = (req, res, next) => {
   const error = validationResult(req).array()
   if(error.length) {
      return res.json({error: error[0].msg})
   }

   next();
}
 