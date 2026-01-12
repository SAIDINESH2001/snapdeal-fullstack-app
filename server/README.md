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
        wishlist
    }

//**_ Product Schema _**//

    {
        name,
        description,
        price,
        mrp,
        discount,
        category,
        brand,
        images,
        seller,
        ratings,        // average rating
        reviews,        // total reviews count or review data
        totalRatings,   // total number of ratings
        specifications
    }

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
