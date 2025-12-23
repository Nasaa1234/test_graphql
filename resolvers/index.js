import {
  getAllNews,
  addNews,
  getNewsDetail,
  deleteNews,
  editNews,
} from "./NewsResolvers.js"

export default {
  Query: {
    getAllNews,
    getNewsDetail,
  },
  Mutation: {
    addNews,
    deleteNews,
    editNews,
  },
}
