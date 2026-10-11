const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [2, "Product name must have at least 2 characters"]
    },

    description: {
      type: String,
      default: "",
      trim: true
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
      validate: {
        validator: Number.isFinite,
        message: "Price must be a finite number"
      }
    },

    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock cannot be negative"],
      validate: {
        validator: Number.isSafeInteger,
        message: "Stock must be a whole number"
      }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Product", productSchema);