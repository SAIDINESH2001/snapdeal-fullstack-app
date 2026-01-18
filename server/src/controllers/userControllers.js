const User = require('../models/userSchema');
const {userInputValidation} = require('../validations/userValidation');
const bcrypt = require("bcryptjs");
const generateOtp = require('../utils/generateOtp');

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
        const { name, email, phone, password , role} = req.body;
        const dob = validationResult.parsedDate;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        const user = await User.create({name, email, phone, password: hashedPassword, dob, role});
        res.json({
            success: true,
            message: `User Registered Successfully`,
        })
    }
    catch(err) {
        next(err);
    }
}

exports.getUserProfile = async (req, res, next) => {
    try {
        const userId = req.user.id; 
        
        const user = await User.findById(userId).select('+address'); 

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone, 
                address: user.address || [] 
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.addAddress = async (req, res, next) => {
    try {
        const userId = req.user.id; 
        const { street, city, state, zipCode, country, isDefault } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { 
                $push: { 
                    address: { street, city, state, zipCode, country, isDefault } 
                } 
            },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            message: "Address added successfully",
            address: updatedUser.address 
        });
    } catch (error) {
        next(error);
    }
};
