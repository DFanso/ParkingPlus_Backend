const mongoose = require("mongoose");

const connectDB = async() => {
    try {
        const MONGODB_URI = 'mongodb+srv://root:sg9tZlQoKDwaKb7H@cluster0.esptv8v.mongodb.net/test';
        const conn = await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit();
    }
};

module.exports = connectDB;
