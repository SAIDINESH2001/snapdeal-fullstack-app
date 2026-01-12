Project Structure

snapdeal-fullstack-app/
 - client
 - server

client/
 - public/
    - favicon.ico
 - src/
    - main.jsx
    - App.jsx
    - assets/
        - images/
        - icons/
        - fonts/
    - components/
        - common/
        - layout/
        - product/
        - cart/
        - checkout/
        - user/
        - filters/
    - pages/
        - Home/
        - Products/
        - Cart/
        - Checkout/
        - User/
        - Seller/
        - Admin/
    - context/
    - services/
    - hooks/
    - utils/
    - styles/

server/
    - src/
        - config/
    - models/
        - userSchema.js
    - controllers/
        - userControllers.js
    - routes/
        - userRoutes.js
    - middlewares/
        - errorHandler.js
    - services/
        - authService.js
    - utils/
        - hashPassword.js
    - validations/
        - authValidations.js
    - app.js
- .env
- server.js

