import mongoose from "mongoose";
import { Campground } from "../models/campground.models.js";
import cities from "./cities.js";
import prices from "./prices.js";
import descriptors, { places } from "./places.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      "mongodb://localhost:27017/YelpCamp",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log(
      `Database connected successfully. DB Host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error(`Error connecting to the database: ${error.message}`);
    process.exit(1); // Exit the process with failure
  }
};
const random = (array) => array[Math.floor(Math.random() * array.length)];

connectDB()
  .then(async () => {
    await Campground.deleteMany({}); // Clear existing campgrounds
    for (let i = 0; i < 50; i++) {
      const camp = new Campground({
        title: `${random(cities).city} , ${random(cities).state}`,
        price: `${random(prices)}`,
        location: `${random(descriptors)} ${random(places)}`,
        image: `https://picsum.photos/400?random=${Math.random()}`,
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga dicta ea facilis itaque eius voluptates veritatis, ipsam ab voluptate beatae saepe delectus quia non distinctio, labore aspernatur. Numquam, magni unde.",
      });
      await camp.save();
    }
    await mongoose.disconnect();
  })
  .catch((error) => {
    console.error("Error during seeding:", error);
  });
