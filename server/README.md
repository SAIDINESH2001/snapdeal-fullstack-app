// **_ SERVER Configuration for Snap Deal ECommerce Project _**//

// **_ Server setup and start _** //
To install dependencies: npm install / yarn install
To start server : npm dev / yarn dev

// **_ DATA BASE SCHEMAS _** //
//**_ User Schema _**//

    {
        name,
        email,
        password,
        phone,
        role,        // user | seller | admin
        address,
        dob,
        wishlist
    }

//**_ Product Schema _**//

    {
        name,
        description,
        pid,
        mrp,
        discount,
        categories,
        brand,
        image,
        crawledAt,
        rating,        // average rating
        reviewRatings,        // total reviews count or review data
        ratingsCount,   // total number of ratings
        reviewsCount,
        specifications,
        isFkAdvantage
    }

    ```

//**_ Cart Schema _**//

    {
        user,
        items: [
        {
            product,
            quantity,
            price,
            seller
        }
        ],
        itemsPrice, // total price of all cart items
        taxPrice,
        shippingPrice,
        totalPrice,
        savedForLater: [
        {
            product,
            quantity,
            price,
            seller
        }
        ],
        updatedAt
    }

```


//**_ Order Schema _**//

    {
        user,
        items: [
            {
                product,
                quantity,
                price,
                seller
            }
                ],
        shippingAddress: {
            street,
            city,
            state,
            country,
            zipCode
        },
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        orderStatus: {
            enum, //pending | preprocessing | shipped | delivered | cancelled
        },
        deliveredAt,
        trackingNumber
    }

```
// *** API End Points *** ///
Authentication
    - POST /api/auth/register
    - POST /api/auth/login
    - POST /api/auth/logout

Products
    - GET  /api/products/
    - GET  /api/products/:id
    - POST /api/products/
    - PUT  /api/products/:id
    - DELETE /api/products/:id
    - GET /api/products/:category

Cart
    - GET /api/cart
    - POST /api/cart/add
    - PUT /api/cart/update
    - DELETE /api/cart/remove

Orders
    - GET /api/orders
    - GET /api/orders/:id
    - POST /api/orders
    - PUT /api/orders/:id/cancel
    - GET /api/orders/:id/track

Wishlist
    - GET /api/wishlist
    - POST /api/wishlist/add/:id
    - DELETE /api/wishlist/remove/:id