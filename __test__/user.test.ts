/* Integration Testing - Login */
import { gql } from "apollo-server";
import { createTestClient } from "apollo-server-testing";

// Main App and Create Context
import createApp from "../src/app";
import createContext from "../src/context";

// Test Utils
import shareLogin from "./util/login";

// Helpers
import * as ErrorHandler from "../src/helpers/errors/english.json";

let query: any, mutate: any;

// Header Data
let accessToken: string;

// Body Data
const My_Profile = {
  query: `{
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
}`
};
const Update_My_Profile = {
  mutation: gql`
    mutation updateMyProfile($input: inputProfileUpdate) {
      updateMyProfile(input: $input) {
        user {
          display_name
          birthdate
          gender
        }
        errors {
          __typename
          ... on Unauthentication {
            message
          }
          ... on ServerError {
            message
          }
        }
      }
    }
  `,
  variables: {
    input: {
      display_name: "Fname Lname",
      birthdate: "",
      gender: "Female"
    }
  }
};

describe("User", () => {
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

  test("Query User Profile with fake Access Token", async done => {
    // Pass req/header to context
    const req = { headers: { authorization: `Bearer 12345678` } };
    const context = await createContext({ req });

    // Pass context to app
    const server = createApp(context);
    const mockQuery = createTestClient(server).query;

    const response = await mockQuery({ query: My_Profile.query });

    // to remove [Object: null prototype] from each object
    const responseString = JSON.parse(JSON.stringify(response));
    expect(responseString.data.myProfile.errors).toMatchObject(
      ErrorHandler.InvalidToken.errors
    );
    return done();
  });

  test("Query User Profile", async done => {
    const response = await query({ query: My_Profile.query });

    // to remove [Object: null prototype] from each object
    const responseString = JSON.parse(JSON.stringify(response));
    expect(responseString.data.myProfile.user).toBeInstanceOf(Object);
    return done();
  });

  test("Mutation Update User Profile with fake Access Token", async done => {
    // Pass req/header to context
    const req = { headers: { authorization: `Bearer 12345678` } };
    const context = await createContext({ req });

    // Pass context to app
    const server = createApp(context);
    const mockMutation = createTestClient(server).mutate;

    const response = await mockMutation({
      mutation: Update_My_Profile.mutation,
      variables: Update_My_Profile.variables
    });

    // to remove [Object: null prototype] from each object
    const responseString = JSON.parse(JSON.stringify(response));
    expect(responseString.data.updateMyProfile.errors).toMatchObject(
      ErrorHandler.InvalidToken.errors
    );
    return done();
  });

  test("Mutation Update User Profile", async done => {
    const response = await mutate({
      mutation: Update_My_Profile.mutation,
      variables: Update_My_Profile.variables
    });

    // to remove [Object: null prototype] from each object
    const responseString = JSON.parse(JSON.stringify(response));
    expect(responseString.data.updateMyProfile.user).toBeInstanceOf(Object);
    return done();
  });
});
