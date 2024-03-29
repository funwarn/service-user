/* Base Schema */
import { gql } from "apollo-server";

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query

  type Mutation

  interface ServerError {
    message: String
  }

  type SomethingWrong implements ServerError {
    message: String
  }

  interface Unauthentication {
    message: String
  }

  interface DatabaseError {
    message: String
  }

  type InvalidToken implements Unauthentication {
    message: String
  }
`;

export default typeDefs;
