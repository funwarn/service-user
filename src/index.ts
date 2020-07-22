import express from "express";
import graphqlHTTP from "express-graphql";

// graphql schema
import schema from "./schemas/user";

// graphql resolver
import resolvers from "./resolvers/user";

const app = express();
const port = process.env.PORT || 3000;

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: resolvers,
    graphiql: true
  })
);

// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
