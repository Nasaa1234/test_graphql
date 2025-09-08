import { addFeedback, getAllFeedback } from "./FeedbackResolvers.js"
import {
  getAllNews,
  addNews,
  getNewsDetail,
  deleteNews,
  editNews,
} from "./NewsResolvers.js"
import { addWork, deleteWork, editWork, getAllWorks } from "./WorkResolvers.js"

export default {
  Query: {
    getAllNews,
    getNewsDetail,
    getAllFeedback,
    getAllWorks,
  },
  Mutation: {
    addNews,
    deleteNews,
    addFeedback,
    editNews,
    editWork,
    addWork,
    deleteWork,
  },
}
