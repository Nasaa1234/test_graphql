import { Feedback } from "../schemas/index.js"
import dotenv from "dotenv"

dotenv.config()

const getAllFeedback = async () => {
  try {
    const allFeedback = await Feedback.find()
    return allFeedback
  } catch (error) {
    throw new Error("Failed to fetch all feedback")
  }
}

const addFeedback = async (_, params) => {
  if (!params.input) {
    throw new Error("❌ No data provided")
  }
  const feedback = new Feedback(params.input)
  try {
    await feedback.save()
    return feedback
  } catch (error) {
    throw new Error("Failed to add news")
  }
}

// const deleteFeedback = async (_: any, { id }: { id: string }) => {
//   try {
//     // const deleted = await Feedback.findByIdAndDelete(id)
//     // if (!deleted) {
//     //   throw new Error("❌ Feedback not found")
//     // }
//     // return {
//     //   success: true,
//     //   message: "✅ Feedback deleted successfully",
//     // }
//   } catch (error) {
//     throw new Error("❌ Failed to delete feedback")
//   }
// }

export { getAllFeedback, addFeedback }
