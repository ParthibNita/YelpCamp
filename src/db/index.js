import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/YelpCamp`
    );
    console.log(
      `Database connected successfully. DB Host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error(`Error connecting to the database: ${error.message}`);
    process.exit(1); // Exit the process with failure
  }
};
export default connectDB;
