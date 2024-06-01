// Modules Imports
import express from "express";
import dotenv from "dotenv";
import { graphqlHTTP } from "express-graphql";
import schema from "./Schema/schema.js";
import { connectDB } from "./utils/features.js";

// App Configs
const app = express();
dotenv.config({
  path: "./.env",
});

// env Constants
const PORT = process.env.PORT;
const NODE_ENV = process.env.NODE_ENV;
const mongoURI = process.env.MONGO_URI;
// Databse
connectDB(mongoURI);
// Using Middlewares Here
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: NODE_ENV === "development",
  })
);

// Server
app.listen(PORT, () => {
  console.log(`Server Started at ${PORT}`);
});
