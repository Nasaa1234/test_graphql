import { ApolloServer, gql } from "apollo-server-express"
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core"
import http from "http"
import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import "dotenv/config"

import {
  getAllNews,
  addNews,
  getNewsDetail,
  deleteNews,
  editNews,
} from "../resolvers/NewsResolvers.js"

const app = express()
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
)
const httpServer = http.createServer(app)

const typeDefs = gql`
  type Section {
    title: String
    content: String
    images: [String]
    listItems: [String]
  }

  type News {
    _id: String
    title: String
    slug: String
    description: String
    image: String
    type: String
    sections: [Section]
    author: String
    published: Boolean
    publishedAt: String
    tags: [String]
    views: Int
    createdAt: String
    updatedAt: String
  }

  input SectionInput {
    title: String
    content: String
    images: [String]
    listItems: [String]
  }

  input NewsInput {
    title: String!
    description: String!
    image: String
    type: String!
    sections: [SectionInput]
    slug: String
    author: String
    published: Boolean
    publishedAt: String
    tags: [String]
  }
  type Query {
    getAllNews: [News]
    getNewsDetail(getNewsDetailId: String): News
  }

  type Mutation {
    addNews(input: NewsInput): News
    editNews(newsId: String!, input: NewsInput): News
    uploadImage(imageBase64: String): String
    deleteNews(newsId: String): DeleteResponse
  }

  type DeleteResponse {
    success: Boolean
    message: String
  }
`

const resolvers = {
  Query: {
    getAllNews,
    getNewsDetail,
  },
  Mutation: {
    addNews,
    editNews,
    deleteNews,
  },
}
//mongodb+srv://CCS:CCSADMIN@cluster0.xivay.mongodb.net/CSSDB
mongoose
  .connect("mongodb://localhost:27017/CCSDB")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err))

const startApolloServer = async (app, httpServer) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  })

  await server.start()
  server.applyMiddleware({ app })

  const PORT = process.env.PORT || 4000
  httpServer.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`)
  })
}

startApolloServer(app, httpServer)
