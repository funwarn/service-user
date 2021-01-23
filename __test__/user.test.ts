/* Integration Testing - Login */
import { createTestClient } from "apollo-server-testing";

// Main App and Create Context
import createApp from "../src/app";
import createContext from "../src/context";

// Test Utils
import shareLogin from "./util/login";

// Helpers
import * as ErrorHandler from "../src/helpers/errors/english.json";

let query: any, mutate: any;

describe("User", () => {
  let accessToken: string;
  beforeAll(async () => {
    // Get Token by Login
    const funwarnToken = await shareLogin();
    accessToken = funwarnToken.data.fbLogin.user.access_token;

    // Pass req/header to context
    const req = { headers: { authorization: `Bearer ${accessToken}` } };
    const context = await createContext({ req });

    // Pass context to app
    const server = createApp(context);
    query = createTestClient(server).query;
    mutate = createTestClient(server).mutate;
  });

  test("Query User Profile", async done => {
    const userProfile = `{
      myProfile {
        user {
          _id,
          username,
          add_username,
          display_name,
          email,
          birthdate,
          gender
        },
        errors {
          __typename
          ... on Unauthentication {
              message
          },
          ... on ServerError {
              message
          }
        }
      }    
    }`;
    const response = await query({ query: userProfile });

    // to remove [Object: null prototype] from each object
    const responseString = JSON.parse(JSON.stringify(response));
    expect(responseString.data.myProfile.user).toBeInstanceOf(Object);
    return done();
  });
});
