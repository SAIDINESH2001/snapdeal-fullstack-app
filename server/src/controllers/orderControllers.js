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

exports.getAllOrders = async(req,res,next) => {
    try {
        const orders = await Order.find();
        res.json({
            success: true,
            orders,
        })
    }
    catch(error) {
        next(error);
    }
}


exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { orderStatus: status },
            { new: true }
        );

        res.status(200).json({ success: true, data: updatedOrder });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getOrderDetail = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const userId = req.user.id;
        const order = await Order.findOne({ 
            _id: orderId, 
            user: userId 
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order details not found."
            });
        }

        return res.status(200).json({
            success: true,
            order: order
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, message: "Invalid Order ID format" });
        }
        next(error);
    }
};

exports.handleOrderAction = async (req, res, next) => {
    try {
        const { orderId, action } = req.params;
        const { reason } = req.body;
        const userId = req.user.id;

        const order = await Order.findOne({ _id: orderId, user: userId });

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        let newStatus;
        const currentStatus = order.orderStatus.toLowerCase();

        if (action === 'cancel') {
            if (['delivered', 'cancelled', 'shipped'].includes(currentStatus)) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Order cannot be cancelled once it is shipped or delivered." 
                });
            }
            newStatus = 'Cancelled';
        } else if (action === 'return') {
            if (currentStatus !== 'delivered') {
                return res.status(400).json({ 
                    success: false, 
                    message: "Only delivered orders can be returned." 
                });
            }
            newStatus = 'Return Pending';
        } else if (action === 'replace') {
            if (currentStatus !== 'delivered') {
                return res.status(400).json({ 
                    success: false, 
                    message: "Only delivered orders can be replaced." 
                });
            }
            newStatus = 'Replace Pending';
        } else {
            return res.status(400).json({ success: false, message: "Invalid action" });
        }

        order.orderStatus = newStatus;
        
        order.actionHistory = order.actionHistory || [];
        order.actionHistory.push({
            actionType: action,
            reason: reason,
            timestamp: new Date()
        });

        await order.save();

        res.status(200).json({
            success: true,
            message: `Order ${action} request submitted successfully.`,
            orderStatus: order.orderStatus
        });
    } catch (error) {
        next(error);
    }
};