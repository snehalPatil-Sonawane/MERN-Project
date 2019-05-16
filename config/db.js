const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");

const connectDb = async () => {
  try {
    await mongoose.connect(db, { useNewUrlParser: true });
    console.log("mongo db connected");
  } catch (error) {
    console.error("mongo db connected");
    //exit process with failure
    process.exit(1);
  }
};

module.exports = connectDb;
