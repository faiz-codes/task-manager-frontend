import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  HttpLink,
} from "@apollo/client";

// Create an HttpLink for GraphQL endpoint
const httpLink = new HttpLink({ uri: "http://localhost:4000/graphql" });

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

// Combine links
const link = ApolloLink.from([loggingLink, errorLink, httpLink]);

// Initialize Apollo Client
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: link,
});

export default client;
