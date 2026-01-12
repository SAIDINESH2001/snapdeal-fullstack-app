
const mongoose = require('mongoose');


const connectDB = async() => {
    try {
        const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://saidineshsuri2001_db_user:n1IZ0KOPfeaCO24J@snapdeal-products.hf8v8nk.mongodb.net/';
        const connection = await mongoose.connect(MONGO_URI);

        console.log(`MongoDB connection is successful`)
    }
    catch(err) {
        console.log(`MongoDB connection error`, err.message);
        process.exit(1);
    }
} 

module.exports = connectDB;