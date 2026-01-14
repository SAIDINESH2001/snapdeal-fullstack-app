const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./src/config/connectDb');
const errorHandler = require('./src/middlewares/errorHandler');
const userRoutes = require('./src/routes/userRoutes');
const otpRoutes = require('./src/routes/otpRoutes');
const authRoutes = require('./src/routes/authRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const productRoutes = require('./src/routes/productRoutes');







//Initializing express application
const app = express();

//Connect to dataBase
connectDB();

//MiddleWares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'));

//Routing
app.use('/api', userRoutes);
app.use("/api", otpRoutes);
app.use("/api", authRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);

//Error Handling
app.use(errorHandler);



//Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server connected to http://localhost:${PORT}`);
    console.log(`Environment : ${process.env.NODE_ENV || 'development'}`);
})

module.exports = app;