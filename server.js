require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const productRoutes = require("./routes/productRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

const PORT = process.env.PORT || 5000;


// Parse incoming JSON requests
app.use(express.json());


// Basic welcome route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Inventory Management System API is running"
  });
});


// Product API routes
app.use("/api/products", productRoutes);


// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found"
  });
});


// Centralized error handler must come after routes
app.use(errorHandler);


// Connect to MongoDB and start the server
async function startServer() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing from the .env file");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start the application:", error.message);
    process.exit(1);
  }
}

startServer();