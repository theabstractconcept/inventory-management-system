# Inventory and Data Management System

## Overview
A REST API for managing inventory products using Node.js,
Express.js, MongoDB, and Mongoose.

## Technologies Used
- Node.js
- Express.js
- MongoDB
- Mongoose
- dotenv

## Features
- Create a product
- Create multiple products
- Retrieve all products
- Retrieve a product by ID
- Update and delete products
- Filter, sort, and paginate products
- Restock products
- Sell products while preventing negative stock
- Generate low-stock reports
- Generate category-wise inventory summaries
- Centralized error handling

## Installation

1. Clone this repository.
2. Install dependencies:

   npm install

3. Create a `.env` file using `.env.example` as a template.
4. Add your MongoDB connection string to `.env`.
5. Start the development server:

   npm run dev

## API Base URL

http://localhost:5000/api/products

## Environment Variables

- PORT: Server port
- MONGODB_URI: MongoDB connection string

## Author
Your Name
