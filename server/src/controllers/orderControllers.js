const Order = require('../models/orderSchema');
const User = require('../models/userSchema');

exports.createOrder = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { shippingAddress, paymentMethod, totalAmount, items } = req.body;

        const newOrder = new Order({
            user: userId,
            items: items, 
            shippingAddress,
            paymentMethod,
            totalAmount,
            paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Completed'
        });

        await newOrder.save();

        await User.findByIdAndUpdate(userId, {
            $set: { cartItems: [] }
        });

        res.status(201).json({
            success: true,
            message: "Order placed successfully!",
            orderId: newOrder._id
        });
    } catch (error) {
        next(error);
    }
};

exports.getMyOrders = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        next(error);
    }
};