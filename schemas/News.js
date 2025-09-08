import mongoose from "mongoose"

const { Schema } = mongoose

const NewsSchema = new Schema(
  {
    title: { type: String, required: true, minlength: 2 },
    content: { type: String, required: true, minlength: 2 },
    url: { type: String, required: false },
    topImage: { type: String },
    bottomImage: { type: String },
    type: { type: String },
  },
  { timestamps: true }
)

const News = mongoose.model("News", NewsSchema)

export { News }
