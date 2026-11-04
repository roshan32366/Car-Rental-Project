
import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    brand: {
      type: String
    },

    category: {
      type: String
    },

    pricePerDay: {
      type: Number,
      required: true
    },

    seats: {
      type: Number
    },

    fuel: {
      type: String
    },

    image: {
      type: String
    },

    available: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const Car = mongoose.model("Car", carSchema);

export default Car;
