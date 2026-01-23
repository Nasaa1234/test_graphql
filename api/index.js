import { ApolloServer, gql } from "apollo-server-express"
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

// Check if running on Vercel
const isVercel = process.env.VERCEL || process.env.VERCEL_ENV

const app = express()
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
)

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

// Cache MongoDB connection for serverless
let cachedDb = null

const connectToDatabase = async () => {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb
  }

  const MONGODB_URI =
    process.env.MONGODB_URI ||
    "mongodb+srv://mongo:nasaa0122@liberal.mlu2opy.mongodb.net/baterdene?retryWrites=true&w=majority"

  try {
    await mongoose.connect(MONGODB_URI)
    cachedDb = mongoose.connection
    console.log("MongoDB connected")
    return cachedDb
  } catch (err) {
    console.error("MongoDB connection error:", err)
    throw err
  }
}

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
})

let serverStarted = false

const startServer = async () => {
  if (!serverStarted) {
    await server.start()
    server.applyMiddleware({ app, path: "/" })
    serverStarted = true
  }
}

// Export handler for Vercel
export default async function handler(req, res) {
  await connectToDatabase()
  await startServer()
  return app(req, res)
}

// Local development server
if (!isVercel) {
  const startLocalServer = async () => {
    await connectToDatabase()
    await startServer()

    const PORT = process.env.PORT || 4000
    app.listen(PORT, () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}/`)
    })
  }

  startLocalServer()
}
