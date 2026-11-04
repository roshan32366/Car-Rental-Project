
import express from "express";
import jwt from "jsonwebtoken";
import Booking from "../models/Booking.js";
import Car from "../models/Car.js";

const router = express.Router();

// Create Booking
router.post("/", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Please login first"
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { carId, pickupDate, returnDate } = req.body;

    const start = new Date(pickupDate);
    const end = new Date(returnDate);

    if (!carId || isNaN(start) || isNaN(end) || end <= start) {
      return res.status(400).json({
        message: "Invalid booking details"
      });
    }

    const car = await Car.findById(carId);

    if (!car || !car.available) {
      return res.status(404).json({
        message: "Car not available"
      });
    }

    const days = Math.ceil(
      (end - start) / (1000 * 60 * 60 * 24)
    );

    const booking = await Booking.create({
      user: decoded.id,
      car: carId,
      pickupDate: start,
      returnDate: end,
      totalPrice: days * car.pricePerDay
    });

    res.status(201).json({
      message: "Booking successful",
      booking
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

export default router;
