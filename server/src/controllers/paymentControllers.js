const Razorpay = require('razorpay');
const User = require('../models/userSchema');
const crypto = require('crypto');
const Order = require('../models/orderSchema');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createRazorpayOrder = async (req, res) => {
    try {
        const { items } = req.body;
        const userId = req.user.id;

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: "No items provided" });
        }

        const totalAmount = items.reduce((acc, item) => {
            return acc + (item.price * item.quantity);
        }, 0);

        const amountInPaise = Math.round(totalAmount * 100);

        const options = {
            amount: amountInPaise,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        res.status(200).json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            keyId: process.env.RAZORPAY_KEY_ID
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const { 
            razorpay_order_id, 
            razorpay_payment_id, 
            razorpay_signature,
            shippingAddress, 
            paymentMethod,
            items
        } = req.body;

        const isCOD = paymentMethod === 'COD';
        
        if (!isCOD) {
            const body = razorpay_order_id + "|" + razorpay_payment_id;
            const expectedSignature = crypto
                .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
                .update(body.toString())
                .digest("hex");

            if (expectedSignature !== razorpay_signature) {
                return res.status(400).json({ success: false, message: "Invalid signature" });
            }
        }

        const user = await User.findById(req.user.id).populate('cartItems');
        
        const orderItems = items.map(frontItem => {
            const cartItem = user.cartItems.find(p => p._id.toString() === frontItem.productId);
            
            return {
                productId: frontItem.productId,
                quantity: frontItem.quantity,
                price: frontItem.price,
                size: frontItem.size || null,
                name: frontItem.name || (cartItem ? cartItem.name : "Product Name Unavailable"),
                image: frontItem.image || (cartItem ? cartItem.image : [])
            };
        });

        const totalAmount = orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

        const newOrder = new Order({
            user: req.user.id,
            items: orderItems,
            shippingAddress: shippingAddress,
            paymentMethod: paymentMethod || 'UPI',
            paymentStatus: isCOD ? 'Pending' : 'Completed',
            totalAmount: totalAmount,
            orderStatus: 'Order Placed'
        });

        await newOrder.save();

        if (user.cartItems && user.cartItems.length > 0) {
             const purchasedIds = items.map(i => i.productId);
             const remainingCartIds = user.cartItems
                .filter(item => !purchasedIds.includes(item._id.toString()))
                .map(item => item._id);

             await User.findByIdAndUpdate(req.user.id, { $set: { cartItems: remainingCartIds } });
        }

        res.status(200).json({ 
            success: true, 
            message: "Order placed successfully!", 
            orderId: newOrder._id 
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};