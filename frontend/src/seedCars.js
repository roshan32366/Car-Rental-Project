
import dotenv from "dotenv";
import mongoose from "mongoose";
import Car from "./models/Car.js";

dotenv.config();

const cars = [
  {
    name: "Swift Dzire",
    brand: "Maruti Suzuki",
    category: "Sedan",
    pricePerDay: 1500,
    seats: 5,
    fuel: "Petrol",
    image: "https://placehold.co/600x350?text=Swift+Dzire"
  },
  {
    name: "Hyundai Creta",
    brand: "Hyundai",
    category: "SUV",
    pricePerDay: 2500,
    seats: 5,
    fuel: "Diesel",
    image: "https://placehold.co/600x350?text=Hyundai+Creta"
  },
  {
    name: "Mahindra Thar",
    brand: "Mahindra",
    category: "SUV",
    pricePerDay: 3000,
    seats: 4,
    fuel: "Diesel",
    image: "https://placehold.co/600x350?text=Mahindra+Thar"
  }
];

async function seedCars() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Car.insertMany(cars);
    console.log("3 sample cars added successfully!");
  } catch (error) {
    console.log("Error:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

seedCars();
