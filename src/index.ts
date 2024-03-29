import createApp from "./app";
import createContext from "./context";

const server = createApp(createContext);
server?.listen().then(() => {
  console.log(`
    Server is running!
    Listening on port 4000
    Query at https://studio.apollographql.com/dev
  `);
});
