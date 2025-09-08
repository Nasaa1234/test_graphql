import mongoose from "mongoose"

const { Schema } = mongoose

const WorkSchema = new Schema(
  {
    year: { type: String, required: true },
    description: { type: String, required: true, minlength: 2 },
    image: { type: String, required: true },
  },
  { timestamps: true }
)

const Work = mongoose.model("Work", WorkSchema)

export { Work }
