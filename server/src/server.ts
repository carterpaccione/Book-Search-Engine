import express from "express";
import path from "node:path";
import db from "./config/connection.js";

import type { Request, Response } from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware as apolloExpressMiddleware } from "@apollo/server/express4";
import { typeDefs, resolvers } from "./schemas/index.js";

import { fileURLToPath } from "node:url";

import { authenticateToken } from "./utils/auth.js";

// Load environment variables from .env file
import dotenv from "dotenv";
const result = dotenv.config({ path: "./server/.env" });
if (result.error) {
  console.error(`Error loading .env file: ${result.error}`);
} else {
  console.log(`.env file loaded successfully`);
}

// create a new Apollo server and pass in our schema data
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startApolloServer = async () => {
  // Start the Apollo server
  await server.start();

  // connect to the database
  await db();

  // create an instance of an express server
  const app = express();
  const PORT = process.env.PORT || 3001;

  // Apply the Apollo GraphQL middleware and set the path to /graphql
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use(
    "/graphql",
    apolloExpressMiddleware(server as any, {
      context: authenticateToken as any,
    })
  );

  // if we're in production, serve client/build as static assets
  if (process.env.NODE_ENV === "production") {
    console.log(`In production mode, from NODE_ENV: ${process.env.NODE_ENV}`);
    const __filename = fileURLToPath(import.meta.url);

    app.use(
      "/graphql",
      apolloExpressMiddleware(server as any, {
        context: authenticateToken as any,
      })
    );

    const __dirname = path.dirname(__filename);
    app.use(express.static(path.join(__dirname, "../../client/dist")));

    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
    });
  }

  // start the server
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`GraphQL server running at http://localhost:${PORT}/graphql`);
  });
};

startApolloServer();
