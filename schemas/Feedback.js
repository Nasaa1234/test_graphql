import mongoose from "mongoose"

const { Schema } = mongoose

const FeedbackSchema = new Schema(
  {
    content: { type: String, required: true, minlength: 2 },
  },
  { timestamps: true }
)

const Feedback = mongoose.model("Feedback", FeedbackSchema)

export { Feedback }
