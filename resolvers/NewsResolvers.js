import { News } from "../schemas/index.js"
import dotenv from "dotenv"

dotenv.config()

const getAllNews = async () => {
  try {
    const allNews = await News.find()
    return allNews
  } catch (error) {
    console.error("Error fetching all news:", error)
    throw new Error("Failed to fetch all news")
  }
}

// API environment variable: CLOUDINARY_URL=cloudinary://688626622819371:40eUgWPCf0dGSBV7gD8ozbRCzZQ@dsrl47mtp
//API SECRET: 40eUgWPCf0dGSBV7gD8ozbRCzZQ
//Cloud name	 : dsrl47mtp
// API key	 :688626622819371
const getNewsDetail = async (_, { getNewsDetailId }) => {
  try {
    const newsDetail = await News.findOne({ _id: getNewsDetailId }).exec()

    if (!newsDetail) {
      console.error(`News with ID ${getNewsDetailId} not found`)
      return null
    }

    return newsDetail
  } catch (error) {
    console.error("Error fetching news detail:", error)
    throw new Error("Failed to fetch news detail")
  }
}

const addNews = async (_, params) => {
  if (!params.input) {
    throw new Error("❌ No data provided")
  }
  const news = new News(params.input)
  try {
    await news.save()
    return news
  } catch (error) {
    throw new Error("Failed to add news")
  }
}

const deleteNews = async (_, { newsId }) => {
  try {
    const news = await News.findById(newsId)

    if (!news) {
      throw new Error(`❌ News with ID ${newsId} not found`)
    }

    await News.findByIdAndDelete(newsId)

    return { success: true, message: "News deleted successfully" }
  } catch (error) {
    console.error("❌ Error deleting news:", error)
    throw new Error("Failed to delete news")
  }
}

const editNews = async (_, { newsId, input }) => {
  try {
    const updatedNews = await News.findByIdAndUpdate(
      newsId,
      { $set: input },
      { new: true, runValidators: true }
    )

    if (!updatedNews) {
      throw new Error(`❌ News with ID ${newsId} not found`)
    }

    return updatedNews
  } catch (error) {
    console.error("❌ Error editing news:", error)
    throw new Error("Failed to edit news")
  }
}

export { getAllNews, addNews, getNewsDetail, deleteNews, editNews }
