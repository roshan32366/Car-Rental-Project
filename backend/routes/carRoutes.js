
import express from "express";
import Car from "../models/Car.js";

const router = express.Router();

// Get all cars
router.get("/", async (req, res) => {
  try {
    const cars = await Car.find();

    res.status(200).json({
      success: true,
      count: cars.length,
      cars
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// Add new car
router.post("/", async (req, res) => {
  try {
    const car = await Car.create(req.body);

    res.status(201).json({
      message: "Car added successfully",
      car
    });

  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

export default router;
