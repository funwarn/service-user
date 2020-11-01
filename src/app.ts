import dotenv from "dotenv";
import express from "express";
import graphqlHTTP from "express-graphql";

// Env from .env
dotenv.config();

// DB Connection Class
import DBConnection from "./configs/db_connection";

// Connect DB
DBConnection.Connect();

// graphql schema
import schema from "./schemas/index";

// graphql resolver
import resolvers from "./resolvers/index";

const app = express();

// graphql context
const context = async (req: any) => {
  const ip_address = req.ip;

  return { ip_address };
};

app.use(
  "/graphql",
  graphqlHTTP((req: any) => ({
    schema,
    rootValue: resolvers,
    graphiql: true,
    context: () => context(req),
    customFormatErrorFn: error => ({
      message: error.message,
      locations: error.locations,
      stack: error.stack ? error.stack.split("\n") : [],
      path: error.path
    })
  }))
);

export default app;
