const mongoose = require("mongoose");

const connectDatabase = async () => {
  try {
    console.log("connecting................ to mongodb");
    const mongoURI = process.env.MONGODB_URI || "";
    const connection = await mongoose.connect(mongoURI);
    console.log(`Connected to MongoDB ${connection}`);
  } catch (error) {
    if (error.name === "MongoNetworkError") {
      console.error("MongoDB connection error: Network issue");
    } else if (error.name === "MongoTimeoutError") {
      console.error("MongoDB connection error: Timeout");
    } else {
      console.error("MongoDB connection error:", error.message);
    }
  }
};
module.exports = connectDatabase;
