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
    const userId = req.user.id;
    const user = await User.findById(userId).populate('cartItems');

    if (!user || user.cartItems.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const amount = user.cartItems.reduce((acc, item) => acc + item.sellingPrice, 0) * 100;

    const options = {
      amount: amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      keyId: process.env.RAZORPAY_KEY_ID,
      userPhone: user.phone, 
      userName: user.name
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
            paymentMethod   
        } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature === razorpay_signature) {
            const user = await User.findById(req.user.id).populate('cartItems');

            const orderItems = user.cartItems.map(item => ({
                productId: item._id,
                name: item.name,
                image: item.image,
                price: item.sellingPrice,
                quantity: 1 
            }));

            const totalAmount = orderItems.reduce((acc, item) => acc + item.price, 0);
            const newOrder = new Order({
                user: req.user.id,
                items: orderItems,
                shippingAddress: shippingAddress,
                paymentMethod: paymentMethod || 'UPI',
                paymentStatus: 'Completed',
                totalAmount: totalAmount,
                orderStatus: 'Order Placed'
            });

            await newOrder.save();

            await User.findByIdAndUpdate(req.user.id, { $set: { cartItems: [] } });

            res.status(200).json({ 
                success: true, 
                message: "Payment verified and order placed!", 
                orderId: newOrder._id 
            });
        } else {
            res.status(400).json({ success: false, message: "Invalid signature" });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};