const User = require('../models/userSchema');

exports.addProductToCart = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const userId = req?.user?.id; 
        console.log(userId);
        if (!productId) {
            return res.status(400).json({
                success: false,
                message: 'Product ID is required'
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.cartItems.includes(productId)) {
            return res.status(200).json({
                success: true,
                message: 'Product is already in your cart'
            });
        }

        user.cartItems.push(productId);
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Product added to Cart Successfully'
        });
    } catch (error) {
        next(error);
    }
};


exports.getCartProducts = async(req,res,next) => {
    try {
        const userId = req?.user?.id;
        if(!userId) {
            return res.status(404).json({
                success: false,
                message: `User mismatch/ not available, Please try again`
            })
        }
        const user = await User.findById(userId).populate('cartItems');
        if(!user) {
            return res.status(400).json({
                success: false,
                message: `User Not found`
            })
        }
        const products = user.cartItems;
        return res.json({
            message: 'Cart Products are available',
            success: true,
            products,
        })

    }
    catch(error) {
        next(error);
    }
}

exports.removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    
    const userId = req?.user?.id; 

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed: No user ID found"
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { cartItems: productId } 
      },
      { new: true } 
    ).populate("cartItems"); 

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found in database"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Item removed from cart successfully",
      products: user.cartItems 
    });
  } catch (error) {
    next(error); 
  }
};