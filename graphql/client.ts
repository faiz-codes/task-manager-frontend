import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  HttpLink,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import SuperTokens from "supertokens-react-native";

// Create an HttpLink for GraphQL endpoint
const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
});
// Middleware to log requests and results
const loggingLink = new ApolloLink((operation, forward) => {
  console.log(`[GraphQL Request] ${operation.operationName}`, {
    variables: operation.variables,
  });

  return forward(operation).map((response) => {
    console.log(`[GraphQL Response] ${operation.operationName}`, response);
    return response;
  });
});

// Error handling link
const errorLink = new ApolloLink((operation, forward) => {
  return forward(operation).map((response) => {
    // This won't trigger on errors; use .catch() in queries/mutations for error handling.
    if (response.errors) {
      console.error(
        `[GraphQL Error] ${operation.operationName}`,
        response.errors
      );
    }
    return response;
  });
});

const authLink = setContext(async (_, { headers }) => {
  try {
    const session = await SuperTokens.getAccessToken();

    return {
      headers: {
        ...headers,
        authorization: session ? `Bearer ${session}` : "", // Set token if available
      },
    };
  } catch (error) {
    console.error("Error retrieving access token:", error);
    return { headers };
  }
});

// Combine links
const link = ApolloLink.from([loggingLink, errorLink, httpLink]);

// Initialize Apollo Client
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(link),
});

export default client;
