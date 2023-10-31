const nodemailer = require('nodemailer')
const User = require('../models/user')
const emailVarificationToken = require('../models/emailVerificationToken');
const { isValidObjectId } = require('mongoose');


exports.create = async (req,res) => {
    const {name, email, password} = req.body

    const oldUser = await User.findOne({email});
    if(oldUser) return res.status(401).json({ error: "This email is already in use!" });

    const newUser = new User({name, email, password})
    await newUser.save();

    // generate 6 digit otp 
    let OTP = '';
    for(let i = 0; i <= 5; i++){
       const randomVal = Math.round(Math.random() * 9)
       OTP += randomVal;
    }

    
    //store otp inside db
    const newemailVarificationToken = new emailVarificationToken({owner: newUser._id, token: OTP})
    await newemailVarificationToken.save();

    //send otp to user
    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "9e28323a85d4d6",
          pass: "ce67b5a7d0eabc"
        }
      });

      transport.sendMail({
        from: 'verification@Phimchill.com',
        to: newUser.email,
        subject: 'Email Verification',
        html: `
            <p>Your verification OTP</p>
            <h1>${OTP}</h1>
        `
      })

    res.status(201).json({
       message: "Please verify your email. OTP has been sent to your email account! ",
    })
};

exports.verifyEmail = async (req, res) => {
  const { userId, OTP } = req.body

  if (!isValidObjectId(userId)) return res.json({ error: "Invalid user!" })

  const user = await User.findById(userId)
  if (!user) return res.json({ error: "user not found!" })

  if (user.isVerified) return res.json({ error: "user is already verified!" })

  const token = await emailVarificationToken.findOne({ owner: userId })
  if (!token) return res.json({ error: 'token not found!' })

  const isMatched = await token.compareToken(OTP)
  if (!isMatched) return res.json({ error: 'Please submit a valid OTP!' })

  user.isVerified = true;
  await user.save();

  await emailVarificationToken.findByIdAndDelete(token._id);

    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "9e28323a85d4d6",
          pass: "ce67b5a7d0eabc"
        }
      });

      transport.sendMail({
        from: 'verification@Phimchill.com',
        to: user.email,
        subject: 'Welcome Email',
        html: `<h1> Welcome to our app and thanks for choosing us. </h1>
        `
      })
      res.json({ message: "Your email is verified." })
}   