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

// **_ Cart Schema _**//

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
