const mongoose = require("mongoose");

const connectDB = async function () {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected ${connection.connection.host}`);
  } catch (error) {
    console.log(`MongoDB ERROR: ${error}`);
    process.exit(1);
  }
};

module.exports = connectDB