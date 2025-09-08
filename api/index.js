import { ApolloServer, gql } from "apollo-server-express"
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core"
import http from "http"
import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import "dotenv/config"

import { addFeedback, getAllFeedback } from "../resolvers/FeedbackResolvers.js"
import {
  getAllNews,
  addNews,
  getNewsDetail,
  deleteNews,
  editNews,
} from "../resolvers/NewsResolvers.js"
import {
  addWork,
  deleteWork,
  editWork,
  getAllWorks,
} from "../resolvers/WorkResolvers.js"

const app = express()
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
)
const httpServer = http.createServer(app)

const typeDefs = gql`
  type News {
    _id: String
    title: String
    topImage: String
    bottomImage: String
    content: String
    url: String
    createdAt: String
    type: String
    updatedAt: String
  }

  type Feedback {
    createdAt: String
    updatedAt: String
    content: String
    _id: String
  }

  type Work {
    _id: String
    year: String!
    description: String!
    image: String!
    createdAt: String
    updatedAt: String
  }

  input NewsInput {
    title: String!
    content: String!
    url: String
    topImage: String
    bottomImage: String
    type: String
  }

  input FeedbackInput {
    content: String!
    createdAt: String
    updatedAt: String
  }

  input WorkInput {
    year: String!
    description: String!
    image: String!
  }

  type Query {
    getAllNews: [News]
    getNewsDetail(getNewsDetailId: String): News
    getAllFeedback: [Feedback]
    getAllWorks: [Work]
  }

  type Mutation {
    addNews(input: NewsInput): News
    deleteNews(newsId: ID): DeleteResponse
    editNews(newsId: ID, input: NewsInput): News
    deleteFeedback(id: String): DeleteResponse
    addFeedback(input: FeedbackInput): Feedback
    addWork(input: WorkInput): Work
    editWork(workId: String, input: WorkInput): Work
    deleteWork(workId: String): DeleteResponse
  }

  type DeleteResponse {
    success: Boolean
    message: String
  }
`

const resolvers = {
  Query: {
    getAllWorks,
    getAllNews,
    getAllFeedback,
    getNewsDetail,
  },
  Mutation: {
    addWork,
    addFeedback,
    addNews,
    deleteNews,
    editNews,
    editWork,
    deleteWork,
  },
}

mongoose
  .connect(
    "mongodb+srv://mongo:nasaa0122@liberal.mlu2opy.mongodb.net/baterdene?retryWrites=true&w=majority"
  )
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
