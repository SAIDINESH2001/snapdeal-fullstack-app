const User = require('../models/userSchema');
const {userInputValidation} = require('../validations/userValidation');
const bcrypt = require("bcryptjs");

exports.checkUser = async (req,res,next) => {
    try {
        const {type, value} = req.body;
        if(!type || !value) {
            res.status(404).json({
                success:false,
                message: `Bad Request`,
            })
        }
        const user = await User.findOne({[type] : value});
        if(!user) {
            res.json({
                success:true,
                message: `New User, Please Register`,
                exists: false,
            })
        }
        res.json({
            success:true,
            message: `User exists`,
            exists: true,
        })
    }   
    catch(err) {
        next(err);
    }
}

exports.postUser = async (req,res,next) => {
    try {
        const validationResult = userInputValidation(req.body);
        if(!validationResult.success) {
            res.status(404).json({
                success: false,
                message: validationResult,
            })
        }
        const { name, email, phone, password } = req.body;
        const dob = validationResult.parsedDate;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        const user = await User.create({name, email, phone, password: hashedPassword, dob});
        res.json({
            success: true,
            message: `User Registered Successfully`,
        })
    }
    catch(err) {
        next(err);
    }
}
